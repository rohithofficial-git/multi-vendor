'use client';

import React, { Suspense } from 'react';
import ProductCatalogContent from './ProductCatalogContent';

export default function ProductCatalogPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-black text-theme-muted">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 rounded-full border-2 border-brand border-t-transparent animate-spin" />
          <span className="text-xs font-semibold">Initializing Curation Catalog...</span>
        </div>
      </div>
    }>
      <ProductCatalogContent />
    </Suspense>
  );
}
