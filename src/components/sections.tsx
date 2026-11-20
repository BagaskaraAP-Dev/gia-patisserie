import Image from "next/image";
import { FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa6";
import { SiShopee } from "react-icons/si";
import logo from "@/assets/logo-gia.webp";
import chocolateChip from "@/assets/menu/classic-chocolate-chip.webp";
import redVelvet from "@/assets/menu/red-velvet-cheese.webp";
import strawberry from "@/assets/menu/strawberry-cheese.webp";
import { cookies, specials, type MenuItem } from "@/data/menu";
import { chatAdminLink, shop } from "@/data/shop";
import { PriceSeal } from "./price-seal";
import { QtyControl } from "./qty-control";

export function Intro() {
  return (
    <section aria-labelledby="intro-title" className="overflow-hidden bg-pink">
      <div className="mx-auto grid max-w-6xl items-center gap-6 px-4 pb-12 pt-8 sm:px-6 md:grid-cols-[1.05fr_1fr] md:gap-10 md:pb-20 md:pt-14">
        <div>
          <h1
            id="intro-title"
            className="font-script text-[clamp(2.9rem,9vw,5rem)] leading-[1.05] text-burgundy md:text-[clamp(3rem,5.6vw,5rem)]"
          >
            Kukis rumahan dari dapur Gia
          </h1>
          <p className="mt-4 max-w-md text-lg leading-relaxed">
            Pilih kukisnya di sini, lalu bayar pakai QRIS. Nominalnya sudah terisi waktu kamu scan, jadi
            tinggal masukkan PIN.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a href="#menu" className="btn-primary">
              Pilih kukis
            </a>
            <a href={chatAdminLink} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              Tanya admin dulu
            </a>
          </div>
        </div>
        <CookieStack />
      </div>
    </section>
  );
}

// The printed sticker sits on top of three cookies, like a label on a box of cookies.
function CookieStack() {
  return (
    <div className="relative mx-auto aspect-[6/5] w-full max-w-[26rem]" aria-hidden="true">
      <Image
        src={chocolateChip}
        alt=""
        loading="eager"
        sizes="(min-width: 768px) 210px, 46vw"
        className="absolute right-[2%] top-[2%] w-[48%] rotate-6"
      />
      <Image
        src={strawberry}
        alt=""
        loading="eager"
        sizes="(min-width: 768px) 190px, 42vw"
        className="absolute bottom-[2%] right-[8%] w-[42%] -rotate-12"
      />
      <Image
        src={redVelvet}
        alt=""
        loading="eager"
        sizes="(min-width: 768px) 200px, 44vw"
        className="absolute bottom-0 left-[14%] w-[44%] rotate-3"
      />
      <Image
        src={logo}
        alt=""
        loading="eager"
        sizes="(min-width: 768px) 180px, 40vw"
        className="absolute left-[2%] top-[4%] w-[42%] -rotate-[8deg] rounded-full shadow-[0_12px_28px_-10px_rgb(55_7_20/0.55)]"
      />
    </div>
  );
}

function CookieRow({ item }: { item: MenuItem }) {
  return (
    <li className="flex gap-4 border-b border-line py-5">
      <div className="relative shrink-0">
        <div className="grid size-24 place-items-center rounded-full bg-pink-soft md:size-28">
          <Image
            src={item.image}
            alt={item.imageAlt}
            sizes="(min-width: 768px) 112px, 96px"
            className="size-[5.5rem] object-contain md:size-[6.5rem]"
          />
        </div>
        <PriceSeal price={item.price} className="absolute -left-2 -top-2" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <h4 className="text-lg font-extrabold leading-snug">{item.name}</h4>
        <p className="mt-1 text-[0.95rem] italic leading-relaxed text-muted">{item.description}</p>
        <div className="mt-auto pt-3">
          <QtyControl item={item} />
        </div>
      </div>
    </li>
  );
}

function SpecialCard({ item }: { item: MenuItem }) {
  return (
    <li className="relative flex flex-col rounded-[2rem] bg-pink p-5 sm:p-6">
      <PriceSeal price={item.price} size="lg" className="absolute left-4 top-4 z-10" />
      <Image
        src={item.image}
        alt={item.imageAlt}
        sizes="(min-width: 640px) 320px, 80vw"
        className="mx-auto h-44 w-auto max-w-full object-contain sm:h-52"
      />
      <h4 className="mt-4 text-xl font-extrabold leading-snug">{item.name}</h4>
      <p className="mt-1 italic leading-relaxed text-muted">{item.description}</p>
      <div className="mt-auto pt-4">
        <QtyControl item={item} />
      </div>
    </li>
  );
}

export function MenuSection() {
  return (
    <section id="menu" aria-labelledby="menu-title" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-24">
      <div className="grid gap-8 lg:grid-cols-[16rem_1fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 id="menu-title" className="font-script text-6xl text-burgundy md:text-7xl">
            Menu
          </h2>
          <p className="mt-3 max-w-sm leading-relaxed text-muted">
            Freshly baked cookies, homemade with love. Boleh campur beberapa rasa dalam satu pesanan.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-extrabold text-burgundy">Cookies · 7K</h3>
          <ul className="grid md:grid-cols-2 md:gap-x-10">
            {cookies.map((item) => (
              <CookieRow key={item.id} item={item} />
            ))}
          </ul>
          <h3 className="mt-12 text-lg font-extrabold text-burgundy">Marshmallow &amp; brownies · 10K</h3>
          <ul className="mt-4 grid gap-5 sm:grid-cols-2">
            {specials.map((item) => (
              <SpecialCard key={item.id} item={item} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

const steps = [
  {
    title: "Pilih kukis",
    body: "Tambahkan rasa yang kamu mau ke keranjang. Boleh campur.",
  },
  {
    title: "Isi data pesanan",
    body: "Nama, nomor WhatsApp, dan mau diambil sendiri atau diantar.",
  },
  {
    title: "Scan QRIS",
    body: "QRIS muncul dengan nominal sesuai pesananmu. Cek penerimanya gia patisserie, lalu masukkan PIN.",
  },
  {
    title: "Kirim bukti ke admin",
    body: "Tombol WhatsApp sudah berisi detail pesananmu. Lampirkan screenshot bukti bayar di chat itu.",
  },
];

export function HowToOrder() {
  return (
    <section id="cara-pesan" aria-labelledby="cara-title" className="bg-burgundy text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1fr_1.3fr] md:py-20">
        <div>
          <h2 id="cara-title" className="font-script text-5xl text-pink md:text-6xl">
            Cara pesan
          </h2>
          <p className="mt-4 max-w-sm leading-relaxed text-pink-soft">
            Bayar pakai aplikasi apa saja yang berlogo QRIS: m-banking, DANA, GoPay, OVO, atau ShopeePay.
          </p>
          <p className="mt-3 max-w-sm leading-relaxed text-pink-soft">
            Bisa ambil sendiri atau diantar. Kalau diantar, admin mengabari ongkirnya lewat WhatsApp dan
            ongkir dibayar terpisah.
          </p>
        </div>
        <ol className="grid gap-7">
          {steps.map((step, index) => (
            <li key={step.title} className="grid grid-cols-[2.75rem_1fr] gap-4">
              <span aria-hidden="true" className="font-script text-5xl leading-none text-pink">
                {index + 1}
              </span>
              <div>
                <h3 className="text-lg font-extrabold">{step.title}</h3>
                <p className="mt-1 leading-relaxed text-pink-soft">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const socials = [
  { label: "Instagram", detail: shop.instagram.handle, href: shop.instagram.url, Icon: FaInstagram },
  { label: "TikTok", detail: shop.tiktok.handle, href: shop.tiktok.url, Icon: FaTiktok },
  { label: "Shopee", detail: "Belanja lewat Shopee", href: shop.shopee.url, Icon: SiShopee },
  { label: "WhatsApp", detail: shop.whatsappDisplay, href: chatAdminLink, Icon: FaWhatsapp },
];

export function Contact() {
  return (
    <section id="kontak" aria-labelledby="kontak-title" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-20">
      <div className="grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <h2 id="kontak-title" className="font-script text-5xl text-burgundy md:text-6xl">
            Mau tanya dulu?
          </h2>
          <p className="mt-3 max-w-md leading-relaxed text-muted">
            Soal jam ambil, ongkir ke alamatmu, atau rasa yang sedang tersedia, chat admin langsung di
            WhatsApp.
          </p>
          <a href={chatAdminLink} target="_blank" rel="noopener noreferrer" className="btn-primary mt-6">
            <FaWhatsapp aria-hidden="true" className="size-5" />
            Chat admin di WhatsApp
          </a>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
          {socials.map(({ label, detail, href, Icon }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-16 items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3 transition-colors hover:border-burgundy hover:bg-pink-soft"
              >
                <Icon aria-hidden="true" className="size-6 shrink-0 text-burgundy" />
                <span className="min-w-0">
                  <span className="block font-extrabold">{label}</span>
                  <span className="block truncate text-sm text-muted">{detail}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line pb-32 pt-6 text-sm text-muted">
      <p className="mx-auto max-w-6xl px-4 sm:px-6">
        {shop.name} · Kota {shop.city} · Freshly baked cookies, homemade with love
      </p>
    </footer>
  );
}
