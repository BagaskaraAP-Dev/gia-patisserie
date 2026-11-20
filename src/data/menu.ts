import type { StaticImageData } from "next/image";
import chocolateChip from "@/assets/menu/classic-chocolate-chip.webp";
import redVelvet from "@/assets/menu/red-velvet-cheese.webp";
import matcha from "@/assets/menu/matcha.webp";
import strawberry from "@/assets/menu/strawberry-cheese.webp";
import ube from "@/assets/menu/ube-cheese.webp";
import marshmallow from "@/assets/menu/marshmallow.webp";
import brownies from "@/assets/menu/fudgy-almond-brownies.webp";

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: StaticImageData;
  imageAlt: string;
};

export const cookies: MenuItem[] = [
  {
    id: "classic-chocolate-chip",
    name: "Classic Chocolate Chip Cookies",
    description: "Brown butter, 60% dark chocolate chips, hints of vanilla",
    price: 7000,
    image: chocolateChip,
    imageAlt: "Cookie cokelat chip dengan potongan dark chocolate",
  },
  {
    id: "red-velvet-cheese",
    name: "Redvelvet Cheese Cookies",
    description:
      "Classic red velvet dough, smooth plain red exterior, rich molten cream cheese filling inside, hints of vanilla",
    price: 7000,
    image: redVelvet,
    imageAlt: "Cookie red velvet terbelah dengan isian cream cheese lumer",
  },
  {
    id: "matcha",
    name: "Matcha Cookies",
    description: "Choco chunk matcha, crunchy",
    price: 7000,
    image: matcha,
    imageAlt: "Cookie matcha hijau dengan potongan cokelat putih",
  },
  {
    id: "strawberry-cheese",
    name: "Strawberry Cheese Cookies",
    description:
      "Sweet strawberry puree & selai swirls, creamy cheese chunks, hints of white chocolate",
    price: 7000,
    image: strawberry,
    imageAlt: "Cookie dengan pusaran selai stroberi dan potongan keju",
  },
  {
    id: "ube-cheese",
    name: "Ube Cheese Cookies",
    description:
      "Rich purple yam (taro) dough, smooth plain vibrant purple exterior, rich cheese chunks inside, premium white chocolate inside",
    price: 7000,
    image: ube,
    imageAlt: "Cookie ungu ube terbelah dengan isian keju",
  },
];

export const specials: MenuItem[] = [
  {
    id: "marshmallow",
    name: "Marshmallow Cookies",
    description: "Chocolate and vanilla dough, gooey marshmallow center",
    price: 10000,
    image: marshmallow,
    imageAlt: "Cookie cokelat vanila dengan marshmallow meleleh di tengah",
  },
  {
    id: "fudgy-almond-brownies",
    name: "Fudgy Almond Brownies",
    description: "Rich chocolate brownies with crunchy almonds",
    price: 10000,
    image: brownies,
    imageAlt: "Brownies cokelat bertabur irisan almond dalam wadah aluminium",
  },
];

export const menu: MenuItem[] = [...cookies, ...specials];

export const menuById: ReadonlyMap<string, MenuItem> = new Map(menu.map((item) => [item.id, item]));
