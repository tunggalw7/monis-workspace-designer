import { getProduct } from "@/data/products";
import type { Product } from "@/data/types";

export const RENTAL_MONTHS = [1, 3, 6, 12] as const;
export type RentalMonths = (typeof RENTAL_MONTHS)[number];

export type AccessoryLine = { id: string; qty: number };

export type Setup = {
  deskId: string | null;
  chairId: string | null;
  /** Accessories and extras, each with a quantity of at least 1. */
  accessories: AccessoryLine[];
  rentalMonths: RentalMonths;
};

export const EMPTY_SETUP: Setup = {
  deskId: null,
  chairId: null,
  accessories: [],
  rentalMonths: 1,
};

export type LineItem = { product: Product; qty: number; monthly: number };

/** How many of a product fit, taking the selected desk's capacity into account. */
export function maxQtyFor(productId: string, deskId: string | null): number {
  const product = getProduct(productId);
  if (!product) return 0;
  const deskCap = deskId ? getProduct(deskId)?.capacity?.[product.preview.slot] : undefined;
  return Math.min(product.preview.maxQty, deskCap ?? Infinity);
}

/** Clamps quantities to their limits, merges duplicates and drops invalid lines. */
export function clampAccessories(lines: AccessoryLine[], deskId: string | null): AccessoryLine[] {
  const result: AccessoryLine[] = [];
  for (const { id, qty } of lines) {
    const product = getProduct(id);
    if (!product || product.category === "desk" || product.category === "chair") continue;
    const existing = result.find((l) => l.id === id);
    const max = maxQtyFor(id, deskId);
    const next = Math.min(Math.floor(qty) + (existing?.qty ?? 0), max);
    if (!Number.isFinite(next) || next < 1) continue;
    if (existing) existing.qty = next;
    else result.push({ id, qty: next });
  }
  return result;
}

function validId(id: unknown, category: Product["category"]): string | null {
  return typeof id === "string" && getProduct(id)?.category === category ? id : null;
}

/** Turns untrusted input (localStorage, URL) into a valid Setup. */
export function sanitizeSetup(raw: unknown): Setup {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const deskId = validId(r.deskId, "desk");
  const lines = Array.isArray(r.accessories)
    ? r.accessories.filter(
        (l): l is AccessoryLine =>
          !!l && typeof l === "object" && typeof l.id === "string" && typeof l.qty === "number",
      )
    : [];
  return {
    deskId,
    chairId: validId(r.chairId, "chair"),
    accessories: clampAccessories(lines, deskId),
    rentalMonths: RENTAL_MONTHS.includes(r.rentalMonths as RentalMonths)
      ? (r.rentalMonths as RentalMonths)
      : 1,
  };
}

export function getLineItems(setup: Pick<Setup, "deskId" | "chairId" | "accessories">): LineItem[] {
  const lines: AccessoryLine[] = [];
  if (setup.deskId) lines.push({ id: setup.deskId, qty: 1 });
  if (setup.chairId) lines.push({ id: setup.chairId, qty: 1 });
  lines.push(...setup.accessories);
  return lines.flatMap(({ id, qty }) => {
    const product = getProduct(id);
    return product ? [{ product, qty, monthly: product.pricePerMonth * qty }] : [];
  });
}

export function getMonthlyTotal(setup: Pick<Setup, "deskId" | "chairId" | "accessories">): number {
  return getLineItems(setup).reduce((sum, l) => sum + l.monthly, 0);
}

export function getRentalTotal(setup: Setup): number {
  return getMonthlyTotal(setup) * setup.rentalMonths;
}

/** A setup is rentable once it has both a desk and a chair. */
export function isComplete(setup: Pick<Setup, "deskId" | "chairId">): boolean {
  return !!setup.deskId && !!setup.chairId;
}

// Share links: ?desk=desk-standing&chair=chair-basic&items=monitor.2~plant.1&months=3
// Product ids only use [a-z0-9-], so the separators never need escaping.

export function encodeSetup(setup: Setup): string {
  const parts: string[] = [];
  if (setup.deskId) parts.push(`desk=${setup.deskId}`);
  if (setup.chairId) parts.push(`chair=${setup.chairId}`);
  if (setup.accessories.length)
    parts.push(`items=${setup.accessories.map((l) => `${l.id}.${l.qty}`).join("~")}`);
  if (setup.rentalMonths !== 1) parts.push(`months=${setup.rentalMonths}`);
  return parts.join("&");
}

/** Returns null when the query string carries no setup. */
export function decodeSetup(search: string): Setup | null {
  const params = new URLSearchParams(search);
  if (!["desk", "chair", "items", "months"].some((k) => params.has(k))) return null;
  const accessories = (params.get("items") ?? "")
    .split("~")
    .filter(Boolean)
    .map((part) => {
      const [id, qty] = part.split(".");
      return { id, qty: qty === undefined ? 1 : Number(qty) };
    });
  return sanitizeSetup({
    deskId: params.get("desk"),
    chairId: params.get("chair"),
    accessories,
    rentalMonths: Number(params.get("months") ?? 1),
  });
}
