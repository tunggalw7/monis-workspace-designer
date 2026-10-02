"use client";

import Link from "next/link";
import { useState } from "react";
import { isComplete } from "@/lib/setup";
import { useSetup } from "@/store/setup";
import { CheckoutForm } from "./CheckoutForm";
import { OrderConfirmation } from "./OrderConfirmation";
import { OrderSummary } from "./OrderSummary";
import type { Order } from "./order";

export function Checkout() {
  const hydrated = useSetup((s) => s.hydrated);
  const deskId = useSetup((s) => s.deskId);
  const chairId = useSetup((s) => s.chairId);
  const [order, setOrder] = useState<Order | null>(null);

  if (order) return <OrderConfirmation order={order} />;

  if (!hydrated) {
    return <CheckoutSkeleton />;
  }

  if (!isComplete({ deskId, chairId })) {
    const missing = !deskId && !chairId ? "a desk and a chair" : !deskId ? "a desk" : "a chair";
    return (
      <section className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-3xl border border-border bg-surface p-8 text-center shadow-sm">
        <h2 className="font-display text-2xl font-semibold">Almost there</h2>
        <p className="text-muted">Every setup needs {missing} before you can rent it.</p>
        <Link
          href="/"
          className="rounded-full bg-terracotta px-5 py-3 font-semibold text-white transition hover:bg-terracotta-dark focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          Back to the designer
        </Link>
      </section>
    );
  }

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <OrderSummary />
      <CheckoutForm onPlaced={setOrder} />
    </div>
  );
}

/** Mirrors the summary and form while the saved setup is restored. */
function CheckoutSkeleton() {
  const card =
    "flex flex-col gap-4 rounded-3xl border border-border bg-surface p-4 shadow-sm sm:p-6";
  return (
    <div
      aria-busy="true"
      aria-label="Loading your setup"
      className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2"
    >
      <div className={card}>
        <span className="skeleton h-7 w-40 rounded-lg" />
        <span className="skeleton aspect-[12/10] w-full rounded-2xl" />
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="skeleton size-12 shrink-0 rounded-xl" />
            <span className="skeleton h-4 flex-1 rounded-md" />
            <span className="skeleton h-4 w-20 rounded-md" />
          </div>
        ))}
      </div>
      <div className={card}>
        <span className="skeleton h-7 w-48 rounded-lg" />
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col gap-2">
            <span className="skeleton h-4 w-28 rounded-md" />
            <span className="skeleton h-11 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
