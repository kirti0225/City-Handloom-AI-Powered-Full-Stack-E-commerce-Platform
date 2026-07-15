'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'

export default function GoogleAuthSuccess() {
  const router = useRouter()
  const { login } = useAuthStore()

  useEffect(() => {
    const load = async () => {
      try {
        const res  = await fetch('/api/auth/me', { credentials: 'include' })
        const data = await res.json()

        if (data.success && data.data) {
          login({
            id:    data.data._id,
            name:  data.data.name,
            email: data.data.email,
            role:  data.data.role,
          })
          router.push(data.data.role === 'admin' ? '/login_kit_city03' : '/account')
        } else {
          router.push('/login')
        }
      } catch {
        router.push('/login')
      }
    }
    load()
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#FDF0EC',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 48, height: 48,
          border: '3px solid #AD8F2E',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
          margin: '0 auto 16px',
        }} />
        <p style={{ fontSize: 14, color: '#3D2B1F88', fontFamily: 'inherit' }}>
          Signing you in with Google...
        </p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}