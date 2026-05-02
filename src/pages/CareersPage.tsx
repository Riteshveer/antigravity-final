import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { BriefcaseBusiness, Heart, Mail, ArrowLeft } from "lucide-react";

export default function CareersPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-16 max-w-3xl">
        <Button variant="ghost" className="mb-6 -ml-4 text-muted-foreground hover:text-foreground" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
        </Button>
        <div className="mb-10">
          <div className="text-sm text-muted-foreground font-mono mb-2">// COMPANY</div>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tighter">
            Careers at <span className="text-gradient-neon">SwapnaAakar</span>
          </h1>
        </div>

        <div className="space-y-6">
          <div className="flex gap-4 p-8 rounded-2xl bg-gradient-card border border-border">
            <BriefcaseBusiness className="w-8 h-8 text-muted-foreground shrink-0 mt-1" />
            <div>
              <h2 className="font-display text-xl font-semibold mb-2">No Open Positions</h2>
              <p className="text-muted-foreground leading-relaxed">
                We are <strong>currently not hiring</strong>, but we're always happy to connect with passionate
                people. Feel free to reach out for future opportunities — we'd love to keep in touch!
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-8 rounded-2xl bg-gradient-card border border-border">
            <Heart className="w-8 h-8 text-primary shrink-0 mt-1" />
            <div>
              <h2 className="font-display text-xl font-semibold mb-2">Who We're Looking For</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                When opportunities open up, we look for people who are:
              </p>
              <ul className="space-y-1.5 text-sm text-muted-foreground list-disc list-inside">
                <li>Passionate about anime, 3D printing, or collectibles</li>
                <li>Creative and detail-oriented</li>
                <li>Enthusiastic about delivering excellent customer experiences</li>
                <li>Self-driven and comfortable in a small, fast-moving team</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-4 p-8 rounded-2xl bg-gradient-card border border-border">
            <Mail className="w-8 h-8 text-primary shrink-0 mt-1" />
            <div>
              <h2 className="font-display text-xl font-semibold mb-2">Stay in Touch</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Send us your portfolio or a short note about yourself to:
              </p>
              <a
                href="mailto:Swapnaaakar@gmail.com"
                className="inline-flex items-center gap-2 text-primary font-semibold underline underline-offset-4"
              >
                <Mail className="w-4 h-4" />
                Swapnaaakar@gmail.com
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
