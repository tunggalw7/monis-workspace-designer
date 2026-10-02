import Image from "next/image";
import type { Product } from "@/data/types";

export function ProductImage({ product }: { product: Product }) {
  return (
    <div className="flex h-24 items-end justify-center rounded-xl bg-background p-2">
      <Image
        src={product.image}
        alt={product.name}
        width={product.preview.width}
        height={product.preview.height}
        className="h-auto max-h-full w-auto max-w-full"
      />
    </div>
  );
}
