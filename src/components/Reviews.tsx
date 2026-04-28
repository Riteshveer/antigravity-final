import { Star, Quote } from "lucide-react";
import { useStorefront } from "@/context/StorefrontContext";

export const Reviews = () => {
  const { reviews } = useStorefront();
  const visible = reviews.slice(0, 8);

  return (
    <section id="reviews" className="container mx-auto px-4 py-20">
      <div className="text-center mb-14">
        <div className="text-sm text-secondary font-mono mb-2">// LOVED BY</div>
        <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tighter">12,000+ collectors</h2>
        <p className="text-muted-foreground mt-3 max-w-md mx-auto">Real reviews from real fans across India.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {visible.map((r) => (
          <div key={r.id} className="relative p-6 rounded-2xl bg-gradient-card border border-border hover:border-primary/40 transition-all">
            <Quote className="absolute top-5 right-5 w-7 h-7 text-primary/30" />
            <div className="flex gap-0.5 mb-3">
              {[...Array(r.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-accent text-accent" />)}
            </div>
            <p className="text-sm leading-relaxed mb-5 text-foreground/90">"{r.text}"</p>
            <div className="pt-4 border-t border-border">
              <div className="font-display font-semibold">{r.name}</div>
              <div className="text-xs text-muted-foreground">{r.city} · {r.productName}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
