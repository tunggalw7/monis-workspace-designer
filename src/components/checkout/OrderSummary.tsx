"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatedPrice } from "@/components/AnimatedPrice";
import { SetupThumbnail } from "@/components/preview/SetupThumbnail";
import type { Product } from "@/data/types";
import { formatIDR } from "@/lib/format";
import { useLineItems, useSetup, useTotals, withUndo } from "@/store/setup";
import { useUI, type ConfiguratorTab } from "@/store/ui";
import { DurationPicker } from "./DurationPicker";

const tabFor = (p: Product): ConfiguratorTab =>
  p.category === "desk" || p.category === "chair" ? p.category : "accessory";

export function OrderSummary() {
  const router = useRouter();
  const setup = useSetup();
  const lineItems = useLineItems();
  const { monthly, rentalMonths, total } = useTotals();
  const reveal = useUI((s) => s.reveal);

  function edit(product: Product) {
    reveal(tabFor(product), product.id);
    router.push("/");
  }

  function remove(product: Product) {
    withUndo(() => {
      if (product.category === "desk") setup.selectDesk(null);
      else if (product.category === "chair") setup.selectChair(null);
      else setup.removeAccessory(product.id);
    }, `${product.name} removed`);
  }

  return (
    <section
      aria-labelledby="summary-heading"
      className="flex flex-col gap-5 rounded-3xl border border-border bg-surface p-4 shadow-sm sm:p-6"
    >
      <h2 id="summary-heading" className="font-display text-2xl font-semibold">
        Your setup
      </h2>
      <SetupThumbnail setup={setup} />

      <ul className="divide-y divide-border">
        {lineItems.map(({ product, qty, monthly: lineMonthly }) => (
          <li key={product.id} className="flex items-center gap-3 py-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-background p-1.5">
              <Image
                src={product.image}
                alt=""
                width={product.preview.width}
                height={product.preview.height}
                className="h-auto max-h-full w-auto max-w-full"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">
                {product.name}
                {qty > 1 && <span className="font-normal text-muted"> × {qty}</span>}
              </p>
              <p className="text-sm text-muted">
                {qty > 1 && `${formatIDR(product.pricePerMonth)} × ${qty} = `}
                <span className="whitespace-nowrap">{formatIDR(lineMonthly)}/mo</span>
              </p>
            </div>
            <div className="flex shrink-0 gap-1">
              <button
                type="button"
                onClick={() => edit(product)}
                className="rounded-full px-2.5 py-1 text-xs font-semibold text-ocean hover:bg-sand focus-visible:ring-2 focus-visible:ring-ocean focus-visible:outline-none"
              >
                Edit<span className="sr-only"> {product.name}</span>
              </button>
              <button
                type="button"
                onClick={() => remove(product)}
                className="rounded-full px-2.5 py-1 text-xs font-semibold text-terracotta-dark hover:bg-sand focus-visible:ring-2 focus-visible:ring-ocean focus-visible:outline-none"
              >
                Remove<span className="sr-only"> {product.name}</span>
              </button>
            </div>
          </li>
        ))}
      </ul>

      <DurationPicker />

      <dl className="flex flex-col gap-1.5 border-t border-border pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">Monthly</dt>
          <dd>{formatIDR(monthly)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">Duration</dt>
          <dd>
            × {rentalMonths} {rentalMonths === 1 ? "month" : "months"}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">Delivery & setup</dt>
          <dd className="font-semibold text-jungle">Free</dd>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <dt className="font-semibold">Total</dt>
          <dd aria-live="polite" className="font-display text-2xl font-semibold">
            <AnimatedPrice amount={total} />
          </dd>
        </div>
      </dl>
    </section>
  );
}
