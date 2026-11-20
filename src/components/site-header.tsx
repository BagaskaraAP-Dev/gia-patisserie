import Image from "next/image";
import logo from "@/assets/logo-gia.webp";
import { CartButton } from "./cart-controls";

const links = [
  { href: "#menu", label: "Menu" },
  { href: "#cara-pesan", label: "Cara pesan" },
  { href: "#kontak", label: "Kontak" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-blush/95">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <a href="#top" className="flex min-w-0 items-center gap-2.5 rounded-lg">
          <Image src={logo} alt="" sizes="40px" className="size-10 shrink-0 rounded-full" />
          <span className="truncate font-script text-lg text-burgundy min-[360px]:text-xl min-[400px]:text-2xl">Gia&apos;s Patisserie</span>
        </a>
        <nav aria-label="Navigasi utama" className="ml-auto hidden md:block">
          <ul className="flex gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="rounded-lg px-3 py-2.5 font-bold text-ink transition-colors hover:bg-pink-soft"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto shrink-0 md:ml-2">
          <CartButton />
        </div>
      </div>
    </header>
  );
}
