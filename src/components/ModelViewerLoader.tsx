"use client";

import Script from "next/script";

/**
 * Registers the <model-viewer> custom element on the client.
 * Using next/script ensures it loads reliably on all devices without bundler issues.
 */
export default function ModelViewerLoader() {
  return (
    <Script
      type="module"
      src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.2.0/model-viewer.min.js"
      strategy="lazyOnload"
    />
  );
}
