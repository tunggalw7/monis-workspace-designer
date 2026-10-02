import type { Setup } from "@/lib/setup";

export type Preset = {
  id: string;
  name: string;
  tagline: string;
  setup: Omit<Setup, "rentalMonths">;
};

export const presets: Preset[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Laptop-first essentials for a short stay.",
    setup: {
      deskId: "desk-standard",
      chairId: "chair-basic",
      accessories: [
        { id: "laptop-stand", qty: 1 },
        { id: "keyboard-mouse", qty: 1 },
        { id: "plant", qty: 1 },
      ],
    },
  },
  {
    id: "developer",
    name: "Developer",
    tagline: "Dual screens and a standing desk for long coding days.",
    setup: {
      deskId: "desk-standing",
      chairId: "chair-ergonomic",
      accessories: [
        { id: "monitor", qty: 2 },
        { id: "keyboard-mouse", qty: 1 },
        { id: "desk-lamp", qty: 1 },
        { id: "plant", qty: 1 },
      ],
    },
  },
  {
    id: "pro-streamer",
    name: "Pro Streamer",
    tagline: "Triple monitors, premium comfort, room for all the gear.",
    setup: {
      deskId: "desk-l-shaped",
      chairId: "chair-premium",
      accessories: [
        { id: "monitor", qty: 3 },
        { id: "laptop-stand", qty: 1 },
        { id: "keyboard-mouse", qty: 1 },
        { id: "desk-lamp", qty: 1 },
        { id: "storage-drawer", qty: 1 },
        { id: "plant", qty: 2 },
      ],
    },
  },
];

export function getPreset(id: string): Preset | undefined {
  return presets.find((p) => p.id === id);
}
