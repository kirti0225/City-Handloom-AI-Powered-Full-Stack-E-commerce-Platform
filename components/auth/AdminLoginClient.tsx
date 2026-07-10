'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Cormorant_Garamond } from 'next/font/google'
import { Eye, EyeOff, Lock, Shield } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import { api } from '@/lib/api'

const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })

export default function AdminLoginClient() {
  const [email,       setEmail]       = useState('')
  const [password,    setPassword]    = useState('')
  const [showPass,    setShowPass]    = useState(false)
  const [isLoading,   setIsLoading]   = useState(false)
  const [error,       setError]       = useState('')

  const router   = useRouter()
  const { login } = useAuthStore()

  const handleLogin = async () => {
    if (!email || !password) { setError('Both fields are required'); return }
    setIsLoading(true)
    setError('')
    try {
      const data = await api.login({ email, password })
      const user = data.data.user

      if (user.role !== 'admin') {
        setError('Access denied. This portal is for administrators only.')
        return
      }

      login(user)
      router.push('/login_kit_city03')
    } catch (err: any) {
      setError(err.message || 'Invalid credentials')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 80, damping: 14 }}
        className="w-full max-w-md"
      >
        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mx-auto mb-4">
              <Shield size={28} className="text-amber-400" />
            </div>
            <h1 className={`${cormorant.className} text-2xl font-semibold text-white mb-1`}>
              Admin Portal
            </h1>
            <p className="text-sm text-gray-400">
              City Handloom — Restricted Access
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-5">
              <p className="text-xs text-red-400 text-center">{error}</p>
            </div>
          )}

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-400 block mb-1.5">
                Admin Email
              </label>
              <input
                type="email"
                placeholder="admin@cityhandloom.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-amber-400 transition-colors"
                autoFocus
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-400 block mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter admin password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-amber-400 transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full py-3.5 bg-amber-400 text-gray-900 font-semibold text-sm rounded-xl hover:bg-amber-300 transition-colors disabled:opacity-60 mt-2 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Lock size={15} /> Access Dashboard
                </>
              )}
            </motion.button>
          </div>

          <p className="text-center text-xs text-gray-600 mt-6">
            Not an admin?{' '}
            <a href="/" className="text-gray-500 hover:text-gray-400 underline">
              Go to store
            </a>
          </p>
        </div>

        <p className="text-center text-xs text-gray-700 mt-4">
          🔒 Secure admin access · City Handloom
        </p>
      </motion.div>
    </main>
  )
}