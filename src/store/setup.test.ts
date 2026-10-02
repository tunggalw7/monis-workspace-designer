import { beforeEach, describe, expect, it } from "vitest";

const storage = new Map<string, string>();
globalThis.localStorage = {
  getItem: (k: string) => storage.get(k) ?? null,
  setItem: (k: string, v: string) => void storage.set(k, v),
  removeItem: (k: string) => void storage.delete(k),
  clear: () => storage.clear(),
  key: () => null,
  length: 0,
} as Storage;

const { useSetup } = await import("./setup");
const store = () => useSetup.getState();

beforeEach(() => {
  store().reset();
});

describe("setup store", () => {
  it("selects a desk and chair", () => {
    store().selectDesk("desk-standing");
    store().selectChair("chair-premium");
    expect(store()).toMatchObject({ deskId: "desk-standing", chairId: "chair-premium" });
  });

  it("ignores ids from the wrong category", () => {
    store().selectDesk("chair-basic");
    expect(store().deskId).toBeNull();
  });

  it("adds accessories up to the limit", () => {
    store().selectDesk("desk-standard");
    for (let i = 0; i < 5; i++) store().addAccessory("monitor");
    expect(store().accessories).toEqual([{ id: "monitor", qty: 2 }]);
  });

  it("clamps monitors when switching to a smaller desk", () => {
    store().selectDesk("desk-l-shaped");
    store().setQty("monitor", 3);
    store().selectDesk("desk-standard");
    expect(store().accessories).toEqual([{ id: "monitor", qty: 2 }]);
  });

  it("removes an accessory with setQty(0) or removeAccessory", () => {
    store().addAccessory("plant");
    store().addAccessory("desk-lamp");
    store().setQty("plant", 0);
    store().removeAccessory("desk-lamp");
    expect(store().accessories).toEqual([]);
  });

  it("applies a preset and keeps the rental duration", () => {
    store().setRentalMonths(6);
    store().applyPreset("developer");
    expect(store()).toMatchObject({
      deskId: "desk-standing",
      chairId: "chair-ergonomic",
      rentalMonths: 6,
    });
    expect(store().accessories).toContainEqual({ id: "monitor", qty: 2 });
  });

  it("persists to localStorage and restores it", async () => {
    store().selectDesk("desk-l-shaped");
    store().addAccessory("monitor");
    const raw = storage.get("monis-setup")!;
    expect(JSON.parse(raw).state).toEqual({
      deskId: "desk-l-shaped",
      chairId: null,
      accessories: [{ id: "monitor", qty: 1 }],
      rentalMonths: 1,
    });

    // Simulate a fresh page load: in-memory state is empty, storage still has the setup.
    useSetup.setState({ deskId: null, accessories: [] });
    storage.set("monis-setup", raw);
    await useSetup.persist.rehydrate();
    expect(store()).toMatchObject({ deskId: "desk-l-shaped", hydrated: true });
  });

  it("sanitizes corrupted storage on rehydrate", async () => {
    storage.set(
      "monis-setup",
      JSON.stringify({ state: { deskId: "bogus", accessories: "x" }, version: 1 }),
    );
    await useSetup.persist.rehydrate();
    expect(store()).toMatchObject({ deskId: null, accessories: [] });
  });
});
