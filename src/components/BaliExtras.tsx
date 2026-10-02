"use client";

import Image from "next/image";
import { getProductsByCategory } from "@/data/products";
import type { Product } from "@/data/types";
import { ZONES } from "@/data/zones";
import { useSetup } from "@/store/setup";
import { useUI } from "@/store/ui";
import { Price } from "./configurator/Price";

const extras = getProductsByCategory("extra");

/** Lifestyle add-ons that stand around the platform, grouped by zone. */
export function BaliExtras({ className = "" }: { className?: string }) {
  return (
    <section
      aria-labelledby="extras-heading"
      className={`flex flex-col gap-3 rounded-3xl border border-border bg-surface p-4 shadow-sm ${className}`}
    >
      <div>
        <h2 id="extras-heading" className="font-display text-lg font-semibold">
          Bali extras
        </h2>
        <p className="text-sm text-muted">Make it a home, not just a desk.</p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {ZONES.map((zone) => (
          <div key={zone.id} className="flex flex-col gap-2 rounded-2xl bg-sand/50 p-3">
            <h3 className="flex items-center gap-1.5 text-sm font-semibold">
              <span aria-hidden>{zone.icon}</span>
              {zone.name}
            </h3>
            <p className="-mt-1.5 text-xs text-muted">{zone.blurb}</p>
            {extras
              .filter((p) => p.zone === zone.id)
              .map((p) => (
                <ExtraRow key={p.id} product={p} />
              ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function ExtraRow({ product }: { product: Product }) {
  const added = useSetup((s) => s.accessories.some((l) => l.id === product.id));
  const setQty = useSetup((s) => s.setQty);
  const highlighted = useUI((s) => s.highlightId === product.id);

  return (
    <div
      id={`card-${product.id}`}
      className={`flex items-center gap-2.5 rounded-xl border-2 bg-surface p-2 transition ${
        added ? "border-terracotta" : "border-transparent"
      } ${highlighted ? "ring-4 ring-ocean/50" : ""}`}
    >
      <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-background p-1">
        <Image
          src={product.image}
          alt=""
          width={product.preview.width}
          height={product.preview.height}
          className="size-full object-contain"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="line-clamp-2 text-sm leading-tight font-semibold">{product.name}</span>
        <Price amount={product.pricePerMonth} />
      </div>
      <button
        type="button"
        aria-label={`${added ? "Remove" : "Add"} ${product.name}`}
        onClick={() => setQty(product.id, added ? 0 : 1)}
        className={`shrink-0 rounded-full border-2 px-3 py-1 text-xs font-semibold transition focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2 focus-visible:outline-none ${
          added
            ? "border-terracotta bg-terracotta text-white hover:bg-terracotta-dark"
            : "border-terracotta text-terracotta-dark hover:bg-terracotta hover:text-white"
        }`}
      >
        {added ? "Added ✓" : "Add"}
      </button>
    </div>
  );
}
