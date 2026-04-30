import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { drizzle } from 'drizzle-orm/d1';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcryptjs';
import { sign } from 'hono/jwt';

// Ensure the JWT secret is available in Bindings
type Bindings = {
  DB: D1Database;
  JWT_SECRET?: string;
};

const authRouter = new Hono<{ Bindings: Bindings }>();

// 1. Validation Schemas
const registerSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password too long')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[\W_]/, 'Password must contain at least one special character'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })
  .refine((data) => {
    const emailPrefix = data.email.split('@')[0];
    return !data.password.toLowerCase().includes(emailPrefix.toLowerCase());
  }, {
    message: 'Password must not contain your email prefix',
    path: ['password'],
  });

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// 2. Helper to generate UUIDs
const generateId = () => crypto.randomUUID();

// 3. Register Route
authRouter.post('/register', zValidator('json', registerSchema), async (c) => {
  const { email, password, fullName } = c.req.valid('json');
  const db = drizzle(c.env.DB);

  // Check if user exists
  const existingUser = await db.select().from(users).where(eq(users.email, email)).get();
  if (existingUser) {
    return c.json({ error: 'Email is already registered' }, 409);
  }

  // Truncate to 72 chars before bcrypt to prevent DoS (as per security guidelines)
  const passwordToHash = password.substring(0, 72);

  // Hash password with cost factor 12 (as per security guidelines)
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(passwordToHash, salt);

  // Insert user
  const userId = generateId();
  try {
    await db.insert(users).values({
      id: userId,
      email,
      fullName,
      hashedPassword,
      role: 'buyer', // default role
    });

    return c.json({ message: 'User registered successfully', userId }, 201);
  } catch (error) {
    console.error('Registration error:', error);
    return c.json({ error: 'Internal server error during registration' }, 500);
  }
});

// 4. Login Route
authRouter.post('/login', zValidator('json', loginSchema), async (c) => {
  const { email, password } = c.req.valid('json');
  const db = drizzle(c.env.DB);

  // Find user
  const user = await db.select().from(users).where(eq(users.email, email)).get();
  if (!user) {
    return c.json({ error: 'Invalid email or password' }, 401);
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.hashedPassword);
  if (!isValidPassword) {
    return c.json({ error: 'Invalid email or password' }, 401);
  }

  // Generate JWT
  const secret = c.env.JWT_SECRET || 'fallback_secret_for_local_dev_only';
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours expiry
  };

  const token = await sign(payload, secret, 'HS256');

  return c.json({
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
  });
});

export default authRouter;
