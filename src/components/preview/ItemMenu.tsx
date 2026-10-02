"use client";

import { useEffect, useRef } from "react";
import { useSetup, withUndo } from "@/store/setup";
import { tabFor, useUI } from "@/store/ui";
import { STAGE, type PlacedItem } from "./layout";

type Props = { item: PlacedItem; stageWidth: number; onClose: (restoreFocus: boolean) => void };

const action =
  "rounded-full px-3 py-1.5 text-xs font-semibold transition focus-visible:ring-2 focus-visible:ring-ocean focus-visible:outline-none";

/** Small popover for an item clicked in the preview: swap/edit or remove it. */
export function ItemMenu({ item, stageWidth, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { product } = item;
  const qty = useSetup((s) => s.accessories.find((l) => l.id === product.id)?.qty ?? 0);
  const selectDesk = useSetup((s) => s.selectDesk);
  const selectChair = useSetup((s) => s.selectChair);
  const setQty = useSetup((s) => s.setQty);
  const reveal = useUI((s) => s.reveal);

  useEffect(() => {
    ref.current?.querySelector("button")?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose(true);
    const onPointer = (e: PointerEvent) => {
      const target = e.target as Element;
      // Clicks on preview items toggle the menu themselves.
      if (!ref.current?.contains(target) && !target.closest("[data-preview-item]")) onClose(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [onClose]);

  const isAccessory = product.category !== "desk" && product.category !== "chair";
  const tab = tabFor(product);

  function remove() {
    withUndo(() => {
      if (product.category === "desk") selectDesk(null);
      else if (product.category === "chair") selectChair(null);
      else setQty(product.id, qty - 1);
    }, `${product.name} removed`);
    onClose(false);
  }

  function swap() {
    reveal(tab, product.id);
    onClose(false);
  }

  // Keep the menu inside the stage near the edges.
  const centerX = Math.min(Math.max(item.left + item.width / 2, 40), stageWidth - 40);
  const centerY = Math.min(item.top + item.height / 2, STAGE.height - 25);

  return (
    <div
      ref={ref}
      role="group"
      aria-label={`${product.name} options`}
      className="absolute z-[100] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 rounded-2xl border border-border bg-surface p-2.5 shadow-lg"
      style={{
        left: `${(centerX / stageWidth) * 100}%`,
        top: `${(centerY / STAGE.height) * 100}%`,
      }}
    >
      <p className="px-1 text-xs font-semibold whitespace-nowrap">{product.name}</p>
      <div className="flex gap-1.5">
        <button
          type="button"
          onClick={swap}
          className={`${action} bg-sand text-foreground hover:bg-border`}
        >
          {isAccessory ? "Edit" : `Swap ${product.category}`}
        </button>
        <button
          type="button"
          onClick={remove}
          className={`${action} bg-terracotta text-white hover:bg-terracotta-dark`}
        >
          {isAccessory && qty > 1 ? "Remove one" : "Remove"}
        </button>
      </div>
    </div>
  );
}
