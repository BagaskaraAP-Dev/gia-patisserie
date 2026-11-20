type QrisField = { id: string; value: string };

// CRC16-CCITT (poly 0x1021, init 0xFFFF) over the payload including the "6304" tag header.
export function crc16(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit++) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

export function hasValidChecksum(qris: string): boolean {
  const body = qris.slice(0, -4);
  return body.endsWith("6304") && crc16(body) === qris.slice(-4).toUpperCase();
}

function parseFields(qris: string): QrisField[] {
  const fields: QrisField[] = [];
  let i = 0;
  while (i < qris.length) {
    const id = qris.slice(i, i + 2);
    const lengthText = qris.slice(i + 2, i + 4);
    if (!/^\d{2}$/.test(id) || !/^\d{2}$/.test(lengthText)) {
      throw new Error("format QRIS tidak dikenali");
    }
    const length = Number(lengthText);
    const value = qris.slice(i + 4, i + 4 + length);
    if (value.length !== length) throw new Error("kode QRIS terpotong");
    fields.push({ id, value });
    i += 4 + length;
  }
  return fields;
}

// Tag 01 "11" means the payer types the amount; "12" plus tag 54 makes the app show a fixed amount.
export function toDynamicQris(staticQris: string, amount: number): string {
  const qris = staticQris.trim();
  if (!hasValidChecksum(qris)) throw new Error("checksum QRIS tidak cocok");
  if (!Number.isInteger(amount) || amount <= 0 || String(amount).length > 13) {
    throw new Error("nominal tidak valid");
  }

  const fields = parseFields(qris).filter((f) => f.id !== "54" && f.id !== "63");
  const initiation = fields.find((f) => f.id === "01");
  if (!initiation) throw new Error("tag 01 QRIS tidak ditemukan");
  initiation.value = "12";
  fields.push({ id: "54", value: String(amount) });
  fields.sort((a, b) => Number(a.id) - Number(b.id));

  const body =
    fields.map((f) => f.id + String(f.value.length).padStart(2, "0") + f.value).join("") + "6304";
  return body + crc16(body);
}
