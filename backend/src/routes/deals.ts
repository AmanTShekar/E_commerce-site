import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { products, categories } from '../db/schema';
import { eq, gt, sql } from 'drizzle-orm';

type Bindings = { DB: D1Database };

const dealsRouter = new Hono<{ Bindings: Bindings }>();

// GET /api/deals - Get products with high discounts
dealsRouter.get('/', async (c) => {
  const db = drizzle(c.env.DB);
  
  // Fetch products where MRP is significantly higher than Price (Deals)
  const results = await db.select({
    id: products.id,
    name: products.title,
    price: products.price,
    oldPrice: products.mrp,
    category: categories.name,
    image: products.image,
  })
  .from(products)
  .leftJoin(categories, eq(products.categoryId, categories.id))
  .where(gt(products.mrp, products.price))
  .all();

  // Add discount calculation and formatting
  const formatted = results.map(p => ({
    ...p,
    discount: `${Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)}%`,
    rating: 4.2 + (Math.random() * 0.8), // Placeholder for real ratings
    isFlashDeal: true
  }));

  return c.json({ products: formatted });
});

export default dealsRouter;
