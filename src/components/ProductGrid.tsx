import { useMemo, useRef } from "react";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useStorefront } from "@/context/StorefrontContext";
import { useNavigate } from "react-router-dom";

export const ProductGrid = () => {
  const { filter, products, loading } = useStorefront();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const visible = useMemo(() => {
    const filtered = filter === "All" ? products : products.filter((p) => p.category === filter);
    return filtered.slice(0, 8);
  }, [filter, products]);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.max(el.clientWidth * 0.85, 320);
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-muted mx-auto rounded"></div>
          <div className="h-4 w-48 bg-muted mx-auto rounded"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[3/4] bg-muted rounded-xl"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="flex flex-wrap items-end justify-between mb-10 gap-4">
        <div>
          <div className="text-sm text-muted-foreground font-mono mb-2">// FEATURED</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tighter">
            Drops you'll <span className="text-gradient-neon">obsess</span> over
          </h2>
        </div>
      </div>

      <div className="relative">
        <button
          aria-label="Scroll left"
          onClick={() => scrollBy(-1)}
          className="hidden md:grid absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 place-items-center rounded-full bg-card border border-border shadow-card hover:bg-foreground hover:text-background transition"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          aria-label="Scroll right"
          onClick={() => scrollBy(1)}
          className="hidden md:grid absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 place-items-center rounded-full bg-card border border-border shadow-card hover:bg-foreground hover:text-background transition"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div
          ref={scrollerRef}
          className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 -mx-4 px-4"
        >
          {visible.length > 0 ? (
            visible.map((p) => (
              <div
                key={p.id}
                className="snap-start shrink-0 w-[70%] sm:w-[45%] md:w-[32%] lg:w-[24%]"
              >
                <ProductCard product={p} />
              </div>
            ))
          ) : (
            <div className="w-full py-20 text-center text-muted-foreground">
              No products found in this category.
            </div>
          )}
        </div>
      </div>

      <div className="text-center mt-12">
        <Button 
          size="lg" 
          variant="outline" 
          className="border-border/60"
          onClick={() => navigate("/products")}
        >
          See More
        </Button>
      </div>
    </section>
  );
};
