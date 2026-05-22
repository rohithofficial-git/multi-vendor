import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Export a real client if keys exist, otherwise a helper function will mock it
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// Mock database storage for frontend fallback
const MOCK_STORAGE_KEY = 'multi_vendor_db';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin';
  phone?: string;
  created_at?: string;
}

export interface Seller {
  id: string;
  user_id: string;
  studio_name: string;
  description: string;
  logo_url: string;
  banner_url: string;
  status: 'approved' | 'pending' | 'suspended';
  commission_rate: number;
  rating: number;
  sales_count: number;
  created_at: string;
}

export interface Product {
  id: string;
  seller_id: string;
  seller_name: string;
  title: string;
  description: string;
  price: number;
  compare_at_price?: number;
  category: string;
  images: string[];
  inventory: number;
  status: 'active' | 'inactive';
  specs: Record<string, string>;
  variants: Record<string, string[]>;
  average_rating: number;
  reviews_count: number;
  is_ai_recommended?: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  buyer_id: string;
  total_amount: number;
  shipping_address: {
    fullName: string;
    addressLine1: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  payment_status: 'pending' | 'paid' | 'failed';
  shipping_status: 'placed' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered';
  coupon_code?: string;
  discount_amount: number;
  gst_amount: number;
  items: {
    product_id: string;
    title: string;
    quantity: number;
    price: number;
    variant?: string;
  }[];
  tracking_history: {
    status: string;
    timestamp: string;
    description: string;
  }[];
  created_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface CartItem {
  product_id: string;
  quantity: number;
  variant?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
  created_at: string;
}

// Initial mock data if empty
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    seller_id: 'sel-1',
    seller_name: 'Aetheris Labs',
    title: 'Aetheris Chrono VII watch',
    description: 'A masterpiece of kinetic watchmaking. Featuring a double-axis tourbillon, titanium carbon-fiber composite case, and self-winding chronographic movements with a 72-hour power reserve. Built for the modern pioneer.',
    price: 1850,
    compare_at_price: 2400,
    category: 'Acoustics & Time',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&auto=format&fit=crop&q=80'
    ],
    inventory: 15,
    status: 'active',
    specs: {
      'Movement': 'Self-winding automatic tourbillon',
      'Power Reserve': '72 Hours',
      'Water Resistance': '50m (5 ATM)',
      'Case Material': 'Titanium Carbon-Fiber Composite',
      'Strap': 'FKM Fluoroelastomer Rubber'
    },
    variants: {
      'Strap Color': ['Obsidian Black', 'Neon Purple', 'Titanium Gray']
    },
    average_rating: 4.8,
    reviews_count: 34,
    is_ai_recommended: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString()
  },
  {
    id: 'prod-2',
    seller_id: 'sel-1',
    seller_name: 'Aetheris Labs',
    title: 'Horizon ANC Soundstage Headphones',
    description: 'Experience auditory levitation. 45mm beryllium drivers combined with an active soundstage projection engine deliver pure studio acoustics. High-grade magnesium sliders and sheepskin leather ear cushions ensure maximum wear comfort.',
    price: 490,
    compare_at_price: 650,
    category: 'Acoustics & Time',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80'
    ],
    inventory: 40,
    status: 'active',
    specs: {
      'Driver Size': '45mm Beryllium',
      'Frequency Response': '4Hz - 45kHz',
      'Connectivity': 'Bluetooth 5.3 / aptX Adaptive / 3.5mm Jack',
      'Battery Life': '40 hours (ANC ON)',
      'Weight': '290g'
    },
    variants: {
      'Color': ['Classic Silver', 'Carbon Black', 'Bespoke Bronze']
    },
    average_rating: 4.7,
    reviews_count: 58,
    is_ai_recommended: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString()
  },
  {
    id: 'prod-3',
    seller_id: 'sel-2',
    seller_name: 'Lumina Craft',
    title: 'Nova Levitating Ambient Light',
    description: 'Defy gravity in style. The Nova lamp uses magnetic levitation to hover and spin quietly in mid-air while casting a warm, customizable neon glow. Perfect for workspaces, studios, and high-end living spaces.',
    price: 250,
    compare_at_price: 320,
    category: 'Vanguard Living',
    images: [
      'https://images.unsplash.com/photo-1507646227500-4d389b0012be?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?w=800&auto=format&fit=crop&q=80'
    ],
    inventory: 25,
    status: 'active',
    specs: {
      'Power Source': 'Wireless induction (Base-powered)',
      'Lighting Type': 'Dimmable RGBCW LED',
      'Control Method': 'Smart Touch / Mobile App',
      'Base Material': 'CNC Brushed Aluminum',
      'Levitation Height': '15mm - 20mm'
    },
    variants: {
      'Base Finish': ['Matte Silver', 'Midnight Gold']
    },
    average_rating: 4.9,
    reviews_count: 18,
    is_ai_recommended: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString()
  },
  {
    id: 'prod-4',
    seller_id: 'sel-3',
    seller_name: 'Veloce Dynamics',
    title: 'Helix Carbon Commuter Helmet',
    description: 'Vanguard protection for urban commuters. Formed with an ultra-lightweight carbon fiber outer shell and density-graded EPS liners. Features integrated LED warning lights with automatic brake detection and turn indicators.',
    price: 320,
    compare_at_price: 380,
    category: 'Mobility & Gear',
    images: [
      'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=800&auto=format&fit=crop&q=80'
    ],
    inventory: 12,
    status: 'active',
    specs: {
      'Shell Material': 'Dry Carbon Fiber',
      'Safety Standard': 'CPSC & EN1078 Certified',
      'Battery Life': '10 hours (Flashing Mode)',
      'Connectivity': 'Bluetooth Smart App integration',
      'Weight': '350g'
    },
    variants: {
      'Size': ['S (52-56cm)', 'M (55-59cm)', 'L (58-62cm)'],
      'Finish': ['Matte Carbon', 'Gloss Carbon']
    },
    average_rating: 4.5,
    reviews_count: 22,
    is_ai_recommended: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
  },
  {
    id: 'prod-5',
    seller_id: 'sel-2',
    seller_name: 'Lumina Craft',
    title: 'Aero Foldable Smart Desk',
    description: 'Optimize your studio. A motorized standing desk that folds flat against the wall when not in use. Built with a solid walnut wood top and carbon steel framing, featuring touch-sensitive height sliders and integrated USB-C hubs.',
    price: 1250,
    compare_at_price: 1600,
    category: 'Vanguard Living',
    images: [
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1493934558415-9d19f0b2b4d2?w=800&auto=format&fit=crop&q=80'
    ],
    inventory: 8,
    status: 'active',
    specs: {
      'Height Range': '65cm - 125cm',
      'Tabletop Material': 'FSC Solid Walnut Wood',
      'Weight Capacity': '120kg',
      'Power Delivery': 'Dual 100W USB-C Ports',
      'Fold Depth': '12cm from wall'
    },
    variants: {
      'Size': ['120x60cm', '140x70cm']
    },
    average_rating: 4.6,
    reviews_count: 14,
    is_ai_recommended: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString()
  },
  {
    id: 'prod-6',
    seller_id: 'sel-3',
    seller_name: 'Veloce Dynamics',
    title: 'Nexus X E-Scooter',
    description: 'Reimagine urban mobility. Dual 1200W hub motors propel the Nexus X up to 45km/h with a range of 80km on a single charge. Features hydraulic disc brakes, adaptive suspension, and a gorgeous handlebar-integrated OLED HUD.',
    price: 2450,
    compare_at_price: 2900,
    category: 'Mobility & Gear',
    images: [
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&auto=format&fit=crop&q=80'
    ],
    inventory: 5,
    status: 'active',
    specs: {
      'Motor Power': 'Dual 1200W (2400W Peak)',
      'Battery Capacity': '60V 24Ah LG Chem Cells',
      'Top Speed': '45 km/h (Restricted to 25 km/h in EU)',
      'Max Range': '80 km',
      'Brake System': 'Front & Rear Zoom Hydraulic Disc Brakes'
    },
    variants: {
      'Power Battery': ['Standard (60km range)', 'Long-Range Pro (80km range)']
    },
    average_rating: 4.9,
    reviews_count: 27,
    is_ai_recommended: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString()
  }
];

export const INITIAL_SELLERS: Seller[] = [
  {
    id: 'sel-1',
    user_id: 'usr-seller-1',
    studio_name: 'Aetheris Labs',
    description: 'Pioneering watchmaking and acoustic engineering with carbon composites and hybrid mechanical engines.',
    logo_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    status: 'approved',
    commission_rate: 12.5,
    rating: 4.8,
    sales_count: 145,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365).toISOString()
  },
  {
    id: 'sel-2',
    user_id: 'usr-seller-2',
    studio_name: 'Lumina Craft',
    description: 'Handcrafted levitational objects and modular workspace aesthetics designed to elevate your environment.',
    logo_url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=150&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
    status: 'approved',
    commission_rate: 10,
    rating: 4.7,
    sales_count: 92,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 200).toISOString()
  },
  {
    id: 'sel-3',
    user_id: 'usr-seller-3',
    studio_name: 'Veloce Dynamics',
    description: 'Precision engineered carbon fiber gear and next-generation urban electric mobility vehicles.',
    logo_url: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=150&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&auto=format&fit=crop&q=80',
    status: 'approved',
    commission_rate: 15,
    rating: 4.6,
    sales_count: 53,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120).toISOString()
  },
  {
    id: 'sel-4',
    user_id: 'usr-seller-4',
    studio_name: 'Nebula Fabrics',
    description: 'Futuristic technical outerwear and smart garments embedded with climate-modulating nanofibres.',
    logo_url: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=150&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&auto=format&fit=crop&q=80',
    status: 'pending',
    commission_rate: 12.0,
    rating: 0,
    sales_count: 0,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString()
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    product_id: 'prod-1',
    user_id: 'usr-buyer-1',
    user_name: 'Alex Mercer',
    rating: 5,
    comment: 'An absolute masterpiece of design! The carbon-fiber composite case is incredibly light and the dual tourbillon is mesmerizing to look at. Worth every penny.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString()
  },
  {
    id: 'rev-2',
    product_id: 'prod-1',
    user_id: 'usr-buyer-2',
    user_name: 'Sarah Connor',
    rating: 4,
    comment: 'Stunning watch, looks fantastic in person. The neon purple strap variant really pops. Only reason for 4 stars is that it takes a bit of time to adjust the strap correctly.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString()
  },
  {
    id: 'rev-3',
    product_id: 'prod-2',
    user_id: 'usr-buyer-3',
    user_name: 'Bruce Wayne',
    rating: 5,
    comment: 'The ANC on the Horizon is outstanding. Easily cancels out helicopter noise. Beryllium drivers reproduce acoustic details perfectly. Highly recommended for audio purists.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString()
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    user_id: 'usr-buyer-admin',
    title: 'Welcome to Aetheris Platform',
    message: 'Your ultra-premium multi-vendor hub is active. You can now cycle roles to inspect buyer interfaces, merchant tools, or admin queues.',
    read: false,
    type: 'success',
    created_at: new Date().toISOString()
  }
];

class MockDatabase {
  private getStorage<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    const stored = localStorage.getItem(`${MOCK_STORAGE_KEY}_${key}`);
    if (!stored) {
      this.setStorage(key, defaultValue);
      return defaultValue;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return defaultValue;
    }
  }

  private setStorage<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`${MOCK_STORAGE_KEY}_${key}`, JSON.stringify(value));
  }

  get products(): Product[] {
    return this.getStorage<Product[]>('products', INITIAL_PRODUCTS);
  }

  set products(val: Product[]) {
    this.setStorage('products', val);
  }

  get sellers(): Seller[] {
    return this.getStorage<Seller[]>('sellers', INITIAL_SELLERS);
  }

  set sellers(val: Seller[]) {
    this.setStorage('sellers', val);
  }

  get orders(): Order[] {
    return this.getStorage<Order[]>('orders', []);
  }

  set orders(val: Order[]) {
    this.setStorage('orders', val);
  }

  get reviews(): Review[] {
    return this.getStorage<Review[]>('reviews', INITIAL_REVIEWS);
  }

  set reviews(val: Review[]) {
    this.setStorage('reviews', val);
  }

  get notifications(): Notification[] {
    return this.getStorage<Notification[]>('notifications', INITIAL_NOTIFICATIONS);
  }

  set notifications(val: Notification[]) {
    this.setStorage('notifications', val);
  }
}

export const mockDb = new MockDatabase();
