import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useStorefront } from "@/context/StorefrontContext";
import { useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Products = () => {
  const { filter, products, loading } = useStorefront();
  const navigate = useNavigate();

  const visible = useMemo(
    () => (filter === "All" ? products : products.filter((p) => p.category === filter)),
    [filter, products]
  );

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-20">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-64 bg-muted rounded"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="aspect-[3/4] bg-muted rounded-xl"></div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-20">
        <Button 
          variant="ghost" 
          className="mb-8 -ml-4 text-muted-foreground hover:text-foreground"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>

        <div className="mb-10">
          <div className="text-sm text-muted-foreground font-mono mb-2">// COLLECTION</div>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tighter">
            All <span className="text-gradient-neon">Products</span>
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl">
            Explore our complete collection of products. Use the category filters to narrow down your search.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {visible.length > 0 ? (
            visible.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-muted-foreground">
              No products found in this category.
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Products;
