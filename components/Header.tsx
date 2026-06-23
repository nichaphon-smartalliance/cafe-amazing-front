"use client";

import { useEffect, useState } from "react";

export default function Header() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("th-TH", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    tick();
    const id = setInterval(tick, 1000 * 20);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="flex items-center justify-between px-8 pt-7 pb-5">
      <div className="flex items-center gap-4">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-espresso text-2xl text-cream shadow-card">
          <span className="-mt-0.5">☕</span>
        </div>
        <div className="leading-none">
          <p className="font-display text-[1.75rem] font-semibold tracking-tight text-espresso">
            Café Amazing
          </p>
          <p className="mt-1 text-sm font-medium text-espresso-muted">
            สั่งเองง่าย ๆ · จ่ายด้วยการสแกน
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-full bg-surface/80 px-4 py-2 text-sm font-medium text-espresso-muted shadow-inset ring-1 ring-espresso/5 sm:flex">
          <span className="h-2 w-2 animate-pulse rounded-full bg-matcha" />
          เปิดให้บริการ
        </div>
        <div className="rounded-full bg-surface/80 px-4 py-2 font-display text-lg font-semibold tabular-nums text-espresso shadow-inset ring-1 ring-espresso/5">
          {time || "--:--"}
        </div>
      </div>
    </header>
  );
}
