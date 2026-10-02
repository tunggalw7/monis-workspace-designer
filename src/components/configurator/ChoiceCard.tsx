"use client";

import type { Product } from "@/data/types";
import { useUI } from "@/store/ui";
import { Price } from "./Price";
import { ProductDetails } from "./ProductDetails";
import { ProductImage } from "./ProductImage";

type Props = {
  product: Product;
  name: string;
  checked: boolean;
  onSelect: () => void;
};

/** Single-choice card (desk or chair) backed by a native radio for keyboard support. */
export function ChoiceCard({ product, name, checked, onSelect }: Props) {
  const highlighted = useUI((s) => s.highlightId === product.id);

  return (
    <div
      id={`card-${product.id}`}
      className={`${highlighted ? "ring-4 ring-ocean/50" : ""} relative flex min-w-0 flex-col gap-2 rounded-2xl border-2 border-border bg-surface p-3 transition hover:border-terracotta/50 has-checked:border-terracotta has-checked:bg-sand/40 has-focus-visible:ring-2 has-focus-visible:ring-ocean has-focus-visible:ring-offset-2`}
    >
      <label className="flex flex-col gap-2">
        <input
          type="radio"
          name={name}
          value={product.id}
          checked={checked}
          onChange={onSelect}
          className="sr-only"
        />
        <ProductImage product={product} />
        <span className="leading-tight font-semibold">{product.name}</span>
        <Price amount={product.pricePerMonth} />
      </label>
      {checked && (
        <span className="absolute top-2 right-2 rounded-full bg-terracotta px-2 py-0.5 text-xs font-semibold text-white">
          Selected
        </span>
      )}
      <div className="mt-auto">
        <ProductDetails product={product} />
      </div>
    </div>
  );
}
