-- =========================================================================
-- SEED DATA: Multi Vendor Marketplace (Aetheris)
-- Run this AFTER schema.sql in Supabase SQL Editor
-- =========================================================================

-- 1. SEED USERS
INSERT INTO public.users (id, name, email, role, phone) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Vanguard Alpha', 'alpha@vanguard.io', 'admin', '+91 98765 43210'),
  ('00000000-0000-0000-0000-000000000002', 'Aetheris Labs Owner', 'labs@aetheris.io', 'seller', '+91 98765 43211'),
  ('00000000-0000-0000-0000-000000000003', 'Lumina Craft Owner', 'craft@lumina.io', 'seller', '+91 98765 43212'),
  ('00000000-0000-0000-0000-000000000004', 'Veloce Dynamics Owner', 'dynamics@veloce.io', 'seller', '+91 98765 43213'),
  ('00000000-0000-0000-0000-000000000005', 'Nebula Fabrics Owner', 'fabrics@nebula.io', 'seller', '+91 98765 43214'),
  ('00000000-0000-0000-0000-000000000006', 'Alex Mercer', 'alex@buyer.io', 'buyer', NULL),
  ('00000000-0000-0000-0000-000000000007', 'Sarah Connor', 'sarah@buyer.io', 'buyer', NULL),
  ('00000000-0000-0000-0000-000000000008', 'Bruce Wayne', 'bruce@buyer.io', 'buyer', NULL)
ON CONFLICT (email) DO NOTHING;

-- 2. SEED SELLERS (Studios)
INSERT INTO public.sellers (id, user_id, studio_name, description, logo_url, banner_url, status, commission_rate, rating, sales_count) VALUES
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002',
   'Aetheris Labs',
   'Pioneering watchmaking and acoustic engineering with carbon composites and hybrid mechanical engines.',
   'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
   'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
   'approved', 12.50, 4.80, 145),

  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003',
   'Lumina Craft',
   'Handcrafted levitational objects and modular workspace aesthetics designed to elevate your environment.',
   'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=150&auto=format&fit=crop&q=80',
   'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
   'approved', 10.00, 4.70, 92),

  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000004',
   'Veloce Dynamics',
   'Precision engineered carbon fiber gear and next-generation urban electric mobility vehicles.',
   'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=150&auto=format&fit=crop&q=80',
   'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&auto=format&fit=crop&q=80',
   'approved', 15.00, 4.60, 53),

  ('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000005',
   'Nebula Fabrics',
   'Futuristic technical outerwear and smart garments embedded with climate-modulating nanofibres.',
   'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=150&auto=format&fit=crop&q=80',
   'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&auto=format&fit=crop&q=80',
   'pending', 12.00, 0.00, 0)
ON CONFLICT (studio_name) DO NOTHING;

-- 3. SEED CATEGORIES
INSERT INTO public.categories (id, name, slug, description, image_url) VALUES
  ('20000000-0000-0000-0000-000000000001', 'Acoustics & Time', 'acoustics-time',
   'Premium watches, headphones, and sonic devices',
   'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80'),
  ('20000000-0000-0000-0000-000000000002', 'Vanguard Living', 'vanguard-living',
   'Smart home, levitating décor, and modular furniture',
   'https://images.unsplash.com/photo-1507646227500-4d389b0012be?w=400&auto=format&fit=crop&q=80'),
  ('20000000-0000-0000-0000-000000000003', 'Mobility & Gear', 'mobility-gear',
   'E-scooters, helmets, and urban commuter tech',
   'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400&auto=format&fit=crop&q=80')
ON CONFLICT (slug) DO NOTHING;

-- 4. SEED PRODUCTS
INSERT INTO public.products (id, seller_id, title, slug, description, price, compare_at_price, category_id, images, inventory, status, specs, variants, average_rating, reviews_count, is_ai_recommended) VALUES
  ('30000000-0000-0000-0000-000000000001',
   '10000000-0000-0000-0000-000000000001',
   'Aetheris Chrono VII watch',
   'aetheris-chrono-vii',
   'A masterpiece of kinetic watchmaking. Featuring a double-axis tourbillon, titanium carbon-fiber composite case, and self-winding chronographic movements with a 72-hour power reserve. Built for the modern pioneer.',
   1850.00, 2400.00,
   '20000000-0000-0000-0000-000000000001',
   ARRAY['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
         'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&auto=format&fit=crop&q=80',
         'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&auto=format&fit=crop&q=80'],
   15, 'active',
   '{"Movement": "Self-winding automatic tourbillon", "Power Reserve": "72 Hours", "Water Resistance": "50m (5 ATM)", "Case Material": "Titanium Carbon-Fiber Composite", "Strap": "FKM Fluoroelastomer Rubber"}'::JSONB,
   '{"Strap Color": ["Obsidian Black", "Neon Purple", "Titanium Gray"]}'::JSONB,
   4.80, 2, true),

  ('30000000-0000-0000-0000-000000000002',
   '10000000-0000-0000-0000-000000000001',
   'Horizon ANC Soundstage Headphones',
   'horizon-anc-soundstage',
   'Experience auditory levitation. 45mm beryllium drivers combined with an active soundstage projection engine deliver pure studio acoustics. High-grade magnesium sliders and sheepskin leather ear cushions ensure maximum wear comfort.',
   490.00, 650.00,
   '20000000-0000-0000-0000-000000000001',
   ARRAY['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
         'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80',
         'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80'],
   40, 'active',
   '{"Driver Size": "45mm Beryllium", "Frequency Response": "4Hz - 45kHz", "Connectivity": "Bluetooth 5.3 / aptX Adaptive / 3.5mm Jack", "Battery Life": "40 hours (ANC ON)", "Weight": "290g"}'::JSONB,
   '{"Color": ["Classic Silver", "Carbon Black", "Bespoke Bronze"]}'::JSONB,
   4.70, 1, true),

  ('30000000-0000-0000-0000-000000000003',
   '10000000-0000-0000-0000-000000000002',
   'Nova Levitating Ambient Light',
   'nova-levitating-light',
   'Defy gravity in style. The Nova lamp uses magnetic levitation to hover and spin quietly in mid-air while casting a warm, customizable neon glow. Perfect for workspaces, studios, and high-end living spaces.',
   250.00, 320.00,
   '20000000-0000-0000-0000-000000000002',
   ARRAY['https://images.unsplash.com/photo-1507646227500-4d389b0012be?w=800&auto=format&fit=crop&q=80',
         'https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?w=800&auto=format&fit=crop&q=80'],
   25, 'active',
   '{"Power Source": "Wireless induction (Base-powered)", "Lighting Type": "Dimmable RGBCW LED", "Control Method": "Smart Touch / Mobile App", "Base Material": "CNC Brushed Aluminum", "Levitation Height": "15mm - 20mm"}'::JSONB,
   '{"Base Finish": ["Matte Silver", "Midnight Gold"]}'::JSONB,
   4.90, 0, false),

  ('30000000-0000-0000-0000-000000000004',
   '10000000-0000-0000-0000-000000000003',
   'Helix Carbon Commuter Helmet',
   'helix-carbon-helmet',
   'Vanguard protection for urban commuters. Formed with an ultra-lightweight carbon fiber outer shell and density-graded EPS liners. Features integrated LED warning lights with automatic brake detection and turn indicators.',
   320.00, 380.00,
   '20000000-0000-0000-0000-000000000003',
   ARRAY['https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800&auto=format&fit=crop&q=80',
         'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=800&auto=format&fit=crop&q=80'],
   12, 'active',
   '{"Shell Material": "Dry Carbon Fiber", "Safety Standard": "CPSC & EN1078 Certified", "Battery Life": "10 hours (Flashing Mode)", "Connectivity": "Bluetooth Smart App integration", "Weight": "350g"}'::JSONB,
   '{"Size": ["S (52-56cm)", "M (55-59cm)", "L (58-62cm)"], "Finish": ["Matte Carbon", "Gloss Carbon"]}'::JSONB,
   4.50, 0, true),

  ('30000000-0000-0000-0000-000000000005',
   '10000000-0000-0000-0000-000000000002',
   'Aero Foldable Smart Desk',
   'aero-foldable-desk',
   'Optimize your studio. A motorized standing desk that folds flat against the wall when not in use. Built with a solid walnut wood top and carbon steel framing, featuring touch-sensitive height sliders and integrated USB-C hubs.',
   1250.00, 1600.00,
   '20000000-0000-0000-0000-000000000002',
   ARRAY['https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&auto=format&fit=crop&q=80',
         'https://images.unsplash.com/photo-1493934558415-9d19f0b2b4d2?w=800&auto=format&fit=crop&q=80'],
   8, 'active',
   '{"Height Range": "65cm - 125cm", "Tabletop Material": "FSC Solid Walnut Wood", "Weight Capacity": "120kg", "Power Delivery": "Dual 100W USB-C Ports", "Fold Depth": "12cm from wall"}'::JSONB,
   '{"Size": ["120x60cm", "140x70cm"]}'::JSONB,
   4.60, 0, false),

  ('30000000-0000-0000-0000-000000000006',
   '10000000-0000-0000-0000-000000000003',
   'Nexus X E-Scooter',
   'nexus-x-escooter',
   'Reimagine urban mobility. Dual 1200W hub motors propel the Nexus X up to 45km/h with a range of 80km on a single charge. Features hydraulic disc brakes, adaptive suspension, and a gorgeous handlebar-integrated OLED HUD.',
   2450.00, 2900.00,
   '20000000-0000-0000-0000-000000000003',
   ARRAY['https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&auto=format&fit=crop&q=80',
         'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&auto=format&fit=crop&q=80'],
   5, 'active',
   '{"Motor Power": "Dual 1200W (2400W Peak)", "Battery Capacity": "60V 24Ah LG Chem Cells", "Top Speed": "45 km/h (Restricted to 25 km/h in EU)", "Max Range": "80 km", "Brake System": "Front & Rear Zoom Hydraulic Disc Brakes"}'::JSONB,
   '{"Power Battery": ["Standard (60km range)", "Long-Range Pro (80km range)"]}'::JSONB,
   4.90, 0, true)
ON CONFLICT (slug) DO NOTHING;

-- 5. SEED REVIEWS
INSERT INTO public.reviews (id, product_id, user_id, rating, comment) VALUES
  ('40000000-0000-0000-0000-000000000001',
   '30000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0000-000000000006',
   5,
   'An absolute masterpiece of design! The carbon-fiber composite case is incredibly light and the dual tourbillon is mesmerizing to look at. Worth every penny.'),

  ('40000000-0000-0000-0000-000000000002',
   '30000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0000-000000000007',
   4,
   'Stunning watch, looks fantastic in person. The neon purple strap variant really pops. Only reason for 4 stars is that it takes a bit of time to adjust the strap correctly.'),

  ('40000000-0000-0000-0000-000000000003',
   '30000000-0000-0000-0000-000000000002',
   '00000000-0000-0000-0000-000000000008',
   5,
   'The ANC on the Horizon is outstanding. Easily cancels out helicopter noise. Beryllium drivers reproduce acoustic details perfectly. Highly recommended for audio purists.')
ON CONFLICT (user_id, product_id) DO NOTHING;

-- 6. SEED NOTIFICATIONS (Welcome notification for admin)
INSERT INTO public.notifications (id, user_id, title, message, read, type) VALUES
  ('50000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0000-000000000001',
   'Welcome to Aetheris Platform',
   'Your ultra-premium multi-vendor hub is active. You can now cycle roles to inspect buyer interfaces, merchant tools, or admin queues.',
   false, 'success')
ON CONFLICT DO NOTHING;

-- Done! Verify with:
-- SELECT count(*) as users FROM public.users;
-- SELECT count(*) as sellers FROM public.sellers;
-- SELECT count(*) as products FROM public.products;
-- SELECT count(*) as reviews FROM public.reviews;
