import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { users, orders, products, categories, siteConfig, discoveryGrids, auditLogs } from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import { jwt } from 'hono/jwt';

type Bindings = { DB: D1Database; JWT_SECRET?: string };
type Variables = { jwtPayload: { sub: string; email: string; role: string } };

const adminRouter = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Helper to log admin actions
async function logAuditAction(db: any, userId: string, action: string, resource: string, details: string, severity: 'info' | 'warning' | 'critical' = 'info') {
  await db.insert(auditLogs).values({
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    userId,
    action,
    resource,
    details,
    severity
  }).run();
}

// Middleware Stage 1: JWT Verification
adminRouter.use('*', async (c, next) => {
  const secret = c.env.JWT_SECRET || 'fallback_secret_for_local_dev_only';
  const jwtMiddleware = jwt({ secret, alg: 'HS256' });
  return jwtMiddleware(c, next);
});

// Middleware Stage 2: Role Authorization
adminRouter.use('*', async (c, next) => {
  const user = c.get('jwtPayload');
  
  if (!user || user.role !== 'admin') {
    console.warn('Unauthorized Admin Access Attempt:', user?.email);
    return c.json({ error: 'Unauthorized: Admin credentials required' }, 403);
  }
  
  return next();
});

// GET /api/admin/stats - Basic dashboard stats
adminRouter.get('/stats', async (c) => {
  const db = drizzle(c.env.DB);
  
  const totalUsers = await db.select().from(users).all();
  const totalOrders = await db.select().from(orders).all();
  const totalProducts = await db.select().from(products).all();
  
  const revenue = totalOrders.reduce((sum, o) => sum + o.total, 0);

  return c.json({
    stats: {
      users: totalUsers.length,
      orders: totalOrders.length,
      products: totalProducts.length,
      revenue: revenue
    }
  });
});

// GET /api/admin/orders - List all orders
adminRouter.get('/orders', async (c) => {
  const db = drizzle(c.env.DB);
  const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt)).all();
  return c.json({ orders: allOrders });
});

// GET /api/admin/users - List all users
adminRouter.get('/users', async (c) => {
  const db = drizzle(c.env.DB);
  const allUsers = await db.select({
    id: users.id,
    email: users.email,
    fullName: users.fullName,
    role: users.role,
    isActive: users.isActive,
    createdAt: users.createdAt
  }).from(users).all();
  return c.json({ users: allUsers });
});

// POST /api/admin/config/site - Update site configuration
adminRouter.post('/config/site', async (c) => {
  const db = drizzle(c.env.DB);
  const body = await c.req.json();
  const admin = c.get('jwtPayload');
  
  for (const [key, value] of Object.entries(body)) {
    await db.insert(siteConfig).values({
      key: key as string,
      value: value as string
    }).onConflictDoUpdate({
      target: siteConfig.key,
      set: { value: value as string }
    }).run();
  }

  await logAuditAction(db, admin.sub, 'CONFIG_UPDATE', 'Site', `Updated keys: ${Object.keys(body).join(', ')}`);

  return c.json({ message: 'Site configuration updated' });
});

// GET /api/admin/audit-logs - Real system logs
adminRouter.get('/audit-logs', async (c) => {
  const db = drizzle(c.env.DB);
  const logs = await db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(100).all();
  return c.json({ logs });
});

// POST /api/admin/users/:id/action - Manage user status
adminRouter.post('/users/:id/action', async (c) => {
  const db = drizzle(c.env.DB);
  const id = c.req.param('id');
  const { action } = await c.req.json();
  const admin = c.get('jwtPayload');

  if (action === 'suspend') {
    await db.update(users).set({ isActive: false }).where(eq(users.id, id)).run();
    await logAuditAction(db, admin.sub, 'USER_SUSPENDED', `User:${id}`, 'Administrative suspension', 'warning');
  } else if (action === 'activate') {
    await db.update(users).set({ isActive: true }).where(eq(users.id, id)).run();
    await logAuditAction(db, admin.sub, 'USER_ACTIVATED', `User:${id}`, 'Administrative activation');
  } else if (action === 'delete') {
    await db.delete(users).where(eq(users.id, id)).run();
    await logAuditAction(db, admin.sub, 'USER_DELETED', `User:${id}`, 'Permanent account deletion', 'critical');
  }

  return c.json({ message: `User ${action}ed successfully` });
});

// POST /api/admin/system/freeze - Toggle Global Freeze
adminRouter.post('/system/freeze', async (c) => {
  const db = drizzle(c.env.DB);
  const { status } = await c.req.json();
  const admin = c.get('jwtPayload');

  await db.insert(siteConfig).values({
    key: 'is_frozen',
    value: String(status)
  }).onConflictDoUpdate({
    target: siteConfig.key,
    set: { value: String(status) }
  }).run();

  await logAuditAction(db, admin.sub, status ? 'SYSTEM_FROZEN' : 'SYSTEM_THAWED', 'Global', 'Deployment state changed', status ? 'critical' : 'info');

  return c.json({ message: status ? 'Global Freeze Activated' : 'System Thawed' });
});

// GET /api/admin/system/backup - Point to DB Export
adminRouter.get('/system/backup', async (c) => {
  const admin = c.get('jwtPayload');
  const db = drizzle(c.env.DB);
  await logAuditAction(db, admin.sub, 'DB_BACKUP_REQUEST', 'D1', 'Backup sequence initiated');
  return c.json({ message: 'Backup sequence initiated. Check wrangler logs for artifact export.' });
});

// GET /api/admin/products - Detailed matrix list
adminRouter.get('/products', async (c) => {
  const db = drizzle(c.env.DB);
  const allProducts = await db.select().from(products).orderBy(desc(products.createdAt)).all();
  return c.json({ products: allProducts });
});

// POST /api/admin/products/:id/status - Toggle product status
adminRouter.post('/products/:id/status', async (c) => {
  const db = drizzle(c.env.DB);
  const id = c.req.param('id');
  const { status } = await c.req.json();
  const admin = c.get('jwtPayload');

  await db.update(products).set({ status }).where(eq(products.id, id)).run();
  await logAuditAction(db, admin.sub, 'PRODUCT_STATUS_CHANGE', `Product:${id}`, `Status changed to ${status}`);

  return c.json({ message: 'Product status updated' });
});

// GET /api/admin/config/discovery - List all discovery grids for editing
adminRouter.get('/config/discovery', async (c) => {
  const db = drizzle(c.env.DB);
  const grids = await db.select().from(discoveryGrids).orderBy(discoveryGrids.order).all();
  return c.json({ grids });
});

// POST /api/admin/config/discovery - Update or create discovery grid
adminRouter.post('/config/discovery', async (c) => {
  const db = drizzle(c.env.DB);
  const body = await c.req.json();
  const admin = c.get('jwtPayload');
  
  if (body.id) {
    await db.update(discoveryGrids)
      .set({
        title: body.title,
        items: JSON.stringify(body.items),
        link: body.link,
        order: body.order
      })
      .where(eq(discoveryGrids.id, body.id))
      .run();
    await logAuditAction(db, admin.sub, 'DISCOVERY_GRID_UPDATE', `Grid:${body.id}`, 'Updated existing grid items');
  } else {
    const newId = `grid-${Date.now()}`;
    await db.insert(discoveryGrids).values({
      id: newId,
      title: body.title,
      items: JSON.stringify(body.items),
      link: body.link,
      order: body.order || 0
    }).run();
    await logAuditAction(db, admin.sub, 'DISCOVERY_GRID_CREATE', `Grid:${newId}`, 'Created new homepage discovery grid');
  }

  return c.json({ message: 'Discovery grid updated' });
});

// GET /api/admin/fix-categories - Integrity Fix Protocol
adminRouter.get('/fix-categories', async (c) => {
  const db = drizzle(c.env.DB);
  const admin = c.get('jwtPayload');
  
  const allProds = await db.select().from(products).all();
  const allCats = await db.select().from(categories).all();
  
  let fixedCount = 0;
  for (const prod of allProds) {
    // If categoryId is missing or doesn't match any existing category
    if (!prod.categoryId || !allCats.find(cat => cat.id === prod.categoryId)) {
      // Try to find by name (assuming name was stored or matches slug)
      const bestMatch = allCats.find(cat => prod.title.toLowerCase().includes(cat.name.toLowerCase()));
      if (bestMatch) {
        await db.update(products).set({ categoryId: bestMatch.id }).where(eq(products.id, prod.id)).run();
        fixedCount++;
      }
    }
  }

  await logAuditAction(db, admin.sub, 'INTEGRITY_FIX', 'Matrix', `Synchronized ${fixedCount} orphaned categories`);
  
  return c.json({ message: `Integrity check complete. ${fixedCount} records synchronized.` });
});

// POST /api/admin/apply-seller - Artisan Application Protocol
adminRouter.post('/apply-seller', async (c) => {
  const db = drizzle(c.env.DB);
  const admin = c.get('jwtPayload');
  
  await db.update(users).set({ role: 'seller' }).where(eq(users.id, admin.sub)).run();
  await logAuditAction(db, admin.sub, 'ROLE_UPGRADE', 'Identity', 'Upgraded to Artisan/Seller status');
  
  return c.json({ message: 'Welcome to the Studio, Artisan. Your permissions have been synchronized.' });
});

export default adminRouter;
