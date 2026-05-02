import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { lazy, Suspense } from "react";

// Core pages
const Index = lazy(() => import("./pages/Index.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const UserDashboard = lazy(() => import("./pages/UserDashboard.tsx"));
const Checkout = lazy(() => import("./pages/Checkout.tsx"));
const Products = lazy(() => import("./pages/Products.tsx"));
const OrderTracking = lazy(() => import("./pages/OrderTracking.tsx"));
const ShopCategoryPage = lazy(() => import("./pages/ShopCategoryPage.tsx"));

// Help pages
const TrackOrderPage = lazy(() => import("./pages/TrackOrderPage.tsx"));
const ShippingPolicy = lazy(() => import("./pages/ShippingPolicy.tsx"));
const ReturnsPolicy = lazy(() => import("./pages/ReturnsPolicy.tsx"));
const FAQPage = lazy(() => import("./pages/FAQPage.tsx"));
const ContactPage = lazy(() => import("./pages/ContactPage.tsx"));

// Company pages
const AboutPage = lazy(() => import("./pages/AboutPage.tsx"));
const ReviewsPage = lazy(() => import("./pages/ReviewsPage.tsx"));
const CareersPage = lazy(() => import("./pages/CareersPage.tsx"));

// Admin pages
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin.tsx"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout.tsx"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.tsx"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts.tsx"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders.tsx"));
const AdminStock = lazy(() => import("./pages/admin/AdminStock.tsx"));
const AdminAnalytics = lazy(() => import("./pages/admin/AdminAnalytics.tsx"));

// Context & Global components
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
                <Suspense fallback={<div className="h-screen w-full flex items-center justify-center text-muted-foreground animate-pulse">Loading...</div>}>
                  <Routes>
                    {/* ── Core ── */}
                    <Route path="/" element={<Index />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/dashboard" element={<UserDashboard />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/track/:orderId" element={<OrderTracking />} />

                    {/* ── Shop by Category ── */}
                    <Route path="/shop/3d-figures" element={<ShopCategoryPage category="3D Figures" title="3D Figures" description="Browse our collection of premium 3D printed anime and pop-culture figures, handcrafted for true collectors." />} />
                    <Route path="/shop/anime" element={<ShopCategoryPage category="Anime" title="Anime Collection" description="Explore our iconic anime-inspired products — from legendary characters to fan-favourite scenes." />} />
                    <Route path="/shop/lamps" element={<ShopCategoryPage category="Lamps" title="Lamps" description="Illuminate your space with our unique 3D printed anime lamps — perfect for any room or desk setup." />} />
                    <Route path="/shop/posters" element={<ShopCategoryPage category="Posters" title="Posters" description="Decorate your walls with high-quality anime and pop-culture posters curated for fans." />} />
                    <Route path="/shop/new-arrivals" element={<ShopCategoryPage category="All" title="New Arrivals" description="Discover the latest additions to our collection — fresh drops from our workshop to your doorstep." />} />

                    {/* ── Help ── */}
                    <Route path="/track-order" element={<TrackOrderPage />} />
                    <Route path="/shipping-policy" element={<ShippingPolicy />} />
                    <Route path="/returns-policy" element={<ReturnsPolicy />} />
                    <Route path="/faq" element={<FAQPage />} />
                    <Route path="/contact" element={<ContactPage />} />

                    {/* ── Company ── */}
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/reviews" element={<ReviewsPage />} />
                    <Route path="/careers" element={<CareersPage />} />

                    {/* ── Admin ── */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route index element={<AdminDashboard />} />
                      <Route path="products" element={<AdminProducts />} />
                      <Route path="orders" element={<AdminOrders />} />
                      <Route path="stock" element={<AdminStock />} />
                      <Route path="analytics" element={<AdminAnalytics />} />
                    </Route>

                    {/* ── 404 ── */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
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
