"use client";

import { formatIDR } from "@/lib/format";
import { useCountUp } from "@/lib/useCountUp";

/** Counts up/down to a price; screen readers only hear the final value. */
export function AnimatedPrice({ amount }: { amount: number }) {
  const shown = useCountUp(amount);
  return (
    <>
      <span aria-hidden="true">{formatIDR(shown)}</span>
      <span className="sr-only">{formatIDR(amount)}</span>
    </>
  );
}
