"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, X } from "lucide-react";
import { useMemo, useState } from "react";
import CartPanel from "@/components/CartPanel";
import CategoryNav from "@/components/CategoryNav";
import Header from "@/components/Header";
import PaymentModal from "@/components/PaymentModal";
import ProductGrid from "@/components/ProductGrid";
import ProductModal from "@/components/ProductModal";
import { CartProvider, useCart } from "@/lib/cart-context";
import { products } from "@/lib/data";
import { baht } from "@/lib/format";
import type { CategoryId, Product } from "@/lib/types";

function Kiosk() {
  const { count, subtotal, clear } = useCart();
  const [category, setCategory] = useState<CategoryId>("all");
  const [selected, setSelected] = useState<Product | null>(null);
  const [payOpen, setPayOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const visible = useMemo(
    () =>
      category === "all"
        ? products
        : products.filter((p) => p.category === category),
    [category]
  );

  function startCheckout() {
    setCartOpen(false);
    setPayOpen(true);
  }

  return (
    <div className="kiosk-root kiosk-bg grain flex h-[100dvh] overflow-hidden">
      {/* main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <CategoryNav active={category} onChange={setCategory} />
        <div className="touch-scroll flex-1 overflow-y-auto">
          <ProductGrid products={visible} onSelect={setSelected} />
        </div>
      </div>

      {/* cart — docked on large screens */}
      <div className="hidden w-[384px] shrink-0 shadow-[-20px_0_50px_-30px_rgba(43,26,17,0.5)] lg:block">
        <CartPanel onCheckout={startCheckout} />
      </div>

      {/* mobile: floating order bar */}
      <AnimatePresence>
        {count > 0 && !cartOpen && (
          <motion.button
            initial={{ y: 90 }}
            animate={{ y: 0 }}
            exit={{ y: 90 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            onClick={() => setCartOpen(true)}
            className="fixed inset-x-4 bottom-4 z-30 flex items-center justify-between rounded-3xl bg-espresso px-5 py-4 text-cream shadow-lift lg:hidden"
          >
            <span className="flex items-center gap-3 font-semibold">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-cream/15">
                <ShoppingBag size={18} />
              </span>
              ดูออเดอร์ · {count} รายการ
            </span>
            <span className="font-display text-xl font-semibold tabular-nums">
              {baht(subtotal)}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* mobile: cart drawer */}
      <AnimatePresence>
        {cartOpen && (
          <motion.div
            className="fixed inset-0 z-30 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-espresso/40 backdrop-blur-sm"
              onClick={() => setCartOpen(false)}
            />
            <motion.div
              className="absolute inset-y-0 right-0 w-full max-w-sm"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 360, damping: 34 }}
            >
              <button
                onClick={() => setCartOpen(false)}
                className="absolute -left-1 top-4 z-10 grid h-11 w-11 -translate-x-full place-items-center rounded-full bg-cream text-espresso shadow-lift"
                aria-label="ปิดตะกร้า"
              >
                <X size={22} />
              </button>
              <CartPanel onCheckout={startCheckout} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ProductModal product={selected} onClose={() => setSelected(null)} />
      <PaymentModal
        open={payOpen}
        total={subtotal}
        onClose={() => setPayOpen(false)}
        onPaid={clear}
      />
    </div>
  );
}

export default function Page() {
  return (
    <CartProvider>
      <Kiosk />
    </CartProvider>
  );
}
