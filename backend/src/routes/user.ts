import { Hono } from 'hono';
import { jwt } from 'hono/jwt';
import { drizzle } from 'drizzle-orm/d1';
import { users, addresses } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

type Bindings = {
  DB: D1Database;
  JWT_SECRET?: string;
};

type Variables = {
  jwtPayload: {
    sub: string;
    email: string;
    role: string;
  };
};

const userRouter = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// JWT Middleware - Apply to all routes in this router
userRouter.use('*', async (c, next) => {
  const secret = c.env.JWT_SECRET || 'fallback_secret_for_local_dev_only';
  try {
    const jwtMiddleware = jwt({
      secret,
      alg: 'HS256',
    });
    return jwtMiddleware(c, next);
  } catch (err: any) {
    console.error('User JWT Middleware Error:', err);
    return c.json({ error: 'Session verification failed' }, 401);
  }
});

// Get current user profile
userRouter.get('/me', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    if (!payload) {
      return c.json({ error: 'Unauthorized: Missing payload' }, 401);
    }

    const db = drizzle(c.env.DB);
    const user = await db.select({
      id: users.id,
      email: users.email,
      fullName: users.fullName,
      role: users.role,
    }).from(users).where(eq(users.id, payload.sub)).get();

    if (!user) {
      console.warn('User not found in DB for sub:', payload.sub);
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json({ user });
  } catch (err: any) {
    console.error('Error in /me endpoint:', err);
    return c.json({ error: 'Internal Server Error', message: err.message }, 500);
  }
});

// --- Address Management ---

const addressSchema = z.object({
  label: z.string().min(1, 'Label is required (e.g. Home, Work)'),
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pincode: z.string().min(6, 'Pincode must be at least 6 digits'),
  country: z.string().default('India'),
  isDefault: z.boolean().default(false),
});

// GET /api/user/addresses - List all saved addresses
userRouter.get('/addresses', async (c) => {
  const payload = c.get('jwtPayload');
  const db = drizzle(c.env.DB);

  const myAddresses = await db.select().from(addresses)
    .where(eq(addresses.userId, payload.sub)).all();

  return c.json({ addresses: myAddresses });
});

// POST /api/user/addresses - Add a new address
userRouter.post('/addresses', zValidator('json', addressSchema), async (c) => {
  const payload = c.get('jwtPayload');
  const db = drizzle(c.env.DB);
  const data = c.req.valid('json');

  // Check address limit (max 5 as per plan.md)
  const existingCount = await db.select().from(addresses)
    .where(eq(addresses.userId, payload.sub)).all();
  
  if (existingCount.length >= 5) {
    return c.json({ error: 'Maximum limit of 5 addresses reached' }, 400);
  }

  // If this is default, unset other defaults
  if (data.isDefault) {
    await db.update(addresses).set({ isDefault: false })
      .where(eq(addresses.userId, payload.sub));
  }

  const addressId = crypto.randomUUID();
  await db.insert(addresses).values({
    id: addressId,
    userId: payload.sub,
    ...data,
  });

  return c.json({ message: 'Address added successfully', addressId }, 201);
});

export default userRouter;
