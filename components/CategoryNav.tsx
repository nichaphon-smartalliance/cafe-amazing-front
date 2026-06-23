"use client";

import { motion } from "framer-motion";
import { categories } from "@/lib/data";
import type { CategoryId } from "@/lib/types";

export default function CategoryNav({
  active,
  onChange,
}: {
  active: CategoryId;
  onChange: (id: CategoryId) => void;
}) {
  return (
    <nav className="touch-scroll flex gap-3 overflow-x-auto px-8 pb-2">
      {categories.map((c) => {
        const selected = c.id === active;
        return (
          <button
            key={c.id}
            onClick={() => onChange(c.id)}
            className={`relative flex shrink-0 items-center gap-2.5 rounded-2xl px-5 py-3.5 text-base font-semibold transition-colors ${
              selected
                ? "text-cream"
                : "bg-surface/70 text-espresso-soft ring-1 ring-espresso/5 hover:bg-surface"
            }`}
          >
            {selected && (
              <motion.span
                layoutId="cat-pill"
                className="absolute inset-0 -z-10 rounded-2xl bg-espresso shadow-card"
                transition={{ type: "spring", stiffness: 500, damping: 38 }}
              />
            )}
            <span className="text-lg leading-none">{c.emoji}</span>
            <span className="leading-none">{c.name}</span>
          </button>
        );
      })}
    </nav>
  );
}
