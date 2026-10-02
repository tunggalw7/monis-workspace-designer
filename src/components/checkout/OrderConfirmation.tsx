"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { SetupThumbnail } from "@/components/preview/SetupThumbnail";
import { formatDate, formatIDR } from "@/lib/format";
import { useSetup } from "@/store/setup";
import type { Order } from "./order";

export function OrderConfirmation({ order }: { order: Order }) {
  const router = useRouter();
  const reset = useSetup((s) => s.reset);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { form, setup } = order;
  const firstName = form.name.split(/\s+/)[0];

  useEffect(() => {
    window.scrollTo({ top: 0 });
    headingRef.current?.focus();
  }, []);

  function startOver() {
    reset();
    router.push("/");
  }

  return (
    <section
      aria-labelledby="confirm-heading"
      className="mx-auto flex w-full max-w-2xl flex-col gap-6 rounded-3xl border border-border bg-surface p-5 shadow-sm sm:p-8"
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <span
          aria-hidden="true"
          className="grid size-14 place-items-center rounded-full bg-jungle text-2xl text-white"
        >
          ✓
        </span>
        <h2
          id="confirm-heading"
          ref={headingRef}
          tabIndex={-1}
          className="font-display text-3xl font-semibold outline-none"
        >
          Terima kasih, {firstName}!
        </h2>
        <p className="text-muted">
          Your rental request <strong className="text-foreground">{order.id}</strong> is in. We’ll
          WhatsApp you at <strong className="text-foreground">{form.whatsapp}</strong> within 24
          hours to confirm delivery.
        </p>
      </div>

      <SetupThumbnail setup={setup} />

      <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted">Start date</dt>
          <dd className="font-semibold">{formatDate(form.startDate)}</dd>
        </div>
        <div>
          <dt className="text-muted">Duration</dt>
          <dd className="font-semibold">
            {setup.rentalMonths} {setup.rentalMonths === 1 ? "month" : "months"}
          </dd>
        </div>
        <div>
          <dt className="text-muted">Delivery to</dt>
          <dd className="font-semibold">
            {form.area}
            {form.address && <span className="font-normal"> · {form.address}</span>}
          </dd>
        </div>
        <div>
          <dt className="text-muted">Confirmation sent to</dt>
          <dd className="font-semibold break-all">{form.email}</dd>
        </div>
      </dl>

      <div className="rounded-2xl bg-background p-4">
        <ul className="flex flex-col gap-1.5 text-sm">
          {order.lines.map((l) => (
            <li key={l.name} className="flex justify-between gap-3">
              <span>
                {l.name}
                {l.qty > 1 && <span className="text-muted"> × {l.qty}</span>}
              </span>
              <span className="whitespace-nowrap">{formatIDR(l.monthly)}/mo</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex items-baseline justify-between border-t border-border pt-3">
          <span className="font-semibold">
            Total for {setup.rentalMonths} {setup.rentalMonths === 1 ? "month" : "months"}
          </span>
          <span className="font-display text-2xl font-semibold">{formatIDR(order.total)}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
        <Link
          href="/"
          className="rounded-full border-2 border-terracotta px-5 py-3 text-center font-semibold text-terracotta-dark transition hover:bg-sand focus-visible:ring-2 focus-visible:ring-ocean focus-visible:outline-none"
        >
          Back to my setup
        </Link>
        <button
          type="button"
          onClick={startOver}
          className="rounded-full bg-terracotta px-5 py-3 font-semibold text-white transition hover:bg-terracotta-dark focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          Design a new setup
        </button>
      </div>
    </section>
  );
}
