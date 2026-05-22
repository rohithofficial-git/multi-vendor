-- PostgreSQL Relational Database Schema for Multi Vendor Marketplace (Aetheris)
-- Compatible with Supabase PostgreSQL and Row-Level Security (RLS)

-- Enable pgcrypto for UUID generation if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom roles or enums
CREATE TYPE user_role AS ENUM ('buyer', 'seller', 'admin');
CREATE TYPE seller_status AS ENUM ('pending', 'approved', 'suspended');
CREATE TYPE order_status AS ENUM ('placed', 'packed', 'shipped', 'out_for_delivery', 'delivered');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed');
CREATE TYPE payment_method AS ENUM ('stripe', 'razorpay', 'upi', 'wallet', 'card');
CREATE TYPE notification_type AS ENUM ('info', 'success', 'warning', 'error');

-- 1. USERS TABLE (Extends Supabase auth.users or stands alone)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255), -- Nullable for OAuth logins
    role user_role DEFAULT 'buyer' NOT NULL,
    phone VARCHAR(50),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. SELLERS TABLE (Merchant profiles)
CREATE TABLE IF NOT EXISTS public.sellers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    studio_name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    logo_url TEXT,
    banner_url TEXT,
    status seller_status DEFAULT 'pending' NOT NULL,
    commission_rate NUMERIC(5,2) DEFAULT 10.00 NOT NULL, -- percentage
    rating NUMERIC(3,2) DEFAULT 0.00 NOT NULL,
    sales_count INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(12,2) NOT NULL,
    compare_at_price NUMERIC(12,2),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    images TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
    inventory INT DEFAULT 0 NOT NULL,
    status VARCHAR(50) DEFAULT 'active' NOT NULL, -- active, inactive
    specs JSONB DEFAULT '{}'::JSONB NOT NULL, -- dynamic attributes (movement, materials, etc.)
    variants JSONB DEFAULT '{}'::JSONB NOT NULL, -- selectable options (sizes, colors: [A, B])
    average_rating NUMERIC(3,2) DEFAULT 0.00 NOT NULL,
    reviews_count INT DEFAULT 0 NOT NULL,
    is_ai_recommended BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. WISHLIST TABLE
CREATE TABLE IF NOT EXISTS public.wishlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, product_id)
);

-- 6. CART ITEMS TABLE (Persistent shopping bag)
CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    quantity INT DEFAULT 1 NOT NULL,
    variant_details JSONB, -- selected variants like {"Color": "Obsidian Black"}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, product_id, variant_details)
);

-- 7. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE SET NULL,
    total_amount NUMERIC(12,2) NOT NULL,
    gst_amount NUMERIC(12,2) NOT NULL,
    discount_amount NUMERIC(12,2) DEFAULT 0.00 NOT NULL,
    shipping_address JSONB NOT NULL, -- {fullName, addressLine1, city, state, zipCode, country}
    payment_status payment_status DEFAULT 'pending' NOT NULL,
    shipping_status order_status DEFAULT 'placed' NOT NULL,
    coupon_code VARCHAR(50),
    tracking_history JSONB DEFAULT '[]'::JSONB NOT NULL, -- array of {status, timestamp, description}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. ORDER ITEMS TABLE (Items within an order)
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    quantity INT NOT NULL,
    price_per_unit NUMERIC(12,2) NOT NULL,
    selected_variant VARCHAR(255)
);

-- 9. PAYMENTS TABLE (Transaction records)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    transaction_id VARCHAR(255) UNIQUE NOT NULL,
    payment_gateway payment_method NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    status payment_status DEFAULT 'pending' NOT NULL,
    payload JSONB DEFAULT '{}'::JSONB NOT NULL, -- raw webhook response details
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    rating INT CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, product_id)
);

-- 11. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false NOT NULL,
    type notification_type DEFAULT 'info' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =========================================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_products_seller ON public.products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_orders_buyer ON public.orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_cart_user ON public.cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id) WHERE read = false;

-- =========================================================================
-- DYNAMIC TRIGGERS AND PROCEDURES
-- =========================================================================

-- Trigger to update average ratings automatically on review changes
CREATE OR REPLACE FUNCTION update_product_rating_avg()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.products
  SET 
    average_rating = COALESCE((SELECT AVG(rating)::NUMERIC(3,2) FROM public.reviews WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)), 0.00),
    reviews_count = COALESCE((SELECT COUNT(*) FROM public.reviews WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)), 0)
  WHERE id = COALESCE(NEW.product_id, OLD.product_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_review_inserted_updated_deleted
AFTER INSERT OR UPDATE OR DELETE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION update_product_rating_avg();

-- Trigger to update updated_at timestamps
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_modtime BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_sellers_modtime BEFORE UPDATE ON public.sellers FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_products_modtime BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_orders_modtime BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- =========================================================================
-- ROW-LEVEL SECURITY (RLS) FOR SUPABASE
-- =========================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 1. Users policies
CREATE POLICY "Allow public read access to basic profiles" ON public.users 
    FOR SELECT USING (true);
CREATE POLICY "Allow users to update own profile" ON public.users 
    FOR UPDATE USING (auth.uid() = id);

-- 2. Sellers policies
CREATE POLICY "Allow public read to approved sellers" ON public.sellers 
    FOR SELECT USING (status = 'approved');
CREATE POLICY "Allow sellers to manage own studio" ON public.sellers 
    FOR ALL USING (auth.uid() = user_id);

-- 3. Products policies
CREATE POLICY "Allow public read to active products" ON public.products 
    FOR SELECT USING (status = 'active');
CREATE POLICY "Allow sellers to manage own products" ON public.products 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.sellers 
            WHERE sellers.id = products.seller_id AND sellers.user_id = auth.uid()
        )
    );

-- 4. Orders policies
CREATE POLICY "Allow buyers to view own orders" ON public.orders 
    FOR SELECT USING (auth.uid() = buyer_id);
CREATE POLICY "Allow buyers to insert orders" ON public.orders 
    FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Allow sellers to view orders containing their products" ON public.orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.order_items
            JOIN public.products ON order_items.product_id = products.id
            JOIN public.sellers ON products.seller_id = sellers.id
            WHERE order_items.order_id = orders.id AND sellers.user_id = auth.uid()
        )
    );

-- 5. Notifications policies
CREATE POLICY "Allow users to view own notifications" ON public.notifications 
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow users to update own notifications" ON public.notifications 
    FOR UPDATE USING (auth.uid() = user_id);
