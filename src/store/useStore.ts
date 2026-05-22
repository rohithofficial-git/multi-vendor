import { create } from 'zustand';
import { 
  mockDb, 
  supabase,
  Product, 
  Seller, 
  Order, 
  Review, 
  CartItem, 
  Notification, 
  User,
  INITIAL_PRODUCTS,
  INITIAL_SELLERS,
  INITIAL_REVIEWS,
  INITIAL_NOTIFICATIONS
} from '../lib/supabase';
import {
  fetchProducts,
  fetchSellers,
  fetchOrders,
  fetchReviews,
  fetchNotifications,
  testConnection,
  insertProduct,
  updateProduct as dbUpdateProduct,
  deleteProduct as dbDeleteProduct,
  insertSeller,
  updateSeller,
  insertOrder,
  updateOrderStatus as dbUpdateOrderStatus,
  insertReview,
  markNotificationRead as dbMarkNotificationRead,
} from '../lib/database';

// HTTP fallback for UUID generation since crypto.randomUUID requires HTTPS
const generateUUID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

interface BillingSummary {
  subtotal: number;
  discount: number;
  gst: number;
  shipping: number;
  total: number;
}

interface StoreState {
  // Authentication & Session
  currentUser: User | null;
  currentRole: 'buyer' | 'seller' | 'admin';
  currentSeller: Seller | null;
  isAuthenticated: boolean;
  
  // Database Tables (Sync with Mock DB)
  products: Product[];
  sellers: Seller[];
  orders: Order[];
  reviews: Review[];
  notifications: Notification[];
  
  // User Actions (Client State)
  cart: CartItem[];
  wishlist: string[]; // product IDs
  activeTheme: 'dark-luxury' | 'light-minimal' | 'cyberpunk';
  
  // Loading & UI
  loading: boolean;
  activeCoupon: { code: string; discountPercent: number } | null;
  dbConnected: boolean;
  isInitialized: boolean;

  // Initialization (fetches from Supabase if connected)
  initialize: () => Promise<void>;
  
  // Actions
  login: (email: string, role: 'buyer' | 'seller' | 'admin') => Promise<boolean>;
  logout: () => void;
  setRole: (role: 'buyer' | 'seller' | 'admin') => void;
  setTheme: (theme: 'dark-luxury' | 'light-minimal' | 'cyberpunk') => void;
  
  // Cart Actions
  addToCart: (productId: string, quantity?: number, variant?: string) => void;
  removeFromCart: (productId: string, variant?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, variant?: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  getBillingSummary: () => BillingSummary;
  
  // Wishlist Actions
  toggleWishlist: (productId: string) => void;
  
  // Order Actions
  createOrder: (shippingAddress: Order['shipping_address'], paymentMethod: string) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order['shipping_status']) => void;
  
  // Seller Actions
  registerAsSeller: (studioName: string, description: string, logoUrl?: string) => Promise<void>;
  requestSellerAccess: (email: string, studioName: string) => Promise<void>;
  addProduct: (productData: Omit<Product, 'id' | 'seller_id' | 'seller_name' | 'average_rating' | 'reviews_count' | 'created_at'>) => Promise<void>;
  updateProduct: (id: string, productData: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  
  // Admin Actions
  approveSeller: (id: string) => Promise<void>;
  suspendSeller: (id: string) => Promise<void>;
  
  // Review Actions
  addReview: (productId: string, rating: number, comment: string) => Promise<void>;
  
  // Notifications Actions
  addNotification: (title: string, message: string, type: Notification['type']) => void;
  markNotificationRead: (id: string) => Promise<void>;
  clearNotifications: () => void;
}

// Default Current User (Simulated OAuth / OTP Session)
const DEFAULT_USER: User = {
  id: 'usr-buyer-admin',
  name: 'Vanguard Alpha',
  email: 'alpha@vanguard.io',
  role: 'buyer',
  phone: '+91 98765 43210',
  created_at: new Date().toISOString()
};

export const useStore = create<StoreState>((set, get) => {
  // Helper to sync mock DB (localStorage fallback)
  const syncDb = (updates: Partial<StoreState>) => {
    if (updates.products) mockDb.products = updates.products;
    if (updates.sellers) mockDb.sellers = updates.sellers;
    if (updates.orders) mockDb.orders = updates.orders;
    if (updates.reviews) mockDb.reviews = updates.reviews;
    if (updates.notifications) mockDb.notifications = updates.notifications;
  };

  // Helper to load cart & wishlist from localStorage securely
  const getLocalStorageItem = <T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;
    const stored = localStorage.getItem(`aetheris_${key}`);
    try {
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const setLocalStorageItem = <T>(key: string, value: T) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`aetheris_${key}`, JSON.stringify(value));
    }
  };

  // Initial setup loads static values to prevent SSR hydration mismatches
  const initialProducts = INITIAL_PRODUCTS;
  const initialSellers = INITIAL_SELLERS;
  const initialOrders: Order[] = [];
  const initialReviews = INITIAL_REVIEWS;
  const initialNotifications = INITIAL_NOTIFICATIONS;

  const initialCart = getLocalStorageItem<CartItem[]>('cart', []);
  const initialWishlist = getLocalStorageItem<string[]>('wishlist', []);
  const initialTheme = getLocalStorageItem<'dark-luxury' | 'light-minimal' | 'cyberpunk'>('theme', 'dark-luxury');

  // Find matching seller profile if current user is seller
  const getSellerProfile = (userId: string, sellerList: Seller[]): Seller | null => {
    return sellerList.find(s => s.user_id === userId) || null;
  };

  return {
    currentUser: null,
    currentRole: 'buyer',
    currentSeller: null,
    isAuthenticated: false,
    
    products: initialProducts,
    sellers: initialSellers,
    orders: initialOrders,
    reviews: initialReviews,
    notifications: initialNotifications,
    
    cart: initialCart,
    wishlist: initialWishlist,
    activeTheme: initialTheme,
    loading: false,
    activeCoupon: null,
    dbConnected: false,
    isInitialized: false,

    initialize: async () => {
      let authState: any = {};
      if (typeof window !== 'undefined') {
        const cookies = document.cookie.split(';');
        const isAuth = cookies.some(c => c.trim().startsWith('aetheris_auth=true'));
        const roleCookie = cookies.find(c => c.trim().startsWith('aetheris_role='));
        const role = roleCookie ? roleCookie.split('=')[1] as 'buyer'|'seller'|'admin' : 'buyer';
        
        const storedUser = localStorage.getItem('aetheris_user');
        const userToUse = storedUser ? JSON.parse(storedUser) : DEFAULT_USER;

        if (isAuth) {
          authState = {
            currentUser: userToUse,
            currentRole: role,
            isAuthenticated: true
          };
        }
      }

      const { connected } = await testConnection();
      if (!connected) {
        console.log('[Store] No Supabase connection — using localStorage fallback');
        
        const mockData = {
          products: mockDb.products,
          sellers: mockDb.sellers,
          orders: mockDb.orders,
          reviews: mockDb.reviews,
          notifications: mockDb.notifications,
        };

        const currentStore = get();
        if (currentStore.isAuthenticated) {
          set({ ...mockData, dbConnected: false, isInitialized: true });
        } else {
          if (authState.isAuthenticated && authState.currentRole === 'seller') {
            authState.currentSeller = getSellerProfile(authState.currentUser.id, mockData.sellers);
          }
          set({ ...mockData, dbConnected: false, isInitialized: true, ...authState });
        }
        return;
      }
      console.log('[Store] ✅ Supabase connected — fetching data...');
      try {
        const [products, sellers, orders, reviews, notifications] = await Promise.all([
          fetchProducts(),
          fetchSellers(),
          fetchOrders(),
          fetchReviews(),
          fetchNotifications(),
        ]);
        
        if (authState.isAuthenticated && authState.currentRole === 'seller') {
          authState.currentSeller = getSellerProfile(authState.currentUser.id, sellers);
        }

        const currentStore = get();
        if (currentStore.isAuthenticated) {
          set({
            products,
            sellers,
            orders,
            reviews,
            notifications,
            dbConnected: true,
            isInitialized: true
          });
        } else {
          set({
            products,
            sellers,
            orders,
            reviews,
            notifications,
            dbConnected: true,
            isInitialized: true,
            ...authState
          });
        }
        console.log(`[Store] Loaded: ${products.length} products, ${sellers.length} sellers, ${orders.length} orders`);
      } catch (err) {
        console.error('[Store] Failed to load from Supabase:', err);
        set({ dbConnected: false, isInitialized: true });
      }
    },

    login: async (email: string, role: 'buyer' | 'seller' | 'admin') => {
      set({ loading: true });
      await new Promise(resolve => setTimeout(resolve, 800)); // simulation delay

      const namePrefix = email.split('@')[0];
      const name = namePrefix.charAt(0).toUpperCase() + namePrefix.slice(1) + ' Creator';
      const user: User = {
        id: generateUUID(),
        name,
        email,
        role,
        created_at: new Date().toISOString()
      };

      // Create or find seller profile if registering/logging in as seller
      let sellerProfile: Seller | null = null;
      if (role === 'seller') {
        const existingSellers = get().sellers;
        
        // Fix: Find seller by description (which contains email) or studio_name mapping
        const exists = existingSellers.find(s => 
          s.description?.includes(email) || 
          s.studio_name.toLowerCase().includes(namePrefix.toLowerCase())
        );

        if (!exists) {
          sellerProfile = {
            id: generateUUID(),
            user_id: user.id,
            studio_name: `${name}'s Studio`,
            description: `Vanguard designs by ${name}. Email: ${email}`,
            logo_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
            banner_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
            status: 'approved', // Auto-approved for preview convenience
            commission_rate: 10.00,
            rating: 5.0,
            sales_count: 0,
            created_at: new Date().toISOString()
          };
          const updatedSellers = [...existingSellers, sellerProfile];
          set({ sellers: updatedSellers });
          syncDb({ sellers: updatedSellers });
        } else {
          sellerProfile = exists;
          // Update the user ID to match the found seller's user_id so they link up correctly
          user.id = exists.user_id;
        }
      }

      set({ 
        currentUser: user, 
        currentRole: role,
        currentSeller: sellerProfile,
        isAuthenticated: true, 
        loading: false 
      });
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('aetheris_user', JSON.stringify(user));
        document.cookie = `aetheris_role=${role}; path=/; max-age=86400; SameSite=Lax`;
        document.cookie = `aetheris_auth=true; path=/; max-age=86400; SameSite=Lax`;
      }
      
      get().addNotification(
        'Authentication Successful',
        `Logged in secure session as ${role.toUpperCase()}: ${user.name}.`,
        'success'
      );
      
      return true;
    },

    logout: () => {
      set({ 
        currentUser: null, 
        currentRole: 'buyer', 
        currentSeller: null, 
        isAuthenticated: false,
        cart: [],
        wishlist: [],
        activeCoupon: null
      });
      if (typeof window !== 'undefined') {
        localStorage.removeItem('aetheris_cart');
        localStorage.removeItem('aetheris_wishlist');
        localStorage.removeItem('aetheris_user');
        document.cookie = `aetheris_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        document.cookie = `aetheris_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      }
    },

    setRole: (role) => {
      const user = get().currentUser;
      let sellerProfile: Seller | null = null;
      if (user && role === 'seller') {
        sellerProfile = getSellerProfile(user.id, get().sellers);
        if (!sellerProfile && get().dbConnected) {
          // When connected to Supabase, use the first approved seller from DB
          // (since we don't have real auth yet, simulate being a real seller)
          const approvedSeller = get().sellers.find(s => s.status === 'approved');
          if (approvedSeller) {
            sellerProfile = approvedSeller;
          }
        }
        if (!sellerProfile) {
          // Fallback: Auto create seller for localStorage mode
          sellerProfile = {
            id: `sel-auto-${user.id}`,
            user_id: user.id,
            studio_name: `${user.name} Studio`,
            description: 'Vanguard bespoke creations.',
            logo_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
            banner_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
            status: 'approved',
            commission_rate: 12.00,
            rating: 4.8,
            sales_count: 34,
            created_at: new Date().toISOString()
          };
          const updatedSellers = [...get().sellers, sellerProfile];
          set({ sellers: updatedSellers });
          syncDb({ sellers: updatedSellers });
        }
      }
      
      set({ currentRole: role, currentSeller: sellerProfile });
      get().addNotification(
        'Role Session Shifted',
        `Workspace privileges updated to ${role.toUpperCase()} mode.`,
        'info'
      );
    },

    setTheme: (theme) => {
      set({ activeTheme: theme });
      setLocalStorageItem('theme', theme);
    },

    addToCart: (productId, quantity = 1, variant) => {
      const cart = [...get().cart];
      const existingIndex = cart.findIndex(
        item => item.product_id === productId && item.variant === variant
      );

      if (existingIndex !== -1) {
        cart[existingIndex].quantity += quantity;
      } else {
        cart.push({ product_id: productId, quantity, variant });
      }

      set({ cart });
      setLocalStorageItem('cart', cart);
      
      const product = get().products.find(p => p.id === productId);
      if (product) {
        get().addNotification(
          'Added to Bag',
          `${product.title} (${variant || 'Default'}) added to your shopping cart.`,
          'success'
        );
      }
    },

    removeFromCart: (productId, variant) => {
      const cart = get().cart.filter(
        item => !(item.product_id === productId && item.variant === variant)
      );
      set({ cart });
      setLocalStorageItem('cart', cart);
      
      const product = get().products.find(p => p.id === productId);
      if (product) {
        get().addNotification(
          'Removed from Bag',
          `${product.title} removed from your shopping cart.`,
          'info'
        );
      }
    },

    updateCartQuantity: (productId, quantity, variant) => {
      if (quantity <= 0) {
        get().removeFromCart(productId, variant);
        return;
      }
      
      const cart = get().cart.map(item => {
        if (item.product_id === productId && item.variant === variant) {
          return { ...item, quantity };
        }
        return item;
      });

      set({ cart });
      setLocalStorageItem('cart', cart);
    },

    clearCart: () => {
      set({ cart: [], activeCoupon: null });
      setLocalStorageItem('cart', []);
    },

    applyCoupon: (code) => {
      const coupons: Record<string, number> = {
        'NEON50': 50,
        'STARTUP20': 20,
        'WELCOME10': 10
      };

      const cleanCode = code.toUpperCase().trim();
      if (coupons[cleanCode] !== undefined) {
        set({ activeCoupon: { code: cleanCode, discountPercent: coupons[cleanCode] } });
        get().addNotification(
          'Coupon Applied',
          `Discount code '${cleanCode}' successfully activated for ${coupons[cleanCode]}% off.`,
          'success'
        );
        return true;
      }
      return false;
    },

    removeCoupon: () => {
      set({ activeCoupon: null });
    },

    getBillingSummary: () => {
      const { cart, products, activeCoupon } = get();
      
      let subtotal = 0;
      cart.forEach(item => {
        const product = products.find(p => p.id === item.product_id);
        if (product) {
          subtotal += product.price * item.quantity;
        }
      });

      const discountPercent = activeCoupon ? activeCoupon.discountPercent : 0;
      const discount = (subtotal * discountPercent) / 100;
      const taxableAmount = subtotal - discount;
      
      // GST Calculation (18% standard luxury tax)
      const gst = taxableAmount * 0.18;
      
      // Shipping (Flat 50, free over 500)
      const shipping = taxableAmount > 500 || taxableAmount === 0 ? 0 : 50;
      
      const total = taxableAmount + gst + shipping;

      return {
        subtotal: Math.round(subtotal * 100) / 100,
        discount: Math.round(discount * 100) / 100,
        gst: Math.round(gst * 100) / 100,
        shipping,
        total: Math.round(total * 100) / 100
      };
    },

    toggleWishlist: (productId) => {
      let wishlist = [...get().wishlist];
      const index = wishlist.indexOf(productId);
      
      if (index === -1) {
        wishlist.push(productId);
        get().addNotification(
          'Wishlist Updated',
          'Product added to your digital wishlist.',
          'success'
        );
      } else {
        wishlist = wishlist.filter(id => id !== productId);
        get().addNotification(
          'Wishlist Updated',
          'Product removed from your digital wishlist.',
          'info'
        );
      }

      set({ wishlist });
      setLocalStorageItem('wishlist', wishlist);
    },

    createOrder: async (shippingAddress, paymentMethod) => {
      set({ loading: true });
      await new Promise(resolve => setTimeout(resolve, 1500)); // Secure gateway lag simulator

      const { cart, products, getBillingSummary, currentUser, activeCoupon } = get();
      const billing = getBillingSummary();

      const orderItems = cart.map(item => {
        const prod = products.find(p => p.id === item.product_id)!;
        return {
          product_id: item.product_id,
          title: prod.title,
          quantity: item.quantity,
          price: prod.price,
          variant: item.variant
        };
      });

      const newOrder: Order = {
        id: `ord-${Math.floor(100000 + Math.random() * 900000)}`,
        buyer_id: currentUser?.id || 'anonymous',
        total_amount: billing.total,
        gst_amount: billing.gst,
        discount_amount: billing.discount,
        shipping_address: shippingAddress,
        payment_status: 'paid', // Auto-successful in simulator
        shipping_status: 'placed',
        coupon_code: activeCoupon?.code,
        items: orderItems,
        tracking_history: [
          {
            status: 'placed',
            timestamp: new Date().toISOString(),
            description: 'Secure payment confirmed. Order dispatched to studios for pack logs.'
          }
        ],
        created_at: new Date().toISOString()
      };

      // Subtract inventory for purchased products
      const updatedProducts = products.map(p => {
        const item = cart.find(ci => ci.product_id === p.id);
        if (item) {
          return { ...p, inventory: Math.max(0, p.inventory - item.quantity) };
        }
        return p;
      });

      // Update sellers sales counts
      const updatedSellers = get().sellers.map(s => {
        // Calculate items in this order belonging to this seller
        const sellerItemsCount = cart.reduce((acc, ci) => {
          const p = products.find(prod => prod.id === ci.product_id);
          return p && p.seller_id === s.id ? acc + ci.quantity : acc;
        }, 0);
        
        return sellerItemsCount > 0 
          ? { ...s, sales_count: s.sales_count + sellerItemsCount }
          : s;
      });

      const updatedOrders = [newOrder, ...get().orders];

      set({ 
        orders: updatedOrders,
        products: updatedProducts,
        sellers: updatedSellers,
        cart: [],
        activeCoupon: null,
        loading: false 
      });

      syncDb({ 
        orders: updatedOrders, 
        products: updatedProducts,
        sellers: updatedSellers 
      });
      localStorage.removeItem('aetheris_cart');

      get().addNotification(
        'Order Confirmed',
        `Order ${newOrder.id} has been processed successfully.`,
        'success'
      );

      return newOrder;
    },

    updateOrderStatus: (orderId, status) => {
      const statusDescriptions: Record<string, string> = {
        'placed': 'Order placement secured.',
        'packed': 'Artisan studio has finished technical packing and quality audits.',
        'shipped': 'Cargo handoff to hyper-freight systems completed. In transit.',
        'out_for_delivery': 'Local logistics runner carrying parcel to destination address.',
        'delivered': 'Secure drop complete. Biometric sign-off recorded.'
      };

      const updatedOrders = get().orders.map(order => {
        if (order.id === orderId) {
          const timestamp = new Date().toISOString();
          const exists = order.tracking_history.some(h => h.status === status);
          
          const tracking_history = [...order.tracking_history];
          if (!exists) {
            tracking_history.push({
              status,
              timestamp,
              description: statusDescriptions[status] || 'Status update logged.'
            });
          }

          return {
            ...order,
            shipping_status: status,
            tracking_history
          };
        }
        return order;
      });

      set({ orders: updatedOrders });
      syncDb({ orders: updatedOrders });

      // Notify the buyer
      const order = get().orders.find(o => o.id === orderId);
      if (order) {
        get().addNotification(
          'Order Tracking Update',
          `Order ${orderId} is now ${status.replace(/_/g, ' ').toUpperCase()}.`,
          status === 'delivered' ? 'success' : 'info'
        );
      }
    },

    registerAsSeller: async (studioName, description, logoUrl) => {
      const user = get().currentUser;
      if (!user) return;

      // FIX: Ensure the user exists in the Supabase users table to satisfy foreign key constraints
      if (get().dbConnected && supabase) {
        const { error: userErr } = await supabase.from('users').upsert({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone || ''
        });
        if (userErr) console.warn('registerAsSeller user upsert:', userErr);
      }

      const sellerData = {
        user_id: user.id,
        studio_name: studioName,
        description,
        logo_url: logoUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
        banner_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
        status: 'pending' as const,
        commission_rate: 12.00,
        rating: 0,
        sales_count: 0,
      };

      if (get().dbConnected) {
        const result = await insertSeller(sellerData);
        if (result) {
          set({ 
            sellers: [...get().sellers, result],
            currentSeller: result
          });
        }
      } else {
        const newSeller: Seller = { ...sellerData, id: generateUUID(), created_at: new Date().toISOString() };
        const updatedSellers = [...get().sellers, newSeller];
        set({ 
          sellers: updatedSellers,
          currentSeller: newSeller
        });
        syncDb({ sellers: updatedSellers });
      }

      get().addNotification(
        'Application Submitted',
        `Seller registry for '${studioName}' is queued for admin moderation audits.`,
        'warning'
      );
    },

    addProduct: async (productData) => {
      const seller = get().currentSeller;
      if (!seller) return;

      const fullData = { ...productData, seller_id: seller.id, seller_name: seller.studio_name };

      if (get().dbConnected) {
        const result = await insertProduct(fullData);
        if (result) {
          set({ products: [result, ...get().products] });
        }
      } else {
        const newProduct: Product = { ...fullData, id: `prod-${Math.random().toString(36).substr(2, 9)}`, average_rating: 0, reviews_count: 0, created_at: new Date().toISOString() };
        const updatedProducts = [newProduct, ...get().products];
        set({ products: updatedProducts });
        syncDb({ products: updatedProducts });
      }

      get().addNotification(
        'Artifact Uploaded',
        `${productData.title} added to the digital catalog.`,
        'success'
      );
    },

    updateProduct: async (id, productData) => {
      if (get().dbConnected) {
        await dbUpdateProduct(id, productData);
      }
      const updatedProducts = get().products.map(p => p.id === id ? { ...p, ...productData } : p);
      set({ products: updatedProducts });
      syncDb({ products: updatedProducts });

      get().addNotification(
        'Product Updated',
        'Catalog changes saved successfully.',
        'success'
      );
    },

    deleteProduct: async (id) => {
      const target = get().products.find(p => p.id === id);
      if (get().dbConnected) {
        await dbDeleteProduct(id);
      }
      const updatedProducts = get().products.filter(p => p.id !== id);
      set({ products: updatedProducts });
      syncDb({ products: updatedProducts });

      if (target) {
        get().addNotification(
          'Product Deleted',
          `${target.title} deleted from the digital catalog.`,
          'info'
        );
      }
    },

    approveSeller: async (id) => {
      if (get().dbConnected) {
        await updateSeller(id, { status: 'approved' });
      }
      const updatedSellers = get().sellers.map(s => s.id === id ? { ...s, status: 'approved' as const } : s);
      set({ sellers: updatedSellers });
      syncDb({ sellers: updatedSellers });

      const seller = get().sellers.find(s => s.id === id);
      if (seller) {
        get().addNotification(
          'Merchant Approved',
          `Studio '${seller.studio_name}' verified and authorized to sell.`,
          'success'
        );
      }
    },

    suspendSeller: async (id) => {
      if (get().dbConnected) {
        await updateSeller(id, { status: 'suspended' });
      }
      const updatedSellers = get().sellers.map(s => s.id === id ? { ...s, status: 'suspended' as const } : s);
      set({ sellers: updatedSellers });
      syncDb({ sellers: updatedSellers });

      const seller = get().sellers.find(s => s.id === id);
      if (seller) {
        get().addNotification(
          'Merchant Suspended',
          `Studio '${seller.studio_name}' privileges suspended for compliance audits.`,
          'error'
        );
      }
    },

    addReview: async (productId, rating, comment) => {
      const user = get().currentUser;
      if (!user) return;

      const reviewData = { product_id: productId, user_id: user.id, user_name: user.name, rating, comment };

      if (get().dbConnected) {
        const result = await insertReview(reviewData);
        if (result) {
          const updatedReviews = [result, ...get().reviews];
          const reviewsForProduct = updatedReviews.filter(r => r.product_id === productId);
          const reviewsCount = reviewsForProduct.length;
          const averageRating = Math.round((reviewsForProduct.reduce((acc, r) => acc + r.rating, 0) / reviewsCount) * 10) / 10;
          const updatedProducts = get().products.map(p => p.id === productId ? { ...p, average_rating: averageRating, reviews_count: reviewsCount } : p);
          set({ reviews: updatedReviews, products: updatedProducts });
        }
      } else {
        const newReview: Review = { ...reviewData, id: `rev-${Math.random().toString(36).substr(2, 9)}`, created_at: new Date().toISOString() };
        const updatedReviews = [newReview, ...get().reviews];
        const reviewsForProduct = updatedReviews.filter(r => r.product_id === productId);
        const reviewsCount = reviewsForProduct.length;
        const averageRating = Math.round((reviewsForProduct.reduce((acc, r) => acc + r.rating, 0) / reviewsCount) * 10) / 10;
        const updatedProducts = get().products.map(p => p.id === productId ? { ...p, average_rating: averageRating, reviews_count: reviewsCount } : p);
        set({ reviews: updatedReviews, products: updatedProducts });
        syncDb({ reviews: updatedReviews, products: updatedProducts });
      }

      get().addNotification(
        'Review Submitted',
        'Your feedback helps maintain vanguard quality.',
        'success'
      );
    },

    addNotification: (title, message, type) => {
      const user = get().currentUser;
      const newNotif: Notification = {
        id: `notif-${Math.random().toString(36).substr(2, 9)}`,
        user_id: user?.id || 'anonymous',
        title,
        message,
        read: false,
        type,
        created_at: new Date().toISOString()
      };

      const updatedNotifications = [newNotif, ...get().notifications];
      set({ notifications: updatedNotifications });
      syncDb({ notifications: updatedNotifications });
    },

    requestSellerAccess: async (email, studioName) => {
      // Check if seller already exists
      const existing = get().sellers.find(
        s => s.studio_name.toLowerCase() === studioName.toLowerCase()
      );
      if (existing) return;

      const userId = crypto.randomUUID();

      // Create user record first (FK requirement)
      if (get().dbConnected && supabase) {
        const { error: userErr } = await supabase.from('users').insert({
          id: userId,
          name: studioName,
          email: email,
          role: 'seller',
          phone: '',
        });
        if (userErr) console.error('requestSellerAccess user insert:', userErr);
      }

      const sellerData = {
        user_id: userId,
        studio_name: studioName,
        description: `Seller application from ${email}. Studio: ${studioName}.`,
        logo_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
        banner_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
        status: 'pending' as const,
        commission_rate: 12.00,
        rating: 0,
        sales_count: 0,
      };

      if (get().dbConnected) {
        const result = await insertSeller(sellerData);
        if (result) {
          set({ sellers: [...get().sellers, result] });
        }
      } else {
        const newSeller = { ...sellerData, id: `sel-${Math.random().toString(36).substr(2, 9)}`, created_at: new Date().toISOString() } as Seller;
        const updatedSellers = [...get().sellers, newSeller];
        set({ sellers: updatedSellers });
        syncDb({ sellers: updatedSellers });
      }

      // Add notification for admin
      const adminNotif: Notification = {
        id: `notif-${Math.random().toString(36).substr(2, 9)}`,
        user_id: 'admin',
        title: '🏪 New Seller Verification Request',
        message: `"${studioName}" (${email}) has requested seller access. Go to Admin Panel → Merchant Verification Queue to approve or decline.`,
        read: false,
        type: 'warning',
        created_at: new Date().toISOString()
      };
      const updatedNotifications = [adminNotif, ...get().notifications];
      set({ notifications: updatedNotifications });
      syncDb({ notifications: updatedNotifications });
    },

    markNotificationRead: async (id) => {
      if (get().dbConnected) {
        await dbMarkNotificationRead(id);
      }
      const updatedNotifications = get().notifications.map(n => n.id === id ? { ...n, read: true } : n);
      set({ notifications: updatedNotifications });
      syncDb({ notifications: updatedNotifications });
    },

    clearNotifications: () => {
      set({ notifications: [] });
      syncDb({ notifications: [] });
    }
  };
});
