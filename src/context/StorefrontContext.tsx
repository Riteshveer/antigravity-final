import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { type AdminProduct } from "@/lib/adminApi";

// import { REVIEWS as SEED_REVIEWS } from "@/data/products"; // File removed


export type Category = "All" | "3D Figures" | "Anime" | "Lamps" | "Posters";

export type Review = {
  id: string;
  productId?: string;
  productName: string;
  name: string;
  city: string;
  rating: number;
  text: string;
  createdAt: number;
};

type StorefrontContextValue = {
  // filter
  filter: Category;
  setFilter: (c: Category) => void;
  // search
  searchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  query: string;
  setQuery: (q: string) => void;
  // reviews
  reviews: Review[];
  addReview: (r: Omit<Review, "id" | "createdAt">) => void;
  // purchased products (set when an order is placed)
  purchasedIds: string[];
  markPurchased: (ids: string[]) => void;
  // products
  products: AdminProduct[];
  loading: boolean;
};

const Ctx = createContext<StorefrontContextValue | undefined>(undefined);
const REVIEWS_KEY = "swapnaaakar-reviews-v1";
const PURCHASED_KEY = "swapnaaakar-purchased-v1";

const seeded: Review[] = []; // Seed data removed


export const StorefrontProvider = ({ children }: { children: ReactNode }) => {
  const [filter, setFilter] = useState<Category>("All");
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const raw = localStorage.getItem(REVIEWS_KEY);
      const stored = raw ? (JSON.parse(raw) as Review[]) : [];
      return [...stored, ...seeded];
    } catch {
      return seeded;
    }
  });

  const [purchasedIds, setPurchasedIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(PURCHASED_KEY);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });

  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_ADMIN_API_BASE ?? "http://localhost:8787"}/admin/products`);
        const data = await res.json();
        setProducts(data);
      } catch (e) {
        console.error("Failed to fetch products", e);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);



  useEffect(() => {
    try {
      const userOnly = reviews.filter((r) => !r.id.startsWith("seed-"));
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(userOnly));
    } catch { /* ignore */ }
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem(PURCHASED_KEY, JSON.stringify(purchasedIds));
    } catch { /* ignore */ }
  }, [purchasedIds]);

  const addReview = useCallback((r: Omit<Review, "id" | "createdAt">) => {
    setReviews((prev) => [
      { ...r, id: `r-${Date.now()}`, createdAt: Date.now() },
      ...prev,
    ]);
  }, []);

  const markPurchased = useCallback((ids: string[]) => {
    setPurchasedIds((prev) => Array.from(new Set([...prev, ...ids])));
  }, []);

  const value = useMemo<StorefrontContextValue>(() => ({
    filter,
    setFilter,
    searchOpen,
    openSearch: () => setSearchOpen(true),
    closeSearch: () => setSearchOpen(false),
    query,
    setQuery,
    reviews,
    addReview,
    purchasedIds,
    markPurchased,
    products,
    loading,
  }), [filter, searchOpen, query, reviews, addReview, purchasedIds, markPurchased, products, loading]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useStorefront = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStorefront must be used within StorefrontProvider");
  return v;
};
