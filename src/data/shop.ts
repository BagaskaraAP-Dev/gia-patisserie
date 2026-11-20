export const shop = {
  name: "Gia's Patisserie",
  city: "Palembang",
  whatsapp: "6289684340271",
  whatsappDisplay: "0896-8434-0271",
  instagram: { handle: "@giaa_patisserie", url: "https://www.instagram.com/giaa_patisserie" },
  tiktok: { handle: "@gia90391", url: "https://www.tiktok.com/@gia90391" },
  shopee: { url: "https://s.shopee.co.id/1gKFG4Rn0i" },
  qris: {
    merchantName: "gia patisserie",
    nmid: "ID1026527283224",
    // Decoded from the printed static QRIS sticker; each order gets its amount injected by toDynamicQris.
    static:
      "00020101021126570011ID.DANA.WWW011893600915302762811302090276281130303UMI51440014ID.CO.QRIS.WWW0215ID10265272832240303UMI5204581253033605802ID5914gia patisserie6014Kota Palembang6105301496304EA5E",
  },
} as const;

export function whatsappLink(message: string): string {
  return `https://wa.me/${shop.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const chatAdminLink = whatsappLink(`Halo ${shop.name}, saya mau tanya soal kukisnya.`);
