import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { products, categories } from '../db/schema';
import { eq, like, or } from 'drizzle-orm';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { jwt } from 'hono/jwt';

type Bindings = { 
  DB: D1Database; 
  BUCKET: R2Bucket; 
  JWT_SECRET?: string 
};
type Variables = { jwtPayload: { sub: string; email: string; role: string } };

const productRouter = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// GET /api/products - List all products with optional search and category filter
productRouter.get('/', async (c) => {
  const db = drizzle(c.env.DB);
  const search = c.req.query('q');
  const categoryId = c.req.query('category');

  let query = db.select({
    id: products.id,
    sellerId: products.sellerId,
    title: products.title,
    description: products.description,
    price: products.price,
    mrp: products.mrp,
    stock: products.stock,
    categoryId: products.categoryId,
    categoryName: categories.name,
    brand: products.brand,
    image: products.image,
    status: products.status,
    createdAt: products.createdAt,
  })
  .from(products)
  .leftJoin(categories, eq(products.categoryId, categories.id));

  if (categoryId) {
    query = query.where(eq(products.categoryId, categoryId)) as any;
  }

  // Handle empty search query (Section 16.5)
  if (search === '') {
    return c.json({ products: [], message: 'Empty search query' });
  }

  const allProducts = await query.all();

  // Very basic search (In production, we would use FTS5 for SQLite)
  const results = search
    ? allProducts.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()))
    : allProducts;

  return c.json({ products: results });
});

// GET /api/products/:id - Get a single product
productRouter.get('/:id', async (c) => {
  const db = drizzle(c.env.DB);
  const id = c.req.param('id');
  
  const product = await db.select({
    id: products.id,
    sellerId: products.sellerId,
    title: products.title,
    description: products.description,
    price: products.price,
    mrp: products.mrp,
    stock: products.stock,
    categoryId: products.categoryId,
    categoryName: categories.name,
    brand: products.brand,
    image: products.image,
    status: products.status,
    createdAt: products.createdAt,
  })
  .from(products)
  .leftJoin(categories, eq(products.categoryId, categories.id))
  .where(eq(products.id, id))
  .get();

  if (!product) return c.json({ error: 'Product not found' }, 404);
  
  return c.json({ product });
});

// --- PROTECTED SELLER ROUTES ---
productRouter.use('*', async (c, next) => {
  const secret = c.env.JWT_SECRET || 'fallback_secret_for_local_dev_only';
  const jwtMiddleware = jwt({ secret, alg: 'HS256' });
  return jwtMiddleware(c, next);
});

const createProductSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  price: z.number().positive(),
  mrp: z.number().positive(),
  stock: z.number().int().nonnegative(),
  categoryId: z.string().optional(),
  brand: z.string().optional(),
  image: z.string().url().optional()
});

// POST /api/products - Create a new product (Sellers only)
productRouter.post('/', zValidator('json', createProductSchema), async (c) => {
  const user = c.get('jwtPayload');
  if (user.role !== 'seller' && user.role !== 'admin') {
    return c.json({ error: 'Only sellers can create products' }, 403);
  }

  const data = c.req.valid('json');
  const db = drizzle(c.env.DB);
  const productId = crypto.randomUUID();

  await db.insert(products).values({
    id: productId,
    sellerId: user.sub,
    title: data.title,
    // Basic sanitization for description (Section 7.3)
    description: data.description.replace(/<[^>]*>?/gm, ''), 
    price: data.price,
    mrp: data.mrp,
    stock: data.stock,
    categoryId: data.categoryId || null,
    brand: data.brand || null,
    image: data.image || null,
    status: 'active'
  });

  return c.json({ message: 'Product created', productId }, 201);
});

// POST /api/products/upload - Upload an image to R2 (Sellers only)
productRouter.post('/upload', async (c) => {
  const user = c.get('jwtPayload');
  if (user.role !== 'seller' && user.role !== 'admin') {
    return c.json({ error: 'Only sellers can upload images' }, 403);
  }

  const body = await c.req.parseBody();
  const file = body['file'] as File;

  if (!file) {
    return c.json({ error: 'No file uploaded' }, 400);
  }

  // Validate file type (EC-108)
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    return c.json({ error: 'Invalid file type. Only JPEG, PNG, and WEBP are allowed.' }, 400);
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return c.json({ error: 'File size too large (max 5MB)' }, 400);
  }

  const key = `products/${crypto.randomUUID()}-${file.name}`;
  
  // @ts-ignore - R2Bucket typing
  await c.env.BUCKET.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type }
  });

  // In production, return the CDN URL or public Worker URL
  const publicUrl = `https://assets.nexmart.in/${key}`; 

  return c.json({ 
    message: 'Upload successful', 
    url: publicUrl,
    key 
  });
});

export default productRouter;
