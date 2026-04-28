import { Instagram, Twitter, Youtube } from "lucide-react";

export const Footer = () => (
  <footer className="border-t border-border/50 mt-10">
    <div className="container mx-auto px-4 py-14">
      <div className="grid md:grid-cols-4 gap-10 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-neon grid place-items-center font-display font-bold text-primary-foreground">S</div>
            <span className="font-display font-bold text-xl">Swapna<span className="text-gradient-neon">Aakar</span></span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">Shape of dreams. Premium collectibles for Indian fandoms.</p>
          <div className="flex gap-3 mt-5">
            {[Instagram, Twitter, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-full border border-border grid place-items-center hover:border-primary hover:text-primary transition" aria-label="Social link">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {[
          { title: "Shop", links: ["3D Figures", "Anime", "Lamps", "Posters", "New Arrivals"] },
          { title: "Help", links: ["Track Order", "Shipping", "Returns", "FAQ", "Contact"] },
          { title: "Company", links: ["About", "Reviews", "Blog", "Request a Model", "Careers"] },
        ].map((col) => (
          <div key={col.title}>
            <div className="font-display font-semibold mb-4">{col.title}</div>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {col.links.map((l) => <li key={l}><a href="#" className="hover:text-foreground transition">{l}</a></li>)}
            </ul>
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-border flex flex-wrap justify-between gap-3 text-xs text-muted-foreground">
        <div>© {new Date().getFullYear()} SwapnaAakar. Made with ✦ in India.</div>
        <div className="flex gap-5">
          <a href="#" className="hover:text-foreground">Privacy</a>
          <a href="#" className="hover:text-foreground">Terms</a>
          <a href="#" className="hover:text-foreground">Refunds</a>
        </div>
      </div>
    </div>
  </footer>
);
