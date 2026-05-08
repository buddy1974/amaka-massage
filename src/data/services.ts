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
}

export interface Service {
  name: string;
  slug: string;
  image: string;
  description: string;
  prices: ServicePrice[];
  featured?: boolean;
}

export const services: Service[] = [
  {
    name: "AFRO ORIGIN – Traditionelle Massage",
    slug: "afro-origin-traditionelle-massage",
    image: img1,
    description: "Klassische Ganzkörpermassage mit authentischen afrikanischen Techniken. Druckpunkte und Dehnpositionen stimulieren die Energielinien im Körper.",
    featured: true,
    prices: [
      { duration: "30 Min.", durationMin: 30,  price: "35 €",  priceEur: 35  },
      { duration: "60 Min.", durationMin: 60,  price: "55 €",  priceEur: 55  },
      { duration: "90 Min.", durationMin: 90,  price: "80 €",  priceEur: 80  },
      { duration: "120 Min.", durationMin: 120, price: "105 €", priceEur: 105 },
      { duration: "150 Min.", durationMin: 150, price: "130 €", priceEur: 130 },
      { duration: "180 Min.", durationMin: 180, price: "155 €", priceEur: 155 },
    ],
  },
  {
    name: "Aromaölmassage",
    slug: "aromaoelmassage",
    image: img2,
    description: "Entspannende Massage mit wärmenden ätherischen Ölen und afrikanischen Botanicals für tiefe Ruhe und Hautpflege.",
    featured: true,
    prices: [
      { duration: "30 Min.", durationMin: 30,  price: "35 €",  priceEur: 35  },
      { duration: "60 Min.", durationMin: 60,  price: "60 €",  priceEur: 60  },
      { duration: "90 Min.", durationMin: 90,  price: "85 €",  priceEur: 85  },
      { duration: "120 Min.", durationMin: 120, price: "115 €", priceEur: 115 },
      { duration: "150 Min.", durationMin: 150, price: "140 €", priceEur: 140 },
      { duration: "180 Min.", durationMin: 180, price: "165 €", priceEur: 165 },
    ],
  },
  {
    name: "Gesichts- und Kopfmassage",
    slug: "gesichts-kopfmassage",
    image: img3,
    description: "Sanfte Massage von Gesicht und Kopf – befreit von Anspannungen, fördert die Durchblutung und sorgt für Klarheit.",
    featured: true,
    prices: [
      { duration: "30 Min.", durationMin: 30, price: "35 €", priceEur: 35 },
      { duration: "60 Min.", durationMin: 60, price: "55 €", priceEur: 55 },
    ],
  },
  {
    name: "Nacken- und Rückenmassage",
    slug: "nacken-rueckenmassage",
    image: img4,
    description: "Gezielte Behandlung von Nacken und Rücken – löst Verspannungen und befreit von Alltagsstress.",
    featured: true,
    prices: [
      { duration: "30 Min.", durationMin: 30, price: "35 €", priceEur: 35 },
      { duration: "60 Min.", durationMin: 60, price: "55 €", priceEur: 55 },
      { duration: "90 Min.", durationMin: 90, price: "75 €", priceEur: 75 },
    ],
  },
  {
    name: "Fußmassage",
    slug: "fussmassage",
    image: img5,
    description: "Reflexzonenmassage der Füße – stimuliert Energiepunkte, fördert Durchblutung und bringt den ganzen Körper zur Ruhe.",
    featured: true,
    prices: [
      { duration: "30 Min.", durationMin: 30, price: "35 €", priceEur: 35 },
      { duration: "60 Min.", durationMin: 60, price: "55 €", priceEur: 55 },
    ],
  },
  {
    name: "Teilkörper-Massage",
    slug: "teilkoerper-massage",
    image: img7,
    description: "Massage von Kopf, Nacken und Beinen – ideal für gezielte Entspannung der am stärksten beanspruchten Körperzonen.",
    featured: true,
    prices: [
      { duration: "30 Min.", durationMin: 30, price: "35 €", priceEur: 35 },
      { duration: "60 Min.", durationMin: 60, price: "55 €", priceEur: 55 },
    ],
  },
  {
    name: "Intensiv Massage mit Bio-Ölen",
    slug: "intensiv-massage",
    image: img8,
    description: "Intensive Tiefenmassage mit Bio Sheabutteröl, Bio Kokosöl und Aboniki. Speziell bei Migräne, Stress und körperlicher Belastung.",
    featured: true,
    prices: [
      { duration: "60 Min.",  durationMin: 60,  price: "75 €",  priceEur: 75  },
      { duration: "90 Min.",  durationMin: 90,  price: "110 €", priceEur: 110 },
      { duration: "120 Min.", durationMin: 120, price: "145 €", priceEur: 145 },
    ],
  },
  {
    name: "Kombi 1 – Wellness Paket",
    slug: "kombi-massage-1",
    image: img1,
    description: "Traditionelle Massage 60 Min. + Kopf-Schulter-Nacken-Massage 30 Min. + Fußmassage 30 Min. Gesamtdauer: 2 Std.",
    prices: [
      { duration: "2 Std.", durationMin: 120, price: "109 €", priceEur: 109 },
    ],
  },
  {
    name: "Kombi 2 – Wellness Paket",
    slug: "kombi-massage-2",
    image: img2,
    description: "Wellness-Aroma Öl Massage 60 Min. + Kopf-Gesicht-Massage 30 Min. + Fußmassage 30 Min. Gesamtdauer: 2 Std.",
    prices: [
      { duration: "2 Std.", durationMin: 120, price: "109 €", priceEur: 109 },
    ],
  },
  {
    name: "Kombi 3 – Hot Stone Paket",
    slug: "kombi-massage-3",
    image: img4,
    description: "Hot-Stone Massage 90 Min. + Kopf-Nacken und Fußmassage 30 Min. Gesamtdauer: 2 Std.",
    prices: [
      { duration: "2 Std.", durationMin: 120, price: "119 €", priceEur: 119 },
    ],
  },
  {
    name: "Physical Chat-Room",
    slug: "physical-chat-room",
    image: img3,
    description: "Brauchen Sie jemanden zum Reden? Ein sicherer, angenehmer Ort zum Entspannen und Abschalten. Wir haben stets ein offenes Ohr für Sie.",
    prices: [
      { duration: "60 Min.",  durationMin: 60,  price: "75 €",  priceEur: 75  },
      { duration: "90 Min.",  durationMin: 90,  price: "100 €", priceEur: 100 },
      { duration: "120 Min.", durationMin: 120, price: "140 €", priceEur: 140 },
      { duration: "150 Min.", durationMin: 150, price: "180 €", priceEur: 180 },
      { duration: "180 Min.", durationMin: 180, price: "215 €", priceEur: 215 },
    ],
  },
];

export const featuredServices = services.filter(s => s.featured);
