import { ArrowUpRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useStorefront } from "@/context/StorefrontContext";

const cats = [
  { name: "3D Figures", img: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=800&auto=format&fit=crop", count: "120+ items", accent: "from-primary/40 to-transparent" },
  { name: "Anime", img: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop", count: "85+ items", accent: "from-secondary/40 to-transparent" },
  { name: "Lamps", img: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?q=80&w=800&auto=format&fit=crop", count: "40+ items", accent: "from-accent/40 to-transparent" },
  { name: "Posters", img: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=800&auto=format&fit=crop", count: "200+ designs", accent: "from-primary/40 to-transparent" },
];

export const Categories = () => {
  const navigate = useNavigate();
  const { setFilter, products } = useStorefront();

  const getCategoryCount = (categoryName: string) => {
    return products.filter((p) => p.category === categoryName).length;
  };

  const handleCategoryClick = (category: string) => {
    setFilter(category as any);
    navigate("/products");
  };

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="flex items-end justify-between mb-10 gap-4">
        <div>
          <div className="text-sm text-secondary font-mono mb-2">// COLLECTIONS</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tighter">Shop by category</h2>
        </div>
        <Link 
          to="/products" 
          onClick={() => setFilter("All")}
          className="text-sm text-muted-foreground hover:text-foreground hidden sm:flex items-center gap-1"
        >
          View all <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {cats.map((c) => (
          <button 
            key={c.name} 
            onClick={() => handleCategoryClick(c.name)}
            className="group relative aspect-[4/5] rounded-2xl overflow-hidden border border-border bg-card hover:border-primary/50 transition-all duration-500 text-left"
          >
            <img src={c.img} alt={c.name} loading="lazy" width={800} height={1024} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className={`absolute inset-0 bg-gradient-to-t ${c.accent} via-background/40 to-background/90`} />
            <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between">
              <div>
                <h3 className="font-display text-xl md:text-2xl font-bold">{c.name}</h3>
                <p className="text-sm text-muted-foreground">{getCategoryCount(c.name)} items</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-foreground text-background grid place-items-center group-hover:bg-gradient-neon group-hover:text-primary-foreground transition-all">
                <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};
