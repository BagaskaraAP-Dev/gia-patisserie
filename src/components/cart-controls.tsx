"use client";

import { FaWhatsapp } from "react-icons/fa6";
import { PiShoppingBagOpenBold } from "react-icons/pi";
import { chatAdminLink } from "@/data/shop";
import { cartSummary, useCart } from "@/lib/cart-store";
import { rupiah } from "@/lib/format";
import { useOrderUi } from "./order-ui";

export function CartButton() {
  const { openCheckout } = useOrderUi();
  const { count } = cartSummary(useCart());
  return (
    <button
      type="button"
      onClick={openCheckout}
      aria-label={count > 0 ? `Buka keranjang, ${count} item` : "Buka keranjang, masih kosong"}
      className="inline-flex h-11 items-center gap-2 rounded-full border-2 border-burgundy px-3.5 font-extrabold text-burgundy transition-colors hover:bg-pink-soft"
    >
      <PiShoppingBagOpenBold aria-hidden="true" className="size-5" />
      <span className="hidden sm:inline">Keranjang</span>
      {count > 0 && (
        <span className="grid h-6 min-w-6 place-items-center rounded-full bg-cherry px-1.5 text-xs text-white">
          {count}
        </span>
      )}
    </button>
  );
}

export function CartBar() {
  const { openCheckout } = useOrderUi();
  const { count, total } = cartSummary(useCart());
  if (count === 0) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6">
      <button
        type="button"
        onClick={openCheckout}
        className="pointer-events-auto mx-auto flex w-full max-w-xl items-center justify-between gap-3 rounded-2xl bg-burgundy py-3 pl-4 pr-3 text-left text-white shadow-[0_10px_30px_-8px_rgb(55_7_20/0.55)] ring-2 ring-pink transition-colors hover:bg-ink sm:pl-5"
      >
        <span className="min-w-0">
          <span className="block text-sm text-pink-soft">
            {count} item<span className="hidden min-[380px]:inline"> di keranjang</span>
          </span>
          <span className="block text-xl font-extrabold tabular-nums">{rupiah(total)}</span>
        </span>
        <span className="whitespace-nowrap rounded-xl bg-white px-4 py-2.5 font-extrabold text-burgundy">
          Pesan &amp; bayar
        </span>
      </button>
    </div>
  );
}

export function ChatAdminButton() {
  const { count } = cartSummary(useCart());
  return (
    <a
      href={chatAdminLink}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed right-3 z-30 inline-flex h-12 items-center gap-2 rounded-full border-2 border-burgundy bg-white font-extrabold text-burgundy shadow-[0_8px_24px_-10px_rgb(55_7_20/0.6)] transition-colors hover:bg-pink-soft sm:right-6 sm:pl-3 sm:pr-4 ${
        count > 0
          ? "bottom-[calc(6rem+env(safe-area-inset-bottom))] w-12 justify-center sm:w-auto"
          : "bottom-[max(1rem,env(safe-area-inset-bottom))] pl-3 pr-4"
      }`}
    >
      <FaWhatsapp aria-hidden="true" className="size-6 shrink-0" />
      {/* Icon-only on phones while the cart bar is showing, so the two floating controls don't cover the menu. */}
      <span className={count > 0 ? "sr-only sm:not-sr-only" : ""}>Chat admin</span>
    </a>
  );
}
