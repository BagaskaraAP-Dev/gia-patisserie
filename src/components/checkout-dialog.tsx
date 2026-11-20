"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode, type RefObject } from "react";
import { FaWhatsapp } from "react-icons/fa6";
import { PiArrowLeftBold, PiDownloadSimpleBold, PiXBold } from "react-icons/pi";
import { shop, whatsappLink } from "@/data/shop";
import { cartSummary, clearCart, useCart, type CartLine } from "@/lib/cart-store";
import { rupiah } from "@/lib/format";
import { toDynamicQris } from "@/lib/qris";
import { useOrderUi } from "./order-ui";
import { QtyControl } from "./qty-control";

type Fulfilment = "pickup" | "delivery";
type Customer = { name: string; phone: string; fulfilment: Fulfilment; address: string; note: string };
type FieldErrors = Partial<Record<"name" | "phone" | "address", string>>;
type Order = { code: string; customer: Customer; lines: CartLine[]; total: number };
type Payment =
  | { status: "loading" }
  | { status: "ready"; qrUrl: string }
  | { status: "error"; reason: string };

const emptyCustomer: Customer = { name: "", phone: "", fulfilment: "pickup", address: "", note: "" };
const PHONE_PATTERN = /^(?:\+?62|0)8\d{7,11}$/;

function normalizePhone(raw: string) {
  return raw.replace(/[\s.()-]/g, "");
}

function validate(customer: Customer): FieldErrors {
  const errors: FieldErrors = {};
  if (!customer.name.trim()) errors.name = "Isi nama pemesan.";
  if (!PHONE_PATTERN.test(normalizePhone(customer.phone))) {
    errors.phone = "Nomor WhatsApp belum benar. Contoh: 0812 3456 7890.";
  }
  if (customer.fulfilment === "delivery" && customer.address.trim().length < 10) {
    errors.address = "Tulis alamat lengkap supaya admin bisa menghitung ongkir.";
  }
  return errors;
}

function newOrderCode() {
  const now = new Date();
  const date = `${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const suffix = Array.from(crypto.getRandomValues(new Uint8Array(4)), (b) => alphabet[b % alphabet.length]);
  return `GIA-${date}-${suffix.join("")}`;
}

function sameLines(a: CartLine[], b: CartLine[]) {
  return a.length === b.length && a.every((line, i) => line.item.id === b[i].item.id && line.qty === b[i].qty);
}

function orderMessage(order: Order, paid: boolean) {
  const { customer } = order;
  return [
    paid
      ? `Halo ${shop.name}, saya sudah bayar pesanan ini lewat QRIS.`
      : `Halo ${shop.name}, saya mau pesan ini. QRIS di website tidak muncul, boleh minta cara bayarnya?`,
    "",
    `Kode pesanan: ${order.code}`,
    `Nama: ${customer.name.trim()}`,
    `WhatsApp: ${normalizePhone(customer.phone)}`,
    `Cara terima: ${customer.fulfilment === "delivery" ? "Diantar" : "Ambil sendiri"}`,
    ...(customer.fulfilment === "delivery" ? [`Alamat: ${customer.address.trim()}`] : []),
    "",
    "Pesanan:",
    ...order.lines.map((line) => `- ${line.qty}x ${line.item.name} = ${rupiah(line.subtotal)}`),
    `Total${paid ? " dibayar" : ""}: ${rupiah(order.total)}`,
    ...(customer.note.trim() ? ["", `Catatan: ${customer.note.trim()}`] : []),
    ...(paid ? ["", "Screenshot bukti bayar saya kirim di chat ini."] : []),
  ].join("\n");
}

export function CheckoutDialog() {
  const { checkoutOpen, closeCheckout } = useOrderUi();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const titleId = useId();
  const { lines, total } = cartSummary(useCart());

  const [customer, setCustomer] = useState<Customer>(emptyCustomer);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [order, setOrder] = useState<Order | null>(null);
  const [payment, setPayment] = useState<Payment>({ status: "loading" });
  const [proofSent, setProofSent] = useState(false);

  // An order whose cart was edited afterwards no longer matches its QR amount, so fall back to the form.
  const activeOrder = order && sameLines(order.lines, lines) ? order : null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (checkoutOpen && !dialog.open) dialog.showModal();
    if (!checkoutOpen && dialog.open) dialog.close();
  }, [checkoutOpen]);

  useEffect(() => {
    if (activeOrder) headingRef.current?.focus();
  }, [activeOrder]);

  async function createPayment(target: Order) {
    setPayment({ status: "loading" });
    try {
      const payload = toDynamicQris(shop.qris.static, target.total);
      const QRCode = (await import("qrcode")).default;
      const qrUrl = await QRCode.toDataURL(payload, { errorCorrectionLevel: "M", margin: 2, width: 600 });
      setPayment({ status: "ready", qrUrl });
    } catch (error) {
      setPayment({ status: "error", reason: error instanceof Error ? error.message : "kesalahan tidak dikenal" });
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate(customer);
    setErrors(found);
    const firstInvalid = (["name", "phone", "address"] as const).find((key) => found[key]);
    if (firstInvalid) {
      document.getElementById(`${titleId}-${firstInvalid}`)?.focus();
      return;
    }
    const next: Order = { code: newOrderCode(), customer, lines, total };
    setOrder(next);
    setProofSent(false);
    void createPayment(next);
  }

  function finish() {
    clearCart();
    setOrder(null);
    setCustomer(emptyCustomer);
    setErrors({});
    closeCheckout();
  }

  function update<K extends keyof Customer>(key: K, value: Customer[K]) {
    setCustomer((current) => ({ ...current, [key]: value }));
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={closeCheckout}
      onClick={(event) => {
        if (event.target === event.currentTarget) closeCheckout();
      }}
      className="m-0 mt-auto max-h-[92dvh] w-full max-w-none overflow-y-auto overscroll-contain rounded-t-3xl border-0 bg-blush p-0 text-ink backdrop:bg-ink/55 sm:m-auto sm:max-h-[90dvh] sm:max-w-lg sm:rounded-3xl"
    >
      {activeOrder ? (
        <PayStep
          order={activeOrder}
          payment={payment}
          proofSent={proofSent}
          titleId={titleId}
          headingRef={headingRef}
          onBack={() => setOrder(null)}
          onClose={closeCheckout}
          onRetry={() => void createPayment(activeOrder)}
          onProofSent={() => setProofSent(true)}
          onFinish={finish}
        />
      ) : (
        <>
          <DialogHeader titleId={titleId} headingRef={headingRef} title="Pesananmu" onClose={closeCheckout} />
          {lines.length === 0 ? (
            <div className="px-5 pb-10 pt-8 text-center">
              <p className="text-lg font-extrabold">Keranjangmu masih kosong.</p>
              <p className="mt-1 text-muted">Pilih kukis dari menu, nanti muncul di sini.</p>
              <a href="#menu" onClick={closeCheckout} className="btn-primary mt-6">
                Lihat menu
              </a>
            </div>
          ) : (
            <form noValidate onSubmit={submit} className="px-5 pb-6">
              <ul className="divide-y divide-line">
                {lines.map((line) => (
                  <li key={line.item.id} className="flex flex-wrap items-center gap-x-3 gap-y-2 py-3">
                    <Image
                      src={line.item.image}
                      alt=""
                      sizes="56px"
                      className="size-14 shrink-0 rounded-full bg-pink-soft object-contain p-1"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold leading-snug">{line.item.name}</p>
                      <p className="text-sm text-muted tabular-nums">
                        {rupiah(line.item.price)} × {line.qty} = {rupiah(line.subtotal)}
                      </p>
                    </div>
                    <QtyControl item={line.item} onEmpty={() => headingRef.current?.focus()} />
                  </li>
                ))}
              </ul>
              <p className="flex justify-between border-t-2 border-burgundy pt-3 text-lg font-extrabold tabular-nums">
                <span>Total</span>
                <span>{rupiah(total)}</span>
              </p>

              <div className="mt-6 space-y-5">
                <Field id={`${titleId}-name`} label="Nama" error={errors.name}>
                  <input
                    id={`${titleId}-name`}
                    autoComplete="name"
                    value={customer.name}
                    onChange={(e) => update("name", e.target.value)}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? `${titleId}-name-error` : undefined}
                    placeholder="Nama kamu"
                    className="field"
                  />
                </Field>
                <Field
                  id={`${titleId}-phone`}
                  label="Nomor WhatsApp"
                  hint="Admin mengabari pesananmu lewat nomor ini."
                  error={errors.phone}
                >
                  <input
                    id={`${titleId}-phone`}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={customer.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={`${titleId}-phone-hint${errors.phone ? ` ${titleId}-phone-error` : ""}`}
                    placeholder="08xx xxxx xxxx"
                    className="field"
                  />
                </Field>

                <fieldset>
                  <legend className="font-extrabold">Cara terima</legend>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    <FulfilmentOption
                      value="pickup"
                      checked={customer.fulfilment === "pickup"}
                      onSelect={() => update("fulfilment", "pickup")}
                      title="Ambil sendiri"
                      detail="Admin mengabari lokasi dan jam ambil lewat WhatsApp."
                    />
                    <FulfilmentOption
                      value="delivery"
                      checked={customer.fulfilment === "delivery"}
                      onSelect={() => update("fulfilment", "delivery")}
                      title="Diantar"
                      detail="Ongkir dihitung admin dari alamatmu, dibayar terpisah."
                    />
                  </div>
                </fieldset>

                {customer.fulfilment === "delivery" && (
                  <Field id={`${titleId}-address`} label="Alamat lengkap" error={errors.address}>
                    <textarea
                      id={`${titleId}-address`}
                      rows={3}
                      autoComplete="street-address"
                      value={customer.address}
                      onChange={(e) => update("address", e.target.value)}
                      aria-invalid={Boolean(errors.address)}
                      aria-describedby={errors.address ? `${titleId}-address-error` : undefined}
                      placeholder="Jalan, nomor rumah, kelurahan, patokan"
                      className="field resize-y"
                    />
                  </Field>
                )}

                <Field id={`${titleId}-note`} label="Catatan (opsional)">
                  <textarea
                    id={`${titleId}-note`}
                    rows={2}
                    value={customer.note}
                    onChange={(e) => update("note", e.target.value)}
                    placeholder="Misalnya jam kamu bisa ambil"
                    className="field resize-y"
                  />
                </Field>
              </div>

              <button type="submit" className="btn-primary mt-7 w-full text-lg">
                Tampilkan QRIS {rupiah(total)}
              </button>
              <p className="mt-3 text-sm text-muted">
                Data ini hanya dipakai untuk pesan WhatsApp ke admin dan tidak disimpan di server.
              </p>
            </form>
          )}
        </>
      )}
    </dialog>
  );
}

type HeaderProps = {
  title: string;
  titleId: string;
  headingRef: RefObject<HTMLHeadingElement | null>;
  onClose: () => void;
  onBack?: () => void;
};

function DialogHeader({ title, titleId, headingRef, onClose, onBack }: HeaderProps) {
  return (
    <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-line bg-blush px-3 py-2">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="Kembali ubah pesanan"
          className="grid size-11 place-items-center rounded-full text-burgundy hover:bg-pink-soft"
        >
          <PiArrowLeftBold aria-hidden="true" className="size-5" />
        </button>
      )}
      <h2
        ref={headingRef}
        id={titleId}
        tabIndex={-1}
        className={`flex-1 font-script text-3xl text-burgundy focus:outline-none ${onBack ? "" : "pl-2"}`}
      >
        {title}
      </h2>
      <button
        type="button"
        onClick={onClose}
        aria-label="Tutup"
        className="grid size-11 place-items-center rounded-full text-burgundy hover:bg-pink-soft"
      >
        <PiXBold aria-hidden="true" className="size-5" />
      </button>
    </div>
  );
}

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="font-extrabold">
        {label}
      </label>
      {children}
      {hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm font-bold text-cherry">
          {error}
        </p>
      )}
    </div>
  );
}

function FulfilmentOption({
  value,
  checked,
  onSelect,
  title,
  detail,
}: {
  value: Fulfilment;
  checked: boolean;
  onSelect: () => void;
  title: string;
  detail: string;
}) {
  return (
    <label
      className={`flex cursor-pointer gap-3 rounded-xl border-2 p-3 transition-colors ${
        checked ? "border-burgundy bg-white" : "border-line hover:border-field"
      }`}
    >
      <input
        type="radio"
        name="fulfilment"
        value={value}
        checked={checked}
        onChange={onSelect}
        className="mt-0.5 size-5 shrink-0 accent-burgundy"
      />
      <span>
        <span className="block font-extrabold">{title}</span>
        <span className="block text-sm text-muted">{detail}</span>
      </span>
    </label>
  );
}

type PayStepProps = {
  order: Order;
  payment: Payment;
  proofSent: boolean;
  titleId: string;
  headingRef: RefObject<HTMLHeadingElement | null>;
  onBack: () => void;
  onClose: () => void;
  onRetry: () => void;
  onProofSent: () => void;
  onFinish: () => void;
};

function PayStep({
  order,
  payment,
  proofSent,
  titleId,
  headingRef,
  onBack,
  onClose,
  onRetry,
  onProofSent,
  onFinish,
}: PayStepProps) {
  return (
    <>
      <DialogHeader
        title="Bayar pakai QRIS"
        titleId={titleId}
        headingRef={headingRef}
        onClose={onClose}
        onBack={onBack}
      />
      <div className="px-5 pb-6 pt-4">
        <p className="text-sm text-muted">
          Kode pesanan <span className="font-extrabold text-ink">{order.code}</span>
        </p>

        <div className="mt-3 rounded-3xl bg-white px-5 pb-5 pt-4 text-center ring-1 ring-line">
          {payment.status === "loading" && (
            <div
              role="status"
              className="mx-auto grid aspect-square w-full max-w-64 place-items-center rounded-2xl bg-pink-soft px-6 font-bold text-muted"
            >
              Menyiapkan QRIS…
            </div>
          )}
          {payment.status === "ready" && (
            <Image
              src={payment.qrUrl}
              alt={`Kode QRIS untuk membayar ${rupiah(order.total)} ke ${shop.qris.merchantName}`}
              width={600}
              height={600}
              unoptimized
              className="mx-auto aspect-square w-full max-w-64"
            />
          )}
          {payment.status === "error" && (
            <div role="alert" className="mx-auto max-w-sm rounded-2xl bg-pink-soft p-4 text-left">
              <p className="font-extrabold">QRIS belum bisa dibuat ({payment.reason}).</p>
              <p className="mt-1 text-sm text-muted">
                Coba sekali lagi. Kalau masih gagal, kirim pesananmu ke admin lewat WhatsApp untuk minta cara
                bayar lain.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" onClick={onRetry} className="btn-primary">
                  Coba lagi
                </button>
                <a
                  href={whatsappLink(orderMessage(order, false))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  Pesan lewat WhatsApp
                </a>
              </div>
            </div>
          )}
          <p className="mt-3 text-3xl font-extrabold tabular-nums text-burgundy">{rupiah(order.total)}</p>
          <p className="text-sm text-muted">
            {shop.qris.merchantName} · NMID {shop.qris.nmid}
          </p>
        </div>

        <ol className="mt-5 list-decimal space-y-1.5 pl-5 leading-relaxed marker:font-extrabold marker:text-burgundy">
          <li>Buka aplikasi pembayaran yang berlogo QRIS, lalu scan kode di atas.</li>
          <li>
            Nominal {rupiah(order.total)} sudah terisi. Pastikan penerimanya <b>{shop.qris.merchantName}</b>, lalu
            masukkan PIN.
          </li>
          <li>Kirim bukti bayar ke admin lewat tombol WhatsApp di bawah.</li>
        </ol>
        <p className="mt-4 rounded-xl bg-pink-soft p-3 text-sm leading-relaxed">
          Pesan dari HP ini? Simpan gambar QR, lalu di aplikasi pembayaran pilih scan dari galeri.
        </p>

        <div className="mt-5 grid gap-2.5">
          <a
            href={whatsappLink(orderMessage(order, true))}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onProofSent}
            className="btn-primary text-lg"
          >
            <FaWhatsapp aria-hidden="true" className="size-6" />
            Kirim bukti bayar ke WhatsApp
          </a>
          {payment.status === "ready" && (
            <a href={payment.qrUrl} download={`QRIS-${order.code}.png`} className="btn-secondary">
              <PiDownloadSimpleBold aria-hidden="true" className="size-5" />
              Simpan gambar QR
            </a>
          )}
        </div>

        {proofSent && (
          <div role="status" className="mt-5 rounded-2xl border-2 border-burgundy bg-white p-4">
            <p className="font-extrabold">WhatsApp sudah dibuka.</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              Lampirkan screenshot bukti bayar di chat itu. Setelah terkirim, kosongkan keranjang di sini.
            </p>
            <button type="button" onClick={onFinish} className="btn-secondary mt-3 w-full">
              Selesai, kosongkan keranjang
            </button>
          </div>
        )}
      </div>
    </>
  );
}
