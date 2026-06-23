"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { baht } from "@/lib/format";
import type { Product } from "@/lib/types";
import ProductVisual from "./ProductVisual";

const badgeStyles: Record<string, string> = {
  ฮิต: "bg-clay text-white",
  ใหม่: "bg-matcha text-white",
  แนะนำ: "bg-espresso text-cream",
};

export default function ProductCard({
  product,
  onSelect,
}: {
  product: Product;
  onSelect: (p: Product) => void;
}) {
  return (
    <motion.button
      layout
      onClick={() => onSelect(product)}
      whileTap={{ scale: 0.96 }}
      className="group flex flex-col overflow-hidden rounded-4xl bg-surface text-left shadow-card ring-1 ring-espresso/5 transition-shadow hover:shadow-lift"
    >
      <div className="relative">
        <ProductVisual product={product} className="aspect-[4/3] w-full" />
        {product.badge && (
          <span
            className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold tracking-wide shadow-sm ${
              badgeStyles[product.badge]
            }`}
          >
            {product.badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 px-4 pb-4 pt-3.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-semibold leading-tight text-espresso">
            {product.name}
          </h3>
        </div>
        <p className="text-xs font-medium uppercase tracking-wide text-caramel-dark">
          {product.nameEn}
        </p>
        <p className="mt-1 line-clamp-2 text-sm leading-snug text-espresso-muted">
          {product.desc}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <span className="font-display text-xl font-semibold text-espresso">
            {baht(product.basePrice)}
          </span>
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-espresso text-cream transition-transform group-hover:scale-105 group-active:scale-95">
            <Plus size={22} strokeWidth={2.5} />
          </span>
        </div>
      </div>
    </motion.button>
  );
}
