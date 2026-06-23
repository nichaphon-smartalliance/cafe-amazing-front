"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Minus, Plus, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { categoryTile } from "@/lib/data";
import { baht, lineSignature } from "@/lib/format";
import type { Product, SelectedOptions } from "@/lib/types";
import ProductVisual from "./ProductVisual";

function defaultSelection(product: Product): SelectedOptions {
  const sel: SelectedOptions = {};
  for (const g of product.options) {
    sel[g.id] = g.type === "single" ? [g.choices[0].id] : [];
  }
  return sel;
}

export default function ProductModal({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const { add } = useCart();
  const [sel, setSel] = useState<SelectedOptions>({});
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (product) {
      setSel(defaultSelection(product));
      setQty(1);
    }
  }, [product]);

  const { unitPrice, optionLabels } = useMemo(() => {
    if (!product) return { unitPrice: 0, optionLabels: [] as string[] };
    let price = product.basePrice;
    const labels: string[] = [];
    for (const g of product.options) {
      for (const choiceId of sel[g.id] ?? []) {
        const choice = g.choices.find((c) => c.id === choiceId);
        if (choice) {
          price += choice.delta;
          labels.push(choice.label);
        }
      }
    }
    return { unitPrice: price, optionLabels: labels };
  }, [product, sel]);

  function toggle(groupId: string, choiceId: string, type: "single" | "multi") {
    setSel((prev) => {
      if (type === "single") return { ...prev, [groupId]: [choiceId] };
      const current = prev[groupId] ?? [];
      return {
        ...prev,
        [groupId]: current.includes(choiceId)
          ? current.filter((c) => c !== choiceId)
          : [...current, choiceId],
      };
    });
  }

  function handleAdd() {
    if (!product) return;
    add(
      {
        lineId: lineSignature(product.id, optionLabels),
        productId: product.id,
        name: product.name,
        emoji: product.emoji,
        gradient: categoryTile[product.category],
        unitPrice,
        optionLabels,
      },
      qty
    );
    onClose();
  }

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 z-40 flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-espresso/40 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            className="relative z-10 flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-5xl bg-cream shadow-lift sm:rounded-5xl"
            initial={{ y: 80, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: "spring", stiffness: 360, damping: 32 }}
          >
            {/* hero */}
            <div className="relative">
              <ProductVisual
                product={product}
                className="h-44 w-full"
                emojiClass="text-7xl"
              />
              <button
                onClick={onClose}
                className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-black/25 text-white backdrop-blur transition-colors hover:bg-black/40"
                aria-label="ปิด"
              >
                <X size={22} />
              </button>
              <div className="absolute bottom-4 left-5 right-5 text-white">
                <h2 className="font-display text-3xl font-semibold leading-tight drop-shadow">
                  {product.name}
                </h2>
                <p className="text-sm font-medium opacity-90">{product.desc}</p>
              </div>
            </div>

            {/* options */}
            <div className="touch-scroll flex-1 space-y-6 overflow-y-auto px-6 py-6">
              {product.options.length === 0 && (
                <p className="rounded-3xl bg-surface px-5 py-4 text-center text-sm font-medium text-espresso-muted ring-1 ring-espresso/5">
                  พร้อมเสิร์ฟทันที ไม่ต้องปรับแต่งเพิ่ม
                </p>
              )}
              {product.options.map((g) => (
                <div key={g.id}>
                  <div className="mb-3 flex items-baseline justify-between">
                    <h3 className="font-display text-lg font-semibold text-espresso">
                      {g.label}
                    </h3>
                    <span className="text-xs font-medium text-espresso-muted">
                      {g.type === "single" ? "เลือก 1 อย่าง" : "เลือกได้หลายอย่าง"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {g.choices.map((c) => {
                      const on = (sel[g.id] ?? []).includes(c.id);
                      return (
                        <button
                          key={c.id}
                          onClick={() => toggle(g.id, c.id, g.type)}
                          className={`flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${
                            on
                              ? "bg-espresso text-cream shadow-card"
                              : "bg-surface text-espresso-soft ring-1 ring-espresso/10 hover:ring-espresso/25"
                          }`}
                        >
                          {on && <Check size={16} strokeWidth={3} />}
                          {c.label}
                          {c.delta > 0 && (
                            <span
                              className={
                                on ? "text-caramel-light" : "text-caramel-dark"
                              }
                            >
                              +{c.delta}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* footer */}
            <div className="flex items-center gap-3 border-t border-espresso/10 bg-cream px-6 py-5">
              <div className="flex items-center gap-1 rounded-2xl bg-surface p-1 ring-1 ring-espresso/10">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="grid h-12 w-12 place-items-center rounded-xl text-espresso transition-colors hover:bg-oat disabled:opacity-30"
                  disabled={qty <= 1}
                  aria-label="ลดจำนวน"
                >
                  <Minus size={20} strokeWidth={2.5} />
                </button>
                <span className="w-8 text-center font-display text-xl font-semibold tabular-nums text-espresso">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="grid h-12 w-12 place-items-center rounded-xl text-espresso transition-colors hover:bg-oat"
                  aria-label="เพิ่มจำนวน"
                >
                  <Plus size={20} strokeWidth={2.5} />
                </button>
              </div>

              <button
                onClick={handleAdd}
                className="flex flex-1 items-center justify-between rounded-2xl bg-caramel px-6 py-4 font-semibold text-white shadow-card transition-transform active:scale-[0.98]"
              >
                <span>เพิ่มลงตะกร้า</span>
                <span className="font-display text-xl tabular-nums">
                  {baht(unitPrice * qty)}
                </span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
