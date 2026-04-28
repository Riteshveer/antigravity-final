import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Categories } from "@/components/Categories";
import { ProductGrid } from "@/components/ProductGrid";
import { Reviews } from "@/components/Reviews";
import { Newsletter } from "@/components/Newsletter";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { SearchDialog } from "@/components/SearchDialog";
import { CartProvider } from "@/context/CartContext";
import { StorefrontProvider, useStorefront } from "@/context/StorefrontContext";

const Index = () => {
  const { setFilter } = useStorefront();

  useEffect(() => {
    setFilter("All");
  }, [setFilter]);

  return (
    <div className="min-h-screen">
      <Navbar />
          <main>
            <Hero />
            <Marquee />
            <Categories />
            <div id="products">
              <ProductGrid />
            </div>
            <Reviews />
            <Newsletter />
          </main>
      <Footer />
    </div>
  );
};

export default Index;
