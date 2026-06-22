const fs = require('fs');

const fileContent = fs.readFileSync('src/lib/supabase.ts', 'utf8');

const newProducts = `export const INITIAL_PRODUCTS: Product[] = [
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
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80'
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
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80'
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
      'https://images.unsplash.com/photo-1594623930572-300a3011d9ae?w=800&auto=format&fit=crop&q=80'
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
      'https://images.unsplash.com/photo-1596755094514-f87e32f85e98?w=800&auto=format&fit=crop&q=80',
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
  }
];`;

const startIdx = fileContent.indexOf('export const INITIAL_PRODUCTS: Product[] = [');
const endIdx = fileContent.indexOf('export const INITIAL_SELLERS: Seller[] = [');

let newFileContent = fileContent.substring(0, startIdx) + newProducts + '\n\n' + fileContent.substring(endIdx);
newFileContent = newFileContent.replace(/const MOCK_STORAGE_KEY = 'multi_vendor_db_v\d+';/, "const MOCK_STORAGE_KEY = 'multi_vendor_db_v8';");

fs.writeFileSync('src/lib/supabase.ts', newFileContent, 'utf8');
console.log('Successfully updated mock data in supabase.ts');
