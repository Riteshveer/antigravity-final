import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2, XCircle, PackageX, Camera, ArrowLeft } from "lucide-react";

export default function ReturnsPolicy() {
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
            Returns &amp; <span className="text-gradient-neon">Refunds</span>
          </h1>
        </div>

        <div className="space-y-6 text-foreground/90">
          {/* Main notice */}
          <div className="flex gap-4 p-6 rounded-2xl bg-destructive/5 border border-destructive/20">
            <AlertTriangle className="w-6 h-6 text-destructive shrink-0 mt-0.5" />
            <div>
              <h2 className="font-display font-semibold text-lg mb-1 text-destructive">Made-to-Order Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We produce all products <strong>on demand</strong>. Therefore, returns are <strong>NOT accepted</strong>{" "}
                for change of mind, incorrect selection, or personal preference issues. Please review your order
                carefully before placing it.
              </p>
            </div>
          </div>

          {/* When returns are allowed */}
          <div className="flex gap-4 p-6 rounded-2xl bg-gradient-card border border-border">
            <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
            <div>
              <h2 className="font-display font-semibold text-lg mb-2">When Are Returns Allowed?</h2>
              <p className="text-muted-foreground leading-relaxed">
                Returns are <strong>only accepted if you receive a wrong product</strong> — i.e., the item you received
                is different from what you ordered.
              </p>
            </div>
          </div>

          {/* How to request */}
          <div className="p-6 rounded-2xl bg-gradient-card border border-border">
            <div className="flex gap-3 items-center mb-4">
              <Camera className="w-6 h-6 text-primary" />
              <h2 className="font-display font-semibold text-lg">How to Request a Return</h2>
            </div>
            <ol className="space-y-3 text-muted-foreground text-sm list-decimal list-inside">
              <li>Contact us <strong>within 48 hours of delivery</strong> at <a href="mailto:Swapnaaakar@gmail.com" className="text-primary underline">Swapnaaakar@gmail.com</a></li>
              <li>Provide your <strong>Order ID</strong></li>
              <li>Include clear <strong>photo or video proof</strong> of the wrong item received</li>
            </ol>
          </div>

          {/* Conditions */}
          <div className="p-6 rounded-2xl bg-gradient-card border border-border">
            <h2 className="font-display font-semibold text-lg mb-3">Return Conditions</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {["Product must be unused and in its original condition", "Must be in original packaging", "Return shipping charges are to be paid by the customer"].map((c) => (
                <li key={c} className="flex gap-2 items-start">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  {c}
                </li>
              ))}
            </ul>
          </div>

          {/* After verification */}
          <div className="p-6 rounded-2xl bg-gradient-card border border-border">
            <h2 className="font-display font-semibold text-lg mb-3">After Verification</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Once the return is verified, we will issue a <strong>replacement</strong>. If a replacement is not
              possible, a <strong>full refund</strong> will be processed to your original payment method within
              5–7 business days.
            </p>
          </div>

          {/* Non-returnable */}
          <div className="flex gap-4 p-6 rounded-2xl bg-destructive/5 border border-destructive/20">
            <XCircle className="w-6 h-6 text-destructive shrink-0 mt-0.5" />
            <div>
              <h2 className="font-display font-semibold text-lg mb-2 text-destructive">Non-Returnable Cases</h2>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {[
                  "Wrong order placed by the customer",
                  "Product no longer needed",
                  "No defect or damage found",
                  "Minor colour differences due to screen/display settings",
                ].map((c) => (
                  <li key={c} className="flex gap-2">
                    <XCircle className="w-3.5 h-3.5 text-destructive mt-0.5 shrink-0" /> {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-border bg-muted/30">
            <div className="flex gap-2 items-center mb-1">
              <PackageX className="w-4 h-4 text-muted-foreground" />
              <span className="font-semibold text-sm">Important</span>
            </div>
            <p className="text-sm text-muted-foreground">
              All products at SwapnaAakar are <strong>made specifically for each individual order</strong>. This
              is why we take quality very seriously and carefully review each return request.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
