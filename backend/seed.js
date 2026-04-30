const { randomUUID } = require('crypto');
const fs = require('fs');

const categories = [
  { id: randomUUID(), name: 'Cyber Hardware', slug: 'cyber-hardware' },
  { id: randomUUID(), name: 'Obsidian Series', slug: 'obsidian-series' },
  { id: randomUUID(), name: 'Hyper Performance', slug: 'hyper-performance' },
  { id: randomUUID(), name: 'Studio Audio', slug: 'studio-audio' },
  { id: randomUUID(), name: 'Artisan Essentials', slug: 'artisan-essentials' }
];

const images = [
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
  'https://images.unsplash.com/photo-1526170315870-ef6876fd8418?w=800&q=80',
  'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80',
  'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&q=80',
  'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80',
  'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80',
  'https://images.unsplash.com/photo-1509048191080-d2984bad6ad5?w=800&q=80',
  'https://images.unsplash.com/photo-1529336953128-6e17730a9370?w=800&q=80'
];

async function seed() {
  console.log("Generating high-fidelity seed SQL...");
  
  const adminId = randomUUID();
  const sellerId = randomUUID(); 

  let sql = `
-- Clean up existing data
DELETE FROM wishlist_items;
DELETE FROM reviews;
DELETE FROM cart_items;
DELETE FROM carts;
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM products;
DELETE FROM categories;
DELETE FROM users;

-- Create Admin and Seller
INSERT INTO users (id, email, hashed_password, full_name, role) VALUES ('${adminId}', 'admin@nexmart.in', '$2b$10$D2XMhYdr0LJMdNJeFt.neuSGVubQ4jFUzUReEFBPvCipsOPUr3rM2', 'System Admin', 'admin');
INSERT INTO users (id, email, hashed_password, full_name, role) VALUES ('${sellerId}', 'seller@nexmart.in', '$2b$10$D2XMhYdr0LJMdNJeFt.neuSGVubQ4jFUzUReEFBPvCipsOPUr3rM2', 'Obsidian Hardware', 'seller');

-- Seed Categories
${categories.map(c => `INSERT INTO categories (id, name, slug) VALUES ('${c.id}', '${c.name}', '${c.slug}');`).join('\n')}

-- Seed 50 Products
`;

  for (let i = 1; i <= 50; i++) {
    const cat = categories[Math.floor(Math.random() * categories.length)];
    const img = images[i % images.length];
    const price = Math.floor(Math.random() * 50000) + 5000;
    const mrp = price + Math.floor(Math.random() * 5000);
    const title = `NEXMART ${cat.name.split(' ')[0]} ${i < 10 ? '0' + i : i}`;
    
    sql += `INSERT INTO products (id, seller_id, title, description, price, mrp, stock, category_id, brand, image, status) 
VALUES ('${randomUUID()}', '${sellerId}', '${title}', 'A high-performance asset from the ${cat.name} line.', ${price}, ${mrp}, 100, '${cat.id}', 'NEXMART', '${img}', 'active');\n`;
  }

  fs.writeFileSync('seed.sql', sql);
  console.log("High-fidelity seed SQL written to seed.sql");
}

seed();
