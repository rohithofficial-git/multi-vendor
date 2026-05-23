import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Export a real client if keys exist, otherwise a helper function will mock it
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// Mock database storage for frontend fallback
const MOCK_STORAGE_KEY = 'multi_vendor_db_v3';

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
    "id": "prod-shirt-1",
    "seller_id": "sel-1",
    "seller_name": "Aetheris Labs",
    "title": "Classic White Oxford Shirt",
    "description": "Premium cotton oxford shirt perfect for formal and casual wear. Breathable, wrinkle-resistant, and tailored for a perfect fit.",
    "price": 45,
    "compare_at_price": 60,
    "category": "Shirts",
    "images": [
      "https://images.unsplash.com/photo-1596755094514-f87e32f0b224?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop&q=80"
    ],
    "inventory": 100,
    "status": "active",
    "specs": {
      "Material": "100% Cotton",
      "Fit": "Regular",
      "Care": "Machine Wash"
    },
    "variants": {
      "Size": [
        "S",
        "M",
        "L",
        "XL"
      ],
      "Color": [
        "White",
        "Light Blue"
      ]
    },
    "average_rating": 4.8,
    "reviews_count": 120,
    "is_ai_recommended": true,
    "created_at": "2026-05-23T06:43:04.796Z"
  },
  {
    "id": "prod-shirt-2",
    "seller_id": "sel-1",
    "seller_name": "Aetheris Labs",
    "title": "Urban Graphic Print T-Shirt",
    "description": "Streetwear-inspired graphic tee made from heavyweight cotton. Features a bold front print and relaxed drop-shoulder fit.",
    "price": 30,
    "compare_at_price": 40,
    "category": "T-Shirts",
    "images": [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop&q=80"
    ],
    "inventory": 50,
    "status": "active",
    "specs": {
      "Material": "100% Heavyweight Cotton",
      "Fit": "Oversized",
      "Neckline": "Crew"
    },
    "variants": {
      "Size": [
        "M",
        "L",
        "XL"
      ],
      "Color": [
        "Black",
        "Charcoal"
      ]
    },
    "average_rating": 4.5,
    "reviews_count": 85,
    "is_ai_recommended": false,
    "created_at": "2026-05-23T06:43:04.797Z"
  },
  {
    "id": "prod-shirt-3",
    "seller_id": "sel-2",
    "seller_name": "Lumina Craft",
    "title": "Vintage Denim Casual Shirt",
    "description": "Rugged vintage wash denim shirt with pearl snap buttons and dual chest pockets. Ideal for layering.",
    "price": 55,
    "compare_at_price": 75,
    "category": "Shirts",
    "images": [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596755094514-f87e32f0b224?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80"
    ],
    "inventory": 40,
    "status": "active",
    "specs": {
      "Material": "100% Cotton Denim",
      "Fit": "Slim Fit",
      "Closure": "Snap Buttons"
    },
    "variants": {
      "Size": [
        "S",
        "M",
        "L"
      ],
      "Wash": [
        "Light Blue",
        "Dark Indigo"
      ]
    },
    "average_rating": 4.7,
    "reviews_count": 42,
    "is_ai_recommended": true,
    "created_at": "2026-05-23T06:43:04.797Z"
  },
  {
    "id": "prod-shirt-4",
    "seller_id": "sel-2",
    "seller_name": "Lumina Craft",
    "title": "Essential Polo Shirt",
    "description": "Classic pique polo shirt with a ribbed collar and cuffs. Designed for breathability and all-day comfort.",
    "price": 35,
    "compare_at_price": 50,
    "category": "T-Shirts",
    "images": [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=80"
    ],
    "inventory": 80,
    "status": "active",
    "specs": {
      "Material": "Cotton Pique",
      "Fit": "Regular",
      "Sleeve": "Short Sleeve"
    },
    "variants": {
      "Size": [
        "M",
        "L",
        "XL",
        "XXL"
      ],
      "Color": [
        "Navy",
        "White",
        "Black"
      ]
    },
    "average_rating": 4.6,
    "reviews_count": 95,
    "is_ai_recommended": false,
    "created_at": "2026-05-23T06:43:04.797Z"
  },
  {
    "id": "prod-shirt-5",
    "seller_id": "sel-3",
    "seller_name": "Veloce Dynamics",
    "title": "Breathable Linen Summer Shirt",
    "description": "Lightweight linen blend shirt for warm weather. Features a relaxed collar and a breezy, comfortable fit.",
    "price": 48,
    "compare_at_price": 65,
    "category": "Shirts",
    "images": [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596755094514-f87e32f0b224?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop&q=80"
    ],
    "inventory": 60,
    "status": "active",
    "specs": {
      "Material": "55% Linen, 45% Cotton",
      "Fit": "Relaxed",
      "Care": "Hand Wash"
    },
    "variants": {
      "Size": [
        "S",
        "M",
        "L",
        "XL"
      ],
      "Color": [
        "Beige",
        "Olive",
        "White"
      ]
    },
    "average_rating": 4.9,
    "reviews_count": 34,
    "is_ai_recommended": true,
    "created_at": "2026-05-23T06:43:04.797Z"
  },
  {
    "id": "prod-pant-1",
    "seller_id": "sel-1",
    "seller_name": "Aetheris Labs",
    "title": "Slim Fit Chino Pants",
    "description": "Versatile stretch chino pants that transition seamlessly from the office to weekend outings.",
    "price": 55,
    "compare_at_price": 70,
    "category": "Pants",
    "images": [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=800&auto=format&fit=crop&q=80"
    ],
    "inventory": 70,
    "status": "active",
    "specs": {
      "Material": "98% Cotton, 2% Elastane",
      "Fit": "Slim",
      "Style": "Flat Front"
    },
    "variants": {
      "Waist": [
        "30",
        "32",
        "34",
        "36"
      ],
      "Color": [
        "Khaki",
        "Navy",
        "Olive"
      ]
    },
    "average_rating": 4.7,
    "reviews_count": 210,
    "is_ai_recommended": true,
    "created_at": "2026-05-23T06:43:04.797Z"
  },
  {
    "id": "prod-pant-2",
    "seller_id": "sel-2",
    "seller_name": "Lumina Craft",
    "title": "Classic Indigo Straight Jeans",
    "description": "Timeless straight-leg jeans crafted from premium selvedge denim. Built to fade beautifully over time.",
    "price": 85,
    "compare_at_price": 110,
    "category": "Pants",
    "images": [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=800&auto=format&fit=crop&q=80"
    ],
    "inventory": 45,
    "status": "active",
    "specs": {
      "Material": "100% Selvedge Denim",
      "Fit": "Straight Leg",
      "Closure": "Button Fly"
    },
    "variants": {
      "Waist": [
        "30",
        "31",
        "32",
        "33",
        "34"
      ],
      "Length": [
        "30",
        "32",
        "34"
      ]
    },
    "average_rating": 4.8,
    "reviews_count": 145,
    "is_ai_recommended": true,
    "created_at": "2026-05-23T06:43:04.797Z"
  },
  {
    "id": "prod-pant-3",
    "seller_id": "sel-3",
    "seller_name": "Veloce Dynamics",
    "title": "Tactical Cargo Utility Pants",
    "description": "Durable ripstop cargo pants with multiple reinforced pockets and articulated knees for mobility.",
    "price": 65,
    "compare_at_price": 90,
    "category": "Pants",
    "images": [
      "https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&auto=format&fit=crop&q=80"
    ],
    "inventory": 55,
    "status": "active",
    "specs": {
      "Material": "Nylon Ripstop",
      "Fit": "Relaxed",
      "Features": "Water-resistant"
    },
    "variants": {
      "Size": [
        "S",
        "M",
        "L",
        "XL"
      ],
      "Color": [
        "Black",
        "Olive Drab"
      ]
    },
    "average_rating": 4.6,
    "reviews_count": 88,
    "is_ai_recommended": false,
    "created_at": "2026-05-23T06:43:04.797Z"
  },
  {
    "id": "prod-pant-4",
    "seller_id": "sel-1",
    "seller_name": "Aetheris Labs",
    "title": "Everyday Jogger Sweatpants",
    "description": "Ultra-soft fleece joggers featuring an elastic waistband, tapered fit, and secure zip pockets.",
    "price": 40,
    "compare_at_price": 55,
    "category": "Pants",
    "images": [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80"
    ],
    "inventory": 90,
    "status": "active",
    "specs": {
      "Material": "Cotton Fleece Blend",
      "Fit": "Tapered",
      "Features": "Zip Pockets"
    },
    "variants": {
      "Size": [
        "S",
        "M",
        "L",
        "XL"
      ],
      "Color": [
        "Heather Grey",
        "Black"
      ]
    },
    "average_rating": 4.9,
    "reviews_count": 310,
    "is_ai_recommended": true,
    "created_at": "2026-05-23T06:43:04.797Z"
  },
  {
    "id": "prod-acc-1",
    "seller_id": "sel-3",
    "seller_name": "Veloce Dynamics",
    "title": "Urban Runner Sneakers",
    "description": "Lightweight performance sneakers designed for everyday urban commuting. Features responsive cushioning and breathable mesh.",
    "price": 120,
    "compare_at_price": 150,
    "category": "Footwear",
    "images": [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80"
    ],
    "inventory": 30,
    "status": "active",
    "specs": {
      "Material": "Engineered Mesh",
      "Sole": "Rubber",
      "Weight": "280g"
    },
    "variants": {
      "Size": [
        "8",
        "9",
        "10",
        "11",
        "12"
      ],
      "Color": [
        "Crimson Red",
        "Midnight Black"
      ]
    },
    "average_rating": 4.8,
    "reviews_count": 142,
    "is_ai_recommended": true,
    "created_at": "2026-05-23T06:43:04.797Z"
  },
  {
    "id": "prod-acc-2",
    "seller_id": "sel-2",
    "seller_name": "Lumina Craft",
    "title": "Vintage Film Camera",
    "description": "A fully restored analog 35mm film camera. Experience the raw beauty of photography with manual focus and mechanical shutter.",
    "price": 250,
    "compare_at_price": 300,
    "category": "Photography",
    "images": [
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80"
    ],
    "inventory": 5,
    "status": "active",
    "specs": {
      "Format": "35mm Film",
      "Lens Mount": "M42",
      "Condition": "Refurbished"
    },
    "variants": {
      "Body": [
        "Silver/Black",
        "All Black"
      ]
    },
    "average_rating": 4.9,
    "reviews_count": 24,
    "is_ai_recommended": true,
    "created_at": "2026-05-23T06:43:04.797Z"
  },
  {
    "id": "prod-acc-3",
    "seller_id": "sel-1",
    "seller_name": "Aetheris Labs",
    "title": "Classic Aviator Sunglasses",
    "description": "Premium polarized sunglasses with a lightweight titanium frame and UV400 protection.",
    "price": 85,
    "compare_at_price": 120,
    "category": "Accessories",
    "images": [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1572635196237-14b3f281501f?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80"
    ],
    "inventory": 45,
    "status": "active",
    "specs": {
      "Frame": "Titanium",
      "Lenses": "Polarized TAC",
      "UV Protection": "100%"
    },
    "variants": {
      "Frame Color": [
        "Gold",
        "Silver",
        "Gunmetal"
      ]
    },
    "average_rating": 4.6,
    "reviews_count": 98,
    "is_ai_recommended": false,
    "created_at": "2026-05-23T06:43:04.797Z"
  },
  {
    "id": "prod-acc-4",
    "seller_id": "sel-2",
    "seller_name": "Lumina Craft",
    "title": "Minimalist Leather Backpack",
    "description": "Handcrafted full-grain leather backpack. Features a padded laptop sleeve and durable brass hardware.",
    "price": 180,
    "compare_at_price": 220,
    "category": "Accessories",
    "images": [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80"
    ],
    "inventory": 15,
    "status": "active",
    "specs": {
      "Material": "Full-Grain Leather",
      "Capacity": "18L",
      "Laptop Fit": "Up to 15 inch"
    },
    "variants": {
      "Color": [
        "Cognac Brown",
        "Midnight Black"
      ]
    },
    "average_rating": 4.8,
    "reviews_count": 67,
    "is_ai_recommended": true,
    "created_at": "2026-05-23T06:43:04.797Z"
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
