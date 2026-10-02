import { create } from "zustand";

export type Toast = {
  id: number;
  message: string;
  action?: { label: string; run: () => void };
};

type ToastState = {
  toasts: Toast[];
  show: (message: string, action?: Toast["action"]) => void;
  dismiss: (id: number) => void;
};

const DURATION_MS = 4500;
let nextId = 1;

export const useToast = create<ToastState>()((set, get) => ({
  toasts: [],
  show: (message, action) => {
    const id = nextId++;
    // Keep at most 3 on screen.
    set((s) => ({ toasts: [...s.toasts.slice(-2), { id, message, action }] }));
    setTimeout(() => get().dismiss(id), DURATION_MS);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
