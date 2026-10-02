import { getProduct } from "@/data/products";
import type { Product } from "@/data/types";
import { maxQtyFor, type Setup } from "@/lib/setup";
import type { ConfiguratorTab } from "@/store/ui";

/**
 * Stage coordinates are in cm, matching each asset's SVG viewBox. This is the base stage
 * around the desk; Bali extras widen it with a zone on either side.
 */
export const STAGE = { width: 240, height: 200, floorY: 166 } as const;

/** Extras stand further back, so they're drawn smaller. */
const EXTRA_SCALE = 0.7;
const LEFT_ZONE_WIDTH = 70;
const RIGHT_ZONE_WIDTH = 100;
const LEFT_EXTRAS = ["coffee-machine", "bean-bag"];
const RIGHT_EXTRAS = ["tool-shelf", "surfboard", "scooter"];

export type PlacedItem = {
  /** Stable per slot, so swapping a desk animates in place. */
  key: string;
  product: Product;
  left: number;
  top: number;
  width: number;
  height: number;
  z: number;
};

export type Hotspot = {
  key: string;
  label: string;
  tab: ConfiguratorTab;
  productId?: string;
  /** Center point in stage cm. */
  x: number;
  y: number;
};

export type Scene = {
  /** Full stage width including any extras zones. */
  width: number;
  /** Where the base stage starts (width of the left zone). */
  offsetX: number;
  items: PlacedItem[];
  hotspots: Hotspot[];
};

/** Horizontal offsets from the cluster center for 1–3 monitors (side screens tuck behind). */
const MONITOR_OFFSETS: Record<number, number[]> = { 1: [0], 2: [-31.5, 31.5], 3: [-56, 0, 56] };
/** Front-row items sit a little lower so they read as closer to the viewer. */
const FRONT_DROP = 2.5;
/** The chair stands in front of the desk, so its feet are lower on screen. */
const CHAIR_DROP = 20;

function place(
  product: Product,
  key: string,
  centerX: number,
  bottom: number,
  z = product.preview.zIndex,
  scale = 1,
): PlacedItem {
  const width = product.preview.width * scale;
  const height = product.preview.height * scale;
  return { key, product, left: centerX - width / 2, top: bottom - height, width, height, z };
}

export function layoutScene(setup: Pick<Setup, "deskId" | "chairId" | "accessories">): Scene {
  const items: PlacedItem[] = [];
  const hotspots: Hotspot[] = [];
  const qty = (id: string) => setup.accessories.find((l) => l.id === id)?.qty ?? 0;
  const desk = setup.deskId ? getProduct(setup.deskId) : undefined;
  const chair = setup.chairId ? getProduct(setup.chairId) : undefined;
  const hasLeft = LEFT_EXTRAS.some((id) => qty(id) > 0);
  const hasRight = RIGHT_EXTRAS.some((id) => qty(id) > 0);
  const offsetX = hasLeft ? LEFT_ZONE_WIDTH : 0;
  const width = offsetX + STAGE.width + (hasRight ? RIGHT_ZONE_WIDTH : 0);
  const centerX = offsetX + STAGE.width / 2;
  const chairX = desk ? centerX + desk.preview.width * 0.18 : centerX;

  if (desk) {
    const { width: deskW, height: deskH } = desk.preview;
    const deskLeft = centerX - deskW / 2;
    const surface = STAGE.floorY - deskH;
    const back = surface + 0.8;
    const front = surface + FRONT_DROP;
    const at = (fraction: number) => deskLeft + deskW * fraction;

    items.push(place(desk, "desk", centerX, STAGE.floorY));

    // Back row: monitors, with the laptop centered when there are none.
    const monitor = getProduct("monitor")!;
    const monitors = qty("monitor");
    const offsets = MONITOR_OFFSETS[monitors] ?? [];
    offsets.forEach((dx, i) => {
      items.push(
        place(
          monitor,
          `monitor-${i}`,
          at(0.5) + dx,
          back,
          monitor.preview.zIndex - (dx === 0 ? 0 : 1),
        ),
      );
    });

    if (qty("laptop-stand")) {
      const laptop = getProduct("laptop-stand")!;
      items.push(
        monitors
          ? place(laptop, "laptop-stand", at(0.8), front)
          : place(laptop, "laptop-stand", at(0.5), back),
      );
    }

    // Front row.
    if (qty("keyboard-mouse")) {
      items.push(place(getProduct("keyboard-mouse")!, "keyboard-mouse", at(0.36), front + 1.5));
    }
    if (qty("desk-lamp")) items.push(place(getProduct("desk-lamp")!, "desk-lamp", at(0.05), front));

    // The first plant sits on the desk; a second one grows into a floor plant beside it.
    const plant = getProduct("plant")!;
    const plants = qty("plant");
    if (plants >= 1) items.push(place(plant, "plant-0", at(0.95), front));
    if (plants >= 2) {
      items.push(place(plant, "plant-1", deskLeft - 14, STAGE.floorY + 4, 16, 1.3));
    }

    // Floor: the drawer tucks under the left side of the desk.
    if (qty("storage-drawer")) {
      items.push(place(getProduct("storage-drawer")!, "storage-drawer", at(0.2), STAGE.floorY));
    }

    if (monitors < maxQtyFor("monitor", desk.id)) {
      const span = monitors ? Math.max(...offsets) + monitor.preview.width / 2 : 0;
      hotspots.push({
        key: "add-monitor",
        label: "+ Add Monitor!",
        tab: "accessory",
        productId: "monitor",
        x: at(0.5) + span * 0.6,
        y: back - (monitors ? monitor.preview.height + 8 : monitor.preview.height / 2),
      });
    }
    if (!qty("plant")) {
      hotspots.push({
        key: "add-plant",
        label: "+ Place a Plant!",
        tab: "accessory",
        productId: "plant",
        x: at(0.92),
        y: front - plant.preview.height / 2,
      });
    }
    if (!chair) {
      hotspots.push({
        key: "add-chair",
        label: "+ Pick a Chair",
        tab: "chair",
        x: chairX,
        y: STAGE.floorY - 30,
      });
    }
  }

  if (chair) items.push(place(chair, "chair", chairX, STAGE.floorY + CHAIR_DROP));

  // Bali extras around the platform: back items sit higher (further away), front items lower.
  const rightStart = offsetX + STAGE.width;
  const extraSpots: Record<string, { x: number; bottom: number }> = {
    "coffee-machine": { x: 22, bottom: STAGE.floorY - 8 },
    "bean-bag": { x: 46, bottom: STAGE.floorY + 22 },
    "tool-shelf": { x: rightStart + 30, bottom: STAGE.floorY - 10 },
    surfboard: { x: rightStart + 70, bottom: STAGE.floorY - 8 },
    scooter: { x: rightStart + 42, bottom: STAGE.floorY + 24 },
  };
  for (const [id, spot] of Object.entries(extraSpots)) {
    const product = getProduct(id);
    if (product && qty(id)) {
      items.push(place(product, id, spot.x, spot.bottom, product.preview.zIndex, EXTRA_SCALE));
    }
  }

  return { width, offsetX, items, hotspots };
}
