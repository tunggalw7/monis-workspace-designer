import { create } from "zustand";

export type ConfiguratorTab = "desk" | "chair" | "accessory";

type UIState = {
  activeTab: ConfiguratorTab;
  /** Product card to scroll to and highlight, set from the preview. */
  highlightId: string | null;
  /** Bumped on every reveal so repeated clicks on the same hotspot still scroll. */
  revealCount: number;
  /** True until the configurator has scrolled to the revealed item (it may mount later). */
  revealPending: boolean;
  setActiveTab: (tab: ConfiguratorTab) => void;
  reveal: (tab: ConfiguratorTab, productId?: string) => void;
  clearHighlight: () => void;
  consumeReveal: () => boolean;
};

/** Transient UI state shared between the configurator and the preview (not persisted). */
export const useUI = create<UIState>()((set, get) => ({
  activeTab: "desk",
  highlightId: null,
  revealCount: 0,
  revealPending: false,
  setActiveTab: (activeTab) => set({ activeTab }),
  reveal: (activeTab, productId) =>
    set((s) => ({
      activeTab,
      highlightId: productId ?? null,
      revealCount: s.revealCount + 1,
      revealPending: true,
    })),
  clearHighlight: () => set({ highlightId: null }),
  consumeReveal: () => {
    const pending = get().revealPending;
    if (pending) set({ revealPending: false });
    return pending;
  },
}));
