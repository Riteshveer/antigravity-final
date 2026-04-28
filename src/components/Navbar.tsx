import { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Search, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useStorefront, type Category } from "@/context/StorefrontContext";
import { toast } from "sonner";
import { LoginModal } from "./LoginModal";
import { useUserAuth } from "@/context/UserAuthContext";
import { UserDropdown } from "./UserDropdown";

const NAV: { label: string; category?: Category; target?: string }[] = [
  { label: "3D Figures", category: "3D Figures" },
  { label: "Anime", category: "Anime" },
  { label: "Lamps", category: "Lamps" },
  { label: "Posters", category: "Posters" },
  { label: "Reviews", target: "reviews" },
];

export const Navbar = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { count, openCart } = useCart();
  const { setFilter, openSearch } = useStorefront();
  const { user } = useUserAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isHomepage = location.pathname === "/";
  const isProductsPage = location.pathname === "/products";

  const handleNav = (item: (typeof NAV)[number]) => {
    if (item.category) {
      setFilter(item.category);
      if (!isHomepage && !isProductsPage) {
        navigate("/products");
      } else if (isHomepage) {
        document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
      }
    } else if (item.target) {
      if (isHomepage) {
        document.getElementById(item.target)?.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate("/#" + item.target);
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border/60">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-neon grid place-items-center font-display font-bold text-primary-foreground text-lg">
            S
          </div>
          <span className="font-display font-bold text-xl tracking-tight">
            Swapna<span className="text-gradient-neon">Aakar</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {NAV.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNav(item)}
              className="text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-foreground transition-all group-hover:w-full" />
            </button>
          ))}
          <Link 
            to="/products" 
            onClick={() => setFilter("All")}
            className="text-muted-foreground hover:text-foreground transition-colors relative group"
          >
            All Products
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-foreground transition-all group-hover:w-full" />
          </Link>
        </nav>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" aria-label="Search" onClick={openSearch}>
            <Search className="w-5 h-5" />
          </Button>
          {user ? (
            <UserDropdown />
          ) : (
            <Button variant="ghost" size="icon" aria-label="Account" onClick={() => setIsLoginModalOpen(true)}>
              <User className="w-5 h-5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Cart"
            className="relative"
            onClick={openCart}
          >
            <ShoppingBag className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-foreground text-background text-[10px] font-bold grid place-items-center">
                {count}
              </span>
            )}
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu" onClick={openSearch}>
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </header>
  );
};
