// Hand-rolled so server and browser render the same string regardless of ICU data.
export function rupiah(amount: number): string {
  return "Rp" + String(Math.round(amount)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function shortPrice(amount: number): string {
  return amount % 1000 === 0 ? `${amount / 1000}K` : rupiah(amount);
}
