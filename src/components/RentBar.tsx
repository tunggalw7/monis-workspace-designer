"use client";

import Link from "next/link";
import { AnimatedPrice } from "@/components/AnimatedPrice";
import { isComplete } from "@/lib/setup";
import { useSetup, useTotals } from "@/store/setup";
import { useUI } from "@/store/ui";

/** Sticky "Ready to rent?" bar with the live monthly total. */
export function RentBar() {
  const deskId = useSetup((s) => s.deskId);
  const chairId = useSetup((s) => s.chairId);
  const hydrated = useSetup((s) => s.hydrated);
  const reveal = useUI((s) => s.reveal);
  const { monthly } = useTotals();
  const complete = isComplete({ deskId, chairId });
  const missing = !deskId && !chairId ? "a desk and a chair" : !deskId ? "a desk" : "a chair";

  const cta =
    "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold whitespace-nowrap shadow-sm transition focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2 focus-visible:outline-none sm:text-base";

  return (
    <div className="fixed inset-x-0 bottom-0 z-[200] border-t border-border bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="min-w-0">
          <p className="text-xs text-muted sm:text-sm">
            {complete ? "Ready to rent?" : `Pick ${missing} to rent your setup`}
          </p>
          <p aria-live="polite" className="font-display text-lg font-semibold sm:text-2xl">
            {hydrated ? (
              <AnimatedPrice amount={monthly} />
            ) : (
              <span
                aria-hidden
                className="skeleton inline-block h-[0.8em] w-32 rounded-md align-middle"
              />
            )}
            <span className="font-sans text-sm font-normal text-muted">/mo</span>
          </p>
        </div>
        {complete ? (
          <Link
            href="/checkout"
            className={`${cta} bg-terracotta text-white hover:bg-terracotta-dark`}
          >
            Rent Your Setup!
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => reveal(deskId ? "chair" : "desk")}
            className={`${cta} border-2 border-dashed border-terracotta/60 bg-sand text-terracotta-dark hover:bg-border`}
          >
            {deskId ? "Pick a chair" : "Pick a desk"}
          </button>
        )}
      </div>
    </div>
  );
}
