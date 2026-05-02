import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminApi, type OrderTracking } from "@/lib/adminApi";
import { Loader2, Search, CheckCircle2, Circle, Clock, Package, Truck, MapPin, CheckSquare, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const STATUS_STEPS = [
  { id: "Placed", icon: Clock, label: "Placed" },
  { id: "Confirmed", icon: CheckCircle2, label: "Confirmed" },
  { id: "Packed", icon: Package, label: "Packed" },
  { id: "Shipped", icon: Truck, label: "Shipped" },
  { id: "Out for Delivery", icon: MapPin, label: "Out for Delivery" },
  { id: "Delivered", icon: CheckSquare, label: "Delivered" },
];

export default function TrackOrderPage() {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [tracking, setTracking] = useState<OrderTracking | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async () => {
    if (!orderId.trim()) return;
    setLoading(true);
    setError(null);
    setTracking(null);
    try {
      const data = await adminApi.getTracking(orderId.trim());
      setTracking(data);
    } catch {
      setError("Order not found. Please check your Order ID and try again.");
    } finally {
      setLoading(false);
    }
  };

  const currentStepIndex = tracking ? STATUS_STEPS.findIndex((s) => s.id === tracking.currentStatus) : -1;
  const isCancelled = tracking?.currentStatus === "Cancelled";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-16 max-w-3xl">
        <Button variant="ghost" className="mb-6 -ml-4 text-muted-foreground hover:text-foreground" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
        </Button>
        <div className="mb-10">
          <div className="text-sm text-muted-foreground font-mono mb-2">// ORDER TRACKING</div>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tighter">
            Track Your <span className="text-gradient-neon">Order</span>
          </h1>
          <p className="text-muted-foreground mt-4">Enter your Order ID to see the current status of your shipment.</p>
        </div>

        {/* Search Input */}
        <div className="flex gap-3 mb-10">
          <Input
            placeholder="e.g. ORD-1746123456789"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleTrack()}
            className="font-mono"
          />
          <Button onClick={handleTrack} disabled={loading || !orderId.trim()}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span className="ml-2">Track</span>
          </Button>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm mb-6">{error}</div>
        )}

        {/* Result */}
        {tracking && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground font-mono">{tracking.orderId}</p>
                <h2 className="font-display text-2xl font-bold">Order Status</h2>
              </div>
              <Badge
                variant={isCancelled ? "destructive" : "default"}
                className="text-sm px-4 py-1 self-start sm:self-auto"
              >
                {tracking.currentStatus}
              </Badge>
            </div>

            {/* Progress stepper */}
            {!isCancelled && (
              <Card className="border-none shadow-sm overflow-hidden">
                <CardContent className="pt-8 pb-12">
                  <div className="relative flex justify-between">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-muted -translate-y-1/2 z-0" />
                    <div
                      className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 z-0 transition-all duration-500"
                      style={{ width: `${currentStepIndex >= 0 ? (currentStepIndex / (STATUS_STEPS.length - 1)) * 100 : 0}%` }}
                    />
                    {STATUS_STEPS.map((step, index) => {
                      const Icon = step.icon;
                      const isCompleted = index <= currentStepIndex;
                      const isCurrent = index === currentStepIndex;
                      return (
                        <div key={step.id} className="relative z-10 flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                            isCompleted ? "bg-primary text-primary-foreground" : "bg-background border-2 border-muted text-muted-foreground"
                          } ${isCurrent ? "ring-4 ring-primary/20" : ""}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className={`absolute top-12 whitespace-nowrap text-[10px] font-medium uppercase tracking-wider ${
                            isCompleted ? "text-primary" : "text-muted-foreground"
                          } ${isCurrent ? "font-bold" : ""}`}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Timeline */}
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-muted-foreground" /> Order Timeline
              </h3>
              <div className="space-y-0 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-muted">
                {tracking.timeline.map((item, index) => (
                  <div key={index} className="relative pl-10 pb-8 last:pb-0">
                    <div className={`absolute left-0 top-1.5 w-9 h-9 rounded-full border-4 border-background flex items-center justify-center z-10 ${
                      index === 0 ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-muted-foreground"
                    }`}>
                      {index === 0 ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-2 h-2 fill-current" />}
                    </div>
                    <div className={index === 0 ? "bg-card p-4 rounded-xl shadow-sm border border-border" : "pt-1"}>
                      <div className="flex justify-between items-start mb-1">
                        <h4 className={`font-bold ${index === 0 ? "text-primary" : "text-foreground"}`}>{item.status}</h4>
                        <span className="text-[10px] text-muted-foreground uppercase font-medium bg-muted px-2 py-0.5 rounded">
                          {new Date(item.time).toLocaleDateString()} {new Date(item.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      {item.location && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                          <MapPin className="w-3 h-3" /> {item.location}
                        </div>
                      )}
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
