import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Export a real client if keys exist, otherwise a helper function will mock it
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// Mock database storage for frontend fallback
const MOCK_STORAGE_KEY = 'multi_vendor_db_v10';

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
  payment_method?: string;
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
  // --- AR SPECIFIC ITEMS ---
  {
    id: 'prod-perfect-1',
    seller_id: 'sel-1',
    seller_name: 'Aetheris Labs',
    title: 'Vanguard Running Shoe',
    description: 'Ultra-lightweight aerodynamic running shoe with responsive foam and a carbon-fiber plate. This is a fully immersive AR compatible model.',
    price: 180,
    compare_at_price: 220,
    category: 'Mobility & Gear',
    images: [
      'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/MaterialsVariantsShoe/screenshot/screenshot.jpg',
      'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/MaterialsVariantsShoe/screenshot/screenshot.jpg'
    ],
    inventory: 45,
    status: 'active',
    specs: { 'Material': 'Knit Mesh', 'Weight': '210g' },
    variants: { 'Size': ['8', '9', '10', '11'] },
    average_rating: 4.8,
    reviews_count: 120,
    is_ai_recommended: true,
    created_at: new Date().toISOString(),
    model_url: 'https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.glb',
    usdz_url: 'https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.usdz'
  },
  {
    id: 'prod-perfect-3',
    seller_id: 'sel-2',
    seller_name: 'Lumina Craft',
    title: 'Antique Film Camera',
    description: 'Beautifully restored vintage camera offering authentic analog photography experiences with AR viewing.',
    price: 450,
    compare_at_price: 500,
    category: 'Vanguard Living',
    images: [
      'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/AntiqueCamera/screenshot/screenshot.jpg'
    ],
    inventory: 5,
    status: 'active',
    specs: { 'Format': '35mm', 'Lens': '50mm f/1.4' },
    variants: { 'Condition': ['Mint', 'Near Mint'] },
    average_rating: 4.9,
    reviews_count: 14,
    is_ai_recommended: true,
    created_at: new Date().toISOString(),
    model_url: 'https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/AntiqueCamera/glTF-Binary/AntiqueCamera.glb',
    usdz_url: 'https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/AntiqueCamera/glTF-Binary/AntiqueCamera.usdz'
  },
  {
    id: 'prod-perfect-5',
    seller_id: 'sel-2',
    seller_name: 'Lumina Craft',
    title: 'Retro BoomBox Audio System',
    description: 'A modern reimagining of the classic 80s boombox. Bluetooth enabled with dual subwoofers.',
    price: 299,
    compare_at_price: 350,
    category: 'Acoustics & Time',
    images: [
      'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/BoomBox/screenshot/screenshot.jpg'
    ],
    inventory: 12,
    status: 'active',
    specs: { 'Output': '40W RMS', 'Connectivity': 'Bluetooth 5.0' },
    variants: { 'Color': ['Matte Black', 'Silver'] },
    average_rating: 4.6,
    reviews_count: 45,
    is_ai_recommended: false,
    created_at: new Date().toISOString(),
    model_url: 'https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/BoomBox/glTF-Binary/BoomBox.glb',
    usdz_url: 'https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/BoomBox/glTF-Binary/BoomBox.usdz'
  },

  // --- SHIRTS (NO T-SHIRTS) ---
  {
    id: 'prod-shirt-1',
    seller_id: 'sel-1',
    seller_name: 'Aetheris Labs',
    title: 'Classic White Oxford Shirt',
    description: 'Premium cotton oxford shirt perfect for formal and casual wear. Breathable, wrinkle-resistant, and tailored for a perfect fit.',
    price: 85,
    category: 'Apparel & Style',
    images: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80'
    ],
    inventory: 150,
    status: 'active',
    specs: { 'Material': '100% Cotton', 'Fit': 'Slim Fit' },
    variants: { 'Size': ['S', 'M', 'L', 'XL'] },
    average_rating: 4.8,
    reviews_count: 342,
    is_ai_recommended: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-shirt-2',
    seller_id: 'sel-2',
    seller_name: 'Lumina Craft',
    title: 'Vintage Denim Casual Shirt',
    description: 'Rugged vintage wash denim shirt with pearl snap buttons and dual chest pockets. Ideal for layering.',
    price: 95,
    category: 'Apparel & Style',
    images: [
      'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800&auto=format&fit=crop&q=80'
    ],
    inventory: 80,
    status: 'active',
    specs: { 'Material': 'Heavyweight Denim', 'Style': 'Snap Button' },
    variants: { 'Size': ['M', 'L', 'XL', 'XXL'] },
    average_rating: 4.7,
    reviews_count: 120,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-shirt-3',
    seller_id: 'sel-3',
    seller_name: 'Veloce Dynamics',
    title: 'Breathable Linen Summer Shirt',
    description: 'Lightweight linen blend shirt for warm weather. Features a relaxed collar and a breezy, comfortable fit.',
    price: 75,
    compare_at_price: 90,
    category: 'Apparel & Style',
    images: [
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=80'
    ],
    inventory: 60,
    status: 'active',
    specs: { 'Material': 'Linen/Cotton Blend', 'Care': 'Machine Wash Cold' },
    variants: { 'Size': ['S', 'M', 'L'], 'Color': ['Beige', 'Navy'] },
    average_rating: 4.5,
    reviews_count: 85,
    created_at: new Date().toISOString()
  },

  // --- SHOES & SANDALS ---
  {
    id: 'prod-shoe-1',
    seller_id: 'sel-3',
    seller_name: 'Veloce Dynamics',
    title: 'Leather High-Top Sneakers',
    description: 'Premium Italian leather high-tops featuring a padded ankle collar and a durable rubber cupsole.',
    price: 210,
    category: 'Mobility & Gear',
    images: [
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop&q=80'
    ],
    inventory: 40,
    status: 'active',
    specs: { 'Upper': 'Full-grain leather', 'Sole': 'Rubber' },
    variants: { 'Size': ['8', '9', '10', '11', '12'] },
    average_rating: 4.9,
    reviews_count: 210,
    is_ai_recommended: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-shoe-2',
    seller_id: 'sel-2',
    seller_name: 'Lumina Craft',
    title: 'Minimalist Slip-on Shoes',
    description: 'Effortless style with these canvas slip-on shoes. Breathable and perfect for casual outings.',
    price: 65,
    category: 'Mobility & Gear',
    images: [
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80'
    ],
    inventory: 100,
    status: 'active',
    specs: { 'Material': 'Canvas', 'Style': 'Slip-on' },
    variants: { 'Size': ['7', '8', '9', '10'] },
    average_rating: 4.4,
    reviews_count: 65,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-sandal-1',
    seller_id: 'sel-1',
    seller_name: 'Aetheris Labs',
    title: 'Beach Flip Flop Sandals',
    description: 'Comfortable and durable flip flops with a contoured footbed and water-resistant straps.',
    price: 25,
    category: 'Mobility & Gear',
    images: [
      'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=800&auto=format&fit=crop&q=80'
    ],
    inventory: 250,
    status: 'active',
    specs: { 'Material': 'EVA Foam', 'Water Resistance': 'High' },
    variants: { 'Size': ['S', 'M', 'L'] },
    average_rating: 4.2,
    reviews_count: 310,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-sandal-2',
    seller_id: 'sel-2',
    seller_name: 'Lumina Craft',
    title: 'Premium Leather Sandals',
    description: 'Handcrafted leather sandals featuring adjustable straps and a cork midsole that molds to your foot.',
    price: 85,
    category: 'Mobility & Gear',
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80'
    ],
    inventory: 75,
    status: 'active',
    specs: { 'Upper': 'Leather', 'Midsole': 'Cork' },
    variants: { 'Size': ['8', '9', '10', '11'] },
    average_rating: 4.7,
    reviews_count: 94,
    created_at: new Date().toISOString()
  },

  // --- SMART WATCHES & DIGITAL ---
  {
    id: 'prod-watch-1',
    seller_id: 'sel-1',
    seller_name: 'Aetheris Labs',
    title: 'Aetheris Carbon Smart Watch',
    description: 'Next-generation smartwatch encased in forged carbon. Features an AMOLED edge-to-edge display, ECG tracking, and 14-day battery life.',
    price: 399,
    compare_at_price: 450,
    category: 'Acoustics & Time',
    images: [
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'
    ],
    inventory: 40,
    status: 'active',
    specs: { 'Display': '1.4" AMOLED', 'Battery': '14 Days', 'Sensors': 'HR, SpO2, ECG' },
    variants: { 'Band': ['Silicone', 'Leather', 'Metal Mesh'] },
    average_rating: 4.9,
    reviews_count: 420,
    is_ai_recommended: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-watch-2',
    seller_id: 'sel-3',
    seller_name: 'Veloce Dynamics',
    title: 'Retro Digital Chronograph',
    description: 'A nostalgic nod to the 80s. A durable stainless steel digital watch with stopwatch, alarm, and electro-luminescent backlight.',
    price: 55,
    category: 'Acoustics & Time',
    images: [
      'https://images.unsplash.com/photo-1511370235399-1802cae1d32f?w=800&auto=format&fit=crop&q=80'
    ],
    inventory: 150,
    status: 'active',
    specs: { 'Material': 'Stainless Steel', 'Water Resistance': '50m' },
    variants: { 'Color': ['Silver', 'Gold', 'Black'] },
    average_rating: 4.6,
    reviews_count: 85,
    created_at: new Date().toISOString()
  },

  // --- HOME DECORATIONS & TABLES ---
  {
    id: 'prod-home-1',
    seller_id: 'sel-2',
    seller_name: 'Lumina Craft',
    title: 'Solid Walnut Coffee Table',
    description: 'A masterpiece of mid-century modern design. Crafted from sustainable solid walnut with tapered legs and a smooth oil finish.',
    price: 450,
    compare_at_price: 600,
    category: 'Vanguard Living',
    images: [
      'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800&auto=format&fit=crop&q=80'
    ],
    inventory: 15,
    status: 'active',
    specs: { 'Material': 'Solid Walnut', 'Dimensions': '120x60x45 cm' },
    variants: {},
    average_rating: 5.0,
    reviews_count: 24,
    is_ai_recommended: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-home-2',
    seller_id: 'sel-2',
    seller_name: 'Lumina Craft',
    title: 'Minimalist Ceramic Vase',
    description: 'Hand-thrown matte ceramic vase with a unique asymmetrical shape. Perfect for dried florals or as a standalone sculptural piece.',
    price: 65,
    category: 'Vanguard Living',
    images: [
      'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&auto=format&fit=crop&q=80'
    ],
    inventory: 35,
    status: 'active',
    specs: { 'Material': 'Stoneware Ceramic', 'Height': '25cm' },
    variants: { 'Color': ['Matte White', 'Terracotta'] },
    average_rating: 4.8,
    reviews_count: 56,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-home-3',
    seller_id: 'sel-1',
    seller_name: 'Aetheris Labs',
    title: 'Abstract Metal Desk Sculpture',
    description: 'A kinetic desk decoration made of precision-machined brass and aluminum that rotates silently.',
    price: 120,
    category: 'Vanguard Living',
    images: [
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&auto=format&fit=crop&q=80'
    ],
    inventory: 20,
    status: 'active',
    specs: { 'Material': 'Brass & Aluminum', 'Weight': '1.2kg' },
    variants: {},
    average_rating: 4.7,
    reviews_count: 18,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-watch-3',
    seller_id: 'sel-1',
    seller_name: 'Aetheris Labs',
    title: 'Aetheris Tourbillon Skeleton Clock',
    description: 'A striking mechanical mantelpiece clock showcasing a suspended tourbillon assembly and manual winding logs.',
    price: 1450,
    compare_at_price: 1650,
    category: 'Acoustics & Time',
    images: [
      'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=800&auto=format&fit=crop&q=80'
    ],
    inventory: 4,
    status: 'active',
    specs: { 'Movement': 'Tourbillon Manual', 'Reserve': '7 Days' },
    variants: {},
    average_rating: 4.9,
    reviews_count: 8,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-audio-1',
    seller_id: 'sel-1',
    seller_name: 'Aetheris Labs',
    title: 'Beryllium Audiophile Headphones',
    description: 'High-fidelity open-back headphones engineered with pure beryllium diaphragms for unmatched transient clarity.',
    price: 599,
    compare_at_price: 699,
    category: 'Acoustics & Time',
    images: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80'
    ],
    inventory: 15,
    status: 'active',
    specs: { 'Driver': '40mm Beryllium', 'Impedance': '32 Ohm' },
    variants: { 'Earpads': ['Suede', 'Sheepskin Leather'] },
    average_rating: 4.8,
    reviews_count: 32,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-audio-2',
    seller_id: 'sel-1',
    seller_name: 'Aetheris Labs',
    title: 'Levitational Soundstage Speaker',
    description: 'An omnidirectional speaker sphere suspended on an electromagnetic base, delivering resonance-free acoustic isolation.',
    price: 899,
    category: 'Acoustics & Time',
    images: [
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80'
    ],
    inventory: 8,
    status: 'active',
    specs: { 'Driver': '3" Planar Magnetic', 'Base Power': '60W' },
    variants: {},
    average_rating: 4.7,
    reviews_count: 14,
    is_ai_recommended: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-living-1',
    seller_id: 'sel-2',
    seller_name: 'Lumina Craft',
    title: 'Ambient Smart Light Column',
    description: 'A sculptural light cylinder displaying dynamic, HSL-tailored colors and interactive flow routines.',
    price: 240,
    compare_at_price: 280,
    category: 'Vanguard Living',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80'
    ],
    inventory: 22,
    status: 'active',
    specs: { 'Height': '120cm', 'Luminance': '1800 lm' },
    variants: { 'Finish': ['Anodized Black', 'Brushed Silver'] },
    average_rating: 4.6,
    reviews_count: 27,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-living-2',
    seller_id: 'sel-2',
    seller_name: 'Lumina Craft',
    title: 'Hydroponic Indoor Garden',
    description: 'A sleek self-watering smart garden with tailored LED arrays for growing gourmet herbs inside your kitchen.',
    price: 350,
    category: 'Vanguard Living',
    images: [
      'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&auto=format&fit=crop&q=80'
    ],
    inventory: 14,
    status: 'active',
    specs: { 'Pods': '9 Pod System', 'Tank Size': '4.5L' },
    variants: {},
    average_rating: 4.5,
    reviews_count: 19,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-living-3',
    seller_id: 'sel-2',
    seller_name: 'Lumina Craft',
    title: 'Modular Magnetic Desk Organizer',
    description: 'A solid oak base with magnetic repositionable accessories for clean utility management on your workspace.',
    price: 110,
    category: 'Vanguard Living',
    images: [
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80'
    ],
    inventory: 50,
    status: 'active',
    specs: { 'Material': 'Solid Oak & Steel', 'Modules': '6 Magnetic Blocks' },
    variants: { 'Timber': ['Natural Oak', 'Dark Walnut'] },
    average_rating: 4.8,
    reviews_count: 65,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-living-4',
    seller_id: 'sel-2',
    seller_name: 'Lumina Craft',
    title: 'Ergonomic Levitation Desk Chair',
    description: 'High-performance workspace seating utilizing elastic mesh webbing and a floating suspension system.',
    price: 1200,
    compare_at_price: 1400,
    category: 'Vanguard Living',
    images: [
      'https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=800&auto=format&fit=crop&q=80'
    ],
    inventory: 6,
    status: 'active',
    specs: { 'Support': 'Dynamic Lumbar', 'Frame': 'Cast Aluminum' },
    variants: {},
    average_rating: 4.9,
    reviews_count: 12,
    is_ai_recommended: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-gear-1',
    seller_id: 'sel-3',
    seller_name: 'Veloce Dynamics',
    title: 'Commuter Carbon Helmet',
    description: 'Forged carbon shell helmet with integrated smart lights and turn signals for modern urban mobility safety.',
    price: 199,
    compare_at_price: 249,
    category: 'Mobility & Gear',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80'
    ],
    inventory: 30,
    status: 'active',
    specs: { 'Safety Cert': 'CPSC & EN1078', 'Battery Life': '10 Hours' },
    variants: { 'Size': ['M', 'L'] },
    average_rating: 4.7,
    reviews_count: 44,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-gear-2',
    seller_id: 'sel-3',
    seller_name: 'Veloce Dynamics',
    title: 'Electric Hub-Motor Longboard',
    description: 'Dual 600W hub-motor longboard with regenerative braking and carbon fiber decks for fast urban transit.',
    price: 799,
    category: 'Mobility & Gear',
    images: [
      'https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=800&auto=format&fit=crop&q=80'
    ],
    inventory: 11,
    status: 'active',
    specs: { 'Top Speed': '38 km/h', 'Range': '25 km' },
    variants: {},
    average_rating: 4.6,
    reviews_count: 23,
    is_ai_recommended: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-gear-3',
    seller_id: 'sel-3',
    seller_name: 'Veloce Dynamics',
    title: 'Hybrid Technical Backpack',
    description: 'Weatherproof heavy-duty commuter backpack with shock-absorbing compartments for professional hardware transit.',
    price: 260,
    category: 'Mobility & Gear',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80'
    ],
    inventory: 45,
    status: 'active',
    specs: { 'Volume': '28L', 'Waterproof Rating': 'IPX6' },
    variants: { 'Color': ['Matte Stealth Black', 'Slate Grey'] },
    average_rating: 4.8,
    reviews_count: 51,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-apparel-1',
    seller_id: 'sel-4',
    seller_name: 'Nebula Fabrics',
    title: 'Waterproof Technical Trenchcoat',
    description: 'Modern long-cut outer layer utilizing climate-modulating nanofibres with heat-sealed seams.',
    price: 420,
    compare_at_price: 480,
    category: 'Apparel & Style',
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80'
    ],
    inventory: 18,
    status: 'active',
    specs: { 'Fabric': 'Nebula Shield 3L', 'Weight': '450g' },
    variants: { 'Size': ['S', 'M', 'L', 'XL'] },
    average_rating: 4.9,
    reviews_count: 15,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-apparel-2',
    seller_id: 'sel-4',
    seller_name: 'Nebula Fabrics',
    title: 'Merino Wool Base Layer',
    description: 'Ultra-fine merino wool long-sleeve knit layer offering natural temperature regulation and odor control.',
    price: 110,
    category: 'Apparel & Style',
    images: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=80'
    ],
    inventory: 60,
    status: 'active',
    specs: { 'Fiber': '100% Merino 18.5 Micron', 'Knit Weight': '200g/m²' },
    variants: { 'Size': ['M', 'L', 'XL'] },
    average_rating: 4.7,
    reviews_count: 28,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-apparel-3',
    seller_id: 'sel-4',
    seller_name: 'Nebula Fabrics',
    title: 'Forged Carbon Fiber Wallet',
    description: 'Minimalist RFID-blocking card holder engineered with aerospace forged carbon plates and cash straps.',
    price: 125,
    category: 'Apparel & Style',
    images: [
      'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=800&auto=format&fit=crop&q=80'
    ],
    inventory: 120,
    status: 'active',
    specs: { 'Material': 'Forged Carbon & Titanium', 'Card Capacity': 'Up to 12 Cards' },
    variants: {},
    average_rating: 4.8,
    reviews_count: 88,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-vault-1',
    seller_id: 'sel-1',
    seller_name: 'Aetheris Labs',
    title: 'Aetheris Carbon Smart Watch (Elite Edition)',
    description: 'Bespoke forged carbon smartwatch run featuring standard cellular sync, AMOLED screen, and custom biosensing software.',
    price: 329,
    compare_at_price: 399,
    category: 'Acoustics & Time',
    images: [
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80'
    ],
    inventory: 3,
    status: 'active',
    specs: { 'Casing': 'Forged Carbon', 'Battery': '14 Days' },
    variants: {},
    average_rating: 4.9,
    reviews_count: 420,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-vault-2',
    seller_id: 'sel-1',
    seller_name: 'Aetheris Labs',
    title: 'Soundstage Acoustics Levitation Base',
    description: 'An electromagnetic levitating platform for speakers, ensuring zero physical floor vibration and acoustic purification.',
    price: 499,
    compare_at_price: 690,
    category: 'Acoustics & Time',
    images: [
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80'
    ],
    inventory: 2,
    status: 'active',
    specs: { 'Suspension': 'Magnetic Levitation', 'Max Load': '5kg' },
    variants: {},
    average_rating: 4.8,
    reviews_count: 15,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-vault-3',
    seller_id: 'sel-2',
    seller_name: 'Lumina Craft',
    title: 'Vintage Camera Darkroom Set',
    description: 'Complete vintage camera bundle including custom leather carrying case, tripods, and analog lens elements.',
    price: 280,
    compare_at_price: 450,
    category: 'Vanguard Living',
    images: [
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80'
    ],
    inventory: 4,
    status: 'active',
    specs: { 'Includes': 'Camera, Tripod, Bag', 'Lens': '50mm + 35mm' },
    variants: {},
    average_rating: 4.9,
    reviews_count: 24,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-vault-4',
    seller_id: 'sel-1',
    seller_name: 'Aetheris Labs',
    title: 'Planar Magnetic In-Ear Monitors',
    description: 'Bespoke high-end IEM earphones with planar magnetic drivers, solid metal casings, and silver-plated copper cabling.',
    price: 180,
    compare_at_price: 299,
    category: 'Acoustics & Time',
    images: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80'
    ],
    inventory: 5,
    status: 'active',
    specs: { 'Driver': '10mm Planar', 'Cable': '8-Core Silver Plated' },
    variants: {},
    average_rating: 4.7,
    reviews_count: 38,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-vault-5',
    seller_id: 'sel-2',
    seller_name: 'Lumina Craft',
    title: 'Levitating Smart Desk Clock',
    description: 'A floating numeric clock sphere that rotates silently and updates sync using wireless local network logs.',
    price: 199,
    compare_at_price: 350,
    category: 'Vanguard Living',
    images: [
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&auto=format&fit=crop&q=80'
    ],
    inventory: 3,
    status: 'active',
    specs: { 'Feature': 'Levitating Sphere', 'Sync': 'Wi-Fi' },
    variants: {},
    average_rating: 4.8,
    reviews_count: 12,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-vault-6',
    seller_id: 'sel-3',
    seller_name: 'Veloce Dynamics',
    title: 'Forged Carbon Commuter E-Bike',
    description: 'Aerospace forged carbon frame folding e-bike with silent hub motor and long range battery integration.',
    price: 1850,
    compare_at_price: 2450,
    category: 'Mobility & Gear',
    images: [
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&auto=format&fit=crop&q=80'
    ],
    inventory: 2,
    status: 'active',
    specs: { 'Frame': 'Forged Carbon', 'Range': '80km' },
    variants: {},
    average_rating: 4.9,
    reviews_count: 7,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-vault-7',
    seller_id: 'sel-4',
    seller_name: 'Nebula Fabrics',
    title: 'Aerodynamic Windbreaker (Alpha V2)',
    description: 'Technical running windbreaker offering waterproof nanofibre layers and laser-perforated thermal venting panels.',
    price: 190,
    compare_at_price: 299,
    category: 'Apparel & Style',
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80'
    ],
    inventory: 8,
    status: 'active',
    specs: { 'Ventilation': 'Laser Vent', 'Weight': '180g' },
    variants: {},
    average_rating: 4.6,
    reviews_count: 19,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-vault-8',
    seller_id: 'sel-1',
    seller_name: 'Aetheris Labs',
    title: 'Beryllium Core Studio Subwoofer',
    description: 'Active studio subwoofer packing a custom beryllium transducer and solid aluminum anti-vibration framing.',
    price: 750,
    compare_at_price: 1100,
    category: 'Acoustics & Time',
    images: [
      'https://images.unsplash.com/photo-1594623930572-300a3011d9ae?w=800&auto=format&fit=crop&q=80'
    ],
    inventory: 2,
    status: 'active',
    specs: { 'Power': '300W RMS', 'Response': '18Hz - 120Hz' },
    variants: {},
    average_rating: 4.9,
    reviews_count: 16,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-vault-9',
    seller_id: 'sel-2',
    seller_name: 'Lumina Craft',
    title: 'Solid Teak Levitating Organizer',
    description: 'Sculptural desk organizer that floats over magnetic arrays, keeping office tools elevated and accessible.',
    price: 140,
    compare_at_price: 220,
    category: 'Vanguard Living',
    images: [
      'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&auto=format&fit=crop&q=80'
    ],
    inventory: 6,
    status: 'active',
    specs: { 'Material': 'Solid Teak Wood', 'Base': 'Gloss Black' },
    variants: {},
    average_rating: 4.7,
    reviews_count: 9,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-vault-10',
    seller_id: 'sel-3',
    seller_name: 'Veloce Dynamics',
    title: 'Aerospace Titanium Sunglasses',
    description: 'Polarized urban sunglasses handcrafted with pure beta-titanium wire frames and carbon shock joints.',
    price: 210,
    compare_at_price: 380,
    category: 'Mobility & Gear',
    images: [
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop&q=80'
    ],
    inventory: 15,
    status: 'active',
    specs: { 'Frame': 'Pure Beta-Titanium', 'Lens': 'Polarized TAC' },
    variants: {},
    average_rating: 4.8,
    reviews_count: 53,
    created_at: new Date().toISOString()
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
