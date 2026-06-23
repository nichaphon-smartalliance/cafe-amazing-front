"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

export default function ProductGrid({
  products,
  onSelect,
}: {
  products: Product[];
  onSelect: (p: Product) => void;
}) {
  return (
    <motion.div
      layout
      className="grid grid-cols-2 gap-4 px-8 pb-10 pt-4 md:grid-cols-3 xl:grid-cols-4"
    >
      <AnimatePresence mode="popLayout">
        {products.map((p, i) => (
          <motion.div
            key={p.id}
            layout
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.25) }}
          >
            <ProductCard product={p} onSelect={onSelect} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
