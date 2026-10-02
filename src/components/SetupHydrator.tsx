"use client";

import { useEffect } from "react";
import { decodeSetup } from "@/lib/setup";
import { useSetup } from "@/store/setup";

/** Restores the saved setup from localStorage, then applies a shared link if present. */
export function SetupHydrator() {
  useEffect(() => {
    void Promise.resolve(useSetup.persist.rehydrate()).then(() => {
      const shared = decodeSetup(window.location.search);
      if (!shared) return;
      useSetup.getState().applySetup(shared);
      const url = new URL(window.location.href);
      ["desk", "chair", "items", "months"].forEach((k) => url.searchParams.delete(k));
      window.history.replaceState(null, "", url);
    });
  }, []);

  return null;
}
