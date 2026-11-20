import { useSyncExternalStore } from "react";
import { menu, menuById, type MenuItem } from "@/data/menu";

export type Cart = Readonly<Record<string, number>>;
export type CartLine = { item: MenuItem; qty: number; subtotal: number };

const STORAGE_KEY = "gia-cart-v1";
export const MAX_QTY = 50;
const EMPTY: Cart = {};

let cart: Cart = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function sanitize(raw: unknown): Cart {
  if (!raw || typeof raw !== "object") return EMPTY;
  const clean: Record<string, number> = {};
  for (const [id, qty] of Object.entries(raw)) {
    if (menuById.has(id) && Number.isInteger(qty) && qty > 0) clean[id] = Math.min(qty, MAX_QTY);
  }
  return clean;
}

function load() {
  if (loaded) return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) cart = sanitize(JSON.parse(raw));
  } catch {
    // Private mode or blocked storage: the cart still works, it just won't survive a reload.
  }
}

function commit(next: Cart) {
  cart = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {}
  listeners.forEach((listener) => listener());
}

export function setQty(id: string, qty: number) {
  load();
  const next: Record<string, number> = { ...cart };
  if (qty <= 0) delete next[id];
  else next[id] = Math.min(qty, MAX_QTY);
  commit(next);
}

export function clearCart() {
  commit(EMPTY);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): Cart {
  load();
  return cart;
}

export function useCart(): Cart {
  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
}

export function cartLines(current: Cart): CartLine[] {
  return menu
    .filter((item) => current[item.id])
    .map((item) => ({ item, qty: current[item.id], subtotal: item.price * current[item.id] }));
}

export function cartSummary(current: Cart) {
  const lines = cartLines(current);
  return {
    lines,
    count: lines.reduce((sum, line) => sum + line.qty, 0),
    total: lines.reduce((sum, line) => sum + line.subtotal, 0),
  };
}
