'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'

type Step = 'landing' | 'login' | 'register' | 'otp' | 'forgot'

export default function LoginPage() {
  const [step,         setStep]         = useState<Step>('landing')
  const [email,        setEmail]        = useState('')
  const [password,     setPassword]     = useState('')
  const [showPass,     setShowPass]     = useState(false)
  const [phone,        setPhone]        = useState('')
  const [otpSent,      setOtpSent]      = useState(false)
  const [otpValues,    setOtpValues]    = useState(['','','','','',''])
  const [otpSending,   setOtpSending]   = useState(false)
  const [name,         setName]         = useState('')
  const [regEmail,     setRegEmail]     = useState('')
  const [regPhone,     setRegPhone]     = useState('')
  const [regPassword,  setRegPassword]  = useState('')
  const [forgotEmail,  setForgotEmail]  = useState('')
  const [forgotSent,   setForgotSent]   = useState(false)
  const [error,        setError]        = useState('')
  const [loading,      setLoading]      = useState(false)

  const { login } = useAuthStore()
  const router    = useRouter()

  const cardStyle: React.CSSProperties = {
    background: '#fff',
    borderRadius: 20,
    padding: 36,
    width: '100%',
    maxWidth: 420,
    boxShadow: '0 4px 32px rgba(0,0,0,0.10)',
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    border: '1.5px solid #e8c8be',
    borderRadius: 10,
    padding: '12px 14px',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    color: '#3D2B1F',
  }

  const btnPrimary: React.CSSProperties = {
    width: '100%',
    padding: '14px',
    background: '#AD8F2E',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit',
    marginTop: 4,
  }

  const btnOutline: React.CSSProperties = {
    width: '100%',
    padding: '12px',
    background: '#fff',
    color: '#3D2B1F',
    border: '1.5px solid #e8c8be',
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  }

  const label: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 600,
    color: '#3D2B1F',
    display: 'block',
    marginBottom: 6,
  }

  const fieldWrap: React.CSSProperties = { marginBottom: 14 }

  const divider = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0' }}>
      <div style={{ flex: 1, height: 1, background: '#f0ddd6' }} />
      <span style={{ fontSize: 11, color: '#3D2B1F55' }}>OR</span>
      <div style={{ flex: 1, height: 1, background: '#f0ddd6' }} />
    </div>
  )

  const errorBox = error ? (
    <div style={{
      background: '#fef2f2', border: '1px solid #fecaca',
      borderRadius: 8, padding: '10px 14px', marginBottom: 14,
      fontSize: 12, color: '#dc2626',
    }}>{error}</div>
  ) : null

  const Logo = () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
      <img
        src="/images/logo.png"
        alt="City Handloom"
        style={{ width: 90, height: 90, objectFit: 'contain', marginBottom: 6 }}
      />
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#3D2B1F', margin: 0, textAlign: 'center' }}>
        City Handloom
      </h1>
    </div>
  )

  const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )

  // ── Handle Login ────────────────────────────────────────────
  const handleLogin = async () => {
    if (!email || !password) { setError('Fill all fields'); return }
    setLoading(true); setError('')
    try {
      const res  = await fetch('/api/auth/login', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message || 'Invalid credentials'); return }
      login(data.data.user)
      router.push(data.data.user.role === 'admin' ? '/login_kit_city03' : '/account')
    } catch { setError('Network error. Try again.') }
    finally { setLoading(false) }
  }

  // ── Handle Register ─────────────────────────────────────────
  const handleRegister = async () => {
    if (!name || !regEmail || !regPassword) { setError('Fill all required fields'); return }
    if (regPhone && regPhone.length !== 10) { setError('Phone must be 10 digits'); return }
    setLoading(true); setError('')
    try {
      const res  = await fetch('/api/auth/register', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email: regEmail.trim().toLowerCase(), phone: regPhone, password: regPassword }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message || 'Registration failed'); return }
      login(data.data.user)
      router.push('/account')
    } catch { setError('Network error. Try again.') }
    finally { setLoading(false) }
  }

  // ── Handle Send OTP ─────────────────────────────────────────
  const handleSendOtp = async () => {
    if (!phone || phone.length !== 10) { setError('Enter valid 10-digit number'); return }
    setOtpSending(true); setError('')
    await new Promise(r => setTimeout(r, 1000))
    setOtpSent(true)
    setOtpSending(false)
  }

  const handleOtpChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return
    const next = [...otpValues]
    next[i] = val.slice(-1)
    setOtpValues(next)
    if (val && i < 5) {
      document.getElementById(`otp-${i + 1}`)?.focus()
    }
  }

  const handleOtpKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpValues[i] && i > 0) {
      document.getElementById(`otp-${i - 1}`)?.focus()
    }
  }

  // ── Handle Forgot Password ──────────────────────────────────
  const handleForgot = async () => {
    if (!forgotEmail.trim()) { setError('Enter your email'); return }
    setLoading(true); setError('')
    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail.trim().toLowerCase() }),
      })
      setForgotSent(true)
    } catch { setError('Something went wrong') }
    finally { setLoading(false) }
  }

  // ── Google ──────────────────────────────────────────────────
  const handleGoogle = () => {
  window.location.href = '/api/auth/google'
}

  const back = (s: Step) => { setStep(s); setError('') }

  const wrapper: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#FDF0EC',
    padding: 16,
    fontFamily: 'inherit',
  }

  // ── LANDING ─────────────────────────────────────────────────
  if (step === 'landing') return (
    <div style={wrapper}>
      <div style={cardStyle}>
        <Logo />
        <p style={{ textAlign: 'center', fontSize: 13, color: '#3D2B1F88', marginBottom: 24, marginTop: -10 }}>
          Sign in or create an account to continue
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button style={btnPrimary} onClick={() => { setStep('login'); setError('') }}>
            Log In
          </button>
          <button style={{ ...btnOutline, borderColor: '#AD8F2E', color: '#AD8F2E' }}
            onClick={() => { setStep('register'); setError('') }}>
            Create Account
          </button>
        </div>
        {divider}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button style={btnOutline} onClick={handleGoogle}>
            <GoogleIcon /> Continue with Google
          </button>
          <button style={btnOutline}
            onClick={() => { setStep('otp'); setOtpSent(false); setPhone(''); setOtpValues(['','','','','','']); setError('') }}>
            📱 Continue with OTP
          </button>
        </div>
      </div>
    </div>
  )

  // ── LOGIN ────────────────────────────────────────────────────
  if (step === 'login') return (
    <div style={wrapper}>
      <div style={cardStyle}>
        <Logo />
        <button onClick={() => back('landing')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#3D2B1F88', marginBottom: 16, padding: 0 }}>
          ← Back
        </button>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#3D2B1F', margin: '0 0 4px' }}>Login</h2>
        <p style={{ fontSize: 13, color: '#3D2B1F88', margin: '0 0 20px' }}>Enter your details to continue</p>

        {errorBox}

        <div style={fieldWrap}>
          <label style={label}>Email</label>
          <input type="email" placeholder="your@email.com" value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={inputStyle} />
        </div>

        <div style={fieldWrap}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <label style={{ ...label, marginBottom: 0 }}>Password</label>
            <button onClick={() => { setForgotEmail(email); setForgotSent(false); back('forgot') }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#AD8F2E', fontWeight: 600 }}>
              Forgot password?
            </button>
          </div>
          <div style={{ position: 'relative' }}>
            <input type={showPass ? 'text' : 'password'} placeholder="Your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{ ...inputStyle, paddingRight: 44 }} />
            <button onClick={() => setShowPass(!showPass)}
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#3D2B1F88' }}>
              {showPass ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <button style={{ ...btnPrimary, opacity: loading ? 0.7 : 1 }}
          onClick={handleLogin} disabled={loading}>
          {loading ? 'Signing in...' : 'Log In'}
        </button>

        {divider}
        <button style={btnOutline} onClick={handleGoogle}>
          <GoogleIcon /> Continue with Google
        </button>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#3D2B1F88', marginTop: 16 }}>
          No account?{' '}
          <button onClick={() => back('register')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#AD8F2E', fontWeight: 700, fontSize: 12 }}>
            Sign up
          </button>
        </p>
      </div>
    </div>
  )

  // ── REGISTER ─────────────────────────────────────────────────
  if (step === 'register') return (
    <div style={wrapper}>
      <div style={{ ...cardStyle, maxWidth: 440 }}>
        <Logo />
        <button onClick={() => back('landing')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#3D2B1F88', marginBottom: 16, padding: 0 }}>
          ← Back
        </button>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#3D2B1F', margin: '0 0 4px' }}>Create Account</h2>
        <p style={{ fontSize: 13, color: '#3D2B1F88', margin: '0 0 20px' }}>Fill in your details to get started</p>

        {errorBox}

        <div style={fieldWrap}>
          <label style={label}>Full Name *</label>
          <input type="text" placeholder="Your full name" value={name}
            onChange={e => setName(e.target.value)} style={inputStyle} />
        </div>
        <div style={fieldWrap}>
          <label style={label}>Email *</label>
          <input type="email" placeholder="your@email.com" value={regEmail}
            onChange={e => setRegEmail(e.target.value)} style={inputStyle} />
        </div>
        <div style={fieldWrap}>
          <label style={label}>Phone Number</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ ...inputStyle, width: 56, flexShrink: 0, background: '#faf5f0', color: '#3D2B1F99', fontSize: 13 }}>
              +91
            </div>
            <input type="tel" placeholder="10-digit number" maxLength={10}
              value={regPhone}
              onChange={e => setRegPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              style={{ ...inputStyle, flex: 1 }} />
          </div>
          {regPhone.length > 0 && regPhone.length < 10 && (
            <p style={{ fontSize: 11, color: '#f59e0b', marginTop: 4 }}>
              {10 - regPhone.length} more digits needed
            </p>
          )}
        </div>
        <div style={fieldWrap}>
          <label style={label}>Password *</label>
          <div style={{ position: 'relative' }}>
            <input type={showPass ? 'text' : 'password'} placeholder="Create a password"
              value={regPassword}
              onChange={e => setRegPassword(e.target.value)}
              style={{ ...inputStyle, paddingRight: 44 }} />
            <button onClick={() => setShowPass(!showPass)}
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>
              {showPass ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <button style={{ ...btnPrimary, opacity: loading ? 0.7 : 1 }}
          onClick={handleRegister} disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
        </button>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#3D2B1F88', marginTop: 16 }}>
          Already have an account?{' '}
          <button onClick={() => back('login')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#AD8F2E', fontWeight: 700, fontSize: 12 }}>
            Log in
          </button>
        </p>
      </div>
    </div>
  )

  // ── OTP ──────────────────────────────────────────────────────
  if (step === 'otp') return (
    <div style={wrapper}>
      <div style={cardStyle}>
        <Logo />
        <button onClick={() => back('landing')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#3D2B1F88', marginBottom: 16, padding: 0 }}>
          ← Back
        </button>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#3D2B1F', margin: '0 0 4px' }}>
          {otpSent ? 'Enter OTP' : 'Login with OTP'}
        </h2>

        {errorBox}

        {!otpSent ? (
          <>
            <p style={{ fontSize: 13, color: '#3D2B1F88', margin: '0 0 20px' }}>
              Enter your mobile number to receive a 6-digit OTP
            </p>
            <div style={fieldWrap}>
              <label style={label}>Phone Number</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ ...inputStyle, width: 56, flexShrink: 0, background: '#faf5f0', color: '#3D2B1F99', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  +91
                </div>
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  onKeyDown={e => e.key === 'Enter' && handleSendOtp()}
                  style={{ ...inputStyle, flex: 1 }}
                  autoFocus
                />
              </div>
              {phone.length > 0 && phone.length < 10 && (
                <p style={{ fontSize: 11, color: '#f59e0b', marginTop: 4 }}>
                  {10 - phone.length} more digits needed
                </p>
              )}
            </div>
            <button style={{ ...btnPrimary, opacity: otpSending ? 0.7 : 1 }}
              onClick={handleSendOtp} disabled={otpSending}>
              {otpSending ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </>
        ) : (
          <>
            <p style={{ fontSize: 13, color: '#3D2B1F88', margin: '0 0 20px' }}>
              OTP sent to <strong>+91 {phone}</strong>
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 20 }}>
              {otpValues.map((val, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={val}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(i, e)}
                  style={{
                    width: 44, height: 48,
                    textAlign: 'center',
                    fontSize: 20, fontWeight: 700,
                    border: '2px solid #e8c8be',
                    borderRadius: 10,
                    outline: 'none',
                    fontFamily: 'inherit',
                    color: '#3D2B1F',
                  }}
                />
              ))}
            </div>
            <button style={btnPrimary}>Verify OTP</button>
            <button
              onClick={() => { setOtpSent(false); setOtpValues(['','','','','','']) }}
              style={{ ...btnOutline, marginTop: 10 }}>
              🔄 Resend OTP
            </button>
          </>
        )}
      </div>
    </div>
  )

  // ── FORGOT PASSWORD ──────────────────────────────────────────
  if (step === 'forgot') return (
    <div style={wrapper}>
      <div style={cardStyle}>
        <Logo />
        <button onClick={() => back('login')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#3D2B1F88', marginBottom: 16, padding: 0 }}>
          ← Back to Login
        </button>

        {!forgotSent ? (
          <>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#3D2B1F', margin: '0 0 4px' }}>Forgot Password?</h2>
            <p style={{ fontSize: 13, color: '#3D2B1F88', margin: '0 0 20px' }}>
              Enter your email and we'll send a reset link.
            </p>
            {errorBox}
            <div style={fieldWrap}>
              <label style={label}>Email Address</label>
              <input type="email" placeholder="your@email.com"
                value={forgotEmail}
                onChange={e => setForgotEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleForgot()}
                style={inputStyle} autoFocus />
            </div>
            <button style={{ ...btnPrimary, opacity: loading ? 0.7 : 1 }}
              onClick={handleForgot} disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <div style={{
              width: 60, height: 60, borderRadius: '50%',
              background: '#dcfce7', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px', fontSize: 28,
            }}>✓</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#3D2B1F', margin: '0 0 8px' }}>Email Sent!</h3>
            <p style={{ fontSize: 13, color: '#3D2B1F88', margin: '0 0 24px', lineHeight: 1.6 }}>
              Check <strong>{forgotEmail}</strong> for the reset link. Also check your spam folder.
            </p>
            <button style={btnPrimary} onClick={() => back('login')}>Back to Login</button>
          </div>
        )}
      </div>
    </div>
  )

  return null
}