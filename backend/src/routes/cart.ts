import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { carts, cartItems, products } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { jwt } from 'hono/jwt';

type Bindings = { DB: D1Database; JWT_SECRET?: string };
type Variables = { jwtPayload: { sub: string; email: string; role: string } };

const cartRouter = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Protect all cart routes
cartRouter.use('*', async (c, next) => {
  const secret = c.env.JWT_SECRET || 'fallback_secret_for_local_dev_only';
  const jwtMiddleware = jwt({ secret, alg: 'HS256' });
  return jwtMiddleware(c, next);
});

// Helper to get or create a cart for the user
async function getOrCreateCart(db: any, userId: string) {
  let cart = await db.select().from(carts).where(eq(carts.userId, userId)).get();
  if (!cart) {
    const cartId = crypto.randomUUID();
    await db.insert(carts).values({ id: cartId, userId });
    cart = { id: cartId, userId };
  }
  return cart;
}

// GET /api/cart - Get user's cart
cartRouter.get('/', async (c) => {
  const db = drizzle(c.env.DB);
  const user = c.get('jwtPayload');
  
  const cart = await getOrCreateCart(db, user.sub);

  const items = await db.select({
    id: cartItems.id,
    quantity: cartItems.quantity,
    product: {
      id: products.id,
      title: products.title,
      price: products.price,
      mrp: products.mrp,
      image: products.id // In a real app we'd have image URL, for now just returning ID
    }
  })
  .from(cartItems)
  .innerJoin(products, eq(cartItems.productId, products.id))
  .where(eq(cartItems.cartId, cart.id));

  return c.json({ cartId: cart.id, items });
});

const addToCartSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive().default(1)
});

// POST /api/cart - Add item to cart
cartRouter.post('/', zValidator('json', addToCartSchema), async (c) => {
  const db = drizzle(c.env.DB);
  const user = c.get('jwtPayload');
  const { productId, quantity } = c.req.valid('json');

  const cart = await getOrCreateCart(db, user.sub);

  // Check if item already exists in cart
  const existingItem = await db.select()
    .from(cartItems)
    .where(and(eq(cartItems.cartId, cart.id), eq(cartItems.productId, productId)))
    .get();

  if (existingItem) {
    // Update quantity
    await db.update(cartItems)
      .set({ quantity: existingItem.quantity + quantity })
      .where(eq(cartItems.id, existingItem.id));
  } else {
    // Add new item
    await db.insert(cartItems).values({
      id: crypto.randomUUID(),
      cartId: cart.id,
      productId,
      quantity
    });
  }

  return c.json({ message: 'Added to cart' });
});

// DELETE /api/cart/:productId - Remove item from cart
cartRouter.delete('/:productId', async (c) => {
  const db = drizzle(c.env.DB);
  const user = c.get('jwtPayload');
  const productId = c.req.param('productId');

  const cart = await db.select().from(carts).where(eq(carts.userId, user.sub)).get();
  if (!cart) return c.json({ error: 'Cart not found' }, 404);

  await db.delete(cartItems)
    .where(and(eq(cartItems.cartId, cart.id), eq(cartItems.productId, productId)));

  return c.json({ message: 'Item removed from cart' });
});

export default cartRouter;
