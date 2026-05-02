import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Truck, Clock, AlertCircle, ArrowLeft } from "lucide-react";

export default function ShippingPolicy() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-16 max-w-3xl">
        <Button variant="ghost" className="mb-6 -ml-4 text-muted-foreground hover:text-foreground" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
        </Button>
        <div className="mb-10">
          <div className="text-sm text-muted-foreground font-mono mb-2">// HELP</div>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tighter">
            Shipping <span className="text-gradient-neon">Policy</span>
          </h1>
        </div>

        <div className="space-y-6 text-foreground/90">
          <div className="flex gap-4 p-6 rounded-2xl bg-gradient-card border border-border">
            <Clock className="w-6 h-6 text-primary shrink-0 mt-0.5" />
            <div>
              <h2 className="font-display font-semibold text-lg mb-1">Processing Time</h2>
              <p className="text-muted-foreground leading-relaxed">
                Orders are processed within <strong>1–2 working days</strong> from the date of purchase. You will
                receive a confirmation email once your order is dispatched.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-6 rounded-2xl bg-gradient-card border border-border">
            <Truck className="w-6 h-6 text-primary shrink-0 mt-0.5" />
            <div>
              <h2 className="font-display font-semibold text-lg mb-1">Delivery Timeline</h2>
              <p className="text-muted-foreground leading-relaxed">
                Delivery timelines depend on your <strong>location and courier partner</strong>. Estimated delivery
                is typically <strong>5–10 working days</strong> after dispatch for most locations across India.
                Remote or pin-code restricted areas may take longer.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-6 rounded-2xl bg-gradient-card border border-border">
            <AlertCircle className="w-6 h-6 text-accent shrink-0 mt-0.5" />
            <div>
              <h2 className="font-display font-semibold text-lg mb-1">Possible Delays</h2>
              <p className="text-muted-foreground leading-relaxed">
                Delays may occur due to unforeseen circumstances or logistics issues, including but not limited to
                public holidays, natural events, or courier network disruptions. We appreciate your patience and
                will keep you informed of any significant delays.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-card border border-border">
            <h2 className="font-display font-semibold text-lg mb-3">Shipping Rates</h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex justify-between py-2 border-b border-border">
                <span>Standard Delivery</span>
                <span className="font-semibold text-foreground">Free on all orders</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Coverage</span>
                <span className="font-semibold text-foreground">Pan India</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            For any shipping-related queries, please{" "}
            <a href="/contact" className="text-primary underline">contact us</a>.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
