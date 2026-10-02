"use client";

import Image from "next/image";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useCallback, useMemo, useState } from "react";
import { useSetup } from "@/store/setup";
import { useUI } from "@/store/ui";
import { Backdrop } from "./Backdrop";
import { ItemMenu } from "./ItemMenu";
import { layoutScene, STAGE, type PlacedItem } from "./layout";

const y = (cm: number) => `${(cm / STAGE.height) * 100}%`;

export function WorkspacePreview() {
  const deskId = useSetup((s) => s.deskId);
  const chairId = useSetup((s) => s.chairId);
  const accessories = useSetup((s) => s.accessories);
  const hydrated = useSetup((s) => s.hydrated);
  const reveal = useUI((s) => s.reveal);
  const [openKey, setOpenKey] = useState<string | null>(null);

  const scene = useMemo(
    () => layoutScene({ deskId, chairId, accessories }),
    [deskId, chairId, accessories],
  );
  const openItem = scene.items.find((i) => i.key === openKey);
  const x = (cm: number) => `${(cm / scene.width) * 100}%`;
  const frame = (item: PlacedItem) => ({
    left: x(item.left),
    top: y(item.top),
    width: x(item.width),
    height: y(item.height),
  });

  const closeMenu = useCallback((restoreFocus: boolean) => {
    setOpenKey((key) => {
      if (restoreFocus && key) {
        document.querySelector<HTMLElement>(`[data-preview-item="${key}"]`)?.focus();
      }
      return null;
    });
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <section
        aria-label="Workspace preview"
        className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#f8eddc] to-sand p-3 sm:p-6"
      >
        <div
          className="relative mx-auto w-full max-w-3xl"
          style={{ aspectRatio: `${scene.width} / ${STAGE.height}` }}
        >
          <Backdrop width={scene.width} offsetX={scene.offsetX} />

          {hydrated && (
            <AnimatePresence>
              {scene.items.map((item) => (
                <motion.button
                  // Keyed by product too, so swapping a desk cross-fades in place.
                  key={`${item.key}:${item.product.id}`}
                  type="button"
                  data-preview-item={item.key}
                  aria-label={`${item.product.name}: swap or remove`}
                  aria-expanded={openKey === item.key}
                  onClick={() => setOpenKey((k) => (k === item.key ? null : item.key))}
                  className="absolute cursor-pointer rounded-md transition-[filter] hover:drop-shadow-[0_0_4px_rgba(42,140,140,0.7)] focus-visible:ring-2 focus-visible:ring-ocean focus-visible:outline-none"
                  style={{ zIndex: item.z }}
                  initial={{ opacity: 0, y: -14, ...frame(item) }}
                  animate={{ opacity: 1, y: 0, ...frame(item) }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                >
                  <Image
                    src={item.product.image}
                    alt=""
                    width={item.product.preview.width}
                    height={item.product.preview.height}
                    draggable={false}
                    className="pointer-events-none h-full w-full select-none"
                  />
                </motion.button>
              ))}
            </AnimatePresence>
          )}

          {hydrated && (
            <AnimatePresence>
              {scene.hotspots.map((h) => (
                <motion.button
                  key={h.key}
                  type="button"
                  onClick={() => reveal(h.tab, h.productId)}
                  className="absolute z-50 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-terracotta bg-surface/90 px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap text-terracotta-dark shadow-sm backdrop-blur-sm transition-colors hover:bg-terracotta hover:text-white focus-visible:ring-2 focus-visible:ring-ocean focus-visible:outline-none sm:px-3 sm:py-1 sm:text-xs"
                  style={{ left: x(h.x), top: y(h.y) }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  {h.label}
                </motion.button>
              ))}
            </AnimatePresence>
          )}

          {openItem && <ItemMenu item={openItem} stageWidth={scene.width} onClose={closeMenu} />}

          {hydrated && !deskId && (
            <div className="absolute inset-x-0 top-[50%] z-40 flex -translate-y-1/2 justify-center px-4">
              {/* A soft card keeps the prompt readable over the window and platform. */}
              <div className="flex flex-col items-center gap-2 rounded-2xl bg-surface/85 px-5 py-4 text-center shadow-sm backdrop-blur-sm">
                <p className="font-display text-xl font-semibold sm:text-2xl">
                  Start by picking a desk
                </p>
                {accessories.length > 0 && (
                  <p className="text-sm text-muted">Your accessories will appear on it.</p>
                )}
                <button
                  type="button"
                  onClick={() => reveal("desk")}
                  className="rounded-full bg-terracotta px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-terracotta-dark focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  Browse desks
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </MotionConfig>
  );
}
