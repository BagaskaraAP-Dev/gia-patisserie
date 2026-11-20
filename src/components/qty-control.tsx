"use client";

import { useRef } from "react";
import { PiMinusBold, PiPlusBold } from "react-icons/pi";
import type { MenuItem } from "@/data/menu";
import { MAX_QTY, setQty, useCart } from "@/lib/cart-store";

type QtyControlProps = {
  item: MenuItem;
  // Called when the quantity drops to zero, so the parent can move focus somewhere that still exists.
  onEmpty?: () => void;
};

export function QtyControl({ item, onEmpty }: QtyControlProps) {
  const qty = useCart()[item.id] ?? 0;
  const plusRef = useRef<HTMLButtonElement>(null);

  function decrease() {
    if (qty - 1 <= 0) {
      if (onEmpty) onEmpty();
      else plusRef.current?.focus();
    }
    setQty(item.id, qty - 1);
  }

  return (
    <div className="inline-flex items-center gap-1.5">
      {qty > 0 && (
        <>
          <button
            type="button"
            onClick={decrease}
            aria-label={`Kurangi ${item.name}`}
            className="grid size-11 place-items-center rounded-full border-2 border-burgundy text-burgundy transition-colors hover:bg-pink-soft active:translate-y-px"
          >
            <PiMinusBold aria-hidden="true" className="size-4" />
          </button>
          <span aria-live="polite" className="min-w-8 text-center text-lg font-extrabold tabular-nums">
            <span className="sr-only">Jumlah </span>
            {qty}
          </span>
        </>
      )}
      <button
        ref={plusRef}
        type="button"
        onClick={() => setQty(item.id, qty + 1)}
        disabled={qty >= MAX_QTY}
        aria-label={qty === 0 ? `Tambah ${item.name} ke keranjang` : `Tambah satu ${item.name}`}
        className={`inline-flex h-11 items-center justify-center gap-1.5 rounded-full bg-burgundy font-extrabold text-white transition-colors hover:bg-ink active:translate-y-px disabled:opacity-50 ${
          qty === 0 ? "px-4" : "w-11"
        }`}
      >
        <PiPlusBold aria-hidden="true" className="size-4" />
        {qty === 0 && <span>Tambah</span>}
      </button>
    </div>
  );
}
