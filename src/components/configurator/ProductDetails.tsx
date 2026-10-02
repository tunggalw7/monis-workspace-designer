"use client";

import { useId, useState } from "react";
import type { Product } from "@/data/types";

/** "Details" toggle with dimensions and highlights. */
export function ProductDetails({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <div className="text-xs">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="rounded font-medium text-ocean underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:ring-ocean focus-visible:outline-none"
      >
        {open ? "Hide details" : "Details"}
        <span className="sr-only"> for {product.name}</span>
      </button>
      <div id={id} hidden={!open} className="mt-1.5 space-y-1 text-muted">
        <p>{product.description}</p>
        <p>
          <span className="font-medium text-foreground">Size:</span> {product.dimensions}
        </p>
        <ul className="list-inside list-disc">
          {product.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
