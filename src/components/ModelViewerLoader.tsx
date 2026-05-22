"use client";

import { useEffect } from "react";

/**
 * Registers the <model-viewer> custom element on the client.
 * Must be a Client Component so the import only runs in the browser.
 * Place this once in the root layout.
 */
export default function ModelViewerLoader() {
  useEffect(() => {
    // Guard: only register once
    if (customElements.get("model-viewer")) return;
    import("@google/model-viewer").catch((err) =>
      console.warn("model-viewer failed to load:", err)
    );
  }, []);

  return null;
}
