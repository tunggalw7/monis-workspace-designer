import { useMemo } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getPreset } from "@/data/presets";
import {
  clampAccessories,
  EMPTY_SETUP,
  getLineItems,
  maxQtyFor,
  sanitizeSetup,
  type RentalMonths,
  type Setup,
} from "@/lib/setup";
import { useToast } from "./toast";

type SetupActions = {
  selectDesk: (id: string | null) => void;
  selectChair: (id: string | null) => void;
  addAccessory: (id: string) => void;
  removeAccessory: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  setRentalMonths: (months: RentalMonths) => void;
  applyPreset: (presetId: string) => void;
  applySetup: (setup: Setup) => void;
  reset: () => void;
};

export type SetupState = Setup & SetupActions & { hydrated: boolean };

export const useSetup = create<SetupState>()(
  persist(
    (set, get) => ({
      ...EMPTY_SETUP,
      hydrated: false,

      selectDesk: (deskId) =>
        set((s) => {
          const desk = sanitizeSetup({ deskId }).deskId;
          // A smaller desk may hold fewer monitors.
          return { deskId: desk, accessories: clampAccessories(s.accessories, desk) };
        }),

      selectChair: (chairId) => set({ chairId: sanitizeSetup({ chairId }).chairId }),

      addAccessory: (id) => {
        const current = get().accessories.find((l) => l.id === id)?.qty ?? 0;
        get().setQty(id, current + 1);
      },

      removeAccessory: (id) =>
        set((s) => ({ accessories: s.accessories.filter((l) => l.id !== id) })),

      setQty: (id, qty) =>
        set((s) => {
          const next = Math.min(Math.floor(qty), maxQtyFor(id, s.deskId));
          const exists = s.accessories.some((l) => l.id === id);
          if (next < 1) return { accessories: s.accessories.filter((l) => l.id !== id) };
          const lines = exists
            ? s.accessories.map((l) => (l.id === id ? { id, qty: next } : l))
            : [...s.accessories, { id, qty: next }];
          return { accessories: clampAccessories(lines, s.deskId) };
        }),

      setRentalMonths: (rentalMonths) =>
        set({ rentalMonths: sanitizeSetup({ rentalMonths }).rentalMonths }),

      applyPreset: (presetId) => {
        const preset = getPreset(presetId);
        if (preset) set((s) => sanitizeSetup({ ...preset.setup, rentalMonths: s.rentalMonths }));
      },

      applySetup: (setup) => set(sanitizeSetup(setup)),

      reset: () => set(EMPTY_SETUP),
    }),
    {
      name: "monis-setup",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // Rehydrated on the client by <SetupHydrator /> so SSR markup matches the first render.
      skipHydration: true,
      partialize: ({ deskId, chairId, accessories, rentalMonths }) => ({
        deskId,
        chairId,
        accessories,
        rentalMonths,
      }),
      merge: (persisted, current) => ({ ...current, ...sanitizeSetup(persisted) }),
      onRehydrateStorage: () => () => useSetup.setState({ hydrated: true }),
    },
  ),
);

export function useLineItems() {
  const deskId = useSetup((s) => s.deskId);
  const chairId = useSetup((s) => s.chairId);
  const accessories = useSetup((s) => s.accessories);
  return useMemo(
    () => getLineItems({ deskId, chairId, accessories }),
    [deskId, chairId, accessories],
  );
}

export function useTotals() {
  const lineItems = useLineItems();
  const rentalMonths = useSetup((s) => s.rentalMonths);
  const monthly = lineItems.reduce((sum, l) => sum + l.monthly, 0);
  return { monthly, rentalMonths, total: monthly * rentalMonths };
}

/** Runs a change and shows a toast that can undo it. */
export function withUndo(change: () => void, message: string) {
  const { deskId, chairId, accessories, rentalMonths, applySetup } = useSetup.getState();
  const before = { deskId, chairId, accessories, rentalMonths };
  change();
  useToast.getState().show(message, { label: "Undo", run: () => applySetup(before) });
}
