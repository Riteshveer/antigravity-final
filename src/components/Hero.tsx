import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
const hero = "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600&auto=format&fit=crop";


const scrollToProducts = () => {
  document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
};

export const Hero = () => (
  <section className="relative overflow-hidden">
    <div className="absolute inset-0 bg-grid opacity-30" />
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

    <div className="container mx-auto px-4 pt-16 pb-24 md:pt-24 md:pb-32 relative">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Festive Sale — up to <span className="text-foreground font-semibold">40% off</span></span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold leading-[0.95] tracking-tighter">
            Shape your <br />
            <span className="text-gradient-neon">dreams.</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
            Premium 3D figures, anime collectibles, glowing lamps and gallery-grade posters. Made in India, built for fandoms.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              onClick={scrollToProducts}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold border-0 shadow-neon group"
            >
              Shop Collection
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={scrollToProducts}
              className="border-border/60 hover:bg-muted backdrop-blur"
            >
              Browse Anime
            </Button>
          </div>

          <div className="flex items-center gap-6 pt-4 text-sm text-muted-foreground">
            <div><div className="text-2xl font-display font-bold text-foreground">12K+</div>Happy fans</div>
            <div className="w-px h-10 bg-border" />
            <div><div className="text-2xl font-display font-bold text-foreground">4.9★</div>Avg rating</div>
            <div className="w-px h-10 bg-border" />
            <div><div className="text-2xl font-display font-bold text-foreground">48h</div>Pan-India ship</div>
          </div>
        </div>

        <div className="relative animate-float">
          <div className="absolute inset-0 bg-gradient-neon blur-3xl opacity-30 rounded-full" />
          <img
            src={hero}
            alt="Featured neon-lit anime collectible figure"
            width={1600}
            height={1200}
            className="relative rounded-3xl shadow-elevated w-full h-auto"
          />
          <div className="absolute -bottom-6 -left-6 px-5 py-3 rounded-2xl bg-card/90 backdrop-blur-xl border border-border shadow-card">
            <div className="text-xs text-muted-foreground">Limited drop</div>
            <div className="font-display font-bold">Mystic Series 01</div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
