import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";

const FAQS = [
  {
    q: "How long does delivery take?",
    a: "Orders are processed within 1–2 working days. After dispatch, delivery typically takes 5–10 working days depending on your location across India. Remote areas may take slightly longer.",
  },
  {
    q: "Can I return my order?",
    a: "Returns are only accepted if you receive a wrong product — i.e., different from what you ordered. We do not accept returns for change of mind, wrong selection, or preference issues, as all products are made-to-order. You must contact us within 48 hours of delivery with photo/video proof.",
  },
  {
    q: "How can I track my order?",
    a: "You can track your order by visiting our Track Order page and entering your Order ID (e.g. ORD-1746123456789). You can also find the Track Order button in your account dashboard under Order History.",
  },
  {
    q: "Are products customizable?",
    a: "Yes! Many of our products can be customized — from colours to specific character details. Please reach out to us via WhatsApp or email with your customization requirements before placing your order, and we'll confirm feasibility.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We currently support all major payment methods through our secure checkout gateway. Cash on Delivery (COD) is not available as all products are made-to-order.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-muted/30 transition-colors"
      >
        <span className="font-semibold">{q}</span>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
      </button>
      {open && (
        <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">
          {a}
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
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
            Frequently Asked <span className="text-gradient-neon">Questions</span>
          </h1>
          <p className="text-muted-foreground mt-4">Can't find the answer? <a href="/contact" className="text-primary underline">Contact us</a> and we'll be happy to help.</p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
