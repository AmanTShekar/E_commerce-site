import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { orders, orderItems, carts, cartItems, addresses, products } from '../db/schema';
import { eq, sql } from 'drizzle-orm';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { jwt } from 'hono/jwt';

type Bindings = { DB: D1Database; JWT_SECRET?: string };
type Variables = { jwtPayload: { sub: string; email: string; role: string } };

const orderRouter = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Protect all order routes
orderRouter.use('*', async (c, next) => {
  const secret = c.env.JWT_SECRET || 'fallback_secret_for_local_dev_only';
  const jwtMiddleware = jwt({ secret, alg: 'HS256' });
  return jwtMiddleware(c, next);
});

const checkoutSchema = z.object({
  shippingDetails: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phone: z.string(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string()
  }),
  paymentMethod: z.string() // 'card', 'upi', 'cod'
});

// POST /api/orders - Checkout and create an order
orderRouter.post('/', zValidator('json', checkoutSchema), async (c) => {
  const db = drizzle(c.env.DB);
  const user = c.get('jwtPayload');
  const { shippingDetails, paymentMethod } = c.req.valid('json');

  // EC-004 — Idempotency Check
  const idempotencyKey = c.req.header('Idempotency-Key');
  if (idempotencyKey) {
    // In a real app with Redis, we'd check Redis. 
    // In D1, we can check if an order with this userId and idempotencyKey exists in the last 5 minutes.
    // For now, let's assume we store the key on the order table or skip if not found.
    // Let's add idempotency_key to orders table in schema if we want full enforcement.
  }

  // 1. Get the user's cart
  const cart = await db.select().from(carts).where(eq(carts.userId, user.sub)).get();
  if (!cart) return c.json({ error: 'Cart is empty' }, 400);

  // 2. Get cart items with product details
  const itemsInCart = await db.select({
    cartItemId: cartItems.id,
    quantity: cartItems.quantity,
    productId: products.id,
    title: products.title,
    image: products.image,
    price: products.price,
    stock: products.stock,
    sellerId: products.sellerId
  })
  .from(cartItems)
  .innerJoin(products, eq(cartItems.productId, products.id))
  .where(eq(cartItems.cartId, cart.id));

  if (itemsInCart.length === 0) return c.json({ error: 'Cart is empty' }, 400);

  // Calculate total and validate stock
  let total = 0;
  for (const item of itemsInCart) {
    if (item.stock < item.quantity) {
      return c.json({ error: `Insufficient stock for product: ${item.title}` }, 409);
    }
    total += item.price * item.quantity;
  }

  // 3. Create Address
  const addressId = crypto.randomUUID();
  await db.insert(addresses).values({
    id: addressId,
    userId: user.sub,
    label: 'Checkout Address',
    street: shippingDetails.address,
    city: shippingDetails.city,
    state: shippingDetails.state,
    pincode: shippingDetails.zip,
    country: 'US', // default for now
    isDefault: true
  });

  // 4. Create Order with Snapshots (EC-206)
  const orderId = crypto.randomUUID();
  await db.insert(orders).values({
    id: orderId,
    userId: user.sub,
    addressId: addressId,
    shippingFullName: `${shippingDetails.firstName} ${shippingDetails.lastName}`,
    shippingStreet: shippingDetails.address,
    shippingCity: shippingDetails.city,
    shippingState: shippingDetails.state,
    shippingPincode: shippingDetails.zip,
    total: total,
    status: 'processing',
    paymentStatus: paymentMethod === 'cod' ? 'pending' : 'completed', // Dummy payment
    paymentId: paymentMethod !== 'cod' ? `DUMMY_PAY_${crypto.randomUUID()}` : null
  });

  // 5. Create Order Items and Update Stock
  const batchOps = [];
  for (const item of itemsInCart) {
    // Add Order Item insertion to batch
    batchOps.push(db.insert(orderItems).values({
      id: crypto.randomUUID(),
      orderId: orderId,
      productId: item.productId,
      sellerId: item.sellerId,
      quantity: item.quantity,
      unitPrice: item.price,
      titleSnapshot: item.title,
      imageSnapshot: item.image,
      status: 'pending'
    }));

    // Add Stock Update to batch (Atomic decrement)
    batchOps.push(db.update(products)
      .set({ stock: sql`${products.stock} - ${item.quantity}` })
      .where(eq(products.id, item.productId)));
  }

  // 6. Clear Cart insertion to batch
  batchOps.push(db.delete(cartItems).where(eq(cartItems.cartId, cart.id)));

  // Execute all operations in a single D1 batch (Transaction)
  try {
    // @ts-ignore - D1 batch support in Drizzle
    await db.batch(batchOps);
  } catch (err) {
    console.error('Batch execution failed:', err);
    return c.json({ error: 'Failed to process order. Please try again.' }, 500);
  }

  return c.json({ message: 'Order placed successfully', orderId });
});

// GET /api/orders - Get user's order history
orderRouter.get('/', async (c) => {
  const db = drizzle(c.env.DB);
  const user = c.get('jwtPayload');

  const myOrders = await db.select().from(orders).where(eq(orders.userId, user.sub)).all();
  return c.json({ orders: myOrders });
});

// POST /api/orders/dummy-complete - Simulate payment callback
const dummyPaymentSchema = z.object({
  orderId: z.string(),
  scenario: z.enum(['success', 'failure', 'timeout'])
});

orderRouter.post('/dummy-complete', zValidator('json', dummyPaymentSchema), async (c) => {
  const db = drizzle(c.env.DB);
  const { orderId, scenario } = c.req.valid('json');

  const order = await db.select().from(orders).where(eq(orders.id, orderId)).get();
  if (!order) return c.json({ error: 'Order not found' }, 404);

  if (scenario === 'timeout') {
    return c.json({ message: 'Simulated timeout. Order remains pending.' });
  }

  if (scenario === 'failure') {
    await db.update(orders).set({ paymentStatus: 'failed' }).where(eq(orders.id, orderId));
    return c.json({ message: 'Simulated failure. Payment status updated to failed.' });
  }

  // Success path
  await db.update(orders).set({ 
    paymentStatus: 'completed',
    status: 'processing' 
  }).where(eq(orders.id, orderId));

  return c.json({ message: 'Simulated success. Order is now being processed.' });
});

export default orderRouter;
