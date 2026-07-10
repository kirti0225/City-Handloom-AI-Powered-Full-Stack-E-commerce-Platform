import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  id: string
  name: string
  price: number
  image: string
  qty: number
  size: string
  color: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clearCart: () => void
  total: () => number
  itemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find(i => i.id === item.id && i.size === item.size && i.color === item.color)
          if (existing) {
            return {
              items: state.items.map(i =>
                i.id === item.id && i.size === item.size && i.color === item.color
                  ? { ...i, qty: i.qty + item.qty }
                  : i
              )
            }
          }
          return { items: [...state.items, item] }
        })
      },

      removeItem: (id) => set((state) => ({
        items: state.items.filter(i => i.id !== id)
      })),

      updateQty: (id, qty) => set((state) => ({
        items: qty <= 0
          ? state.items.filter(i => i.id !== id)
          : state.items.map(i => i.id === id ? { ...i, qty } : i)
      })),

      clearCart: () => set({ items: [] }),

      total: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),

      itemCount: () => get().items.reduce((sum, i) => sum + i.qty, 0),
    }),
    { name: 'cart-store' }
  )
)