/**
 * Database Access Layer
 * Uses real Supabase when connected, falls back to MockDatabase (localStorage)
 */
import { supabase, mockDb, Product, Seller, Order, Review, Notification } from './supabase';

const isConnected = () => !!supabase;

// ── Products ──────────────────────────────────────────────────────────
export async function fetchProducts(): Promise<Product[]> {
  if (!isConnected()) return mockDb.products;
  const { data, error } = await supabase!.from('products').select(`
    id, title, description, price, compare_at_price, images, inventory,
    status, specs, variants, average_rating, reviews_count, is_ai_recommended, created_at,
    seller_id,
    sellers ( studio_name )
  `).eq('status', 'active');
  if (error || !data) { console.error('fetchProducts:', error); return mockDb.products; }
  return data.map((p: Record<string, unknown>) => ({
    ...p,
    seller_name: (p.sellers as { studio_name: string })?.studio_name ?? '',
    category: String(p.title).includes('Shoe') || String(p.title).includes('Helmet') || String(p.title).includes('Scooter') ? 'Mobility & Gear' :
              String(p.title).includes('Audio') || String(p.title).includes('Watch') || String(p.title).includes('Headphones') || String(p.title).includes('BoomBox') ? 'Acoustics & Time' :
              'Vanguard Living',
  })) as Product[];
}

export async function insertProduct(product: Omit<Product, 'id' | 'average_rating' | 'reviews_count' | 'created_at'>): Promise<Product | null> {
  if (!isConnected()) { mockDb.products = [{ ...product, id: `prod-${crypto.randomUUID()}`, average_rating: 0, reviews_count: 0, created_at: new Date().toISOString() } as Product, ...mockDb.products]; return mockDb.products[0]; }
  const { data, error } = await supabase!.from('products').insert({
    seller_id: product.seller_id,
    title: product.title,
    slug: product.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    description: product.description,
    price: product.price,
    compare_at_price: product.compare_at_price,
    images: product.images,
    inventory: product.inventory,
    status: product.status,
    specs: product.specs,
    variants: product.variants,
    is_ai_recommended: product.is_ai_recommended ?? false,
  }).select().single();
  if (error) { console.error('insertProduct:', error); return null; }
  return { ...data, seller_name: product.seller_name, category: product.category } as Product;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<boolean> {
  if (!isConnected()) { mockDb.products = mockDb.products.map(p => p.id === id ? { ...p, ...updates } : p); return true; }
  const { error } = await supabase!.from('products').update(updates).eq('id', id);
  if (error) { console.error('updateProduct:', error); return false; }
  return true;
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (!isConnected()) { mockDb.products = mockDb.products.filter(p => p.id !== id); return true; }
  const { error } = await supabase!.from('products').delete().eq('id', id);
  if (error) { console.error('deleteProduct:', error); return false; }
  return true;
}

// ── Sellers ───────────────────────────────────────────────────────────
export async function fetchSellers(): Promise<Seller[]> {
  if (!isConnected()) return mockDb.sellers;
  const { data, error } = await supabase!.from('sellers').select('*');
  if (error || !data) { console.error('fetchSellers:', error); return mockDb.sellers; }
  return data as Seller[];
}

export async function insertSeller(seller: Omit<Seller, 'id' | 'created_at'>): Promise<Seller | null> {
  if (!isConnected()) { const s = { ...seller, id: `sel-${crypto.randomUUID()}`, created_at: new Date().toISOString() } as Seller; mockDb.sellers = [...mockDb.sellers, s]; return s; }
  const { data, error } = await supabase!.from('sellers').insert(seller).select().single();
  if (error) { console.error('insertSeller:', error); return null; }
  return data as Seller;
}

export async function updateSeller(id: string, updates: Partial<Seller>): Promise<boolean> {
  if (!isConnected()) { mockDb.sellers = mockDb.sellers.map(s => s.id === id ? { ...s, ...updates } : s); return true; }
  const { error } = await supabase!.from('sellers').update(updates).eq('id', id);
  if (error) { console.error('updateSeller:', error); return false; }
  return true;
}

// ── Orders ────────────────────────────────────────────────────────────
export async function fetchOrders(buyerId?: string): Promise<Order[]> {
  if (!isConnected()) return mockDb.orders;
  let query = supabase!.from('orders').select('*').order('created_at', { ascending: false });
  if (buyerId) query = query.eq('buyer_id', buyerId);
  const { data, error } = await query;
  if (error || !data) { console.error('fetchOrders:', error); return mockDb.orders; }
  return data as Order[];
}

export async function insertOrder(order: Omit<Order, 'id' | 'created_at'>): Promise<Order | null> {
  if (!isConnected()) { const o = { ...order, id: `ord-${Math.floor(100000 + Math.random() * 900000)}`, created_at: new Date().toISOString() } as Order; mockDb.orders = [o, ...mockDb.orders]; return o; }
  const { data, error } = await supabase!.from('orders').insert({
    buyer_id: order.buyer_id,
    total_amount: order.total_amount,
    gst_amount: order.gst_amount,
    discount_amount: order.discount_amount,
    shipping_address: order.shipping_address,
    payment_status: order.payment_status,
    shipping_status: order.shipping_status,
    coupon_code: order.coupon_code,
    tracking_history: order.tracking_history,
  }).select().single();
  if (error) { console.error('insertOrder:', error); return null; }
  return data as Order;
}

export async function updateOrderStatus(orderId: string, status: Order['shipping_status'], trackingEntry: { status: string; timestamp: string; description: string }): Promise<boolean> {
  if (!isConnected()) {
    mockDb.orders = mockDb.orders.map(o => o.id === orderId ? { ...o, shipping_status: status, tracking_history: [...o.tracking_history, trackingEntry] } : o);
    return true;
  }
  // Fetch current tracking, append, and update
  const { data: current } = await supabase!.from('orders').select('tracking_history').eq('id', orderId).single();
  const history = [...(current?.tracking_history || []), trackingEntry];
  const { error } = await supabase!.from('orders').update({ shipping_status: status, tracking_history: history }).eq('id', orderId);
  if (error) { console.error('updateOrderStatus:', error); return false; }
  return true;
}

// ── Reviews ───────────────────────────────────────────────────────────
export async function fetchReviews(productId?: string): Promise<Review[]> {
  if (!isConnected()) return productId ? mockDb.reviews.filter(r => r.product_id === productId) : mockDb.reviews;
  let query = supabase!.from('reviews').select('*, users ( name )').order('created_at', { ascending: false });
  if (productId) query = query.eq('product_id', productId);
  const { data, error } = await query;
  if (error || !data) { console.error('fetchReviews:', error); return mockDb.reviews; }
  return data.map((r: Record<string, unknown>) => ({ ...r, user_name: (r.users as { name: string })?.name ?? 'Anonymous' })) as Review[];
}

export async function insertReview(review: Omit<Review, 'id' | 'created_at'>): Promise<Review | null> {
  if (!isConnected()) { const r = { ...review, id: `rev-${crypto.randomUUID()}`, created_at: new Date().toISOString() } as Review; mockDb.reviews = [r, ...mockDb.reviews]; return r; }
  const { data, error } = await supabase!.from('reviews').insert({
    product_id: review.product_id,
    user_id: review.user_id,
    rating: review.rating,
    comment: review.comment,
  }).select().single();
  if (error) { console.error('insertReview:', error); return null; }
  return { ...data, user_name: review.user_name } as Review;
}

// ── Notifications ─────────────────────────────────────────────────────
export async function fetchNotifications(userId?: string): Promise<Notification[]> {
  if (!isConnected()) return mockDb.notifications;
  let query = supabase!.from('notifications').select('*').order('created_at', { ascending: false });
  if (userId) query = query.eq('user_id', userId);
  const { data, error } = await query;
  if (error || !data) { console.error('fetchNotifications:', error); return mockDb.notifications; }
  return data as Notification[];
}

export async function markNotificationRead(id: string): Promise<boolean> {
  if (!isConnected()) { mockDb.notifications = mockDb.notifications.map(n => n.id === id ? { ...n, read: true } : n); return true; }
  const { error } = await supabase!.from('notifications').update({ read: true }).eq('id', id);
  if (error) { console.error('markNotificationRead:', error); return false; }
  return true;
}

// ── Connection Test ───────────────────────────────────────────────────
export async function testConnection(): Promise<{ connected: boolean; error?: string }> {
  if (!isConnected()) return { connected: false, error: 'No Supabase credentials configured' };
  const { error } = await supabase!.from('users').select('id').limit(1);
  if (error) return { connected: false, error: error.message };
  return { connected: true };
}
