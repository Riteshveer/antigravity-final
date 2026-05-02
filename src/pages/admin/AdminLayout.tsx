import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useUserAuth } from "@/context/UserAuthContext";
import { ADMIN_EMAILS } from "@/lib/adminApi";
import { NavLink } from "@/components/NavLink";
import { LayoutDashboard, Package, Boxes, BarChart3, LogOut, ShieldCheck, ArrowLeft, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const items = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/stock", label: "Stock", icon: Boxes },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

const AdminLayout = () => {
  const { user, loading, logout } = useUserAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) return null;
  if (!user || !ADMIN_EMAILS.includes(user.email)) return <Navigate to="/" replace />;

  const handleLogout = () => {
    logout();
    toast.success("Signed out");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-64 shrink-0 border-r border-border bg-card hidden md:flex flex-col">
        <div className="px-5 h-16 flex items-center gap-2 border-b border-border">
          <div className="w-9 h-9 rounded-xl bg-foreground text-background grid place-items-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="font-display font-bold leading-tight">SwapnaAakar</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Admin Console</div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.end}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition"
              activeClassName="bg-muted text-foreground font-medium"
            >
              <it.icon className="w-4 h-4" />
              {it.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-border">
          <div className="px-3 py-2 mb-2">
            <div className="text-xs text-muted-foreground">Signed in as</div>
            <div className="text-sm font-medium truncate">{user.email}</div>
          </div>
          <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" /> Sign out
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden h-14 border-b border-border flex items-center justify-between px-4 bg-card">
          <div className="flex items-center gap-2 font-display font-bold">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="mr-2">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            SwapnaAakar Admin
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
          </Button>
        </header>
        
        <div className="hidden md:flex h-14 border-b border-border items-center px-6 bg-card justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="-ml-3 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to website
          </Button>
        </div>
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
