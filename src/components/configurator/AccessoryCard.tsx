"use client";

import type { Product } from "@/data/types";
import { getProduct } from "@/data/products";
import { maxQtyFor } from "@/lib/setup";
import { useSetup } from "@/store/setup";
import { useUI } from "@/store/ui";
import { Price } from "./Price";
import { ProductDetails } from "./ProductDetails";
import { ProductImage } from "./ProductImage";

const stepButton =
  "grid size-8 place-items-center rounded-full text-lg font-semibold leading-none transition focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40";

/** Multi-choice card with a quantity stepper. */
export function AccessoryCard({ product }: { product: Product }) {
  const qty = useSetup((s) => s.accessories.find((l) => l.id === product.id)?.qty ?? 0);
  const deskId = useSetup((s) => s.deskId);
  const setQty = useSetup((s) => s.setQty);
  const highlighted = useUI((s) => s.highlightId === product.id);
  const max = maxQtyFor(product.id, deskId);
  const limitedByDesk = max < product.preview.maxQty;

  return (
    <div
      id={`card-${product.id}`}
      className={`relative flex min-w-0 flex-col gap-2 rounded-2xl border-2 bg-surface p-3 transition ${
        qty > 0 ? "border-terracotta bg-sand/40" : "border-border hover:border-terracotta/50"
      } ${highlighted ? "ring-4 ring-ocean/50" : ""}`}
    >
      <ProductImage product={product} />
      <span className="leading-tight font-semibold">{product.name}</span>
      <Price amount={product.pricePerMonth} />

      {qty === 0 ? (
        <button
          type="button"
          onClick={() => setQty(product.id, 1)}
          className="rounded-full border-2 border-terracotta px-3 py-1.5 text-sm font-semibold text-terracotta-dark transition hover:bg-terracotta hover:text-white focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          Add<span className="sr-only"> {product.name}</span>
        </button>
      ) : (
        <div className="flex items-center justify-between rounded-full bg-sand p-0.5">
          <button
            type="button"
            onClick={() => setQty(product.id, qty - 1)}
            aria-label={qty === 1 ? `Remove ${product.name}` : `Remove one ${product.name}`}
            className={`${stepButton} bg-surface text-terracotta-dark hover:bg-white`}
          >
            −
          </button>
          <output aria-live="polite" className="text-sm font-semibold">
            {qty}
            <span className="sr-only"> {product.name} in your setup</span>
          </output>
          <button
            type="button"
            onClick={() => setQty(product.id, qty + 1)}
            disabled={qty >= max}
            aria-label={`Add one more ${product.name}`}
            className={`${stepButton} bg-terracotta text-white hover:bg-terracotta-dark`}
          >
            +
          </button>
        </div>
      )}
      {qty > 0 && qty >= max && max > 1 && (
        <p className="text-xs text-muted">
          Max {max}
          {limitedByDesk && deskId ? ` on the ${getProduct(deskId)?.name}` : ""}
        </p>
      )}
      <ProductDetails product={product} />
    </div>
  );
}
