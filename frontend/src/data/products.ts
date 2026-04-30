export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  discount?: string;
  category: string;
  rating: number;
  image: string;
  description?: string;
  specs?: Record<string, string>;
  isNew?: boolean;
  isFlashDeal?: boolean;
}

export const products: Product[] = [
  { 
    id: '1', 
    name: 'Studio Monitor Gen 3', 
    price: 45000, 
    oldPrice: 52000,
    discount: '15%',
    category: 'Audio', 
    rating: 4.9, 
    image: 'https://images.unsplash.com/photo-1588333390623-0ef50d75a874?q=80&w=2070&auto=format&fit=crop',
    description: 'Reference-grade studio monitors for professional audio production.',
    specs: { 'Drivers': '5" Kevlar', 'Freq Response': '45Hz - 22kHz', 'Power': '100W Bi-amped' },
    isFlashDeal: true
  },
  { 
    id: '2', 
    name: 'Keychron Q1 Pro', 
    price: 18999, 
    category: 'Hardware', 
    rating: 4.8, 
    image: 'https://images.unsplash.com/photo-1618335829737-2228ad3088c3?q=80&w=2070&auto=format&fit=crop',
    description: 'Wireless custom mechanical keyboard with CNC aluminum body.',
    specs: { 'Switches': 'K Pro Red', 'Material': 'Aluminum', 'Connection': 'Bluetooth/Wired' },
    isNew: true
  },
  { 
    id: '3', 
    name: 'Sony WH-1000XM5', 
    price: 29999, 
    oldPrice: 34999,
    discount: '14%',
    category: 'Audio', 
    rating: 5.0, 
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop',
    description: 'Industry-leading noise canceling headphones with exceptional sound.',
    specs: { 'Battery': '30 Hours', 'Weight': '250g', 'Bluetooth': '5.2' },
    isFlashDeal: true
  },
  { 
    id: '4', 
    name: 'MacBook Pro M3', 
    price: 169999, 
    category: 'Laptops', 
    rating: 4.9, 
    image: 'https://images.unsplash.com/photo-1517336714467-d23623217b9c?q=80&w=2070&auto=format&fit=crop',
    description: 'Unprecedented performance for professional workflows.',
    specs: { 'Chip': 'Apple M3 Pro', 'RAM': '18GB Unified', 'Storage': '512GB SSD' },
    isNew: true
  },
  { 
    id: '5', 
    name: 'Logitech MX Master 3S', 
    price: 9499, 
    category: 'Accessories', 
    rating: 4.7, 
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=1965&auto=format&fit=crop',
    description: 'Performance wireless mouse with silent clicks and 8K DPI sensor.',
    specs: { 'DPI': '8000', 'Buttons': '7 Custom', 'Battery': '70 Days' }
  },
  { 
    id: '6', 
    name: 'iPhone 15 Pro', 
    price: 134999, 
    category: 'Mobiles', 
    rating: 4.8, 
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=2070&auto=format&fit=crop',
    description: 'Forged in titanium. A17 Pro chip. A game-changing camera.',
    specs: { 'Screen': '6.1" OLED', 'Chip': 'A17 Pro', 'Camera': '48MP Main' }
  },
  { 
    id: '7', 
    name: 'Dell UltraSharp 32', 
    price: 89000, 
    category: 'Monitors', 
    rating: 4.9, 
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=2070&auto=format&fit=crop',
    description: '4K USB-C Hub Monitor with IPS Black technology.',
    specs: { 'Resolution': '4K UHD', 'Size': '32"', 'Panel': 'IPS Black' },
    isNew: true
  },
  { 
    id: '8', 
    name: 'Herman Miller Embody', 
    price: 145000, 
    category: 'Furniture', 
    rating: 5.0, 
    image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1964&auto=format&fit=crop',
    description: 'The pinnacle of ergonomic seating design.',
    specs: { 'Warranty': '12 Years', 'Back': 'Pixelated Support', 'Material': 'Balance Fabric' },
    isFlashDeal: true
  },
  { 
    id: '9', 
    name: 'Canon EOS R5', 
    price: 325000, 
    category: 'Photography', 
    rating: 4.9, 
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1938&auto=format&fit=crop',
    description: '8K video and 45MP stills in a compact mirrorless body.',
    specs: { 'Sensor': 'Full Frame', 'Video': '8K RAW', 'AF': 'Dual Pixel II' },
    isNew: true
  },
  { 
    id: '10', 
    name: 'Steelcase Gesture', 
    price: 98000, 
    category: 'Furniture', 
    rating: 4.8, 
    image: 'https://images.unsplash.com/photo-1505843490701-5be55ccb03a1?q=80&w=2070&auto=format&fit=crop',
    description: 'Designed for the way we work today.',
    specs: { 'Adjustability': '4D Arms', 'Support': 'LiveBack', 'Assembly': 'Pre-assembled' }
  },
  { 
    id: '11', 
    name: 'Audio-Technica LP120X', 
    price: 34900, 
    category: 'Audio', 
    rating: 4.7, 
    image: 'https://images.unsplash.com/photo-1539375665275-f9ad415ef9ac?q=80&w=2070&auto=format&fit=crop',
    description: 'Professional direct-drive manual turntable.',
    specs: { 'Drive': 'Direct', 'Speed': '33/45/78', 'Out': 'USB/Phono' },
    isFlashDeal: true
  },
  { 
    id: '12', 
    name: 'iPad Pro M4', 
    price: 99900, 
    category: 'Tablets', 
    rating: 4.9, 
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=2030&auto=format&fit=crop',
    description: 'Thinner than thin. Faster than fast.',
    specs: { 'Display': 'OLED Tandem', 'Chip': 'M4', 'Storage': '256GB' },
    isNew: true
  },
  { 
    id: '13', 
    name: 'Sennheiser HD 800 S', 
    price: 135000, 
    category: 'Audio', 
    rating: 5.0, 
    image: 'https://images.unsplash.com/photo-1546435770-a3e4265da3ec?q=80&w=2070&auto=format&fit=crop',
    description: 'Reference headphones for the ultimate listening experience.',
    specs: { 'Design': 'Open Back', 'Impedance': '300 Ohms', 'Made in': 'Germany' },
    isFlashDeal: true
  },
  { 
    id: '14', 
    name: 'ASUS ProArt Studiobook', 
    price: 245000, 
    category: 'Laptops', 
    rating: 4.8, 
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071&auto=format&fit=crop',
    description: 'For creative professionals who demand perfection.',
    specs: { 'GPU': 'RTX 4070', 'Screen': '3.2K OLED', 'Dial': 'ASUS Dial' },
    isNew: true
  },
  { 
    id: '15', 
    name: 'Evoluent VerticalMouse', 
    price: 8900, 
    category: 'Accessories', 
    rating: 4.6, 
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=2070&auto=format&fit=crop',
    description: 'Avoid forearm twisting for comfort and good health.',
    specs: { 'Type': 'Vertical', 'Hand': 'Right', 'Sensor': 'Laser' },
    isFlashDeal: true
  }
];
