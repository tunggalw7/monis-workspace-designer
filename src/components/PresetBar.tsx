"use client";

import { presets } from "@/data/presets";
import { formatIDR } from "@/lib/format";
import { getMonthlyTotal, sanitizeSetup } from "@/lib/setup";
import { useSetup, withUndo } from "@/store/setup";

const sameSetup = (
  a: { deskId: string | null; chairId: string | null; accessories: { id: string; qty: number }[] },
  b: typeof a,
) =>
  a.deskId === b.deskId &&
  a.chairId === b.chairId &&
  a.accessories.length === b.accessories.length &&
  a.accessories.every((l) => b.accessories.some((m) => m.id === l.id && m.qty === l.qty));

const presetSetups = presets.map((p) => ({ ...p, clean: sanitizeSetup(p.setup) }));

export function PresetBar() {
  const deskId = useSetup((s) => s.deskId);
  const chairId = useSetup((s) => s.chairId);
  const accessories = useSetup((s) => s.accessories);
  const hydrated = useSetup((s) => s.hydrated);
  const applyPreset = useSetup((s) => s.applyPreset);
  const reset = useSetup((s) => s.reset);
  const current = { deskId, chairId, accessories };
  const isEmpty = !deskId && !chairId && accessories.length === 0;

  return (
    <div
      // One swipeable row on phones; wraps on wider screens.
      className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
      role="group"
      aria-label="Quick start presets"
    >
      <span className="shrink-0 text-sm font-semibold text-muted">Quick start:</span>
      {presetSetups.map((p) => {
        const active = hydrated && sameSetup(current, p.clean);
        return (
          <button
            key={p.id}
            type="button"
            title={p.tagline}
            aria-pressed={active}
            onClick={() => withUndo(() => applyPreset(p.id), `${p.name} setup applied`)}
            className={`shrink-0 rounded-full border-2 px-3 py-1.5 text-sm font-semibold whitespace-nowrap transition focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2 focus-visible:outline-none ${
              active
                ? "border-jungle bg-jungle text-white"
                : "border-border bg-surface hover:border-jungle"
            }`}
          >
            {p.name}
            <span className={`ml-1.5 font-normal ${active ? "text-white/85" : "text-muted"}`}>
              {formatIDR(getMonthlyTotal(p.clean))}
            </span>
          </button>
        );
      })}
      {hydrated && !isEmpty && (
        <button
          type="button"
          onClick={() => withUndo(reset, "Setup cleared")}
          className="shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold text-terracotta-dark underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:ring-ocean focus-visible:outline-none"
        >
          Clear
        </button>
      )}
    </div>
  );
}
