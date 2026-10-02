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
    return <div aria-busy="true" className="h-96 animate-pulse rounded-3xl bg-sand/60" />;
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
