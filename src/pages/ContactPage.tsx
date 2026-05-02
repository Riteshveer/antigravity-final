import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageCircle, Send, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    setSending(true);
    // Simulate submission (replace with real API call if needed)
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    toast.success("Message sent! We'll get back to you soon.");
    setName(""); setEmail(""); setMessage("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-16 max-w-5xl">
        <Button variant="ghost" className="mb-6 -ml-4 text-muted-foreground hover:text-foreground" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
        </Button>
        <div className="mb-10">
          <div className="text-sm text-muted-foreground font-mono mb-2">// HELP</div>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tighter">
            Get in <span className="text-gradient-neon">Touch</span>
          </h1>
          <p className="text-muted-foreground mt-4 max-w-xl">
            Have a question, customization request, or just want to say hi? We'd love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <a
              href="mailto:Swapnaaakar@gmail.com"
              className="flex gap-4 items-start p-6 rounded-2xl bg-gradient-card border border-border hover:border-primary/50 transition-colors group"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-display font-semibold mb-0.5">Email Us</div>
                <div className="text-sm text-muted-foreground">Swapnaaakar@gmail.com</div>
                <div className="text-xs text-muted-foreground mt-1">We typically reply within 24 hours</div>
              </div>
            </a>

            <a
              href="https://wa.me/qr/EWLZPYSYCBOQA1"
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-4 items-start p-6 rounded-2xl bg-gradient-card border border-border hover:border-green-500/50 transition-colors group"
            >
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0 group-hover:bg-green-500/20 transition-colors">
                <MessageCircle className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <div className="font-display font-semibold mb-0.5">WhatsApp</div>
                <div className="text-sm text-muted-foreground">Chat with us directly</div>
                <div className="text-xs text-muted-foreground mt-1">Fastest way to reach us</div>
              </div>
            </a>

            <div className="p-6 rounded-2xl bg-gradient-card border border-border">
              <div className="font-display font-semibold mb-2">Business Hours</div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Monday – Saturday</span>
                  <span>10:00 AM – 7:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Your Name</label>
              <Input
                placeholder="Aarav Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Email Address</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Message</label>
              <Textarea
                placeholder="Tell us what's on your mind..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={sending}>
              {sending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
              {sending ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
