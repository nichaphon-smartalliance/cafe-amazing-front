"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ScanLine, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { baht } from "@/lib/format";

type Step = "scan" | "processing" | "success";

/** deterministic pseudo-random matrix so the "QR" looks stable per order */
function buildMatrix(seed: number, size = 25): boolean[][] {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const m: boolean[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => rnd() > 0.5)
  );
  // finder squares in 3 corners
  const finder = (r0: number, c0: number) => {
    for (let r = 0; r < 7; r++)
      for (let c = 0; c < 7; c++) {
        const edge = r === 0 || r === 6 || c === 0 || c === 6;
        const core = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        m[r0 + r][c0 + c] = edge || core;
        if (!edge && !core) m[r0 + r][c0 + c] = false;
      }
  };
  finder(0, 0);
  finder(0, size - 7);
  finder(size - 7, 0);
  return m;
}

function barWidths(seed: number, count = 44): number[] {
  let s = (seed * 7919) % 2147483647;
  if (s <= 0) s += 2147483646;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  return Array.from({ length: count }, () => 1 + Math.floor(rnd() * 3));
}

export default function PaymentModal({
  open,
  total,
  onClose,
  onPaid,
}: {
  open: boolean;
  total: number;
  onClose: () => void;
  onPaid: () => void;
}) {
  const [step, setStep] = useState<Step>("scan");
  const [orderNo, setOrderNo] = useState<number>(1000);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (open) {
      setStep("scan");
      setOrderNo(1000 + Math.floor(Math.random() * 9000));
    }
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [open]);

  const matrix = useMemo(() => buildMatrix(orderNo * 31 + 7), [orderNo]);
  const bars = useMemo(() => barWidths(orderNo), [orderNo]);

  function simulatePay() {
    setStep("processing");
    timers.current.push(
      setTimeout(() => setStep("success"), 1700),
      setTimeout(() => {
        onPaid();
        onClose();
      }, 4200)
    );
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-espresso/55 backdrop-blur-md"
            onClick={step === "scan" ? onClose : undefined}
          />

          <motion.div
            className="relative z-10 w-full max-w-md overflow-hidden rounded-5xl bg-cream shadow-lift"
            initial={{ scale: 0.94, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
          >
            <AnimatePresence mode="wait">
              {step === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center px-8 py-12 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                    className="grid h-24 w-24 place-items-center rounded-full bg-matcha text-white shadow-lift"
                  >
                    <Check size={52} strokeWidth={3} />
                  </motion.div>
                  <h2 className="mt-6 font-display text-3xl font-semibold text-espresso">
                    ชำระเงินสำเร็จ
                  </h2>
                  <p className="mt-2 text-espresso-muted">
                    ขอบคุณที่ใช้บริการ Café Amazing
                  </p>
                  <div className="mt-6 w-full rounded-3xl bg-surface px-6 py-5 ring-1 ring-espresso/5">
                    <p className="text-sm text-espresso-muted">หมายเลขออเดอร์</p>
                    <p className="font-display text-4xl font-semibold tracking-wide text-espresso">
                      #{orderNo}
                    </p>
                    <p className="mt-2 text-sm text-espresso-muted">
                      กรุณารอเรียกคิวที่หน้าเคาน์เตอร์
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="scan"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex items-center justify-between bg-espresso px-7 py-5 text-cream">
                    <div>
                      <p className="text-sm text-cream/60">ยอดที่ต้องชำระ</p>
                      <p className="font-display text-3xl font-semibold tabular-nums">
                        {baht(total)}
                      </p>
                    </div>
                    {step === "scan" && (
                      <button
                        onClick={onClose}
                        className="grid h-11 w-11 place-items-center rounded-full bg-cream/10 text-cream transition-colors hover:bg-cream/20"
                        aria-label="ยกเลิก"
                      >
                        <X size={22} />
                      </button>
                    )}
                  </div>

                  <div className="px-7 pb-7 pt-6">
                    <div className="mb-5 flex items-center justify-center gap-2 text-sm font-semibold text-espresso-soft">
                      <span className="rounded-full bg-clay/15 px-3 py-1 text-clay">
                        PromptPay
                      </span>
                      <span className="text-espresso-muted">
                        สแกน QR หรือบาร์โค้ดเพื่อจ่าย
                      </span>
                    </div>

                    {/* QR */}
                    <div className="relative mx-auto w-fit rounded-3xl bg-white p-5 shadow-card ring-1 ring-espresso/5">
                      <div
                        className="grid"
                        style={{
                          gridTemplateColumns: `repeat(${matrix.length}, 1fr)`,
                          width: 220,
                          height: 220,
                        }}
                      >
                        {matrix.flatMap((row, r) =>
                          row.map((on, c) => (
                            <div
                              key={`${r}-${c}`}
                              className={on ? "bg-espresso" : "bg-transparent"}
                            />
                          ))
                        )}
                      </div>

                      {/* scanning beam */}
                      {step === "scan" && (
                        <div className="pointer-events-none absolute inset-5 overflow-hidden rounded-xl">
                          <div className="absolute inset-x-0 h-10 animate-scan-line bg-gradient-to-b from-transparent via-clay/40 to-transparent" />
                        </div>
                      )}

                      {step === "processing" && (
                        <div className="absolute inset-0 grid place-items-center rounded-3xl bg-white/80 backdrop-blur-sm">
                          <div className="flex flex-col items-center gap-3">
                            <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-oat border-t-caramel" />
                            <p className="text-sm font-semibold text-espresso">
                              กำลังตรวจสอบการชำระเงิน…
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* barcode */}
                    <div className="mt-5 rounded-3xl bg-white px-5 py-4 shadow-card ring-1 ring-espresso/5">
                      <div className="flex h-14 items-stretch justify-center gap-[2px]">
                        {bars.map((w, i) => (
                          <span
                            key={i}
                            className="bg-espresso"
                            style={{ width: w, opacity: i % 4 === 0 ? 0.55 : 1 }}
                          />
                        ))}
                      </div>
                      <p className="mt-2 text-center font-mono text-xs tracking-[0.35em] text-espresso-muted">
                        CAFE {orderNo} TH
                      </p>
                    </div>

                    <button
                      onClick={simulatePay}
                      disabled={step === "processing"}
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-caramel py-4 font-semibold text-white shadow-card transition-all active:scale-[0.98] disabled:opacity-60"
                    >
                      <ScanLine size={20} />
                      จำลองการสแกนจ่าย
                    </button>
                    <p className="mt-3 text-center text-xs text-espresso-muted">
                      * เดโมเท่านั้น — ปุ่มนี้จำลองการชำระเงินสำเร็จ
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
