import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { promotions, siteConfig, discoveryGrids } from '../db/schema';
import { eq } from 'drizzle-orm';

type Bindings = { DB: D1Database };

const configRouter = new Hono<{ Bindings: Bindings }>();

// GET /api/config/promotions - Get all active promotions
configRouter.get('/promotions', async (c) => {
  const db = drizzle(c.env.DB);
  const type = c.req.query('type');
  
  let query = db.select().from(promotions).where(eq(promotions.isActive, true));
  
  const allPromos = await query.all();
  
  // Filter by type if provided (Drizzle-lite style)
  const filtered = type ? allPromos.filter(p => p.type === type) : allPromos;
  
  return c.json({ promotions: filtered.sort((a, b) => (b.priority || 0) - (a.priority || 0)) });
});

// GET /api/config/site - Get all site configurations
configRouter.get('/site', async (c) => {
  const db = drizzle(c.env.DB);
  const allConfigs = await db.select().from(siteConfig).all();
  
  // Transform to a key-value object
  const configMap = allConfigs.reduce((acc: any, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});
  
  return c.json({ config: configMap });
});

// GET /api/config/discovery - Get all homepage discovery grids
configRouter.get('/discovery', async (c) => {
  const db = drizzle(c.env.DB);
  const grids = await db.select().from(discoveryGrids).all();
  
  const formattedGrids = grids.map(g => ({
    ...g,
    items: JSON.parse(g.items)
  })).sort((a, b) => (a.order || 0) - (b.order || 0));
  
  return c.json({ grids: formattedGrids });
});

export default configRouter;
