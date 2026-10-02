import { describe, expect, it } from "vitest";
import { layoutScene, STAGE } from "./layout";

const scene = (
  deskId: string | null,
  chairId: string | null,
  accessories: { id: string; qty: number }[] = [],
) => layoutScene({ deskId, chairId, accessories });

describe("layoutScene", () => {
  it("is empty without a selection", () => {
    expect(scene(null, null)).toMatchObject({ width: STAGE.width, items: [], hotspots: [] });
  });

  it("stands the desk on the floor and the chair in front of it", () => {
    const { items } = scene("desk-standard", "chair-basic");
    const desk = items.find((i) => i.key === "desk")!;
    const chair = items.find((i) => i.key === "chair")!;
    expect(desk.top + desk.height).toBe(STAGE.floorY);
    expect(chair.z).toBeGreaterThan(desk.z);
  });

  it("puts desktop items on the desk surface, in front of the desk", () => {
    const { items } = scene("desk-standing", null, [{ id: "monitor", qty: 2 }]);
    const desk = items.find((i) => i.key === "desk")!;
    const monitors = items.filter((i) => i.product.id === "monitor");
    expect(monitors).toHaveLength(2);
    for (const m of monitors) {
      // Sits on the desktop, sunk in slightly so it looks seated.
      expect(Math.abs(m.top + m.height - desk.top)).toBeLessThan(1);
      expect(m.z).toBeGreaterThan(desk.z);
    }
  });

  it("keeps the center monitor in front of the side ones", () => {
    const monitors = scene("desk-l-shaped", null, [{ id: "monitor", qty: 3 }]).items.filter(
      (i) => i.product.id === "monitor",
    );
    expect(monitors[1].z).toBeGreaterThan(monitors[0].z);
  });

  it("does not place accessories without a desk", () => {
    expect(scene(null, "chair-basic", [{ id: "monitor", qty: 1 }]).items.map((i) => i.key)).toEqual(
      ["chair"],
    );
  });

  it("offers hotspots for empty slots and hides them once filled", () => {
    const keys = (s: ReturnType<typeof scene>) => s.hotspots.map((h) => h.key);
    expect(keys(scene("desk-standard", null))).toEqual(["add-monitor", "add-plant", "add-chair"]);
    expect(
      keys(
        scene("desk-standard", "chair-basic", [
          { id: "monitor", qty: 2 },
          { id: "plant", qty: 1 },
        ]),
      ),
    ).toEqual([]);
  });

  it("keeps every item inside the stage for the fullest setups", () => {
    const all = [
      { id: "monitor", qty: 3 },
      { id: "laptop-stand", qty: 1 },
      { id: "keyboard-mouse", qty: 1 },
      { id: "desk-lamp", qty: 1 },
      { id: "plant", qty: 2 },
      { id: "storage-drawer", qty: 1 },
    ];
    const extras = ["coffee-machine", "bean-bag", "tool-shelf", "surfboard", "scooter"];
    for (const desk of ["desk-standard", "desk-standing", "desk-l-shaped", null]) {
      for (const withExtras of [false, true]) {
        const lines = withExtras ? [...all, ...extras.map((id) => ({ id, qty: 1 }))] : all;
        const s = scene(desk, "chair-premium", lines);
        for (const item of s.items) {
          expect(item.left).toBeGreaterThanOrEqual(0);
          expect(item.top).toBeGreaterThanOrEqual(0);
          expect(item.left + item.width).toBeLessThanOrEqual(s.width);
          expect(item.top + item.height).toBeLessThanOrEqual(STAGE.height);
        }
      }
    }
  });

  it("widens the stage only on the sides that have extras", () => {
    expect(scene("desk-standard", null, [{ id: "bean-bag", qty: 1 }])).toMatchObject({
      width: STAGE.width + 70,
      offsetX: 70,
    });
    expect(scene("desk-standard", null, [{ id: "scooter", qty: 1 }])).toMatchObject({
      width: STAGE.width + 100,
      offsetX: 0,
    });
  });

  it("shows extras even without a desk", () => {
    expect(scene(null, null, [{ id: "surfboard", qty: 1 }]).items.map((i) => i.key)).toEqual([
      "surfboard",
    ]);
  });
});
