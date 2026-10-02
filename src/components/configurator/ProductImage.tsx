import { FadeImage } from "@/components/FadeImage";
import type { Product } from "@/data/types";

export function ProductImage({ product }: { product: Product }) {
  return (
    <div className="relative flex h-24 items-end justify-center rounded-xl bg-background p-2">
      <FadeImage
        src={product.image}
        alt={product.name}
        width={product.preview.width}
        height={product.preview.height}
        className="h-auto max-h-full w-auto max-w-full"
      />
    </div>
  );
}
