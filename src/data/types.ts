export type Category = "desk" | "chair" | "accessory" | "extra";

/** Where an item is placed in the live preview. */
export type Slot =
  "desk" | "chair" | "monitor" | "laptop" | "keyboard" | "lamp" | "plant" | "floor" | "zone";

export type PreviewMeta = {
  slot: Slot;
  /** Stacking order in the preview; higher is in front. */
  zIndex: number;
  /** Max quantity that fits in the setup (1 for desk and chair). */
  maxQty: number;
  /** Real-world size in cm, matching the asset's SVG viewBox. */
  width: number;
  height: number;
};

export type Product = {
  id: string;
  category: Category;
  name: string;
  description: string;
  /** Monthly rental price in IDR. */
  pricePerMonth: number;
  /** Path under /public; transparent SVG so it layers in the preview. */
  image: string;
  dimensions: string;
  highlights: string[];
  preview: PreviewMeta;
};
