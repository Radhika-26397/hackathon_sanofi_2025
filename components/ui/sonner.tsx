"use client";

import { Toaster as Sonner } from "sonner";

export const Toaster = () => {
  return (
    <Sonner
      richColors
      position="top-right"
      toastOptions={{
        style: { fontSize: '0.875rem' },
      }}
    />
  );
};
