import type { Category, Product } from "./types";

export const products: Product[] = [
  // Desks
  {
    id: "desk-standard",
    category: "desk",
    name: "Classic Teak Desk",
    description: "A warm wooden desk with room for a laptop and a monitor.",
    pricePerMonth: 350_000,
    image: "/items/desk-standard.svg",
    dimensions: "120 × 60 × 75 cm",
    highlights: ["Solid teak-finish top", "Fits up to 2 monitors"],
    preview: { slot: "desk", zIndex: 10, maxQty: 1, width: 120, height: 75 },
  },
  {
    id: "desk-standing",
    category: "desk",
    name: "Electric Standing Desk",
    description: "Switch between sitting and standing at the touch of a button.",
    pricePerMonth: 650_000,
    image: "/items/desk-standing.svg",
    dimensions: "140 × 70 × 72–120 cm",
    highlights: ["Dual motor, 3 memory presets", "Shown at standing height"],
    preview: { slot: "desk", zIndex: 10, maxQty: 1, width: 140, height: 105 },
  },
  {
    id: "desk-l-shaped",
    category: "desk",
    name: "L-Shaped Corner Desk",
    description: "Extra-wide surface with a side return for a multi-screen setup.",
    pricePerMonth: 550_000,
    image: "/items/desk-l-shaped.svg",
    dimensions: "160 × 120 × 75 cm",
    highlights: ["Room for 3 monitors", "Side return for documents"],
    preview: { slot: "desk", zIndex: 10, maxQty: 1, width: 160, height: 75 },
  },

  // Chairs
  {
    id: "chair-basic",
    category: "chair",
    name: "Basic Office Chair",
    description: "Comfortable everyday chair with a padded seat.",
    pricePerMonth: 200_000,
    image: "/items/chair-basic.svg",
    dimensions: "60 × 60 × 95 cm",
    highlights: ["Height adjustable", "Swivel with castors"],
    preview: { slot: "chair", zIndex: 30, maxQty: 1, width: 60, height: 100 },
  },
  {
    id: "chair-ergonomic",
    category: "chair",
    name: "Ergonomic Mesh Chair",
    description: "Breathable mesh back — keeps you cool in the tropical heat.",
    pricePerMonth: 400_000,
    image: "/items/chair-ergonomic.svg",
    dimensions: "64 × 64 × 115 cm",
    highlights: ["Adjustable lumbar support", "Headrest and 3D armrests"],
    preview: { slot: "chair", zIndex: 30, maxQty: 1, width: 64, height: 115 },
  },
  {
    id: "chair-premium",
    category: "chair",
    name: "Premium Executive Chair",
    description: "Plush leather chair for long deep-work sessions.",
    pricePerMonth: 600_000,
    image: "/items/chair-premium.svg",
    dimensions: "70 × 70 × 125 cm",
    highlights: ["Vegan leather, hand-stitched", "Recline with tilt lock"],
    preview: { slot: "chair", zIndex: 30, maxQty: 1, width: 70, height: 125 },
  },

  // Accessories
  {
    id: "monitor",
    category: "accessory",
    name: '27" 4K Monitor',
    description: "Crisp 4K screen with USB-C — one cable to your laptop.",
    pricePerMonth: 450_000,
    image: "/items/monitor.svg",
    dimensions: '27", 62 × 48 cm',
    highlights: ["USB-C 65W charging", "Height-adjustable stand"],
    preview: { slot: "monitor", zIndex: 20, maxQty: 3, width: 62, height: 48 },
  },
  {
    id: "laptop-stand",
    category: "accessory",
    name: "Laptop Stand",
    description: "Raises your laptop to eye level. Laptop not included.",
    pricePerMonth: 75_000,
    image: "/items/laptop-stand.svg",
    dimensions: "26 × 24 × 12 cm",
    highlights: ["Aluminium, foldable", 'Fits 11–16" laptops'],
    preview: { slot: "laptop", zIndex: 22, maxQty: 1, width: 36, height: 32 },
  },
  {
    id: "keyboard-mouse",
    category: "accessory",
    name: "Keyboard + Mouse",
    description: "Wireless low-profile keyboard and mouse combo.",
    pricePerMonth: 100_000,
    image: "/items/keyboard-mouse.svg",
    dimensions: "44 cm keyboard",
    highlights: ["Bluetooth, multi-device", "Rechargeable"],
    preview: { slot: "keyboard", zIndex: 24, maxQty: 1, width: 60, height: 8 },
  },
  {
    id: "desk-lamp",
    category: "accessory",
    name: "Desk Lamp",
    description: "Warm, dimmable light for late-night calls.",
    pricePerMonth: 60_000,
    image: "/items/desk-lamp.svg",
    dimensions: "30 × 48 cm",
    highlights: ["3 color temperatures", "Adjustable arm"],
    preview: { slot: "lamp", zIndex: 21, maxQty: 1, width: 30, height: 48 },
  },
  {
    id: "plant",
    category: "accessory",
    name: "Desk Plant",
    description: "A little tropical green in a terracotta pot. We water it.",
    pricePerMonth: 50_000,
    image: "/items/plant.svg",
    dimensions: "28 × 42 cm",
    highlights: ["Low-light snake plant", "Weekly care included"],
    preview: { slot: "plant", zIndex: 21, maxQty: 2, width: 28, height: 42 },
  },
  {
    id: "storage-drawer",
    category: "accessory",
    name: "Storage Drawer",
    description: "Rolling 3-drawer cabinet that tucks under the desk.",
    pricePerMonth: 120_000,
    image: "/items/storage-drawer.svg",
    dimensions: "40 × 50 × 60 cm",
    highlights: ["Lockable top drawer", "On castors"],
    preview: { slot: "floor", zIndex: 15, maxQty: 1, width: 40, height: 60 },
  },
];

const byId = new Map(products.map((p) => [p.id, p]));

export function getProduct(id: string): Product | undefined {
  return byId.get(id);
}

export function getProductsByCategory(category: Category): Product[] {
  return products.filter((p) => p.category === category);
}
