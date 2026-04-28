import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, X } from "lucide-react";
import { useStorefront } from "@/context/StorefrontContext";
import { useMemo } from "react";


export const SearchDialog = () => {
  const { searchOpen, closeSearch, query, setQuery, setFilter, products } = useStorefront();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      )
      .slice(0, 8);
  }, [query, products]);

  const goToProducts = () => {
    closeSearch();
    requestAnimationFrame(() => {
      document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
    });
  };

  return (
    <Dialog open={searchOpen} onOpenChange={(o) => (o ? null : closeSearch())}>
      <DialogContent className="max-w-xl p-0 gap-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Search products</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <SearchIcon className="w-5 h-5 text-muted-foreground shrink-0" />
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search figures, anime, lamps, posters..."
            className="border-0 focus-visible:ring-0 shadow-none px-0 h-10 text-base"
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Clear" className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {!query.trim() ? (
            <div className="p-6">
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Popular categories</div>
              <div className="flex flex-wrap gap-2">
                {(["3D Figures", "Anime", "Lamps", "Posters"] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setFilter(c);
                      goToProducts();
                    }}
                    className="px-3 py-1.5 rounded-full border border-border text-sm hover:bg-foreground hover:text-background transition"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No products found for "{query}"
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {results.map((p) => (
                <li key={p.id}>
                  <button
                    onClick={() => {
                      setFilter(p.category);
                      goToProducts();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition text-left"
                  >
                    <img src={p.images?.[0] ?? ""} alt={p.name} className="w-12 h-12 rounded-md object-cover bg-muted" />

                    <div className="flex-1 min-w-0">
                      <div className="font-medium leading-tight line-clamp-1">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.category}</div>
                    </div>
                    <div className="font-display font-bold text-sm">₹{p.price.toLocaleString("en-IN")}</div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
