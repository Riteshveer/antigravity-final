import { useEffect, useState } from "react";
import { adminApi, type AdminProduct } from "@/lib/adminApi";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Minus, Plus, Save } from "lucide-react";
import { toast } from "sonner";

const AdminStock = () => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [drafts, setDrafts] = useState<Record<string, number>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = () =>
    adminApi.listProducts().then((p) => {
      setProducts(p);
      setDrafts(Object.fromEntries(p.map((x) => [x.id, x.stock])));
    });

  useEffect(() => { load(); }, []);

  const set = (id: string, v: number) =>
    setDrafts((d) => ({ ...d, [id]: Math.max(0, v) }));

  const save = async (p: AdminProduct) => {
    setSavingId(p.id);
    try {
      await adminApi.updateProduct(p.id, { stock: drafts[p.id] });
      toast.success(`${p.name} stock updated`);
      load();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSavingId(null);
    }
  };

  const lowStock = products.filter((p) => p.stock < 10);

  return (
    <div className="p-6 md:p-10 space-y-6 max-w-7xl">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Stock</h1>
        <p className="text-muted-foreground">Adjust inventory levels per product.</p>
      </div>

      {lowStock.length > 0 && (
        <Card className="p-4 flex items-start gap-3 border-destructive/40 bg-destructive/5">
          <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
          <div className="text-sm">
            <div className="font-semibold">Low-stock alert</div>
            <div className="text-muted-foreground">
              {lowStock.map((p) => p.name).join(", ")} {lowStock.length === 1 ? "is" : "are"} below 10 units.
            </div>
          </div>
        </Card>
      )}

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Current</th>
                <th className="px-4 py-3 font-medium">New stock</th>
                <th className="px-4 py-3 font-medium text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((p) => {
                const draft = drafts[p.id] ?? p.stock;
                const dirty = draft !== p.stock;
                return (
                  <tr key={p.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-md object-cover bg-muted" />
                        <div>
                          <div className="font-medium leading-tight">{p.name}</div>
                          <div className="text-xs text-muted-foreground">{p.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={p.stock < 10 ? "text-destructive font-semibold" : ""}>{p.stock}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 max-w-[160px]">
                        <Button type="button" size="icon" variant="outline" onClick={() => set(p.id, draft - 1)}>
                          <Minus className="w-3.5 h-3.5" />
                        </Button>
                        <Input
                          type="number"
                          min={0}
                          value={draft}
                          onChange={(e) => set(p.id, Number(e.target.value))}
                          className="text-center"
                        />
                        <Button type="button" size="icon" variant="outline" onClick={() => set(p.id, draft + 1)}>
                          <Plus className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button size="sm" disabled={!dirty || savingId === p.id} onClick={() => save(p)}>
                        <Save className="w-4 h-4 mr-1.5" /> Save
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminStock;
