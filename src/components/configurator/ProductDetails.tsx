"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { Product } from "@/data/types";

/**
 * "Details" toggle with description, dimensions and highlights. The panel covers its card
 * (the nearest positioned ancestor) instead of growing it, so cards in a row keep their size.
 */
export function ProductDetails({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const id = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    // A brief skeleton so the panel settles in rather than popping.
    const timer = setTimeout(() => setReady(true), 350);
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(timer);
      setReady(false);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function close() {
    setOpen(false);
    toggleRef.current?.focus();
  }

  return (
    <div className="text-xs">
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(true)}
        className="rounded font-medium text-ocean underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:ring-ocean focus-visible:outline-none"
      >
        Details
        <span className="sr-only"> for {product.name}</span>
      </button>
      <div
        id={id}
        role="group"
        aria-label={`${product.name} details`}
        hidden={!open}
        aria-busy={!ready}
        className="absolute -inset-0.5 z-10 flex flex-col gap-2 overflow-y-auto rounded-2xl border-2 border-ocean/40 bg-surface p-3 text-muted shadow-md"
      >
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm leading-tight font-semibold text-foreground">{product.name}</p>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label={`Close details for ${product.name}`}
            className="-mt-1 -mr-1 grid size-7 shrink-0 place-items-center rounded-full bg-sand text-foreground transition hover:bg-border focus-visible:ring-2 focus-visible:ring-ocean focus-visible:outline-none"
          >
            <svg
              aria-hidden
              viewBox="0 0 14 14"
              className="size-3"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.25"
              strokeLinecap="round"
            >
              <path d="M3 3l8 8M11 3l-8 8" />
            </svg>
          </button>
        </div>
        {ready ? (
          <>
            <p>{product.description}</p>
            <p>
              <span className="font-medium text-foreground">Size:</span> {product.dimensions}
            </p>
            <ul className="list-inside list-disc">
              {product.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </>
        ) : (
          <div aria-hidden className="flex flex-col gap-2 pt-0.5">
            <span className="skeleton h-3 w-full rounded" />
            <span className="skeleton h-3 w-11/12 rounded" />
            <span className="skeleton h-3 w-2/3 rounded" />
            <span className="skeleton mt-1 h-3 w-1/2 rounded" />
            <span className="skeleton h-3 w-3/4 rounded" />
            <span className="skeleton h-3 w-2/3 rounded" />
          </div>
        )}
      </div>
    </div>
  );
}
