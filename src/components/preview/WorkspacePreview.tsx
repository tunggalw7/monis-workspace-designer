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
  const ghostX = scene.offsetX + STAGE.width / 2;
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
        aria-busy={!hydrated}
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
                  className="absolute rounded-md transition-[filter] hover:drop-shadow-[0_0_4px_rgba(42,140,140,0.7)] focus-visible:ring-2 focus-visible:ring-ocean focus-visible:outline-none"
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

          {/* Until the saved setup is restored, sketch where the desk and chair will stand. */}
          {!hydrated && (
            <div aria-hidden>
              <span className="skeleton absolute top-[27%] left-[30%] h-[16%] w-[40%] rounded-lg" />
              <span className="skeleton absolute top-[46%] left-[17%] h-[37%] w-[66%] rounded-xl opacity-70" />
              <span className="skeleton absolute top-[52%] left-[46%] h-[38%] w-[18%] rounded-2xl" />
            </div>
          )}

          {hydrated && !deskId && (
            <>
              {/* A dashed "ghost" desk on the platform shows where the setup will stand. */}
              <svg
                aria-hidden
                viewBox={`0 0 ${scene.width} ${STAGE.height}`}
                className="absolute inset-0 h-full w-full text-terracotta motion-safe:animate-pulse"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeDasharray="4 3"
                strokeLinecap="round"
                opacity="0.45"
              >
                <rect x={ghostX - 70} y={STAGE.floorY - 75} width="140" height="7" rx="2" />
                <path
                  d={`M${ghostX - 62} ${STAGE.floorY - 68}V${STAGE.floorY}M${ghostX + 62} ${STAGE.floorY - 68}V${STAGE.floorY}`}
                />
              </svg>

              <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center px-4">
                {/* A soft card keeps the prompt readable over the window and platform. */}
                <div className="pointer-events-auto flex max-w-xs flex-col items-center gap-2 rounded-3xl bg-surface/90 px-5 py-4 text-center shadow-lg ring-1 ring-border backdrop-blur-sm sm:gap-2.5 sm:px-7 sm:py-5">
                  <span className="rounded-full bg-sand px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-terracotta-dark uppercase">
                    Step 1 · Your desk
                  </span>
                  <p className="font-display text-lg leading-tight font-semibold sm:text-2xl">
                    Start by picking a desk
                  </p>
                  <p className="hidden text-sm text-muted sm:block">
                    {accessories.length > 0
                      ? "Your accessories are waiting to go on it."
                      : "Then add a chair, screens and a plant. It all appears right here."}
                  </p>
                  <button
                    type="button"
                    onClick={() => reveal("desk")}
                    className="group mt-1 inline-flex items-center gap-1.5 rounded-full bg-terracotta py-2 pr-3.5 pl-4 text-sm font-semibold text-white shadow-md shadow-terracotta/30 transition hover:-translate-y-0.5 hover:bg-terracotta-dark hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2 focus-visible:outline-none motion-reduce:hover:translate-y-0"
                  >
                    Browse desks
                    <svg
                      aria-hidden
                      viewBox="0 0 16 16"
                      className="size-4 transition-transform group-hover:translate-x-0.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 8h10M9 4l4 4-4 4" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </MotionConfig>
  );
}
