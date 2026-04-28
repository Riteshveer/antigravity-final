import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star, PencilLine } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { useStorefront } from "@/context/StorefrontContext";
import { type AdminProduct } from "@/lib/adminApi";


const schema = z.object({
  name: z.string().trim().min(2, "Name too short").max(60),
  city: z.string().trim().min(2, "City too short").max(40),
  text: z.string().trim().min(10, "Tell us a bit more (10+ chars)").max(500),
  rating: z.number().int().min(1).max(5),
});

export const WriteReviewDialog = ({ product }: { product: AdminProduct }) => {

  const { addReview, purchasedIds } = useStorefront();
  const purchased = purchasedIds.includes(product.id);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);

  const submit = () => {
    const parsed = schema.safeParse({ name, city, text, rating });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid review");
      return;
    }
    addReview({
      productId: product.id,
      productName: product.name,
      name: parsed.data.name,
      city: parsed.data.city,
      text: parsed.data.text,
      rating: parsed.data.rating,
    });
    toast.success("Thanks for your review!");
    setOpen(false);
    setName(""); setCity(""); setText(""); setRating(5);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="w-full"
          disabled={!purchased}
          title={purchased ? "Write a review" : "Purchase this product to write a review"}
        >
          <PencilLine className="w-4 h-4 mr-2" />
          {purchased ? "Write a review" : "Buy to review"}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display tracking-tight">Review · {product.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <div className="text-sm font-medium mb-1.5">Your rating</div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onMouseEnter={() => setHover(n)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(n)}
                  aria-label={`${n} star`}
                  className="p-0.5"
                >
                  <Star
                    className={`w-7 h-7 transition ${
                      (hover || rating) >= n ? "fill-accent text-accent" : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} maxLength={60} placeholder="Aarav S." />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">City</label>
              <Input value={city} onChange={(e) => setCity(e.target.value)} maxLength={40} placeholder="Mumbai" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Your review</label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={500}
              rows={4}
              placeholder="What did you love about it?"
            />
            <div className="text-xs text-muted-foreground mt-1 text-right">{text.length}/500</div>
          </div>

          <Button className="w-full" onClick={submit}>Submit review</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
