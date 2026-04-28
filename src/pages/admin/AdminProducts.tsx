import { useEffect, useMemo, useState } from "react";
import { adminApi, type AdminProduct } from "@/lib/adminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ProductFormDialog } from "@/components/admin/ProductFormDialog";

const AdminProducts = () => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [creating, setCreating] = useState(false);

  const load = () => adminApi.listProducts().then(setProducts);
  useEffect(() => { load(); }, []);

  const filtered = useMemo(
    () => products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase())),
    [products, q],
  );

  const handleDelete = async (p: AdminProduct) => {
    if (!confirm(`Delete ${p.name}? This cannot be undone.`)) return;
    await adminApi.deleteProduct(p.id);
    toast.success("Product deleted");
    load();
  };

  return (
    <div className="p-6 md:p-10 space-y-6 max-w-7xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your full catalog — prices, images, descriptions.</p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus className="w-4 h-4 mr-2" /> New product
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…" className="pl-9" />
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Images</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.images[0]} alt={p.name} className="w-12 h-12 rounded-md object-cover bg-muted" />
                      <div>
                        <div className="font-medium leading-tight">{p.name}</div>
                        <div className="text-xs text-muted-foreground">{p.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{p.category}</td>
                  <td className="px-4 py-3">
                    <div className="font-display font-bold">₹{p.price.toLocaleString("en-IN")}</div>
                    <div className="text-xs text-muted-foreground line-through">₹{p.mrp.toLocaleString("en-IN")}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={p.stock < 10 ? "text-destructive font-semibold" : ""}>{p.stock}</span>
                  </td>
                  <td className="px-4 py-3">{p.images.length}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button size="sm" variant="ghost" onClick={() => setEditing(p)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(p)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center py-10 text-muted-foreground">No products found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <ProductFormDialog
        open={creating || !!editing}
        product={editing}
        onClose={() => { setCreating(false); setEditing(null); }}
        onSaved={() => { load(); setCreating(false); setEditing(null); }}
      />
    </div>
  );
};

export default AdminProducts;
