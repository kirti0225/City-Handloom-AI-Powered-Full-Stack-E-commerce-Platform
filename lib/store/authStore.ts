import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  name: string
  email: string
  role: 'customer' | 'admin'
  phone?: string
}

interface AuthState {
  user: User | null
  isLoggedIn: boolean
  login: (user: User) => void
  setUser: (user: User) => void
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,

      login: (user: User) => {
        set({ user, isLoggedIn: true })
      },

      setUser: (user: User) => {
        set({ user, isLoggedIn: true })
      },

      logout: async () => {
        try {
          await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
          })
        } catch { }
        set({ user: null, isLoggedIn: false })
      },
    }),
    {
      name: 'city-handloom-auth',
    }
  )
)