"use client";

import Image from "next/image";
import { useMemo } from "react";
import type { Setup } from "@/lib/setup";
import { Backdrop } from "./Backdrop";
import { layoutScene, STAGE } from "./layout";

type Props = { setup: Pick<Setup, "deskId" | "chairId" | "accessories">; className?: string };

/** Static, non-interactive render of a setup (summary and confirmation). */
export function SetupThumbnail({ setup, className = "" }: Props) {
  const { deskId, chairId, accessories } = setup;
  const { items, width, offsetX } = useMemo(
    () => layoutScene({ deskId, chairId, accessories }),
    [deskId, chairId, accessories],
  );

  return (
    <div
      role="img"
      aria-label={`Your workspace: ${items.map((i) => i.product.name).join(", ") || "empty"}`}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#f8eddc] to-sand ${className}`}
      style={{ aspectRatio: `${width} / ${STAGE.height}` }}
    >
      <Backdrop width={width} offsetX={offsetX} />
      {items.map((item) => (
        <Image
          key={item.key}
          src={item.product.image}
          alt=""
          width={item.product.preview.width}
          height={item.product.preview.height}
          className="absolute"
          style={{
            left: `${(item.left / width) * 100}%`,
            top: `${(item.top / STAGE.height) * 100}%`,
            width: `${(item.width / width) * 100}%`,
            height: `${(item.height / STAGE.height) * 100}%`,
            zIndex: item.z,
          }}
        />
      ))}
    </div>
  );
}
