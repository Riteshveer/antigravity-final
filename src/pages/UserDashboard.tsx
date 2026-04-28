import { useState, useEffect } from "react";
import { useUserAuth, type Address } from "@/context/UserAuthContext";
import { Navigate, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, MapPin, Loader2, ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { toast } from "sonner";

export default function UserDashboard() {
  const { user, loading, saveAddress } = useUserAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const defaultTab = searchParams.get("tab") || "orders";
  
  const [addressForm, setAddressForm] = useState<Address>({
    phone: "", state: "", city: "", pincode: "", address: ""
  });
  
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (user?.address) {
      setAddressForm(user.address);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setOrdersLoading(true);
      setTimeout(() => {
        setOrders([
          { id: "ORD-98213", date: "2023-11-20", total: 1299, status: "Delivered", items: 1 },
          { id: "ORD-99042", date: "2023-12-05", total: 899, status: "Shipped", items: 1 },
        ]);
        setOrdersLoading(false);
      }, 1000);
    }
  }, [user]);

  if (loading) {
    return <div className="h-screen w-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (addressForm.phone.length !== 10) return toast.error("Phone must be 10 digits");
    if (addressForm.pincode.length !== 6) return toast.error("Pincode must be 6 digits");
    
    saveAddress(addressForm);
    toast.success("Address saved locally to your device!");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate("/")} className="mb-4 -ml-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to shopping
          </Button>
          <h1 className="text-3xl font-display font-bold">My Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.name}!</p>
        </div>

        <Tabs defaultValue={defaultTab} onValueChange={(v) => setSearchParams({ tab: v }, { replace: true })}>
          <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
            <TabsTrigger value="orders">
              <Package className="w-4 h-4 mr-2" />
              Order History
            </TabsTrigger>
            <TabsTrigger value="address">
              <MapPin className="w-4 h-4 mr-2" />
              Saved Address
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Orders</CardTitle>
                <CardDescription>Track and manage your recent purchases.</CardDescription>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No orders found.</div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg">
                        <div>
                          <p className="font-semibold">{order.id}</p>
                          <p className="text-sm text-muted-foreground">Placed on {order.date} • {order.items} item(s)</p>
                        </div>
                        <div className="mt-4 sm:mt-0 text-left sm:text-right">
                          <p className="font-bold">₹{order.total}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${order.status === 'Delivered' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="address" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
                <CardDescription>Saved locally on this device for faster checkout.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveAddress} className="space-y-4 max-w-md">
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
                  <Button type="submit">Save Address</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
