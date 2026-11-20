import { rupiah, shortPrice } from "@/lib/format";

// Wavy-edged seal echoing the red price badges on the printed menu.
const SEAL_PATH = (() => {
  const scallops = 14;
  const steps = 168;
  const points: string[] = [];
  for (let i = 0; i < steps; i++) {
    const angle = (i / steps) * Math.PI * 2;
    const radius = 46 + 4 * Math.cos(scallops * angle);
    points.push(`${(radius * Math.cos(angle)).toFixed(2)},${(radius * Math.sin(angle)).toFixed(2)}`);
  }
  return `M${points.join("L")}Z`;
})();

type PriceSealProps = {
  price: number;
  size?: "md" | "lg";
  className?: string;
};

// className must set the position (relative or absolute): the seal artwork is laid out against it.
export function PriceSeal({ price, size = "md", className = "relative" }: PriceSealProps) {
  const sizing = size === "lg" ? "size-16 text-lg" : "size-12 text-sm";
  return (
    <span className={`inline-grid shrink-0 place-items-center ${sizing} ${className}`}>
      <svg viewBox="-50 -50 100 100" aria-hidden="true" className="absolute inset-0 size-full fill-cherry">
        <path d={SEAL_PATH} />
      </svg>
      <span aria-hidden="true" className="relative font-extrabold tracking-tight text-white">
        {shortPrice(price)}
      </span>
      <span className="sr-only">Harga {rupiah(price)}</span>
    </span>
  );
}
