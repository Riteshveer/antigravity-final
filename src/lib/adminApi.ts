/**
 * SwapnaAakar Admin API client.
 *
 * This module is the SINGLE integration point with your Cloudflare Worker
 * + D1 backend. Right now it returns mock data from in-memory storage so the
 * admin UI is fully usable inside the Lovable preview.
 *
 * To go live:
 *   1. Deploy a Cloudflare Worker that exposes the endpoints below.
 *   2. Set VITE_ADMIN_API_BASE in your env to the Worker URL
 *      (e.g. https://api.swapnaaakar.workers.dev).
 *   3. Flip USE_MOCK to false. Every call below already maps 1:1 to a REST route.
 *
 * Expected Worker routes (all return JSON):
 *   POST   /auth/email          { email, password }
 *   POST   /auth/otp/start      { phone }
 *   POST   /auth/otp/verify     { phone, code }
 *   POST   /auth/google         { idToken }
 *   GET    /admin/products
 *   POST   /admin/products
 *   PATCH  /admin/products/:id
 *   DELETE /admin/products/:id
 *   GET    /admin/analytics
 *   GET    /admin/activity
 */

// import { PRODUCTS as SEED } from "@/data/products"; // File removed


const USE_MOCK = false;
const BASE = import.meta.env.VITE_ADMIN_API_BASE ?? "http://localhost:8787";

export type AdminProduct = {
  id: string;
  name: string;
  category: "3D Figures" | "Anime" | "Lamps" | "Posters";
  price: number;
  mrp: number;
  images: string[];
  description: string;
  stock: number;
  rating: number;
  reviews: number;
  badge?: "NEW" | "HOT" | "LIMITED";
  createdAt: string;
};

export type AdminSession = {
  token: string;
  email?: string;
  phone?: string;
  name: string;
  role: "admin";
};

export type AnalyticsSummary = {
  totals: {
    users: number;
    orders: number;
    revenue: number;
    avgOrderValue: number;
  };
  signupsByDay: { date: string; count: number }[];
  revenueByDay: { date: string; amount: number }[];
  topProducts: { id: string; name: string; units: number; revenue: number }[];
  cartAbandonment: { rate: number; abandoned: number; recovered: number };
  productViews: { id: string; name: string; views: number }[];
};

export type ActivityEvent = {
  id: string;
  at: string;
  type: "signup" | "order" | "review" | "stock_low" | "product_edit";
  message: string;
};

/* ---------- Allowed admin identities (UI-only gating) ---------- */
export const ADMIN_EMAILS = ["riteshveer1177@gmail.com", "riteshveer0326@gmail.com"];
export const ADMIN_PHONE = "+917498329578";

const SESSION_KEY = "swapna_user";

export const getSession = (): AdminSession | null => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const user = JSON.parse(raw);
    if (!user.email || !ADMIN_EMAILS.includes(user.email)) return null;
    return { token: user.token || "mock-token", email: user.email, name: user.name, role: "admin" };
  } catch {
    return null;
  }
};

const setSession = (s: AdminSession | null) => {
  // Controlled by UserAuthContext now.
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/* ---------------------- Auth ---------------------- */

export const adminApi = {
  async loginEmail(email: string, password: string): Promise<AdminSession> {
    if (USE_MOCK) {
      await sleep(500);
      const normalizedEmail = email.trim().toLowerCase();
      if (!ADMIN_EMAILS.map(e => e.toLowerCase()).includes(normalizedEmail)) {
        throw new Error("Not an admin account.");
      }
      if (password !== "@8698651320") throw new Error("Invalid credentials.");
      const session: AdminSession = { token: "mock-token", email, name: "Admin", role: "admin" };
      setSession(session);
      return session;
    }
    const r = await fetch(`${BASE}/auth/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!r.ok) throw new Error((await r.text()) || "Login failed");
    const session = (await r.json()) as AdminSession;
    setSession(session);
    return session;
  },

  async startOtp(phone: string): Promise<{ sent: true }> {
    if (USE_MOCK) {
      await sleep(500);
      if (normalizePhone(phone) !== ADMIN_PHONE) throw new Error("This number is not authorized.");
      // Mock OTP printed for the dev — tell the user via toast.
      console.info("[MOCK OTP] Use code: 123456");
      return { sent: true };
    }
    const r = await fetch(`${BASE}/auth/otp/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: normalizePhone(phone) }),
    });
    if (!r.ok) throw new Error((await r.text()) || "Could not send OTP");
    return r.json();
  },

  async verifyOtp(phone: string, code: string): Promise<AdminSession> {
    if (USE_MOCK) {
      await sleep(400);
      if (code !== "123456") throw new Error("Wrong code. (mock code is 123456)");
      const session: AdminSession = {
        token: "mock-token",
        phone: normalizePhone(phone),
        name: "Ritesh",
        role: "admin",
      };
      setSession(session);
      return session;
    }
    const r = await fetch(`${BASE}/auth/otp/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: normalizePhone(phone), code }),
    });
    if (!r.ok) throw new Error((await r.text()) || "Verification failed");
    const s = (await r.json()) as AdminSession;
    setSession(s);
    return s;
  },

  async loginGoogleMock(): Promise<AdminSession> {
    // Real path needs Google Identity Services + your Worker verifying the ID token.
    if (USE_MOCK) {
      await sleep(600);
      const session: AdminSession = {
        token: "mock-token",
        email: ADMIN_EMAILS[0],
        name: "Admin",
        role: "admin",
      };
      setSession(session);
      return session;
    }
    throw new Error("Google sign-in must be wired to your Worker /auth/google route.");
  },

  logout() {
    setSession(null);
  },

  /* ---------------------- Products ---------------------- */

  async listProducts(): Promise<AdminProduct[]> {
    if (USE_MOCK) {
      await sleep(120);
      return [...mockDb.products];
    }
    const r = await fetch(`${BASE}/admin/products`, { headers: authHeaders() });
    return r.json();
  },

  async createProduct(input: Omit<AdminProduct, "id" | "createdAt" | "rating" | "reviews">): Promise<AdminProduct> {
    if (USE_MOCK) {
      await sleep(200);
      const p: AdminProduct = {
        ...input,
        id: `p-${Date.now()}`,
        createdAt: new Date().toISOString(),
        rating: 0,
        reviews: 0,
      };
      mockDb.products.unshift(p);
      return p;
    }
    const r = await fetch(`${BASE}/admin/products`, {
      method: "POST",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    return r.json();
  },

  async updateProduct(id: string, patch: Partial<AdminProduct>): Promise<AdminProduct> {
    if (USE_MOCK) {
      await sleep(150);
      const idx = mockDb.products.findIndex((p) => p.id === id);
      if (idx < 0) throw new Error("Not found");
      mockDb.products[idx] = { ...mockDb.products[idx], ...patch };
      return mockDb.products[idx];
    }
    const r = await fetch(`${BASE}/admin/products/${id}`, {
      method: "PATCH",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    return r.json();
  },

  async deleteProduct(id: string): Promise<void> {
    if (USE_MOCK) {
      await sleep(120);
      mockDb.products = mockDb.products.filter((p) => p.id !== id);
      return;
    }
    await fetch(`${BASE}/admin/products/${id}`, { method: "DELETE", headers: authHeaders() });
  },

  /* ---------------------- Analytics ---------------------- */

  async analytics(): Promise<AnalyticsSummary> {
    if (USE_MOCK) {
      await sleep(200);
      return mockAnalytics();
    }
    const r = await fetch(`${BASE}/admin/analytics`, { headers: authHeaders() });
    return r.json();
  },

  async activity(): Promise<ActivityEvent[]> {
    if (USE_MOCK) {
      await sleep(150);
      return mockActivity();
    }
    const r = await fetch(`${BASE}/admin/activity`, { headers: authHeaders() });
    return r.json();
  },
};

/* ---------------------- helpers ---------------------- */

const authHeaders = (): Record<string, string> => {
  const s = getSession();
  return s ? { Authorization: `Bearer ${s.token}` } : {};
};

const normalizePhone = (p: string) => {
  const digits = p.replace(/\D/g, "");
  if (digits.length === 10) return `+91${digits}`;
  if (digits.startsWith("91") && digits.length === 12) return `+${digits}`;
  return p.startsWith("+") ? p : `+${digits}`;
};

/* ---------------------- mock store ---------------------- */

const mockDb: { products: AdminProduct[] } = { products: [] }; // Mock data disabled


const mockAnalytics = (): AnalyticsSummary => {
  const days = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return d.toISOString().slice(0, 10);
  });
  const signupsByDay = days.map((date, i) => ({ date, count: 4 + Math.round(Math.sin(i) * 3 + i * 0.6) }));
  const revenueByDay = days.map((date, i) => ({ date, amount: 8000 + i * 600 + Math.round(Math.cos(i) * 1500) }));
  const topProducts = mockDb.products
    .slice()
    .sort((a, b) => b.reviews - a.reviews)
    .slice(0, 5)
    .map((p) => ({ id: p.id, name: p.name, units: p.reviews, revenue: p.reviews * p.price }));
  return {
    totals: {
      users: 1284,
      orders: 412,
      revenue: revenueByDay.reduce((s, r) => s + r.amount, 0),
      avgOrderValue: 1850,
    },
    signupsByDay,
    revenueByDay,
    topProducts,
    cartAbandonment: { rate: 0.34, abandoned: 142, recovered: 38 },
    productViews: mockDb.products.slice(0, 6).map((p) => ({
      id: p.id,
      name: p.name,
      views: 200 + Math.round(Math.random() * 1200),
    })),
  };
};

const mockActivity = (): ActivityEvent[] => [
  { id: "a1", at: new Date(Date.now() - 1000 * 60 * 4).toISOString(), type: "order", message: "New order ₹2,499 — Iron Man Bust" },
  { id: "a2", at: new Date(Date.now() - 1000 * 60 * 18).toISOString(), type: "signup", message: "Aarav S. signed up" },
  { id: "a3", at: new Date(Date.now() - 1000 * 60 * 41).toISOString(), type: "stock_low", message: "Dragon Lamp stock at 3 — restock soon" },
  { id: "a4", at: new Date(Date.now() - 1000 * 60 * 70).toISOString(), type: "review", message: "5★ review on Naruto Sage Mode Figure" },
  { id: "a5", at: new Date(Date.now() - 1000 * 60 * 130).toISOString(), type: "product_edit", message: "Price updated: Goku Super Saiyan" },
  { id: "a6", at: new Date(Date.now() - 1000 * 60 * 220).toISOString(), type: "order", message: "New order ₹1,299 — Death Star Lamp" },
];
