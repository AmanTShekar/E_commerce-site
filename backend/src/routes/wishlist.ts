import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { wishlistItems, products } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { jwt } from 'hono/jwt';

type Bindings = { DB: D1Database; JWT_SECRET?: string };
type Variables = { jwtPayload: { sub: string; email: string; role: string } };

const wishlistRouter = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Protect all wishlist routes
wishlistRouter.use('*', async (c, next) => {
  const secret = c.env.JWT_SECRET || 'fallback_secret_for_local_dev_only';
  const jwtMiddleware = jwt({ secret, alg: 'HS256' });
  return jwtMiddleware(c, next);
});

// GET /api/wishlist - Get user's wishlist
wishlistRouter.get('/', async (c) => {
  const db = drizzle(c.env.DB);
  const user = c.get('jwtPayload');

  const items = await db.select({
    id: wishlistItems.id,
    product: {
      id: products.id,
      title: products.title,
      price: products.price,
      image: products.image
    }
  })
  .from(wishlistItems)
  .innerJoin(products, eq(wishlistItems.productId, products.id))
  .where(eq(wishlistItems.userId, user.sub));

  return c.json({ wishlist: items });
});

const addToWishlistSchema = z.object({
  productId: z.string()
});

// POST /api/wishlist - Add to wishlist
wishlistRouter.post('/', zValidator('json', addToWishlistSchema), async (c) => {
  const db = drizzle(c.env.DB);
  const user = c.get('jwtPayload');
  const { productId } = c.req.valid('json');

  const existing = await db.select().from(wishlistItems)
    .where(and(eq(wishlistItems.userId, user.sub), eq(wishlistItems.productId, productId)))
    .get();

  if (!existing) {
    await db.insert(wishlistItems).values({
      id: crypto.randomUUID(),
      userId: user.sub,
      productId
    });
  }

  return c.json({ message: 'Added to wishlist' });
});

// DELETE /api/wishlist/:productId - Remove from wishlist
wishlistRouter.delete('/:productId', async (c) => {
  const db = drizzle(c.env.DB);
  const user = c.get('jwtPayload');
  const productId = c.req.param('productId');

  await db.delete(wishlistItems)
    .where(and(eq(wishlistItems.userId, user.sub), eq(wishlistItems.productId, productId)));

  return c.json({ message: 'Removed from wishlist' });
});

export default wishlistRouter;
