'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// A single line in the staff's draft order (the "bag"). Prices are snapshots
// for display only; the backend re-snapshots them when the sale is created.
export interface DraftItem {
  productId: string;
  name: string;
  brandName: string;
  unitPrice: number;
  image: string | null;
  quantity: number;
}

interface DraftState {
  items: DraftItem[];
  addItem: (item: Omit<DraftItem, 'quantity'>, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
}

/**
 * Client-side draft order for staff. Persisted to localStorage so an accidental
 * refresh doesn't lose an in-progress order. Submitting it creates a PENDING
 * sale (which the admin approves), after which the draft is cleared.
 */
export const useDraftStore = create<DraftState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: i.quantity + quantity }
                  : i,
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity }] };
        }),
      setQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity: Math.max(1, quantity) } : i,
          ),
        })),
      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),
      clear: () => set({ items: [] }),
    }),
    { name: 'vape-shop-draft' },
  ),
);
