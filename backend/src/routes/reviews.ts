import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { reviews, orderItems, orders } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { jwt } from 'hono/jwt';

type Bindings = { DB: D1Database; JWT_SECRET?: string };
type Variables = { jwtPayload: { sub: string; email: string; role: string } };

const reviewsRouter = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// GET /api/reviews/:productId - List all reviews for a product
reviewsRouter.get('/:productId', async (c) => {
  const db = drizzle(c.env.DB);
  const productId = c.req.param('productId');

  const productReviews = await db.select().from(reviews)
    .where(eq(reviews.productId, productId)).all();

  return c.json({ reviews: productReviews });
});

// POST /api/reviews - Create a review (Protected)
const reviewSchema = z.object({
  productId: z.string(),
  rating: z.number().min(1).max(5),
  title: z.string().min(1),
  body: z.string().min(5),
});

reviewsRouter.post('/', async (c, next) => {
  const secret = c.env.JWT_SECRET || 'fallback_secret_for_local_dev_only';
  return jwt({ secret, alg: 'HS256' })(c, next);
}, zValidator('json', reviewSchema), async (c) => {
  const user = c.get('jwtPayload');
  const db = drizzle(c.env.DB);
  const data = c.req.valid('json');

  // Check for verified purchase (Section 16.3)
  // User must have an order with this product that is 'delivered'
  const purchased = await db.select()
    .from(orderItems)
    .innerJoin(orders, eq(orderItems.orderId, orders.id))
    .where(
      and(
        eq(orders.userId, user.sub),
        eq(orderItems.productId, data.productId),
        eq(orders.status, 'delivered')
      )
    ).get();

  if (!purchased) {
    return c.json({ error: 'Only verified purchasers can review this product' }, 403);
  }

  // Check if already reviewed (Section 16.3)
  const existing = await db.select().from(reviews)
    .where(and(eq(reviews.userId, user.sub), eq(reviews.productId, data.productId))).get();
  
  if (existing) {
    return c.json({ error: 'You have already reviewed this product' }, 400);
  }

  const reviewId = crypto.randomUUID();
  await db.insert(reviews).values({
    id: reviewId,
    userId: user.sub,
    productId: data.productId,
    rating: data.rating,
    title: data.title,
    body: data.body.replace(/<[^>]*>?/gm, ''), // Sanitize
    isVerifiedPurchase: true,
  });

  return c.json({ message: 'Review submitted successfully', reviewId }, 201);
});

export default reviewsRouter;
