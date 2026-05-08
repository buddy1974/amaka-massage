import img1 from "@/assets/1.png";
import img2 from "@/assets/2.png";
import img3 from "@/assets/3.png";
import img4 from "@/assets/4.png";
import img5 from "@/assets/5.png";
import img7 from "@/assets/7.png";

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
}

export const services: Service[] = [
  {
    name: "Traditional Afro Massage",
    slug: "traditional-afro-massage",
    image: img1,
    description: "Classic full-body relaxation with authentic African smooth, flowing strokes that melt away tension.",
    prices: [
      { duration: "30 min", durationMin: 30, price: "25 €", priceEur: 25 },
      { duration: "60 min", durationMin: 60, price: "40 €", priceEur: 40 },
      { duration: "90 min", durationMin: 90, price: "58 €", priceEur: 58 },
    ],
  },
  {
    name: "Aroma Oil Massage",
    slug: "aroma-oil-massage",
    image: img2,
    description: "Warm essential oils with African botanicals for deep calm, skin nourishment, and total relaxation.",
    prices: [
      { duration: "30 min", durationMin: 30, price: "30 €", priceEur: 30 },
      { duration: "60 min", durationMin: 60, price: "49 €", priceEur: 49 },
      { duration: "90 min", durationMin: 90, price: "69 €", priceEur: 69 },
    ],
  },
  {
    name: "Deep Tissue Massage",
    slug: "deep-tissue-massage",
    image: img3,
    description: "Firm, targeted pressure to release deep muscle tension and restore flexibility and mobility.",
    prices: [
      { duration: "30 min", durationMin: 30, price: "25 €", priceEur: 25 },
      { duration: "60 min", durationMin: 60, price: "40 €", priceEur: 40 },
      { duration: "90 min", durationMin: 90, price: "58 €", priceEur: 58 },
    ],
  },
  {
    name: "Hot Stone Massage",
    slug: "hot-stone-massage",
    image: img4,
    description: "Smooth heated basalt stones melt away stiffness and promote deep relaxation and energy flow.",
    prices: [
      { duration: "30 min", durationMin: 30, price: "25 €", priceEur: 25 },
      { duration: "60 min", durationMin: 60, price: "40 €", priceEur: 40 },
      { duration: "90 min", durationMin: 90, price: "58 €", priceEur: 58 },
    ],
  },
  {
    name: "Foot Reflexology",
    slug: "foot-reflexology",
    image: img5,
    description: "Targeted pressure on reflex points of the feet to relieve stress and restore balance across the whole body.",
    prices: [
      { duration: "30 min", durationMin: 30, price: "25 €", priceEur: 25 },
      { duration: "60 min", durationMin: 60, price: "40 €", priceEur: 40 },
      { duration: "90 min", durationMin: 90, price: "58 €", priceEur: 58 },
    ],
  },
  {
    name: "Head & Shoulder Massage",
    slug: "head-shoulder-massage",
    image: img7,
    description: "Focused relief for neck, shoulder, and scalp tension — perfect for desk workers and stress headaches.",
    prices: [
      { duration: "30 min", durationMin: 30, price: "25 €", priceEur: 25 },
      { duration: "60 min", durationMin: 60, price: "40 €", priceEur: 40 },
      { duration: "90 min", durationMin: 90, price: "58 €", priceEur: 58 },
    ],
  },
];
