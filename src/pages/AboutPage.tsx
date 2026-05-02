import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Box, Sparkles, Heart, MapPin, ArrowLeft } from "lucide-react";

// Use a simple emoji/lucide approach – no external images needed
const MILESTONES = [
  { year: "2022", text: "SwapnaAakar was born from a passion for anime and 3D printing." },
  { year: "2023", text: "Expanded to lamps, posters, and custom collectibles." },
  { year: "2024", text: "Reached 12,000+ happy collectors across India." },
  { year: "2025", text: "Launched our online store with pan-India shipping." },
];

export default function AboutPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-16 max-w-4xl">
        <Button variant="ghost" className="mb-6 -ml-4 text-muted-foreground hover:text-foreground" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
        </Button>
        <div className="mb-10">
          <div className="text-sm text-muted-foreground font-mono mb-2">// COMPANY</div>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tighter">
            About <span className="text-gradient-neon">SwapnaAakar</span>
          </h1>
        </div>

        {/* Hero statement */}
        <p className="text-xl text-foreground/80 leading-relaxed mb-12 max-w-2xl">
          SwapnaAakar specializes in <strong>custom 3D printed products</strong>, including anime figures, lamps, and
          personalized designs — bringing your favourite characters and dreams to life, one print at a time.
        </p>

        {/* Values */}
        <div className="grid sm:grid-cols-3 gap-6 mb-16">
          {[
            { icon: Sparkles, title: "Premium Quality", desc: "Every product is carefully 3D printed and finished with attention to detail." },
            { icon: Heart, title: "Fan-Made with Love", desc: "We are fans ourselves. We understand what quality means to collectors." },
            { icon: MapPin, title: "Made in India", desc: "Proudly Indian-made, shipped across the entire country." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-6 rounded-2xl bg-gradient-card border border-border">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display font-semibold mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Our Story / Timeline */}
        <div className="mb-12">
          <h2 className="font-display text-2xl font-bold mb-8">Our Journey</h2>
          <div className="space-y-0 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
            {MILESTONES.map((m, i) => (
              <div key={m.year} className="relative pl-12 pb-8 last:pb-0">
                <div className={`absolute left-0 top-1 w-10 h-10 rounded-full border-4 border-background flex items-center justify-center z-10 text-xs font-bold ${
                  i === MILESTONES.length - 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {m.year.slice(2)}
                </div>
                <div className="pt-1.5">
                  <div className="font-semibold mb-1">{m.year}</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{m.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="p-8 rounded-2xl bg-gradient-card border border-border text-center">
          <Box className="w-10 h-10 text-primary mx-auto mb-4" />
          <h3 className="font-display text-2xl font-bold mb-2">Have a custom idea?</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            We love bringing unique ideas to life. Reach out and let's create something amazing together.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition"
          >
            Contact Us
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
