'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cormorant_Garamond } from 'next/font/google'
import { Eye, EyeOff, Phone, Mail, Check, RefreshCw, X } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import { api } from '@/lib/api'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

const SPRING = { type: 'spring' as const, stiffness: 80, damping: 14 }
type Step = 'landing' | 'login' | 'register' | 'otp' | 'forgot'

export default function LoginPageClient() {
  const [step,             setStep]             = useState<Step>('landing')
  const [showPass,         setShowPass]         = useState(false)
  const [showConfirmPass,  setShowConfirmPass]  = useState(false)
  const [agreed,           setAgreed]           = useState(false)
  const [otpValues,        setOtpValues]        = useState(['', '', '', '', '', ''])
  const [otpPhone,         setOtpPhone]         = useState('')
  const [otpSent,          setOtpSent]          = useState(false)
  const [otpSending,       setOtpSending]       = useState(false)
  const [errors,           setErrors]           = useState<Record<string, string>>({})
  const [isLoading,        setIsLoading]        = useState(false)
  const [forgotEmail,      setForgotEmail]      = useState('')
  const [forgotSent,       setForgotSent]       = useState(false)

  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({
    firstName: '', lastName: '', email: '',
    phone: '', password: '', confirmPassword: '',
  })

  const router = useRouter()
  const { login } = useAuthStore()

  const pageVariants = {
    hidden:  { opacity: 0, y: 40, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1, transition: SPRING },
    exit:    { opacity: 0, y: -30, scale: 0.97, transition: { duration: 0.2 } },
  }

  const inp = (err?: string) =>
    `w-full border rounded-xl px-4 py-3 text-sm font-body outline-none transition-colors ${
      err ? 'border-red-400 bg-red-50' : 'border-mocha/15 focus:border-gold-warm bg-white'
    }`

  // ── OTP ──────────────────────────────────────────────────
  const handleOtpChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return
    const next = [...otpValues]
    next[i] = val
    setOtpValues(next)
    if (val && i < 5) document.getElementById(`otp-${i + 1}`)?.focus()
  }

  const handleOtpKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpValues[i] && i > 0) {
      document.getElementById(`otp-${i - 1}`)?.focus()
    }
  }

  const handleSendOtp = async () => {
    if (!otpPhone || otpPhone.length < 10) {
      setErrors({ otpPhone: 'Enter a valid 10-digit phone number' })
      return
    }
    setOtpSending(true)
    setErrors({})
    await new Promise(r => setTimeout(r, 1000))
    setOtpSent(true)
    setOtpSending(false)
  }

  // ── Login ─────────────────────────────────────────────────
  const handleLogin = async () => {
    const errs: Record<string, string> = {}
    if (!loginForm.email.trim())    errs.email    = 'Email is required'
    if (!loginForm.password.trim()) errs.password = 'Password is required'
    if (Object.keys(errs).length) { setErrors(errs); return }

    setIsLoading(true)
    setErrors({})
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email:    loginForm.email.trim().toLowerCase(),
          password: loginForm.password,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setErrors({ general: data.message || 'Invalid email or password' }); return }

      login(data.data.user)

      if (data.data.user.role === 'admin') {
        router.push('/login_kit_city03')
      } else {
        router.push('/account')
      }
    } catch {
      setErrors({ general: 'Network error. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  // ── Register ──────────────────────────────────────────────
  const handleRegister = async () => {
    const errs: Record<string, string> = {}
    if (!registerForm.firstName)  errs.firstName    = 'First name is required'
    if (!registerForm.lastName)   errs.lastName     = 'Last name is required'
    if (!registerForm.email)      errs.email        = 'Email is required'
    if (!registerForm.phone)      errs.phone        = 'Phone is required'
    if (!registerForm.password)   errs.password     = 'Password is required'
    if (registerForm.password !== registerForm.confirmPassword)
      errs.confirmPassword = 'Passwords do not match'
    if (!agreed) errs.agreed = 'Please accept terms & privacy policy'
    if (Object.keys(errs).length) { setErrors(errs); return }

    setIsLoading(true)
    setErrors({})
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:     `${registerForm.firstName} ${registerForm.lastName}`,
          email:    registerForm.email.trim().toLowerCase(),
          phone:    registerForm.phone,
          password: registerForm.password,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setErrors({ general: data.message || 'Registration failed' }); return }

      login(data.data.user)
      router.push('/account')
    } catch {
      setErrors({ general: 'Network error. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  // ── Forgot password ───────────────────────────────────────
  const handleForgotPassword = async () => {
    if (!forgotEmail.trim()) { setErrors({ forgotEmail: 'Email is required' }); return }
    setIsLoading(true)
    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail.trim().toLowerCase() }),
      })
      setForgotSent(true)
    } catch {
      setErrors({ forgotEmail: 'Something went wrong. Try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )

  return (
    <main className="min-h-screen bg-ivory">
      <Navbar />
      <div className="pt-28 md:pt-32 min-h-screen flex items-center justify-center px-4 pb-16">
        <AnimatePresence mode="wait">

          {/* ── Landing ────────────────────────────────── */}
          {step === 'landing' && (
            <motion.div key="landing" variants={pageVariants} initial="hidden" animate="visible" exit="exit"
              className="w-full max-w-md">
              <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-petal flex items-center justify-center mx-auto mb-5">
                  <img src="/images/logo.png" alt="CH" className="w-12 h-12 object-contain" />
                </div>
                <h1 className={`${cormorant.className} text-3xl font-semibold text-mocha mb-2`}>Welcome</h1>
                <p className="text-sm text-mocha/55 font-body mb-8">
                  Sign in or create an account to continue shopping
                </p>
                <div className="space-y-3 mb-6">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setStep('login')}
                    className="w-full py-3.5 bg-gold-warm text-espresso font-semibold text-sm font-body rounded-full hover:bg-gold-deep transition-colors">
                    Log In
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setStep('register')}
                    className="w-full py-3.5 border-2 border-gold-warm text-mocha font-semibold text-sm font-body rounded-full hover:bg-gold-warm/10 transition-colors">
                    Create Account
                  </motion.button>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px bg-mocha/10" />
                  <span className="text-xs text-mocha/40 font-body">OR</span>
                  <div className="flex-1 h-px bg-mocha/10" />
                </div>
                <div className="space-y-3">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={() => alert('Google Sign-In requires GOOGLE_CLIENT_ID setup in .env.local')}
                    className="w-full py-3 border border-mocha/15 rounded-full flex items-center justify-center gap-2 text-sm text-mocha font-body hover:bg-petal/30 transition-colors">
                    <GoogleIcon /> Continue with Google
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={() => { setOtpSent(false); setOtpValues(['','','','','','']); setStep('otp') }}
                    className="w-full py-3 border border-mocha/15 rounded-full flex items-center justify-center gap-2 text-sm text-mocha font-body hover:bg-petal/30 transition-colors">
                    <Phone size={16} className="text-mocha/60" /> Continue with OTP
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Login ──────────────────────────────────── */}
          {step === 'login' && (
            <motion.div key="login" variants={pageVariants} initial="hidden" animate="visible" exit="exit"
              className="w-full max-w-md">
              <div className="bg-white rounded-3xl shadow-lg p-8">
                <button onClick={() => { setStep('landing'); setErrors({}) }}
                  className="text-xs text-mocha/50 font-body mb-5 hover:text-mocha transition-colors">
                  ← Back
                </button>
                <div className="w-14 h-14 rounded-full bg-petal flex items-center justify-center mb-4">
                  <img src="/images/logo.png" alt="CH" className="w-10 h-10 object-contain" />
                </div>
                <h2 className={`${cormorant.className} text-2xl font-semibold text-mocha mb-1`}>Login</h2>
                <p className="text-sm text-mocha/55 font-body mb-6">Enter your details to continue.</p>

                {errors.general && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
                    <X size={14} className="text-red-500 flex-shrink-0" />
                    <p className="text-xs text-red-600 font-body">{errors.general}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-mocha font-body block mb-1.5">Email</label>
                    <input type="email" placeholder="Enter your email"
                      value={loginForm.email}
                      onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                      onKeyDown={e => e.key === 'Enter' && handleLogin()}
                      className={inp(errors.email)} />
                    {errors.email && <p className="text-xs text-red-500 font-body mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <label className="text-xs font-semibold text-mocha font-body">Password</label>
                      <button type="button"
                        onClick={() => { setForgotEmail(loginForm.email); setForgotSent(false); setErrors({}); setStep('forgot') }}
                        className="text-xs text-gold-deep font-body hover:underline">
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <input type={showPass ? 'text' : 'password'} placeholder="Enter your password"
                        value={loginForm.password}
                        onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                        onKeyDown={e => e.key === 'Enter' && handleLogin()}
                        className={`${inp(errors.password)} pr-10`} />
                      <button type="button" onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-mocha/40">
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors.password && <p className="text-xs text-red-500 font-body mt-1">{errors.password}</p>}
                  </div>
                </div>

                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={handleLogin} disabled={isLoading}
                  className="w-full mt-5 py-3.5 bg-espresso text-ivory font-semibold text-sm font-body rounded-full hover:bg-mocha transition-colors disabled:opacity-60">
                  {isLoading ? 'Logging in...' : 'Log In'}
                </motion.button>

                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-mocha/10" />
                  <span className="text-xs text-mocha/40 font-body">OR</span>
                  <div className="flex-1 h-px bg-mocha/10" />
                </div>

                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={() => alert('Google Sign-In requires GOOGLE_CLIENT_ID in .env.local')}
                  className="w-full py-3 border border-mocha/15 rounded-full flex items-center justify-center gap-2 text-sm text-mocha font-body hover:bg-petal/30 transition-colors">
                  <GoogleIcon /> Continue with Google
                </motion.button>

                <p className="text-center text-xs text-mocha/50 font-body mt-5">
                  Don't have an account?{' '}
                  <button onClick={() => { setStep('register'); setErrors({}) }}
                    className="text-mocha font-semibold underline">Sign up</button>
                </p>
              </div>
            </motion.div>
          )}

          {/* ── Register ───────────────────────────────── */}
          {step === 'register' && (
            <motion.div key="register" variants={pageVariants} initial="hidden" animate="visible" exit="exit"
              className="w-full max-w-md">
              <div className="bg-white rounded-3xl shadow-lg p-8">
                <button onClick={() => { setStep('landing'); setErrors({}) }}
                  className="text-xs text-mocha/50 font-body mb-5 hover:text-mocha transition-colors">
                  ← Back
                </button>
                <div className="w-14 h-14 rounded-full bg-petal flex items-center justify-center mb-4">
                  <img src="/images/logo.png" alt="CH" className="w-10 h-10 object-contain" />
                </div>
                <h2 className={`${cormorant.className} text-2xl font-semibold text-mocha mb-1`}>Create Account</h2>
                <p className="text-sm text-mocha/55 font-body mb-6">Fill in your details to get started.</p>

                {errors.general && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
                    <X size={14} className="text-red-500 flex-shrink-0" />
                    <p className="text-xs text-red-600 font-body">{errors.general}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-mocha font-body block mb-1.5">First Name</label>
                      <input type="text" placeholder="First name"
                        value={registerForm.firstName}
                        onChange={e => setRegisterForm({ ...registerForm, firstName: e.target.value })}
                        className={inp(errors.firstName)} />
                      {errors.firstName && <p className="text-[11px] text-red-500 font-body mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-mocha font-body block mb-1.5">Last Name</label>
                      <input type="text" placeholder="Last name"
                        value={registerForm.lastName}
                        onChange={e => setRegisterForm({ ...registerForm, lastName: e.target.value })}
                        className={inp(errors.lastName)} />
                      {errors.lastName && <p className="text-[11px] text-red-500 font-body mt-1">{errors.lastName}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-mocha font-body block mb-1.5">Email</label>
                    <input type="email" placeholder="Enter your email"
                      value={registerForm.email}
                      onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })}
                      className={inp(errors.email)} />
                    {errors.email && <p className="text-xs text-red-500 font-body mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-mocha font-body block mb-1.5">Phone Number</label>
                    <div className="flex gap-2">
                      <div className="border border-mocha/15 rounded-xl px-3 py-3 text-sm text-mocha font-body flex-shrink-0 bg-petal/20">+91</div>
                      <input type="tel" placeholder="10-digit number"
                        value={registerForm.phone}
                        onChange={e => setRegisterForm({ ...registerForm, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                        className={inp(errors.phone)} />
                    </div>
                    {errors.phone && <p className="text-xs text-red-500 font-body mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-mocha font-body block mb-1.5">Password</label>
                    <div className="relative">
                      <input type={showPass ? 'text' : 'password'} placeholder="Create a password"
                        value={registerForm.password}
                        onChange={e => setRegisterForm({ ...registerForm, password: e.target.value })}
                        className={`${inp(errors.password)} pr-10`} />
                      <button type="button" onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-mocha/40">
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors.password && <p className="text-xs text-red-500 font-body mt-1">{errors.password}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-mocha font-body block mb-1.5">Confirm Password</label>
                    <div className="relative">
                      <input type={showConfirmPass ? 'text' : 'password'} placeholder="Confirm password"
                        value={registerForm.confirmPassword}
                        onChange={e => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                        className={`${inp(errors.confirmPassword)} pr-10`} />
                      <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-mocha/40">
                        {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-xs text-red-500 font-body mt-1">{errors.confirmPassword}</p>}
                  </div>
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <div onClick={() => setAgreed(!agreed)}
                      className={`w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center mt-0.5 cursor-pointer transition-colors ${
                        agreed ? 'bg-gold-warm border-gold-warm' : 'border-mocha/20'
                      }`}>
                      {agreed && <Check size={12} className="text-white" />}
                    </div>
                    <span className="text-xs text-mocha/60 font-body leading-relaxed">
                      I agree to the{' '}
                      <Link href="/terms" className="text-gold-deep underline">Terms</Link>
                      {' '}and{' '}
                      <Link href="/privacy-policy" className="text-gold-deep underline">Privacy Policy</Link>
                    </span>
                  </label>
                  {errors.agreed && <p className="text-xs text-red-500 font-body">{errors.agreed}</p>}
                </div>

                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={handleRegister} disabled={isLoading}
                  className="w-full mt-5 py-3.5 bg-espresso text-ivory font-semibold text-sm font-body rounded-full hover:bg-mocha transition-colors disabled:opacity-60">
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </motion.button>

                <p className="text-center text-xs text-mocha/50 font-body mt-5">
                  Already have an account?{' '}
                  <button onClick={() => { setStep('login'); setErrors({}) }}
                    className="text-mocha font-semibold underline">Log in</button>
                </p>
              </div>
            </motion.div>
          )}

          {/* ── OTP ────────────────────────────────────── */}
          {step === 'otp' && (
            <motion.div key="otp" variants={pageVariants} initial="hidden" animate="visible" exit="exit"
              className="w-full max-w-md">
              <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-petal flex items-center justify-center mx-auto mb-5">
                  <Phone size={24} className="text-gold-deep" />
                </div>
                <h2 className={`${cormorant.className} text-2xl font-semibold text-mocha mb-2`}>
                  {otpSent ? 'Enter OTP' : 'Continue with OTP'}
                </h2>

                {!otpSent ? (
                  <div className="text-left">
                    <p className="text-sm text-mocha/55 font-body mb-5 text-center">
                      Enter your mobile number to receive a 6-digit OTP
                    </p>
                    <label className="text-xs font-semibold text-mocha font-body block mb-1.5">Phone Number</label>
                    <div className="flex gap-2 mb-3">
                      <div className="border border-mocha/15 rounded-xl px-3 py-3 text-sm text-mocha font-body flex-shrink-0 bg-petal/20">+91</div>
                      <input type="tel" placeholder="10-digit mobile number"
                        value={otpPhone}
                        onChange={e => setOtpPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        className={inp(errors.otpPhone)}
                        autoFocus />
                    </div>
                    {errors.otpPhone && <p className="text-xs text-red-500 font-body mb-3">{errors.otpPhone}</p>}
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      onClick={handleSendOtp} disabled={otpSending}
                      className="w-full py-3.5 bg-gold-warm text-espresso font-semibold text-sm font-body rounded-full hover:bg-gold-deep transition-colors disabled:opacity-60">
                      {otpSending ? 'Sending OTP...' : 'Send OTP'}
                    </motion.button>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-mocha/55 font-body mb-6">
                      OTP sent to <span className="font-semibold text-mocha">+91 {otpPhone}</span>
                    </p>
                    <div className="flex gap-2 justify-center mb-6">
                      {otpValues.map((val, i) => (
                        <input key={i} id={`otp-${i}`}
                          type="text" inputMode="numeric" maxLength={1} value={val}
                          onChange={e => handleOtpChange(i, e.target.value)}
                          onKeyDown={e => handleOtpKeyDown(i, e)}
                          className="w-11 h-12 text-center text-lg font-semibold font-body border-2 border-mocha/15 rounded-xl outline-none focus:border-gold-warm transition-colors" />
                      ))}
                    </div>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      className="w-full py-3.5 bg-espresso text-ivory font-semibold text-sm font-body rounded-full hover:bg-mocha transition-colors mb-4">
                      Verify OTP
                    </motion.button>
                    <button onClick={() => { setOtpSent(false); setOtpValues(['','','','','','']) }}
                      className="flex items-center gap-1.5 text-xs text-mocha/50 font-body mx-auto hover:text-mocha">
                      <RefreshCw size={12} /> Resend OTP
                    </button>
                  </div>
                )}

                <button onClick={() => { setStep('landing'); setErrors({}); setOtpSent(false) }}
                  className="block text-xs text-mocha/40 font-body mt-4 mx-auto hover:text-mocha">
                  ← Back
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Forgot Password ─────────────────────────── */}
          {step === 'forgot' && (
            <motion.div key="forgot" variants={pageVariants} initial="hidden" animate="visible" exit="exit"
              className="w-full max-w-md">
              <div className="bg-white rounded-3xl shadow-lg p-8">
                <button onClick={() => { setStep('login'); setErrors({}); setForgotSent(false) }}
                  className="text-xs text-mocha/50 font-body mb-5 hover:text-mocha transition-colors">
                  ← Back to Login
                </button>
                <div className="w-14 h-14 rounded-full bg-petal flex items-center justify-center mb-4">
                  <Mail size={22} className="text-gold-deep" />
                </div>
                <h2 className={`${cormorant.className} text-2xl font-semibold text-mocha mb-1`}>Forgot Password?</h2>

                {!forgotSent ? (
                  <>
                    <p className="text-sm text-mocha/55 font-body mb-6">
                      Enter your email and we'll send a reset link.
                    </p>
                    <div className="mb-4">
                      <label className="text-xs font-semibold text-mocha font-body block mb-1.5">Email Address</label>
                      <input type="email" placeholder="Enter your email"
                        value={forgotEmail}
                        onChange={e => setForgotEmail(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleForgotPassword()}
                        className={inp(errors.forgotEmail)}
                        autoFocus />
                      {errors.forgotEmail && <p className="text-xs text-red-500 font-body mt-1">{errors.forgotEmail}</p>}
                    </div>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      onClick={handleForgotPassword} disabled={isLoading}
                      className="w-full py-3.5 bg-gold-warm text-espresso font-semibold text-sm font-body rounded-full hover:bg-gold-deep transition-colors disabled:opacity-60">
                      {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </motion.button>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                      <Check size={28} className="text-green-600" />
                    </div>
                    <h3 className={`${cormorant.className} text-xl font-semibold text-mocha mb-2`}>Email Sent!</h3>
                    <p className="text-sm text-mocha/60 font-body mb-6">
                      Check your inbox for the reset link. Also check spam folder.
                    </p>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      onClick={() => { setStep('login'); setForgotSent(false) }}
                      className="w-full py-3 bg-espresso text-ivory font-semibold text-sm font-body rounded-full hover:bg-mocha transition-colors">
                      Back to Login
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </main>
  )
}