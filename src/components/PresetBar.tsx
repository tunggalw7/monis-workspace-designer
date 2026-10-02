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
      className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center"
      role="group"
      aria-label="Quick start presets"
    >
      {/* Phones: label and Clear on one line, presets as equal tiles below. From sm, one row. */}
      <div className="flex min-h-8 items-center justify-between sm:contents">
        <span className="shrink-0 text-sm font-semibold text-muted">Quick start:</span>
        {hydrated && !isEmpty && (
          <button
            type="button"
            onClick={() => withUndo(reset, "Setup cleared")}
            className="-mr-3 shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold text-terracotta-dark underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:ring-ocean focus-visible:outline-none sm:order-last sm:mr-0"
          >
            Clear
          </button>
        )}
      </div>
      <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap">
        {presetSetups.map((p) => {
          const active = hydrated && sameSetup(current, p.clean);
          return (
            <button
              key={p.id}
              type="button"
              title={p.tagline}
              aria-pressed={active}
              onClick={() => withUndo(() => applyPreset(p.id), `${p.name} setup applied`)}
              className={`flex min-w-0 flex-col items-center justify-center rounded-2xl border-2 px-2 py-1.5 text-sm leading-tight font-semibold transition focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2 focus-visible:outline-none sm:flex-row sm:rounded-full sm:px-3 sm:whitespace-nowrap ${
                active
                  ? "border-jungle bg-jungle text-white"
                  : "border-border bg-surface hover:border-jungle"
              }`}
            >
              {p.name}
              <span
                className={`text-xs font-normal whitespace-nowrap sm:ml-1.5 sm:text-sm ${active ? "text-white/85" : "text-muted"}`}
              >
                {formatIDR(getMonthlyTotal(p.clean))}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
