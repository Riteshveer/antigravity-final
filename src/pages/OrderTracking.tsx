import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminApi, type OrderTracking } from "@/lib/adminApi";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, CheckCircle2, Circle, Clock, Package, Truck, MapPin, CheckSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const STATUS_STEPS = [
  { id: "Placed", icon: Clock, label: "Placed" },
  { id: "Confirmed", icon: CheckCircle2, label: "Confirmed" },
  { id: "Packed", icon: Package, label: "Packed" },
  { id: "Shipped", icon: Truck, label: "Shipped" },
  { id: "Out for Delivery", icon: MapPin, label: "Out for Delivery" },
  { id: "Delivered", icon: CheckSquare, label: "Delivered" }
];

export default function OrderTrackingPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [tracking, setTracking] = useState<OrderTracking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      adminApi.getTracking(orderId)
        .then(setTracking)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !tracking) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
          <p className="text-muted-foreground mb-6">We couldn't find the tracking information for this order.</p>
          <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const currentStepIndex = STATUS_STEPS.findIndex(s => s.id === tracking.currentStatus);
  const isCancelled = tracking.currentStatus === "Cancelled";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/30">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-10 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-6 -ml-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Button>

        <div className="space-y-8">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold">Track Order</h1>
              <p className="text-muted-foreground font-mono text-sm mt-1">ID: {orderId}</p>
            </div>
            <Badge variant={isCancelled ? "destructive" : "default"} className="text-sm px-4 py-1">
              {tracking.currentStatus}
            </Badge>
          </header>

          {/* Progress Bar */}
          {!isCancelled && (
            <Card className="border-none shadow-sm overflow-hidden">
              <CardContent className="pt-8 pb-10">
                <div className="relative flex justify-between">
                  {/* Background Line */}
                  <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
                  
                  {/* Active Line */}
                  <div 
                    className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 z-0 transition-all duration-500" 
                    style={{ width: `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
                  />

                  {STATUS_STEPS.map((step, index) => {
                    const Icon = step.icon;
                    const isCompleted = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;

                    return (
                      <div key={step.id} className="relative z-10 flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isCompleted ? "bg-primary text-primary-foreground" : "bg-white border-2 border-slate-100 text-slate-300"
                        } ${isCurrent ? "ring-4 ring-primary/20 animate-pulse-glow" : ""}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className={`absolute top-12 whitespace-nowrap text-[10px] font-medium uppercase tracking-wider ${
                          isCompleted ? "text-primary" : "text-slate-400"
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

          {isCancelled && (
            <Card className="border-red-100 bg-red-50/30">
              <CardContent className="p-6 flex items-center gap-4 text-red-700">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold">This order was cancelled</h3>
                  <p className="text-sm">If you believe this is an error, please contact support.</p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid md:grid-cols-3 gap-8">
            {/* Timeline */}
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Clock className="w-5 h-5 text-muted-foreground" />
                Order Timeline
              </h3>
              <div className="space-y-0 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                {tracking.timeline.map((item, index) => (
                  <div key={index} className="relative pl-10 pb-8 last:pb-0">
                    <div className={`absolute left-0 top-1.5 w-[36px] h-[36px] rounded-full border-4 border-white flex items-center justify-center z-10 ${
                      index === 0 ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" : "bg-slate-100 text-slate-400"
                    }`}>
                      {index === 0 ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-2 h-2 fill-current" />}
                    </div>
                    <div className={index === 0 ? "bg-white p-4 rounded-xl shadow-sm border border-slate-100" : ""}>
                      <div className="flex justify-between items-start mb-1">
                        <h4 className={`font-bold ${index === 0 ? "text-primary" : "text-slate-700"}`}>{item.status}</h4>
                        <span className="text-[10px] text-muted-foreground uppercase font-medium bg-slate-50 px-2 py-0.5 rounded border">
                          {new Date(item.time).toLocaleDateString()} {new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {item.location && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
                          <MapPin className="w-3 h-3" />
                          {item.location}
                        </div>
                      )}
                      <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Support Card */}
            <div className="space-y-4">
              <Card className="bg-primary text-primary-foreground overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-primary-foreground/80">
                    Questions about your order? Our support team is here to help you.
                  </p>
                  <Button variant="secondary" className="w-full text-primary font-bold">
                    Contact Support
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">Delivery Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">Standard Home Delivery</p>
                  <p className="text-xs text-muted-foreground mt-1">3-5 business days</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
