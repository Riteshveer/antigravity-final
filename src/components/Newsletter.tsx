import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { toast } from "sonner";

export const Newsletter = () => {
  const [email, setEmail] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("You're in! Check your inbox for 10% off.");
    setEmail("");
  };

  return (
  <section className="container mx-auto px-4 py-20">
    <div className="relative overflow-hidden rounded-3xl border border-border p-10 md:p-16 text-center bg-gradient-card">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-secondary/30 rounded-full blur-3xl" />

      <div className="relative max-w-xl mx-auto space-y-6">
        <div className="inline-grid place-items-center w-14 h-14 rounded-2xl bg-gradient-neon shadow-neon">
          <Mail className="w-6 h-6 text-primary-foreground" />
        </div>
        <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tighter">
          Get early access to <span className="text-gradient-neon">drops</span>
        </h2>
        <p className="text-muted-foreground">Join 8,000+ fans. Exclusive previews, restock alerts, and 10% off your first order.</p>

        <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@dreamer.in"
            className="flex-1 px-5 py-3 rounded-xl bg-card border border-border focus:border-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition"
          />
          <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 px-6">
            Subscribe
          </Button>
        </form>
      </div>
    </div>
  </section>
  );
};
