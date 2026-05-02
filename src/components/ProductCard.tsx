import { Star, ShoppingBag, Minus, Plus } from "lucide-react";
import { type AdminProduct } from "@/lib/adminApi";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { WriteReviewDialog } from "@/components/WriteReviewDialog";

const badgeStyles: Record<string, string> = {
  NEW: "bg-secondary text-secondary-foreground",
  HOT: "bg-primary text-primary-foreground",
  LIMITED: "bg-accent text-accent-foreground",
};

export const ProductCard = ({ product }: { product: AdminProduct }) => {
  const { addItem, openCart, items, updateQty } = useCart();
  const off = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const inCart = items.find((i) => i.id === product.id)?.qty ?? 0;
  const isOutOfStock = product.stock <= 0;
  const isLowStock = !isOutOfStock && product.stock <= 5;

  const handleAdd = () => {
    addItem(product);
    toast.success(`${product.name} added to bag`, {
      action: { label: "View bag", onClick: openCart },
    });
  };

  const handleDecrease = () => {
    updateQty(product.id, inCart - 1);
    if (inCart - 1 <= 0) toast.success(`${product.name} removed from bag`);
  };

  const handleIncrease = () => {
    if (inCart >= product.stock) {
      toast.error(`Only ${product.stock} left in stock`);
      return;
    }
    updateQty(product.id, inCart + 1);
  };

  return (
    <div className="group relative rounded-2xl overflow-hidden border border-border bg-card hover:border-foreground/30 transition-all duration-500 hover:shadow-card hover:-translate-y-1 flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.images[0] || ""}
          alt={product.name}
          loading="lazy"
          width={800}
          height={800}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${
            isOutOfStock ? "opacity-50 grayscale" : ""
          }`}
        />

        {/* Out of Stock overlay */}
        {isOutOfStock && (
          <>
            <div className="absolute inset-0 bg-background/40" />
            <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-display font-bold tracking-wider rounded-md bg-destructive text-destructive-foreground">
              OUT OF STOCK
            </span>
          </>
        )}

        {/* Normal badges when in stock */}
        {!isOutOfStock && (
          <>
            {product.badge && (
              <span className={`absolute top-3 left-3 px-2.5 py-1 text-[10px] font-display font-bold tracking-wider rounded-md ${badgeStyles[product.badge] ?? ""}`}>
                {product.badge}
              </span>
            )}
            <span className="absolute top-3 right-3 px-2 py-1 text-[10px] font-bold rounded-md bg-background/90 backdrop-blur border border-border">
              -{off}%
            </span>
          </>
        )}

        {/* Low stock warning */}
        {isLowStock && (
          <span className="absolute bottom-3 left-3 px-2 py-1 text-[10px] font-bold rounded-md bg-accent text-accent-foreground">
            Only {product.stock} left
          </span>
        )}

        {/* In-bag indicator */}
        {inCart > 0 && !isOutOfStock && (
          <button
            onClick={openCart}
            aria-label={`${inCart} in bag — view bag`}
            className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-foreground text-background text-[11px] font-semibold shadow-card hover:scale-105 transition"
          >
            <ShoppingBag className="w-3 h-3" />
            {inCart} in bag
          </button>
        )}
      </div>

      <div className="p-4 space-y-2 flex flex-col flex-1">
        <div className="text-xs text-muted-foreground uppercase tracking-wider">{product.category}</div>
        <h3 className="font-display font-semibold leading-tight line-clamp-1">{product.name}</h3>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="w-3.5 h-3.5 fill-accent text-accent" />
          <span className="text-foreground font-medium">{product.rating}</span>
          <span>({product.reviews})</span>
        </div>
        <div className="flex items-baseline gap-2 pt-1">
          <span className="font-display font-bold text-lg">₹{product.price.toLocaleString("en-IN")}</span>
          <span className="text-sm text-muted-foreground line-through">₹{product.mrp.toLocaleString("en-IN")}</span>
        </div>

        {/* CTA — three states: out of stock / add / quantity stepper */}
        {isOutOfStock ? (
          <Button size="sm" disabled className="mt-2 w-full cursor-not-allowed opacity-70">
            Out of Stock
          </Button>
        ) : inCart === 0 ? (
          <Button
            size="sm"
            onClick={handleAdd}
            className="mt-2 w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Add to cart
          </Button>
        ) : (
          <div className="mt-2 flex items-center justify-between rounded-md bg-primary text-primary-foreground h-9 overflow-hidden">
            <button
              onClick={handleDecrease}
              aria-label="Decrease quantity"
              className="h-full px-3 hover:bg-primary-foreground/10 transition grid place-items-center"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-display font-semibold text-sm tabular-nums">{inCart} in bag</span>
            <button
              onClick={handleIncrease}
              aria-label="Increase quantity"
              disabled={inCart >= product.stock}
              className={`h-full px-3 transition grid place-items-center ${
                inCart >= product.stock ? "opacity-40 cursor-not-allowed" : "hover:bg-primary-foreground/10"
              }`}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}

        <WriteReviewDialog product={product} />
      </div>
    </div>
  );
};
