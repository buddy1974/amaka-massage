import traditional from "@/assets/service-traditional.jpg";
import aroma from "@/assets/service-aroma.jpg";
import deep from "@/assets/service-deep.jpg";
import hotstone from "@/assets/service-hotstone.jpg";
import foot from "@/assets/service-foot.jpg";
import head from "@/assets/service-head.jpg";

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
    image: traditional,
    description: "Classic full-body relaxation with African-inspired smooth, flowing strokes.",
    prices: [
      { duration: "30 min", durationMin: 30, price: "25 €", priceEur: 25 },
      { duration: "60 min", durationMin: 60, price: "45 €", priceEur: 45 },
      { duration: "90 min", durationMin: 90, price: "60 €", priceEur: 60 },
    ],
  },
  {
    name: "Afro Aroma Oil Massage",
    slug: "afro-aroma-oil-massage",
    image: aroma,
    description: "Warm essential oils with African botanicals for deep calm and skin nourishment.",
    prices: [
      { duration: "30 min", durationMin: 30, price: "30 €", priceEur: 30 },
      { duration: "60 min", durationMin: 60, price: "50 €", priceEur: 50 },
      { duration: "90 min", durationMin: 90, price: "70 €", priceEur: 70 },
    ],
  },
  {
    name: "Afro Deep Tissue Massage",
    slug: "afro-deep-tissue-massage",
    image: deep,
    description: "Firm, targeted pressure to release tension deep in the muscles.",
    prices: [
      { duration: "30 min", durationMin: 30, price: "35 €", priceEur: 35 },
      { duration: "60 min", durationMin: 60, price: "55 €", priceEur: 55 },
      { duration: "90 min", durationMin: 90, price: "75 €", priceEur: 75 },
    ],
  },
  {
    name: "Afro Hot Stone Massage",
    slug: "afro-hot-stone-massage",
    image: hotstone,
    description: "Warm basalt stones melt away stress and stiffness in harmony with the body.",
    prices: [
      { duration: "60 min", durationMin: 60, price: "60 €", priceEur: 60 },
      { duration: "90 min", durationMin: 90, price: "80 €", priceEur: 80 },
    ],
  },
  {
    name: "Afro Foot Massage",
    slug: "afro-foot-massage",
    image: foot,
    description: "Reflexology-inspired pressure to restore energy to tired feet.",
    prices: [
      { duration: "30 min", durationMin: 30, price: "25 €", priceEur: 25 },
      { duration: "60 min", durationMin: 60, price: "40 €", priceEur: 40 },
    ],
  },
  {
    name: "Afro Head & Face Massage",
    slug: "afro-head-face-massage",
    image: head,
    description: "Soothing Afro techniques to release tension in the head, scalp, and face.",
    prices: [
      { duration: "30 min", durationMin: 30, price: "25 €", priceEur: 25 },
      { duration: "60 min", durationMin: 60, price: "40 €", priceEur: 40 },
    ],
  },
];
