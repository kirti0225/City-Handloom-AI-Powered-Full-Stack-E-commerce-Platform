'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

function ResetPasswordInner() {
  const searchParams = useSearchParams()
  const router       = useRouter()
  const token        = searchParams.get('token')

  const [password,    setPassword]    = useState('')
  const [confirm,     setConfirm]     = useState('')
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState('')
  const [success,     setSuccess]     = useState(false)
  const [tokenValid,  setTokenValid]  = useState<boolean | null>(null)
  const [showPass,    setShowPass]    = useState(false)

  useEffect(() => {
    if (!token) { setTokenValid(false); return }
    // Verify token exists
    fetch(`/api/auth/verify-reset-token?token=${token}`)
      .then(r => r.json())
      .then(d => setTokenValid(d.success))
      .catch(() => setTokenValid(false))
  }, [token])

  const handleReset = async () => {
    if (!password) { setError('Enter new password'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    if (password !== confirm) { setError('Passwords do not match'); return }
    setLoading(true); setError('')
    try {
      const res  = await fetch('/api/auth/reset-password', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ token, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message || 'Reset failed'); return }
      setSuccess(true)
      setTimeout(() => router.push('/login'), 3000)
    } catch { setError('Network error. Try again.') }
    finally { setLoading(false) }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', border: '1.5px solid #e8c8be',
    borderRadius: 10, padding: '12px 14px',
    fontSize: 14, outline: 'none',
    boxSizing: 'border-box', fontFamily: 'inherit',
  }

  const btnStyle: React.CSSProperties = {
    width: '100%', padding: 14,
    background: '#AD8F2E', color: '#fff',
    border: 'none', borderRadius: 10,
    fontSize: 14, fontWeight: 700,
    cursor: 'pointer', fontFamily: 'inherit',
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: '#FDF0EC', padding: 16,
    }}>
      <div style={{
        background: '#fff', borderRadius: 20, padding: 40,
        width: '100%', maxWidth: 420,
        boxShadow: '0 4px 32px rgba(0,0,0,0.10)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <img src="/images/logo.png" alt="City Handloom"
            style={{ width: 90, height: 90, objectFit: 'contain' }} />
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#3D2B1F', margin: '6px 0 0' }}>
            Reset Password
          </h1>
        </div>

        {/* Token checking */}
        {tokenValid === null && (
          <div style={{ textAlign: 'center', padding: 20 }}>
            <div style={{
              width: 32, height: 32,
              border: '3px solid #AD8F2E',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 0.6s linear infinite',
              margin: '0 auto',
            }} />
            <p style={{ fontSize: 13, color: '#3D2B1F88', marginTop: 12 }}>Verifying reset link...</p>
          </div>
        )}

        {/* Invalid token */}
        {tokenValid === false && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>❌</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#dc2626', margin: '0 0 8px' }}>
              Link Expired
            </h3>
            <p style={{ fontSize: 13, color: '#3D2B1F88', margin: '0 0 20px' }}>
              This reset link has expired or is invalid. Please request a new one.
            </p>
            <button style={btnStyle} onClick={() => router.push('/login')}>
              Back to Login
            </button>
          </div>
        )}

        {/* Valid token — show form */}
        {tokenValid === true && !success && (
          <>
            <p style={{ fontSize: 13, color: '#3D2B1F88', margin: '0 0 20px', textAlign: 'center' }}>
              Enter your new password below
            </p>

            {error && (
              <div style={{
                background: '#fef2f2', border: '1px solid #fecaca',
                borderRadius: 8, padding: '10px 14px', marginBottom: 14,
                fontSize: 12, color: '#dc2626',
              }}>{error}</div>
            )}

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#3D2B1F', display: 'block', marginBottom: 6 }}>
                New Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ ...inputStyle, paddingRight: 44 }}
                />
                <button onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#3D2B1F', display: 'block', marginBottom: 6 }}>
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="Repeat your password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleReset()}
                style={inputStyle}
              />
              {confirm && confirm !== password && (
                <p style={{ fontSize: 11, color: '#dc2626', marginTop: 4 }}>Passwords do not match</p>
              )}
              {confirm && confirm === password && password.length >= 6 && (
                <p style={{ fontSize: 11, color: '#16a34a', marginTop: 4 }}>✓ Passwords match</p>
              )}
            </div>

            <button style={{ ...btnStyle, opacity: loading ? 0.7 : 1 }}
              onClick={handleReset} disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </>
        )}

        {/* Success */}
        {success && (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 60, height: 60, borderRadius: '50%',
              background: '#dcfce7', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px', fontSize: 28,
            }}>✓</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#16a34a', margin: '0 0 8px' }}>
              Password Reset!
            </h3>
            <p style={{ fontSize: 13, color: '#3D2B1F88', margin: '0 0 8px' }}>
              Your password has been changed successfully.
            </p>
            <p style={{ fontSize: 12, color: '#3D2B1F55' }}>
              Redirecting to login in 3 seconds...
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 32, border: '3px solid #AD8F2E', borderTopColor: 'transparent', borderRadius: '50%' }} />
      </div>
    }>
      <ResetPasswordInner />
    </Suspense>
  )
}