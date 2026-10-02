import { describe, expect, it } from "vitest";
import {
  clampAccessories,
  decodeSetup,
  encodeSetup,
  getMonthlyTotal,
  getRentalTotal,
  isComplete,
  maxQtyFor,
  sanitizeSetup,
  type Setup,
} from "./setup";

describe("maxQtyFor", () => {
  it("uses the product limit without a desk", () => {
    expect(maxQtyFor("monitor", null)).toBe(3);
  });

  it("respects the desk's capacity", () => {
    expect(maxQtyFor("monitor", "desk-standard")).toBe(2);
    expect(maxQtyFor("monitor", "desk-l-shaped")).toBe(3);
  });

  it("returns 0 for unknown products", () => {
    expect(maxQtyFor("nope", null)).toBe(0);
  });
});

describe("clampAccessories", () => {
  it("merges duplicates, clamps and drops invalid lines", () => {
    expect(
      clampAccessories(
        [
          { id: "monitor", qty: 2 },
          { id: "monitor", qty: 2 },
          { id: "plant", qty: 0 },
          { id: "desk-standard", qty: 1 },
          { id: "unknown", qty: 1 },
        ],
        "desk-standard",
      ),
    ).toEqual([{ id: "monitor", qty: 2 }]);
  });
});

describe("sanitizeSetup", () => {
  it("rejects ids from the wrong category and bad months", () => {
    expect(
      sanitizeSetup({ deskId: "chair-basic", chairId: "chair-basic", rentalMonths: 5 }),
    ).toEqual({ deskId: null, chairId: "chair-basic", accessories: [], rentalMonths: 1 });
  });

  it("handles garbage input", () => {
    expect(sanitizeSetup("garbage").deskId).toBeNull();
    expect(sanitizeSetup({ accessories: [null, 1, { id: "plant" }] }).accessories).toEqual([]);
  });
});

describe("totals", () => {
  const setup: Setup = {
    deskId: "desk-standard", // 350k
    chairId: "chair-basic", // 200k
    accessories: [{ id: "monitor", qty: 2 }], // 2 × 450k
    rentalMonths: 3,
  };

  it("sums monthly and rental totals", () => {
    expect(getMonthlyTotal(setup)).toBe(1_450_000);
    expect(getRentalTotal(setup)).toBe(4_350_000);
  });

  it("is complete with a desk and a chair", () => {
    expect(isComplete(setup)).toBe(true);
    expect(isComplete({ ...setup, chairId: null })).toBe(false);
  });
});

describe("share links", () => {
  it("round-trips a setup", () => {
    const setup: Setup = {
      deskId: "desk-standing",
      chairId: "chair-ergonomic",
      accessories: [
        { id: "monitor", qty: 2 },
        { id: "plant", qty: 1 },
      ],
      rentalMonths: 6,
    };
    const encoded = encodeSetup(setup);
    expect(encoded).toBe(
      "desk=desk-standing&chair=chair-ergonomic&items=monitor.2~plant.1&months=6",
    );
    expect(decodeSetup(`?${encoded}`)).toEqual(setup);
  });

  it("returns null without setup params", () => {
    expect(decodeSetup("?utm_source=x")).toBeNull();
  });

  it("sanitizes tampered links", () => {
    expect(decodeSetup("?desk=desk-standard&items=monitor.9~hack.1")?.accessories).toEqual([
      { id: "monitor", qty: 2 },
    ]);
  });
});
