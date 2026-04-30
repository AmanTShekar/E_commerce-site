import { drizzle } from 'drizzle-orm/d1';
import { users, categories, products, promotions, siteConfig, discoveryGrids } from './schema';
import bcrypt from 'bcryptjs';

export async function seed(db: any) {
  console.log('Starting seed process...');

  // Clean existing data to avoid conflicts
  await db.delete(products).run();
  await db.delete(users).run();
  await db.delete(categories).run();

  // 1. Seed Categories
  const categoryData = [
    { id: 'cat-home-office', name: 'Home Office Essentials', slug: 'home-office' },
    { id: 'cat-audio', name: 'Audio Mastery', slug: 'audio' },
    { id: 'cat-furniture', name: 'Task Furniture', slug: 'furniture' },
    { id: 'cat-gaming', name: 'Gaming Hardware', slug: 'gaming' },
    { id: 'cat-obsidian', name: 'Obsidian Series', slug: 'obsidian' },
    { id: 'cat-limited', name: 'Limited Drop', slug: 'limited-drop' }
  ];

  for (const cat of categoryData) {
    await db.insert(categories).values(cat).onConflictDoNothing();
  }

  const commonPassword = await bcrypt.hash('Pass@1234', 10);

  // 2. Seed Admin
  await db.insert(users).values({
    id: 'admin-1',
    email: 'admin@nexmart.in',
    hashedPassword: commonPassword,
    fullName: 'System Administrator',
    role: 'admin'
  }).onConflictDoNothing();

  // 3. Seed Sellers
  const sellers = [];
  for (let i = 1; i <= 5; i++) {
    const seller = {
      id: `seller-${i}`,
      email: `vendor${i}@nexmart.in`,
      hashedPassword: commonPassword,
      fullName: `Vendor Store ${i}`,
      role: 'seller'
    };
    await db.insert(users).values(seller).onConflictDoNothing();
    sellers.push(seller);
  }

  // 4. Seed Products
  const productTemplates = [
    // Home Office
    { name: 'Mechanical Keyboard (RGB)', cat: 'cat-home-office', brand: 'Keychron', price: 12000, img: 'https://images.unsplash.com/photo-1595225402422-03d7e674a6a7' },
    { name: 'Ergonomic Productivity Mouse', cat: 'cat-home-office', brand: 'Logitech', price: 8500, img: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46' },
    { name: 'Aluminum Monitor Stand', cat: 'cat-home-office', brand: 'Satechi', price: 4500, img: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6' },
    { name: 'Premium Felt Desk Mat', cat: 'cat-home-office', brand: 'Grovemade', price: 3500, img: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd' },
    
    // Audio Mastery
    { name: 'Studio Headphones', cat: 'cat-audio', brand: 'Sony', price: 29900, img: 'https://images.unsplash.com/photo-1546435770-a3e4265029b6' },
    { name: 'Wireless Earbuds Pro', cat: 'cat-audio', brand: 'Apple', price: 24900, img: 'https://images.unsplash.com/photo-1588423770574-013c7a6e4f3a' },
    { name: 'Hi-Fi Bookshelf Speakers', cat: 'cat-audio', brand: 'Audioengine', price: 35000, img: 'https://images.unsplash.com/photo-1589492477829-5e65395b66cc' },
    { name: 'Professional Condenser Mic', cat: 'cat-audio', brand: 'Shure', price: 32000, img: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc' },

    // Task Furniture
    { name: 'Executive Office Chair', cat: 'cat-furniture', brand: 'Herman Miller', price: 125000, img: 'https://images.unsplash.com/photo-1505797149-43b0ad0d7996' },
    { name: 'Electric Standing Desk', cat: 'cat-furniture', brand: 'Fully', price: 65000, img: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c' },
    { name: 'Industrial Steel Shelving', cat: 'cat-furniture', brand: 'NEXMART', price: 12500, img: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1' },
    { name: 'Minimalist Task Lamp', cat: 'cat-furniture', brand: 'Anglepoise', price: 8500, img: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c' },

    // Gaming Hardware
    { name: 'NVIDIA RTX 4090 GPU', cat: 'cat-gaming', brand: 'NVIDIA', price: 185000, img: 'https://images.unsplash.com/photo-1591488320449-011701bb6704' },
    { name: '240Hz Gaming Monitor', cat: 'cat-gaming', brand: 'ASUS', price: 45000, img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf' },
    { name: 'RGB Mechanical Keyboard', cat: 'cat-gaming', brand: 'Razer', price: 15000, img: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae' },
    { name: 'Pro Streaming Kit', cat: 'cat-gaming', brand: 'Elgato', price: 28000, img: 'https://images.unsplash.com/photo-1598550476439-6847785fce66' },

    // Special Items for Banners
    { name: 'Studio Series Headphones', cat: 'cat-obsidian', brand: 'NEXMART', price: 29900, img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e' },
    { name: 'Oak & Walnut Desk', cat: 'cat-obsidian', brand: 'NEXMART', price: 12500, img: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd' },
    { name: 'Steel Grey Edition', cat: 'cat-limited', brand: 'NEXMART', price: 18500, img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30' }
  ];

  const productInserts = [];
  for (let i = 0; i < productTemplates.length; i++) {
    const template = productTemplates[i];
    const seller = sellers[i % sellers.length];
    
    productInserts.push(
      db.insert(products).values({
        id: `prod-${i}`,
        sellerId: seller.id,
        title: template.name,
        description: `Premium ${template.name} designed for maximum efficiency and aesthetic appeal.`,
        price: template.price,
        mrp: template.price + 5000,
        stock: 50,
        categoryId: template.cat,
        brand: template.brand,
        image: `${template.img}?w=800&auto=format&fit=crop`
      }).onConflictDoNothing()
    );
  }

  for (let i = 0; i < productInserts.length; i += 10) {
    await Promise.all(productInserts.slice(i, i + 10));
  }

  // 5. Seed Promotions (Banners, Bank Offers)
  const promoData = [
    { 
      id: 'promo-1', 
      type: 'hero_banner', 
      title: 'STUDIO SERIES', 
      subtitle: 'Pro Audio Engineered for high-performance productivity.', 
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600&q=80',
      linkUrl: '/discovery?category=cat-audio',
      priority: 1
    },
    { 
      id: 'promo-2', 
      type: 'hero_banner', 
      title: 'SUSTAINABILITY', 
      subtitle: 'Ethically sourced, precision crafted furniture.', 
      imageUrl: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=1600&q=80',
      linkUrl: '/discovery?category=cat-furniture',
      priority: 2
    },
    { 
      id: 'promo-3', 
      type: 'bank_offer', 
      title: 'HDFC', 
      subtitle: '10% Instant Discount on HDFC Bank Credit Cards', 
      imageUrl: 'HDFC', 
      metadata: JSON.stringify({ discount: '10%', minAmount: 5000 })
    },
    { 
      id: 'promo-4', 
      type: 'bank_offer', 
      title: 'ICICI', 
      subtitle: 'Extra ₹2,500 Off on ICICI Bank EMI Transactions', 
      imageUrl: 'ICICI',
      metadata: JSON.stringify({ discount: '₹2500', minAmount: 20000 })
    }
  ];

  for (const promo of promoData) {
    await db.insert(promotions).values(promo).onConflictDoNothing();
  }

  // 6. Seed Site Config
  const configData = [
    { key: 'guarantee_shipping', value: 'Fast Global Shipping' },
    { key: 'guarantee_returns', value: '30-Day Easy Returns' },
    { key: 'guarantee_warranty', value: '2 Year Brand Warranty' },
    { key: 'guarantee_secure', value: 'Secure Payment PCI-DSS' },
    { key: 'is_frozen', value: 'false' }
  ];

  for (const config of configData) {
    await db.insert(siteConfig).values(config).onConflictDoNothing();
  }

  // 7. Seed Discovery Grids
  const gridData = [
    {
      id: 'grid-office',
      title: 'Home Office Essentials',
      items: JSON.stringify(['Mechanical Keyboards', 'Ergonomic Mice', 'Monitor Stands', 'Desk Mats']),
      link: '/search?category=Home Office Essentials',
      order: 1
    },
    {
      id: 'grid-audio',
      title: 'Audio Mastery',
      items: JSON.stringify(['Studio Headphones', 'Wireless Earbuds', 'Hi-Fi Speakers', 'Microphones']),
      link: '/search?category=Audio Mastery',
      order: 2
    },
    {
      id: 'grid-furniture',
      title: 'Task Furniture',
      items: JSON.stringify(['Office Chairs', 'Standing Desks', 'Steel Shelving', 'Task Lamps']),
      link: '/search?category=Task Furniture',
      order: 3
    },
    {
      id: 'grid-gaming',
      title: 'Gaming Hardware',
      items: JSON.stringify(['NVIDIA GPUs', 'Gaming Monitors', 'RGB Keyboards', 'Streaming Kits']),
      link: '/search?category=Gaming Hardware',
      order: 4
    }
  ];

  for (const grid of gridData) {
    await db.insert(discoveryGrids).values(grid).onConflictDoNothing();
  }

  console.log('Seed completed successfully!');
}
