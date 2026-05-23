import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Export a real client if keys exist, otherwise a helper function will mock it
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// Mock database storage for frontend fallback
const MOCK_STORAGE_KEY = 'multi_vendor_db_v6';

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
  model_url?: string;
  usdz_url?: string;
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
    "id": "prod-perfect-1",
    "seller_id": "sel-3",
    "seller_name": "Veloce Dynamics",
    "title": "Vanguard Running Shoe",
    "description": "Ultra-responsive running shoe featuring advanced foam cushioning and a breathable mesh upper. Engineered for peak performance and urban aesthetics.",
    "price": 135,
    "compare_at_price": 160,
    "category": "Footwear",
    "images": [
      "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80"
    ],
    "inventory": 45,
    "status": "active",
    "specs": {
      "Material": "Engineered Mesh",
      "Sole": "Responsive Foam",
      "Weight": "250g"
    },
    "variants": {
      "Size": [
        "8",
        "9",
        "10",
        "11"
      ],
      "Color": [
        "Pacific Blue",
        "Crimson"
      ]
    },
    "average_rating": 4.8,
    "reviews_count": 312,
    "is_ai_recommended": true,
    "created_at": "2026-05-23T07:12:07.526Z",
    "model_url": "https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.glb"
  },
  {
    "id": "prod-perfect-3",
    "seller_id": "sel-1",
    "seller_name": "Aetheris Labs",
    "title": "Antique Film Camera",
    "description": "A fully restored vintage folding camera. Experience the mechanical precision of classic photography with authentic bellows and manual focus.",
    "price": 450,
    "compare_at_price": 520,
    "category": "Photography",
    "images": [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1588602061214-41d3ee5026bd?w=800&auto=format&fit=crop&q=80"
    ],
    "inventory": 3,
    "status": "active",
    "specs": {
      "Format": "Medium Format Film",
      "Condition": "Restored Antique",
      "Lens": "Anastigmat"
    },
    "variants": {
      "Finish": [
        "Original Brass",
        "Matte Black"
      ]
    },
    "average_rating": 5,
    "reviews_count": 14,
    "is_ai_recommended": false,
    "created_at": "2026-05-23T07:12:07.527Z",
    "model_url": "https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/AntiqueCamera/glTF-Binary/AntiqueCamera.glb"
  },
  {
    "id": "prod-perfect-4",
    "seller_id": "sel-3",
    "seller_name": "Veloce Dynamics",
    "title": "Classic Wooden Toy Car",
    "description": "Beautifully crafted wooden toy car with a glossy red finish and rolling wheels. A timeless collectible or perfect gift.",
    "price": 35,
    "compare_at_price": 45,
    "category": "Collectibles",
    "images": [
      "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800&auto=format&fit=crop&q=80"
    ],
    "inventory": 120,
    "status": "active",
    "specs": {
      "Material": "Birch Wood",
      "Finish": "Non-toxic Gloss Paint",
      "Dimensions": "15x8x6 cm"
    },
    "variants": {
      "Color": [
        "Racing Red",
        "Vintage Yellow"
      ]
    },
    "average_rating": 4.6,
    "reviews_count": 230,
    "is_ai_recommended": false,
    "created_at": "2026-05-23T07:12:07.527Z",
    "model_url": "https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/ToyCar/glTF-Binary/ToyCar.glb"
  },
  {
    "id": "prod-perfect-5",
    "seller_id": "sel-2",
    "seller_name": "Lumina Craft",
    "title": "Retro BoomBox Audio System",
    "description": "Bring the 80s back with this massive retro boombox. Features dual cassette decks, massive acoustic speakers, and modern Bluetooth integration.",
    "price": 280,
    "compare_at_price": 350,
    "category": "Audio",
    "images": [
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1518177695326-7edb561c28c8?w=800&auto=format&fit=crop&q=80"
    ],
    "inventory": 22,
    "status": "active",
    "specs": {
      "Output": "40W RMS",
      "Connectivity": "Bluetooth 5.0, Cassette, FM",
      "Battery": "Rechargeable Lithium"
    },
    "variants": {
      "Style": [
        "Silver Classic",
        "Neon Edition"
      ]
    },
    "average_rating": 4.7,
    "reviews_count": 91,
    "is_ai_recommended": true,
    "created_at": "2026-05-23T07:12:07.527Z",
    "model_url": "https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/BoomBox/glTF-Binary/BoomBox.glb"
  },
  {
    "id": "prod-perfect-6",
    "seller_id": "sel-1",
    "seller_name": "Aetheris Labs",
    "title": "Apollo Space Explorer Suit Replica",
    "description": "An incredibly detailed 1:1 replica of the historic astronaut space suit. Perfect for high-end collectors and museums.",
    "price": 4500,
    "compare_at_price": 5000,
    "category": "Collectibles",
    "images": [
      "https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=800&auto=format&fit=crop&q=80"
    ],
    "inventory": 2,
    "status": "active",
    "specs": {
      "Scale": "1:1 Full Size",
      "Materials": "Beta Cloth, Nomex",
      "Certification": "Museum Grade"
    },
    "variants": {
      "Mission Patch": [
        "Apollo 11",
        "Apollo 13"
      ]
    },
    "average_rating": 5,
    "reviews_count": 3,
    "is_ai_recommended": true,
    "created_at": "2026-05-23T07:12:07.527Z",
    "model_url": "https://modelviewer.dev/shared-assets/models/Astronaut.glb"
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
