"use client";

import { getProductsByCategory } from "@/data/products";
import type { Product } from "@/data/types";
import { ZONES } from "@/data/zones";
import { useSetup } from "@/store/setup";
import { useUI } from "@/store/ui";
import { FadeImage } from "./FadeImage";
import { Price } from "./configurator/Price";

const extras = getProductsByCategory("extra");
// Zones with several items come first and span the full row, so the single-item zones
// below line up as equal tiles.
const zones = ZONES.map((zone) => ({ ...zone, items: extras.filter((p) => p.zone === zone.id) }))
  .filter((zone) => zone.items.length > 0)
  .sort((a, b) => b.items.length - a.items.length);

/** Lifestyle add-ons that stand around the platform, grouped by zone. */
export function BaliExtras({ className = "" }: { className?: string }) {
  return (
    <section
      aria-labelledby="extras-heading"
      className={`@container flex flex-col gap-3 rounded-3xl border border-border bg-surface p-4 shadow-sm ${className}`}
    >
      <div>
        <h2 id="extras-heading" className="font-display text-lg font-semibold">
          Bali extras
        </h2>
        <p className="text-sm text-muted">Make it a home, not just a desk.</p>
      </div>
      <div className="grid grid-cols-1 gap-3 @lg:grid-cols-3">
        {zones.map((zone) => {
          const wide = zone.items.length > 1;
          return (
            <div
              key={zone.id}
              // Subgrid rows (title, blurb, items) keep neighbouring zones aligned even when a blurb wraps.
              className={`row-span-3 grid grid-rows-subgrid gap-2 rounded-2xl bg-sand/50 p-3 ${wide ? "@lg:col-span-3" : ""}`}
            >
              <h3 className="flex items-center gap-1.5 text-sm font-semibold">
                <span aria-hidden>{zone.icon}</span>
                {zone.name}
              </h3>
              <p className="-mt-1.5 self-start text-xs text-muted">{zone.blurb}</p>
              <div className={`grid flex-1 gap-2 ${wide ? "@md:grid-cols-2" : ""}`}>
                {zone.items.map((p) => (
                  <ExtraRow key={p.id} product={p} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ExtraRow({ product }: { product: Product }) {
  const added = useSetup((s) => s.accessories.some((l) => l.id === product.id));
  const setQty = useSetup((s) => s.setQty);
  const highlighted = useUI((s) => s.highlightId === product.id);

  return (
    // A row when there's room, a stacked tile in narrow columns.
    <div
      id={`card-${product.id}`}
      className={`@container rounded-xl border-2 bg-surface p-2 transition ${
        added ? "border-terracotta" : "border-transparent"
      } ${highlighted ? "ring-4 ring-ocean/50" : ""}`}
    >
      <div className="flex h-full flex-col items-center gap-2 text-center @[15rem]:flex-row @[15rem]:gap-2.5 @[15rem]:text-left">
        <div className="relative flex size-16 shrink-0 items-center justify-center rounded-lg bg-background p-1 @[15rem]:size-12">
          <FadeImage
            src={product.image}
            alt=""
            width={product.preview.width}
            height={product.preview.height}
            className="size-full object-contain"
          />
        </div>
        <div className="flex min-w-0 flex-col @[15rem]:flex-1">
          <span className="line-clamp-2 text-sm leading-tight font-semibold">{product.name}</span>
          <Price amount={product.pricePerMonth} />
        </div>
        <button
          type="button"
          aria-label={`${added ? "Remove" : "Add"} ${product.name}`}
          onClick={() => setQty(product.id, added ? 0 : 1)}
          className={`mt-auto w-full shrink-0 rounded-full border-2 px-3 py-1 text-xs font-semibold transition focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2 focus-visible:outline-none @[15rem]:mt-0 @[15rem]:w-auto ${
            added
              ? "border-terracotta bg-terracotta text-white hover:bg-terracotta-dark"
              : "border-terracotta text-terracotta-dark hover:bg-terracotta hover:text-white"
          }`}
        >
          {added ? "Added ✓" : "Add"}
        </button>
      </div>
    </div>
  );
}
