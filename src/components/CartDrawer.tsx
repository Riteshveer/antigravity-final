import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useStorefront } from "@/context/StorefrontContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const CartDrawer = () => {
  const { items, isOpen, closeCart, updateQty, removeItem, addItem, subtotal, clear } = useCart();
  const { markPurchased } = useStorefront();
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  return (
    <Sheet open={isOpen} onOpenChange={(o) => (o ? null : closeCart())}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl tracking-tight">Your bag</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 grid place-items-center text-center px-6">
            <div className="space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-muted grid place-items-center">
                <ShoppingBag className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">Your bag is empty.</p>
              <Button variant="outline" onClick={closeCart}>Continue shopping</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto -mx-6 px-6 divide-y divide-border">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 py-4">
                  <img src={item.images?.[0] || ""} alt={item.name} className="w-20 h-20 rounded-lg object-cover bg-muted" />

                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-muted-foreground">{item.category}</div>
                    <div className="font-medium leading-tight line-clamp-2">{item.name}</div>
                    <div className="font-display font-bold mt-1">₹{item.price.toLocaleString("en-IN")}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-border rounded-md">
                        <button
                          aria-label="Decrease quantity"
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          className="px-2 py-1 hover:bg-muted transition"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-sm font-medium">{item.qty}</span>
                        <button
                          aria-label="Increase quantity"
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          className="px-2 py-1 hover:bg-muted transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button
                        onClick={() => {
                          const currentQty = item.qty;
                          removeItem(item.id);
                          toast.success("Removed from bag", {
                            action: {
                              label: "Undo",
                              onClick: () => addItem(item, currentQty),
                            },
                          });
                        }}
                        aria-label="Remove item"
                        className="ml-auto p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-muted transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-display font-bold text-lg">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <p className="text-xs text-muted-foreground">Shipping and taxes calculated at checkout.</p>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => { clear(); toast.success("Bag cleared"); }}>
                  Clear
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleCheckout}
                >
                  Checkout
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
