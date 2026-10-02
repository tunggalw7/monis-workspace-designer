import { create } from "zustand";

export type ConfiguratorTab = "desk" | "chair" | "accessory";

type UIState = {
  activeTab: ConfiguratorTab;
  setActiveTab: (tab: ConfiguratorTab) => void;
};

/** Transient UI state shared between the configurator and the preview (not persisted). */
export const useUI = create<UIState>()((set) => ({
  activeTab: "desk",
  setActiveTab: (activeTab) => set({ activeTab }),
}));
