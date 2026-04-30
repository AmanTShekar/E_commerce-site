import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'
import authRouter from './routes/auth'
import userRouter from './routes/user'
import productRouter from './routes/products'
import categoryRouter from './routes/categories'
import cartRouter from './routes/cart'
import orderRouter from './routes/orders'
import wishlistRouter from './routes/wishlist'
import reviewsRouter from './routes/reviews'
import adminRouter from './routes/admin'
import configRouter from './routes/config'
import dealsRouter from './routes/deals'
import { seed } from './db/seed'
import { drizzle } from 'drizzle-orm/d1'
import { siteConfig } from './db/schema'
import { eq } from 'drizzle-orm'

type Bindings = {
  DB: D1Database;
  JWT_SECRET?: string;
  ALLOWED_ORIGIN?: string;
  APP_ENV?: string;
}

const app = new Hono<{ Bindings: Bindings }>()

// Middleware
app.use('/*', secureHeaders()) // Sets HSTS, X-Frame-Options, X-Content-Type-Options, etc.
app.use('/*', cors({
  origin: (origin, c) => c.env.ALLOWED_ORIGIN || '*', 
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Idempotency-Key'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: true,
}))

// System Guard: Enforce Global Freeze
app.use('/api/*', async (c, next) => {
  const method = c.req.method;
  const path = c.req.path;
  
  // Allow all GET requests and all admin routes
  if (method === 'GET' || path.startsWith('/api/admin')) return next();

  // Check if system is frozen
  const db = drizzle(c.env.DB);
  try {
    const isFrozen = await db.select().from(siteConfig).where(eq(siteConfig.key, 'is_frozen')).get();
    if (isFrozen && isFrozen.value === 'true') {
      return c.json({ 
        error: 'System Frozen', 
        message: 'A global freeze is currently in effect for maintenance. All write operations are halted.' 
      }, 503);
    }
  } catch (e) {
    // If table doesn't exist yet or other error, just continue
  }
  
  return next();
});

// Global Error Handler (EC-114)
app.onError((err, c) => {
  console.error(`[ERROR] ${err.message}`, err);
  return c.json({
    error: 'Internal Server Error',
    message: c.env.APP_ENV === 'production' ? 'Something went wrong' : err.message,
    stack: c.env.APP_ENV === 'production' ? undefined : err.stack,
  }, 500);
})

// Routes
app.get('/', (c) => {
  return c.json({ message: 'Welcome to NEXMART API on Cloudflare Edge!' })
})

app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Mount Auth Router
app.route('/api/auth', authRouter)

// Mount User Router (Protected)
app.route('/api/user', userRouter)

// Mount Product & Category Routers
app.route('/api/products', productRouter)
app.route('/api/categories', categoryRouter)
app.route('/api/cart', cartRouter)
app.route('/api/orders', orderRouter)
app.route('/api/wishlist', wishlistRouter)
app.route('/api/reviews', reviewsRouter)
app.route('/api/admin', adminRouter)
app.route('/api/deals', dealsRouter)
app.route('/api/config', configRouter)

app.get('/api/seed', async (c) => {
  const db = drizzle(c.env.DB);
  try {
    await seed(db);
    return c.json({ message: 'Seed successful' })
  } catch (err: any) {
    console.error('Seed error:', err);
    return c.json({ error: 'Seed failed', message: err.message }, 500)
  }
});

export default app
