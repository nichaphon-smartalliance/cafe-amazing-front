"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, QrCode } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { baht } from "@/lib/format";

export default function CartPanel({ onCheckout }: { onCheckout: () => void }) {
  const { lines, count, subtotal, inc, dec, remove, clear } = useCart();

  return (
    <aside className="flex h-full w-full flex-col bg-espresso text-cream">
      <div className="flex items-center justify-between px-6 pt-7 pb-4">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-cream/10">
            <ShoppingBag size={22} />
          </div>
          <div className="leading-tight">
            <p className="font-display text-xl font-semibold">ออเดอร์ของคุณ</p>
            <p className="text-sm text-cream/60">
              {count > 0 ? `${count} รายการ` : "ยังไม่มีรายการ"}
            </p>
          </div>
        </div>
        {lines.length > 0 && (
          <button
            onClick={clear}
            className="grid h-10 w-10 place-items-center rounded-xl text-cream/60 transition-colors hover:bg-cream/10 hover:text-cream"
            aria-label="ล้างตะกร้า"
          >
            <Trash2 size={19} />
          </button>
        )}
      </div>

      <div className="touch-scroll flex-1 overflow-y-auto px-4">
        {lines.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-cream/5 text-4xl">
              ☕
            </div>
            <p className="font-display text-lg text-cream/80">
              เลือกเครื่องดื่มที่ชอบได้เลย
            </p>
            <p className="text-sm text-cream/50">
              แตะที่เมนูเพื่อเพิ่มลงตะกร้า แล้วชำระเงินด้วยการสแกน
            </p>
          </div>
        ) : (
          <ul className="space-y-3 pb-4">
            <AnimatePresence initial={false}>
              {lines.map((l) => (
                <motion.li
                  key={l.lineId}
                  layout
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 24, height: 0, marginBottom: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 36 }}
                  className="flex gap-3 rounded-3xl bg-cream/5 p-3 ring-1 ring-cream/10"
                >
                  <div
                    className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-2xl ${l.gradient}`}
                  >
                    {l.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate font-semibold text-cream">{l.name}</p>
                      <p className="shrink-0 font-display font-semibold tabular-nums text-cream">
                        {baht(l.unitPrice * l.qty)}
                      </p>
                    </div>
                    {l.optionLabels.length > 0 && (
                      <p className="mt-0.5 line-clamp-1 text-xs text-cream/55">
                        {l.optionLabels.join(" · ")}
                      </p>
                    )}
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex items-center gap-1 rounded-xl bg-cream/10 p-1">
                        <button
                          onClick={() => dec(l.lineId)}
                          className="grid h-8 w-8 place-items-center rounded-lg text-cream transition-colors hover:bg-cream/15"
                          aria-label="ลดจำนวน"
                        >
                          <Minus size={16} strokeWidth={2.5} />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold tabular-nums">
                          {l.qty}
                        </span>
                        <button
                          onClick={() => inc(l.lineId)}
                          className="grid h-8 w-8 place-items-center rounded-lg text-cream transition-colors hover:bg-cream/15"
                          aria-label="เพิ่มจำนวน"
                        >
                          <Plus size={16} strokeWidth={2.5} />
                        </button>
                      </div>
                      <button
                        onClick={() => remove(l.lineId)}
                        className="ml-auto text-xs font-medium text-cream/45 transition-colors hover:text-clay"
                      >
                        ลบ
                      </button>
                    </div>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>

      {/* totals + pay */}
      <div className="border-t border-cream/10 px-6 pb-7 pt-5">
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between text-cream/65">
            <dt>ยอดรวมย่อย</dt>
            <dd className="tabular-nums">{baht(subtotal)}</dd>
          </div>
          <div className="flex justify-between text-cream/65">
            <dt>ภาษีรวมแล้ว</dt>
            <dd className="tabular-nums">฿0</dd>
          </div>
          <div className="mt-2 flex items-baseline justify-between border-t border-dashed border-cream/15 pt-3">
            <dt className="font-display text-lg font-semibold text-cream">
              ยอดชำระ
            </dt>
            <dd className="font-display text-3xl font-semibold tabular-nums text-cream">
              {baht(subtotal)}
            </dd>
          </div>
        </dl>

        <button
          onClick={onCheckout}
          disabled={lines.length === 0}
          className="mt-5 flex w-full items-center justify-center gap-3 rounded-2xl bg-caramel py-4 font-semibold text-white shadow-lift transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-cream/10 disabled:text-cream/40 disabled:shadow-none"
        >
          <QrCode size={22} />
          สแกนเพื่อชำระเงิน
        </button>
      </div>
    </aside>
  );
}
