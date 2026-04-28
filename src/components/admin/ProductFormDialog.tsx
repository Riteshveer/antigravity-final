import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { adminApi, type AdminProduct } from "@/lib/adminApi";
import { toast } from "sonner";
import { Plus, X, ImagePlus } from "lucide-react";

type Props = {
  open: boolean;
  product: AdminProduct | null;
  onClose: () => void;
  onSaved: () => void;
};

const empty = {
  name: "",
  category: "3D Figures" as AdminProduct["category"],
  price: 0,
  mrp: 0,
  stock: 0,
  description: "",
  images: [] as string[],
  badge: undefined as AdminProduct["badge"],
};

export const ProductFormDialog = ({ open, product, onClose, onSaved }: Props) => {
  const [form, setForm] = useState(empty);
  const [imageUrl, setImageUrl] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        category: product.category,
        price: product.price,
        mrp: product.mrp,
        stock: product.stock,
        description: product.description,
        images: [...product.images],
        badge: product.badge,
      });
    } else {
      setForm(empty);
    }
    setImageUrl("");
  }, [product, open]);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((s) => ({ ...s, [k]: v }));

  const addImageUrl = () => {
    const url = imageUrl.trim();
    if (!url) return;
    set("images", [...form.images, url]);
    setImageUrl("");
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    files.forEach((f) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setForm((s) => ({ ...s, images: [...s.images, reader.result as string] }));
        }
      };
      reader.readAsDataURL(f);
    });
    e.target.value = "";
  };

  const removeImage = (idx: number) =>
    set("images", form.images.filter((_, i) => i !== idx));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    let finalImages = [...form.images];
    if (imageUrl.trim()) {
      finalImages.push(imageUrl.trim());
      set("images", finalImages);
      setImageUrl("");
    }
    if (finalImages.length === 0) {
      toast.error("Add at least one product image.");
      return;
    }
    setBusy(true);
    const submissionForm = { ...form, images: finalImages };
    try {
      if (product) {
        await adminApi.updateProduct(product.id, submissionForm);
        toast.success("Product updated");
      } else {
        await adminApi.createProduct(submissionForm);
        toast.success("Product created");
      }
      onSaved();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? null : onClose())}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? "Edit product" : "New product"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-5">
          <div>
            <Label>Images ({form.images.length})</Label>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {form.images.map((src, i) => (
                <div key={i} className="relative aspect-square rounded-md overflow-hidden border border-border bg-muted">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-foreground/80 text-background grid place-items-center hover:bg-destructive transition"
                    aria-label="Remove image"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 text-[10px] rounded bg-foreground text-background">Cover</span>
                  )}
                </div>
              ))}
              <label className="aspect-square rounded-md border-2 border-dashed border-border grid place-items-center cursor-pointer hover:border-foreground/40 hover:bg-muted/50 transition">
                <input type="file" accept="image/*" multiple onChange={handleFile} className="hidden" />
                <ImagePlus className="w-5 h-5 text-muted-foreground" />
              </label>
            </div>
            <div className="flex gap-2 mt-3">
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="…or paste an image URL"
              />
              <Button type="button" variant="outline" onClick={addImageUrl}>
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={form.name} onChange={(e) => set("name", e.target.value)} required />
            </div>
            <div>
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => set("category", v as AdminProduct["category"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="3D Figures">3D Figures</SelectItem>
                  <SelectItem value="Anime">Anime</SelectItem>
                  <SelectItem value="Lamps">Lamps</SelectItem>
                  <SelectItem value="Posters">Posters</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="price">Price (₹)</Label>
              <Input id="price" type="number" min={0} value={form.price}
                onChange={(e) => set("price", Number(e.target.value))} required />
            </div>
            <div>
              <Label htmlFor="mrp">MRP (₹)</Label>
              <Input id="mrp" type="number" min={0} value={form.mrp}
                onChange={(e) => set("mrp", Number(e.target.value))} required />
            </div>
            <div>
              <Label htmlFor="stock">Stock</Label>
              <Input id="stock" type="number" min={0} value={form.stock}
                onChange={(e) => set("stock", Number(e.target.value))} required />
            </div>
          </div>

          <div>
            <Label>Badge (optional)</Label>
            <Select
              value={form.badge ?? "none"}
              onValueChange={(v) => set("badge", v === "none" ? undefined : (v as AdminProduct["badge"]))}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="NEW">NEW</SelectItem>
                <SelectItem value="HOT">HOT</SelectItem>
                <SelectItem value="LIMITED">LIMITED</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="desc">Description</Label>
            <Textarea id="desc" rows={4} value={form.description}
              onChange={(e) => set("description", e.target.value)} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={busy}>{product ? "Save changes" : "Create product"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
