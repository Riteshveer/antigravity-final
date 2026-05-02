import { useState, useEffect } from "react";
import { adminApi, type Order } from "@/lib/adminApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, RefreshCw } from "lucide-react";

const STATUS_OPTIONS = [
  "Placed",
  "Confirmed",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled"
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Placed": return "bg-blue-500/10 text-blue-500";
    case "Confirmed": return "bg-cyan-500/10 text-cyan-500";
    case "Packed": return "bg-yellow-500/10 text-yellow-500";
    case "Shipped": return "bg-purple-500/10 text-purple-500";
    case "Out for Delivery": return "bg-orange-500/10 text-orange-500";
    case "Delivered": return "bg-green-500/10 text-green-500";
    case "Cancelled": return "bg-red-500/10 text-red-500";
    default: return "bg-slate-500/10 text-slate-500";
  }
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await adminApi.listOrders();
      setOrders(data);
    } catch (error) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) return;
    
    setUpdating(true);
    try {
      await adminApi.updateOrderStatus(selectedOrder.id, newStatus, description, location);
      toast.success("Order status updated");
      setSelectedOrder(null);
      fetchOrders();
    } catch (error) {
      toast.error("Failed to update order status");
    } finally {
      setUpdating(false);
    }
  };

  const openUpdateModal = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setDescription("");
    setLocation("");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold">Order Management</h1>
          <p className="text-muted-foreground">Update and track customer orders.</p>
        </div>
        <Button variant="outline" size="icon" onClick={fetchOrders} disabled={loading}>
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin" /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                      No orders found.
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">{order.id}</TableCell>
                      <TableCell>{order.user_email}</TableCell>
                      <TableCell>₹{order.total_amount.toLocaleString('en-IN')}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)} variant="outline">
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => openUpdateModal(order)}>
                          Update Status
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input 
                placeholder="e.g. Mumbai Hub" 
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea 
                placeholder="e.g. Package left the facility" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedOrder(null)}>Cancel</Button>
            <Button onClick={handleUpdateStatus} disabled={updating}>
              {updating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
