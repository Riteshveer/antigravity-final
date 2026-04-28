import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import UserDashboard from "./pages/UserDashboard.tsx";
import Checkout from "./pages/Checkout.tsx";
import Products from "./pages/Products.tsx";
import AdminLogin from "./pages/admin/AdminLogin.tsx";
import AdminLayout from "./pages/admin/AdminLayout.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import AdminProducts from "./pages/admin/AdminProducts.tsx";
import AdminStock from "./pages/admin/AdminStock.tsx";
import AdminAnalytics from "./pages/admin/AdminAnalytics.tsx";
import { AdminAuthProvider } from "./context/AdminAuthContext.tsx";
import { UserAuthProvider } from "./context/UserAuthContext.tsx";
import { CartProvider } from "./context/CartContext.tsx";
import { StorefrontProvider } from "./context/StorefrontContext.tsx";
import { CartDrawer } from "./components/CartDrawer.tsx";
import { SearchDialog } from "./components/SearchDialog.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AdminAuthProvider>
          <UserAuthProvider>
            <StorefrontProvider>
              <CartProvider>
                <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/products" element={<Products />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="stock" element={<AdminStock />} />
              <Route path="analytics" element={<AdminAnalytics />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <CartDrawer />
          <SearchDialog />
          </CartProvider>
          </StorefrontProvider>
          </UserAuthProvider>
        </AdminAuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
