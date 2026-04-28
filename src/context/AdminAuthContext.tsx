import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { adminApi, getSession, type AdminSession } from "@/lib/adminApi";

type Ctx = {
  session: AdminSession | null;
  loading: boolean;
  refresh: () => void;
  logout: () => void;
};

const AdminAuthContext = createContext<Ctx | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = () => setSession(getSession());

  useEffect(() => {
    setSession(getSession());
    setLoading(false);
    const onStorage = () => setSession(getSession());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const logout = () => {
    adminApi.logout();
    setSession(null);
  };

  return (
    <AdminAuthContext.Provider value={{ session, loading, refresh, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
};
