import { Link } from "react-router-dom";
import { Instagram, Twitter, Youtube } from "lucide-react";

const FOOTER_LINKS = {
  Shop: [
    { label: "3D Figures", to: "/shop/3d-figures" },
    { label: "Anime", to: "/shop/anime" },
    { label: "Lamps", to: "/shop/lamps" },
    { label: "Posters", to: "/shop/posters" },
    { label: "New Arrivals", to: "/shop/new-arrivals" },
  ],
  Help: [
    { label: "Track Order", to: "/track-order" },
    { label: "Shipping", to: "/shipping-policy" },
    { label: "Returns", to: "/returns-policy" },
    { label: "FAQ", to: "/faq" },
    { label: "Contact", to: "/contact" },
  ],
  Company: [
    { label: "About", to: "/about" },
    { label: "Reviews", to: "/reviews" },
    { label: "Careers", to: "/careers" },
  ],
};

export const Footer = () => (
  <footer className="border-t border-border/50 mt-10">
    <div className="container mx-auto px-4 py-14">
      <div className="grid md:grid-cols-4 gap-10 mb-12">
        {/* Brand */}
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

        {/* Nav columns */}
        {Object.entries(FOOTER_LINKS).map(([title, links]) => (
          <div key={title}>
            <div className="font-display font-semibold mb-4">{title}</div>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-foreground transition">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-border flex flex-wrap justify-between gap-3 text-xs text-muted-foreground">
        <div>© {new Date().getFullYear()} SwapnaAakar. Made with ✦ in India.</div>
        <div className="flex gap-5">
          <Link to="/shipping-policy" className="hover:text-foreground">Privacy</Link>
          <Link to="/shipping-policy" className="hover:text-foreground">Terms</Link>
          <Link to="/returns-policy" className="hover:text-foreground">Refunds</Link>
        </div>
      </div>
    </div>
  </footer>
);
