import { sqliteTable, text, integer, real, blob } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Users Table
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').unique().notNull(),
  hashedPassword: text('hashed_password').notNull(),
  fullName: text('full_name').notNull(),
  phone: text('phone'),
  role: text('role', { enum: ['buyer', 'seller', 'admin'] }).default('buyer').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).default(true).notNull(),
  isVerified: integer('is_verified', { mode: 'boolean' }).default(false).notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Addresses Table
export const addresses = sqliteTable('addresses', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  label: text('label').notNull(), // e.g., 'Home', 'Work'
  street: text('street').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  pincode: text('pincode').notNull(),
  country: text('country').notNull(),
  isDefault: integer('is_default', { mode: 'boolean' }).default(false).notNull(),
});

// Categories Table
export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  parentId: text('parent_id'),
  iconUrl: text('icon_url'),
});

// Products Table
export const products = sqliteTable('products', {
  id: text('id').primaryKey(),
  sellerId: text('seller_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  price: real('price').notNull(),
  mrp: real('mrp').notNull(),
  stock: integer('stock').notNull(),
  categoryId: text('category_id').references(() => categories.id),
  brand: text('brand'),
  image: text('image'),
  status: text('status', { enum: ['active', 'inactive', 'pending'] }).default('active').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Orders Table
export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  addressId: text('address_id').references(() => addresses.id), // Link to original, but snapshot is authoritative
  shippingFullName: text('shipping_full_name').notNull(),
  shippingStreet: text('shipping_street').notNull(),
  shippingCity: text('shipping_city').notNull(),
  shippingState: text('shipping_state').notNull(),
  shippingPincode: text('shipping_pincode').notNull(),
  total: real('total').notNull(),
  status: text('status', { enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] }).default('pending').notNull(),
  paymentStatus: text('payment_status', { enum: ['pending', 'completed', 'failed', 'refunded'] }).default('pending').notNull(),
  paymentId: text('payment_id'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Order Items Table
export const orderItems = sqliteTable('order_items', {
  id: text('id').primaryKey(),
  orderId: text('order_id').references(() => orders.id).notNull(),
  productId: text('product_id').references(() => products.id).notNull(),
  sellerId: text('seller_id').references(() => users.id).notNull(),
  quantity: integer('quantity').notNull(),
  unitPrice: real('unit_price').notNull(),
  titleSnapshot: text('title_snapshot').notNull(),
  imageSnapshot: text('image_snapshot'),
  status: text('status', { enum: ['pending', 'shipped', 'delivered', 'cancelled', 'returned'] }).default('pending').notNull(),
});

// Cart Table
export const carts = sqliteTable('carts', {
  id: text('id').primaryKey(),
  userId: text('user_id').unique().references(() => users.id).notNull(),
});

// Cart Items Table
export const cartItems = sqliteTable('cart_items', {
  id: text('id').primaryKey(),
  cartId: text('cart_id').references(() => carts.id).notNull(),
  productId: text('product_id').references(() => products.id).notNull(),
  quantity: integer('quantity').notNull(),
  addedAt: text('added_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Reviews Table
export const reviews = sqliteTable('reviews', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  productId: text('product_id').references(() => products.id).notNull(),
  orderId: text('order_id').references(() => orders.id),
  rating: integer('rating').notNull(),
  title: text('title').notNull(),
  body: text('body').notNull(),
  isVerifiedPurchase: integer('is_verified_purchase', { mode: 'boolean' }).default(false).notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Promotions Table (Banners, Bank Offers)
export const promotions = sqliteTable('promotions', {
  id: text('id').primaryKey(),
  type: text('type', { enum: ['hero_banner', 'bank_offer', 'ad_banner', 'flash_deal'] }).notNull(),
  title: text('title').notNull(),
  subtitle: text('subtitle'),
  imageUrl: text('image_url').notNull(),
  linkUrl: text('link_url'),
  priority: integer('priority').default(0),
  isActive: integer('is_active', { mode: 'boolean' }).default(true).notNull(),
  metadata: text('metadata'), // JSON string for extra data like bank codes, discount %
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Site Config Table (Global Settings)
export const siteConfig = sqliteTable('site_config', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const discoveryGrids = sqliteTable('discovery_grids', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  items: text('items').notNull(), // JSON string of items: ["Item 1", "Item 2"]
  link: text('link'),
  order: integer('order').default(0)
});

export const wishlistItems = sqliteTable('wishlist_items', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  productId: text('product_id').references(() => products.id).notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const auditLogs = sqliteTable('audit_logs', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  action: text('action').notNull(),
  details: text('details'),
  resource: text('resource'),
  severity: text('severity', { enum: ['info', 'warning', 'critical'] }).default('info').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});
