"use client";

import { useEffect, useRef, type KeyboardEvent } from "react";
import { getProduct, getProductsByCategory } from "@/data/products";
import { useSetup } from "@/store/setup";
import { useToast } from "@/store/toast";
import { useUI, type ConfiguratorTab } from "@/store/ui";
import { AccessoryCard } from "./AccessoryCard";
import { ChoiceCard } from "./ChoiceCard";

const TABS: { id: ConfiguratorTab; label: string }[] = [
  { id: "desk", label: "Desks" },
  { id: "chair", label: "Chairs" },
  { id: "accessory", label: "Accessories" },
];

const desks = getProductsByCategory("desk");
const chairs = getProductsByCategory("chair");
const accessories = getProductsByCategory("accessory");

export function Configurator() {
  const activeTab = useUI((s) => s.activeTab);
  const setActiveTab = useUI((s) => s.setActiveTab);
  const deskId = useSetup((s) => s.deskId);
  const chairId = useSetup((s) => s.chairId);
  const accessoryCount = useSetup((s) =>
    s.accessories.reduce((n, l) => (getProduct(l.id)?.category === "accessory" ? n + l.qty : n), 0),
  );
  const selectDesk = useSetup((s) => s.selectDesk);
  const selectChair = useSetup((s) => s.selectChair);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const revealCount = useUI((s) => s.revealCount);
  const clearHighlight = useUI((s) => s.clearHighlight);

  // The preview asked to show a tab or product: scroll to it and move focus there.
  useEffect(() => {
    if (!useUI.getState().revealPending) return;
    // Wait a frame so the newly selected panel is visible. The reveal is consumed inside the
    // frame so React's dev-only double effect run (mount, cleanup, mount) doesn't drop it.
    const frame = requestAnimationFrame(() => {
      if (!useUI.getState().consumeReveal()) return;
      const { activeTab, highlightId } = useUI.getState();
      const target =
        (highlightId && document.getElementById(`card-${highlightId}`)) ||
        document.getElementById(`panel-${activeTab}`);
      if (!target) return;
      target.scrollIntoView({ behavior: "smooth", block: "nearest" });
      const focusable =
        target.querySelector<HTMLElement>("input:checked") ??
        target.querySelector<HTMLElement>("input, button");
      focusable?.focus({ preventScroll: true });
    });
    const timer = setTimeout(clearHighlight, 1600);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, [revealCount, clearHighlight]);

  // A smaller desk can drop monitors; say so and offer undo.
  function chooseDesk(id: string) {
    const { deskId, chairId, accessories, rentalMonths, applySetup } = useSetup.getState();
    const before = { deskId, chairId, accessories, rentalMonths };
    const count = (lines: typeof accessories) => lines.find((l) => l.id === "monitor")?.qty ?? 0;
    selectDesk(id);
    const removed = count(accessories) - count(useSetup.getState().accessories);
    if (removed > 0) {
      const kept = count(useSetup.getState().accessories);
      useToast
        .getState()
        .show(`Only ${kept} monitors fit on the ${getProduct(id)?.name} — removed ${removed}.`, {
          label: "Undo",
          run: () => applySetup(before),
        });
    }
  }

  const badges: Record<ConfiguratorTab, string | null> = {
    desk: deskId ? "✓" : null,
    chair: chairId ? "✓" : null,
    accessory: accessoryCount ? String(accessoryCount) : null,
  };

  function onTabKeyDown(e: KeyboardEvent, index: number) {
    const last = TABS.length - 1;
    const next = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    setActiveTab(TABS[next].id);
    tabRefs.current[next]?.focus();
  }

  return (
    <section
      aria-label="Configure your workspace"
      className="@container flex min-w-0 flex-col gap-4 rounded-3xl border border-border bg-surface p-4 shadow-sm"
    >
      <div
        role="tablist"
        aria-label="Product categories"
        className="flex gap-1 rounded-full bg-sand p-1"
      >
        {TABS.map((tab, i) => {
          const selected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(e) => onTabKeyDown(e, i)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold transition focus-visible:ring-2 focus-visible:ring-ocean focus-visible:outline-none ${
                selected
                  ? "bg-surface text-foreground shadow-sm"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {tab.label}
              {badges[tab.id] && (
                <span className="grid min-w-5 place-items-center rounded-full bg-jungle px-1 text-[11px] text-white">
                  {badges[tab.id]}
                  <span className="sr-only">{tab.id === "accessory" ? " added" : " selected"}</span>
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" id="panel-desk" aria-labelledby="tab-desk" hidden={activeTab !== "desk"}>
        <fieldset>
          <legend className="mb-3 text-sm text-muted">Pick one desk</legend>
          <div className="grid grid-cols-2 gap-3 @md:grid-cols-3">
            {desks.map((p) => (
              <ChoiceCard
                key={p.id}
                product={p}
                name="desk"
                checked={deskId === p.id}
                onSelect={() => chooseDesk(p.id)}
              />
            ))}
          </div>
        </fieldset>
      </div>

      <div
        role="tabpanel"
        id="panel-chair"
        aria-labelledby="tab-chair"
        hidden={activeTab !== "chair"}
      >
        <fieldset>
          <legend className="mb-3 text-sm text-muted">Pick one chair</legend>
          <div className="grid grid-cols-2 gap-3 @md:grid-cols-3">
            {chairs.map((p) => (
              <ChoiceCard
                key={p.id}
                product={p}
                name="chair"
                checked={chairId === p.id}
                onSelect={() => selectChair(p.id)}
              />
            ))}
          </div>
        </fieldset>
      </div>

      <div
        role="tabpanel"
        id="panel-accessory"
        aria-labelledby="tab-accessory"
        hidden={activeTab !== "accessory"}
      >
        <p className="mb-3 text-sm text-muted">Add as many as you like</p>
        <div className="grid grid-cols-2 gap-3 @md:grid-cols-3">
          {accessories.map((p) => (
            <AccessoryCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
