/**
 * ─── ELITEhub Auth Credentials Registry ───
 *
 * These are the hardcoded demo credentials for all user roles.
 * In production, replace with real Supabase Auth or JWT-based authentication.
 */

export interface AuthCredential {
  email: string;
  password: string;
  role: 'buyer' | 'seller' | 'admin';
  name: string;
  /** Seller-specific: maps to a seller profile in INITIAL_SELLERS */
  sellerId?: string;
}

export const AUTH_CREDENTIALS: AuthCredential[] = [
  // ──────────── ADMIN ────────────
  {
    email: 'own@elitehub.com',
    password: 'own@elitehub',
    role: 'admin',
    name: 'Platform Administrator',
  },

  // ──────────── SELLERS ────────────
  {
    email: 'seller@aetheris.com',
    password: 'Seller@1234',
    role: 'seller',
    name: 'Aetheris Labs',
    sellerId: 'sel-1',
  },
  {
    email: 'seller@lumina.com',
    password: 'Seller@1234',
    role: 'seller',
    name: 'Lumina Craft',
    sellerId: 'sel-2',
  },
  {
    email: 'seller@veloce.com',
    password: 'Seller@1234',
    role: 'seller',
    name: 'Veloce Dynamics',
    sellerId: 'sel-3',
  },

  // ──────────── BUYERS ────────────
  {
    email: 'buyer@elitehub.com',
    password: 'Buyer@1234',
    role: 'buyer',
    name: 'Vanguard Alpha',
  },
  {
    email: 'test@buyer.com',
    password: 'Test@1234',
    role: 'buyer',
    name: 'Test Buyer',
  },
];

/**
 * Validate credentials and return the matching auth record or null.
 */
export function validateCredentials(
  email: string,
  password: string,
  expectedRole?: 'buyer' | 'seller' | 'admin'
): AuthCredential | null {
  const normalized = email.trim().toLowerCase();
  const match = AUTH_CREDENTIALS.find(
    (c) =>
      c.email.toLowerCase() === normalized &&
      c.password === password &&
      (expectedRole ? c.role === expectedRole : true)
  );
  return match || null;
}
