import traditional from "@/assets/service-traditional.jpg";
import aroma from "@/assets/service-aroma.jpg";
import deep from "@/assets/service-deep.jpg";
import hotstone from "@/assets/service-hotstone.jpg";
import foot from "@/assets/service-foot.jpg";
import head from "@/assets/service-head.jpg";

export const services = [
  {
    name: "Traditional Massage",
    image: traditional,
    description: "Classic full-body relaxation with smooth, flowing strokes.",
    prices: [
      { duration: "30 min", price: "25 €" },
      { duration: "60 min", price: "45 €" },
      { duration: "90 min", price: "60 €" },
    ],
  },
  {
    name: "Aroma Oil Massage",
    image: aroma,
    description: "Warm essential oils for deep calm and skin nourishment.",
    prices: [
      { duration: "30 min", price: "30 €" },
      { duration: "60 min", price: "50 €" },
      { duration: "90 min", price: "70 €" },
    ],
  },
  {
    name: "Deep Tissue Massage",
    image: deep,
    description: "Firm pressure to release tension in deeper muscle layers.",
    prices: [
      { duration: "30 min", price: "35 €" },
      { duration: "60 min", price: "55 €" },
      { duration: "90 min", price: "75 €" },
    ],
  },
  {
    name: "Hot Stone Massage",
    image: hotstone,
    description: "Warm basalt stones melt away stress and stiffness.",
    prices: [
      { duration: "60 min", price: "60 €" },
      { duration: "90 min", price: "80 €" },
    ],
  },
  {
    name: "Foot Massage",
    image: foot,
    description: "Reflexology-inspired pressure for tired feet.",
    prices: [
      { duration: "30 min", price: "25 €" },
      { duration: "60 min", price: "40 €" },
    ],
  },
  {
    name: "Head & Face Massage",
    image: head,
    description: "Soothing techniques to release tension in head and face.",
    prices: [
      { duration: "30 min", price: "25 €" },
      { duration: "60 min", price: "40 €" },
    ],
  },
];
