import { create } from "zustand";

export type ConfiguratorTab = "desk" | "chair" | "accessory";

type UIState = {
  activeTab: ConfiguratorTab;
  /** Product card to scroll to and highlight, set from the preview. */
  highlightId: string | null;
  /** Bumped on every reveal so repeated clicks on the same hotspot still scroll. */
  revealCount: number;
  setActiveTab: (tab: ConfiguratorTab) => void;
  reveal: (tab: ConfiguratorTab, productId?: string) => void;
  clearHighlight: () => void;
};

/** Transient UI state shared between the configurator and the preview (not persisted). */
export const useUI = create<UIState>()((set) => ({
  activeTab: "desk",
  highlightId: null,
  revealCount: 0,
  setActiveTab: (activeTab) => set({ activeTab }),
  reveal: (activeTab, productId) =>
    set((s) => ({ activeTab, highlightId: productId ?? null, revealCount: s.revealCount + 1 })),
  clearHighlight: () => set({ highlightId: null }),
}));
