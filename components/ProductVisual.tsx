import { categoryTile } from "@/lib/data";
import type { Product } from "@/lib/types";

export default function ProductVisual({
  product,
  className = "",
  emojiClass = "text-6xl",
}: {
  product: Product;
  className?: string;
  emojiClass?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${
        categoryTile[product.category]
      } ${className}`}
    >
      {/* glossy sheen */}
      <div className="absolute -left-1/3 -top-1/2 h-[160%] w-[70%] rotate-12 bg-white/15 blur-2xl" />
      {/* ring decor */}
      <div className="absolute -bottom-10 -right-8 h-32 w-32 rounded-full border-[6px] border-white/15" />
      <div className="absolute -top-6 left-6 h-16 w-16 rounded-full border-[5px] border-white/10" />
      <div className="grid h-full w-full place-items-center">
        <span className={`drop-shadow-[0_6px_10px_rgba(0,0,0,0.25)] ${emojiClass}`}>
          {product.emoji}
        </span>
      </div>
    </div>
  );
}
