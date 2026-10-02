import type { Zone } from "./types";

export const ZONES: { id: Zone; name: string; icon: string; blurb: string }[] = [
  { id: "coffee", name: "Coffee Station", icon: "☕", blurb: "Barista-grade coffee at home." },
  { id: "outdoor", name: "Outdoor Gear", icon: "🏄", blurb: "Surf at sunrise, ride to the café." },
  { id: "relax", name: "Relax Zone", icon: "🛋️", blurb: "Somewhere to switch off." },
  { id: "garage", name: "Garage Space", icon: "🧰", blurb: "Keep your gear sorted." },
];
