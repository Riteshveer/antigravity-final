import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useUserAuth, type Address } from "@/context/UserAuthContext";
import { useCart } from "@/context/CartContext";
import { useStorefront } from "@/context/StorefrontContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GoogleSignIn } from "@/components/GoogleSignIn";
import { MapPin, CreditCard, ShoppingBag, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function Checkout() {
  const { user, loading, login, saveAddress } = useUserAuth();
  const { items, subtotal, clear } = useCart();
  const { markPurchased } = useStorefront();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2>(1); // 1 = Address, 2 = Payment
  const [addressForm, setAddressForm] = useState<Address>({
    phone: "", state: "", city: "", pincode: "", address: ""
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // If user is logged in and has an address, skip to payment automatically
  useEffect(() => {
    if (user && user.address && step === 1) {
      setAddressForm(user.address);
      setStep(2);
    } else if (user?.address) {
       setAddressForm(user.address);
    }
  }, [user]);

  if (loading) {
    return <div className="h-screen w-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  // If cart is empty, don't let them checkout
  if (items.length === 0 && !isProcessing) {
    return <Navigate to="/" />;
  }

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (addressForm.phone.length !== 10) return toast.error("Phone must be 10 digits");
    if (addressForm.pincode.length !== 6) return toast.error("Pincode must be 6 digits");
    
    saveAddress(addressForm);
    toast.success("Address saved!");
    setStep(2); // Move to payment
  };

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const ids = items.map((i) => i.id);
      markPurchased(ids);
      clear();
      setIsProcessing(false);
      toast.success("Order placed successfully!");
      navigate("/dashboard?tab=orders");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate("/")} className="mb-4 -ml-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to shopping
          </Button>
          <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground mb-8">
            <div className="flex items-center gap-2 text-foreground">
              <ShoppingBag className="w-4 h-4" /> Cart
            </div>
            <div className="h-px w-8 bg-border"></div>
            <div className={`flex items-center gap-2 ${user && step >= 1 ? 'text-foreground' : ''}`}>
              <MapPin className="w-4 h-4" /> Address
            </div>
            <div className="h-px w-8 bg-border"></div>
            <div className={`flex items-center gap-2 ${user && step === 2 ? 'text-foreground' : ''}`}>
              <CreditCard className="w-4 h-4" /> Payment
            </div>
          </div>
        </div>

        {!user ? (
          <Card className="max-w-md mx-auto mt-12">
            <CardHeader className="text-center">
              <CardTitle>Sign in to Checkout</CardTitle>
              <CardDescription>You need an account to track your orders.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-6">
              <GoogleSignIn onSuccess={login} />
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              
              {step === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Address</CardTitle>
                    <CardDescription>Where should we send your order?</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSaveAddress} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Phone Number</label>
                          <Input placeholder="10-digit number" value={addressForm.phone} onChange={(e) => setAddressForm({...addressForm, phone: e.target.value.replace(/\\D/g,'').slice(0,10)})} required />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Pincode</label>
                          <Input placeholder="6-digit pincode" value={addressForm.pincode} onChange={(e) => setAddressForm({...addressForm, pincode: e.target.value.replace(/\\D/g,'').slice(0,6)})} required />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">State</label>
                          <Input placeholder="State" value={addressForm.state} onChange={(e) => setAddressForm({...addressForm, state: e.target.value})} required />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">City</label>
                          <Input placeholder="City" value={addressForm.city} onChange={(e) => setAddressForm({...addressForm, city: e.target.value})} required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Full Address</label>
                        <Input placeholder="Street, Apartment, Locality" value={addressForm.address} onChange={(e) => setAddressForm({...addressForm, address: e.target.value})} required />
                      </div>
                      <Button type="submit" className="w-full mt-6">Save Address & Continue</Button>
                    </form>
                  </CardContent>
                </Card>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="flex flex-row items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500" /> Shipping To
                        </CardTitle>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setStep(1)}>Edit Address</Button>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm space-y-1">
                        <p className="font-medium">{user.name}</p>
                        <p>{user.address?.address}</p>
                        <p>{user.address?.city}, {user.address?.state} {user.address?.pincode}</p>
                        <p className="text-muted-foreground mt-2">Phone: {user.address?.phone}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Payment Method</CardTitle>
                      <CardDescription>Complete your purchase securely.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="p-4 border rounded-lg bg-muted/50 mb-6 flex items-center justify-center h-32">
                        <p className="text-muted-foreground text-sm">[ Dummy Payment Gateway Integration ]</p>
                      </div>
                      <Button onClick={handlePayment} className="w-full" size="lg" disabled={isProcessing}>
                        {isProcessing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {isProcessing ? "Processing..." : `Pay ₹${subtotal.toLocaleString("en-IN")}`}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}

            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="max-h-64 overflow-y-auto space-y-4 pr-2">
                    {items.map(item => (
                      <div key={item.id} className="flex gap-3">
                        <img src={item.images?.[0] || ""} alt={item.name} className="w-16 h-16 rounded-md object-cover bg-muted" />

                        <div className="flex-1 text-sm">
                          <p className="font-medium line-clamp-2">{item.name}</p>
                          <p className="text-muted-foreground mt-1">Qty: {item.qty}</p>
                          <p className="font-semibold mt-1">₹{(item.price * item.qty).toLocaleString("en-IN")}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-4 border-t space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{subtotal.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-green-500">Free</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Total</span>
                      <span>₹{subtotal.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
