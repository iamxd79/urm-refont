'use client';
import { useEffect } from 'react';
/** Puts the docs (nav and page background included) in the colours of the product a page is about. */
export default function ThemeSetter({ product }: { product: string }) {
  useEffect(() => {
    const b = document.body;
    if (['rage', 'hestia', 'circle'].includes(product)) b.dataset.theme = product; else delete b.dataset.theme;
    return () => { delete b.dataset.theme; };
  }, [product]);
  return null;
}
