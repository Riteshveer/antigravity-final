import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useStorefront } from "@/context/StorefrontContext";
import { ProductCard } from "@/components/ProductCard";
import { useMemo } from "react";
import type { Category } from "@/context/StorefrontContext";

interface ShopCategoryPageProps {
  category: Category;
  title: string;
  description: string;
}

export default function ShopCategoryPage({ category, title, description }: ShopCategoryPageProps) {
  const navigate = useNavigate();
  const { products, loading } = useStorefront();

  const visible = useMemo(
    () => products.filter((p) => p.category === category),
    [products, category]
  );

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        <Button
          variant="ghost"
          className="mb-8 -ml-4 text-muted-foreground hover:text-foreground"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>

        <div className="mb-10">
          <div className="text-sm text-muted-foreground font-mono mb-2">// {category.toUpperCase()}</div>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tighter">
            {title}
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl">{description}</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-[3/4] bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        ) : visible.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {visible.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-muted-foreground">
            No products found in this category yet. Check back soon!
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
