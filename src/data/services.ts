import img1 from "@/assets/1.webp";
import img2 from "@/assets/2.webp";
import img3 from "@/assets/3.webp";
import img4 from "@/assets/4.webp";
import img5 from "@/assets/5.webp";
import img7 from "@/assets/7.webp";
import img8 from "@/assets/8.webp";

export interface ServicePrice {
  duration: string;
  durationMin: number;
  price: string;
  priceEur: number;
  note?: string;
}

export interface Service {
  name: string;
  slug: string;
  image: string;
  description: string;
  prices: ServicePrice[];
  featured?: boolean;
  badge?: string;
}

export const services: Service[] = [
  {
    name: "Wellness Massage mit Öl",
    slug: "wellness-massage",
    image: img1,
    description: "Klassische Ganzkörpermassage mit hochwertigen Ölen und authentischer Afro Touch Technik – löst Verspannungen und bringt Körper und Geist zur Ruhe.",
    featured: true,
    prices: [
      { duration: "60 Min.",  durationMin: 60,  price: "55 €",  priceEur: 55  },
      { duration: "90 Min.",  durationMin: 90,  price: "80 €",  priceEur: 80  },
      { duration: "120 Min.", durationMin: 120, price: "105 €", priceEur: 105 },
      { duration: "150 Min.", durationMin: 150, price: "130 €", priceEur: 130 },
      { duration: "180 Min.", durationMin: 180, price: "155 €", priceEur: 155 },
    ],
  },
  {
    name: "Intensiv Massage",
    slug: "intensiv-massage",
    image: img8,
    description: "Intensive Tiefenmassage mit Bio Sheabutteröl, Bio Kokosöl & Aboniki Menthol. Speziell bei Migräne, Stress und starker körperlicher Belastung.",
    featured: true,
    badge: "Spezialtechnik",
    prices: [
      { duration: "30 Min.",  durationMin: 30,  price: "45 €",  priceEur: 45  },
      { duration: "60 Min.",  durationMin: 60,  price: "75 €",  priceEur: 75  },
      { duration: "90 Min.",  durationMin: 90,  price: "110 €", priceEur: 110 },
      { duration: "120 Min.", durationMin: 120, price: "145 €", priceEur: 145 },
    ],
  },
  {
    name: "Aromaölmassage",
    slug: "aromaoelmassage",
    image: img2,
    description: "Entspannende Massage mit wärmenden ätherischen Ölen für tiefe Ruhe, Hautpflege und wohltuende Entspannung aller Sinne.",
    featured: true,
    prices: [
      { duration: "30 Min.",  durationMin: 30,  price: "40 €",  priceEur: 40  },
      { duration: "60 Min.",  durationMin: 60,  price: "60 €",  priceEur: 60  },
      { duration: "90 Min.",  durationMin: 90,  price: "85 €",  priceEur: 85  },
      { duration: "120 Min.", durationMin: 120, price: "115 €", priceEur: 115 },
      { duration: "150 Min.", durationMin: 150, price: "140 €", priceEur: 140 },
      { duration: "180 Min.", durationMin: 180, price: "170 €", priceEur: 170 },
    ],
  },
  {
    name: "Teilkörper-Massage",
    slug: "teilkoerper-massage",
    image: img7,
    description: "Gezielte Entspannung einzelner Zonen: Gesicht & Kopf / Nacken & Rücken / Fuß / Kopf-Nacken-Beine – ideal für den Alltag.",
    featured: true,
    prices: [
      { duration: "30 Min.", durationMin: 30, price: "35 €", priceEur: 35 },
      { duration: "60 Min.", durationMin: 60, price: "50 €", priceEur: 50 },
      { duration: "90 Min.", durationMin: 90, price: "70 €", priceEur: 70, note: "nur Nacken-Rücken" },
    ],
  },
  {
    name: "Hot-Stone Massage",
    slug: "hot-stone-massage",
    image: img4,
    description: "Warme Basaltsteine lösen tiefe Muskelverspannungen und verbessern die Durchblutung – ideal bei Stress, Kälte und hartnäckigen Rückenproblemen.",
    featured: true,
    badge: "Bestseller",
    prices: [
      { duration: "60 Min.",  durationMin: 60,  price: "65 €",  priceEur: 65  },
      { duration: "90 Min.",  durationMin: 90,  price: "95 €",  priceEur: 95  },
      { duration: "120 Min.", durationMin: 120, price: "125 €", priceEur: 125 },
    ],
  },
  {
    name: "Entspannungsmassage nach OP",
    slug: "massage-nach-op",
    image: img5,
    description: "Behutsame Massage zur Regeneration nach Operationen. Fördert Lymphfluss und Heilung. Nur mit ärztlicher Freigabe buchbar.",
    featured: false,
    badge: "Nur mit ärztl. Freigabe",
    prices: [
      { duration: "30 Min.",  durationMin: 30,  price: "40 €",  priceEur: 40  },
      { duration: "60 Min.",  durationMin: 60,  price: "70 €",  priceEur: 70  },
      { duration: "90 Min.",  durationMin: 90,  price: "100 €", priceEur: 100 },
      { duration: "120 Min.", durationMin: 120, price: "135 €", priceEur: 135 },
    ],
  },
  {
    name: "Seelische Auszeit – Gesprächsbegleitung",
    slug: "seelische-auszeit",
    image: img3,
    description: "Ein sicherer, ruhiger Ort zum Abschalten und Reden. Mit jeder Massage 20 % Rabatt auf die Gesprächsbegleitung.",
    featured: false,
    prices: [
      { duration: "60 Min.",  durationMin: 60,  price: "55 €",  priceEur: 55  },
      { duration: "90 Min.",  durationMin: 90,  price: "80 €",  priceEur: 80  },
      { duration: "120 Min.", durationMin: 120, price: "105 €", priceEur: 105 },
      { duration: "150 Min.", durationMin: 150, price: "130 €", priceEur: 130 },
      { duration: "180 Min.", durationMin: 180, price: "160 €", priceEur: 160 },
    ],
  },
  // Kombi packages
  {
    name: "Kombi 1 – Tiefenentspannung Komplett",
    slug: "kombi-1-tiefenentspannung",
    image: img1,
    description: "Wellness Massage 60 Min. + Kopf-Schulter-Nacken 30 Min. + Fußmassage 30 Min. Gesamtdauer: 2 Std. Einzelpreis 125 € – Sie sparen 20 €.",
    badge: "Spare 20 €",
    prices: [
      { duration: "2 Std.", durationMin: 120, price: "105 €", priceEur: 105 },
    ],
  },
  {
    name: "Kombi 2 – Aroma Auszeit",
    slug: "kombi-2-aroma-auszeit",
    image: img2,
    description: "Aromaölmassage 60 Min. + Kopf-Gesicht 30 Min. + Fußmassage 30 Min. Gesamtdauer: 2 Std. Einzelpreis 130 € – Sie sparen 15 €.",
    badge: "Spare 15 €",
    prices: [
      { duration: "2 Std.", durationMin: 120, price: "115 €", priceEur: 115 },
    ],
  },
  {
    name: "Kombi 3 – Hot-Stone Power",
    slug: "kombi-3-hot-stone-power",
    image: img4,
    description: "Hot-Stone Massage 90 Min. + Kopf-Nacken 30 Min. + Fußmassage 30 Min. Gesamtdauer: 2 Std. Einzelpreis 165 € – Sie sparen 50 €.",
    badge: "Spare 50 €",
    prices: [
      { duration: "2 Std.", durationMin: 120, price: "115 €", priceEur: 115 },
    ],
  },
  {
    name: "Kombi 4 – Wellness + Intensiv 120",
    slug: "kombi-4-wellness-intensiv",
    image: img8,
    description: "Wellness Massage 60 Min. + Intensiv Massage 60 Min. Das kraftvolle Duo für maximale Tiefenentspannung. Gesamtdauer: 2 Std.",
    prices: [
      { duration: "2 Std.", durationMin: 120, price: "125 €", priceEur: 125 },
    ],
  },
  {
    name: "Kombi 5 – Wellness + Intensiv 90",
    slug: "kombi-5-wellness-intensiv-kompakt",
    image: img8,
    description: "Wellness Massage 60 Min. + Intensiv Massage 30 Min. Das kompakte Duo für Körper und Geist. Gesamtdauer: 90 Min.",
    prices: [
      { duration: "90 Min.", durationMin: 90, price: "95 €", priceEur: 95 },
    ],
  },
];

export const featuredServices = services.filter(s => s.featured);
export const kombiServices    = services.filter(s => s.slug.startsWith("kombi-"));
export const singleServices   = services.filter(s => !s.slug.startsWith("kombi-"));
