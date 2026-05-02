import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Star, Quote, ArrowLeft } from "lucide-react";
import { useStorefront } from "@/context/StorefrontContext";
import { WriteReviewDialog } from "@/components/WriteReviewDialog";
import { useUserAuth } from "@/context/UserAuthContext";
import { useState } from "react";
import { LoginModal } from "@/components/LoginModal";
import { Button } from "@/components/ui/button";

export default function ReviewsPage() {
  const navigate = useNavigate();
  const { reviews } = useStorefront();
  const { user } = useUserAuth();
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-16">
        <Button variant="ghost" className="mb-6 -ml-4 text-muted-foreground hover:text-foreground" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
        </Button>
        <div className="mb-10 text-center">
          <div className="text-sm text-muted-foreground font-mono mb-2">// COMPANY</div>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tighter">
            Customer <span className="text-gradient-neon">Reviews</span>
          </h1>
          <p className="text-muted-foreground mt-4 max-w-md mx-auto">
            Real reviews from real collectors across India.
          </p>

          {!user && (
            <Button className="mt-6" onClick={() => setLoginOpen(true)}>
              Sign in to Leave a Review
            </Button>
          )}
        </div>

        {reviews.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            <Quote className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-semibold">No reviews yet.</p>
            <p className="text-sm mt-1">Be the first to share your experience after purchasing!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="relative p-6 rounded-2xl bg-gradient-card border border-border hover:border-primary/40 transition-all"
              >
                <Quote className="absolute top-5 right-5 w-7 h-7 text-primary/20" />
                <div className="flex gap-0.5 mb-3">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-5 text-foreground/90">"{r.text}"</p>
                <div className="pt-4 border-t border-border">
                  <div className="font-display font-semibold">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.city} · {r.productName}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
      <Footer />
    </div>
  );
}
