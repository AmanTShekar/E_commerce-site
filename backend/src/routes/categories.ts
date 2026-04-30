import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { categories } from '../db/schema';

type Bindings = { DB: D1Database };

const categoryRouter = new Hono<{ Bindings: Bindings }>();

// GET /api/categories - Fetch all categories
categoryRouter.get('/', async (c) => {
  const db = drizzle(c.env.DB);
  const allCategories = await db.select().from(categories).all();
  return c.json({ categories: allCategories });
});

export default categoryRouter;
