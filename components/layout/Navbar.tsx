'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cormorant_Garamond } from 'next/font/google'
import {
  ShoppingBag, Heart, User, Sparkles,
  Menu, X, ChevronDown, ChevronRight,
  Search, TrendingUp, Clock
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import { useCartStore } from '@/lib/store/cartStore'
import { api } from '@/lib/api'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

const SPRING = { type: 'spring' as const, stiffness: 300, damping: 30 }

const megaMenus: Record<string, { label: string; href: string; desc?: string }[]> = {
  Bedding: [
    { label: 'Single Bed Sheet',       href: '/products/bedsheets?size=single',    desc: 'Perfect for single beds' },
    { label: 'Double Bed Sheet',       href: '/products/bedsheets?size=double',    desc: 'For double & queen beds' },
    { label: 'Pure Cotton Bed Sheet',  href: '/products/bedsheets?material=cotton',desc: '100% natural cotton' },
    { label: 'Mixed Fabric Bed Sheet', href: '/products/bedsheets?material=mixed', desc: 'Blended for durability' },
    { label: 'Dewan Size',             href: '/products/bedsheets?size=dewan',     desc: 'For dewan & sofa beds' },
  ],
  Curtains: [
    { label: 'Window Curtain',       href: '/products/curtains?type=window', desc: 'Light & sheer options' },
    { label: 'Door Curtain',         href: '/products/curtains?type=door',   desc: 'Full-length door panels' },
    { label: 'Curtain Fabric Rolls', href: '/products/curtains?type=fabric', desc: 'Sold by meter' },
  ],
  Blankets: [
    { label: 'Single Bed Blanket', href: '/products/quilts?size=single', desc: 'Cozy single blankets' },
    { label: 'Double Bed Blanket', href: '/products/quilts?size=double', desc: 'Warm double blankets' },
  ],
  'Pillow Covers': [
    { label: 'Standard Pillow Covers', href: '/products/pillows?type=standard', desc: 'Classic cotton covers' },
    { label: 'Silk Pillow Covers',     href: '/products/pillows?type=silk',     desc: 'Luxurious silk finish' },
    { label: 'Designer Covers',        href: '/products/pillows?type=designer', desc: 'Embroidered & printed' },
  ],
}

const navLinks = [
  { label: 'Bedding',       hasMenu: true,  href: '/products/bedsheets' },
  { label: 'Curtains',      hasMenu: true,  href: '/products/curtains' },
  { label: 'Blankets',      hasMenu: true,  href: '/products/quilts' },
  { label: 'Pillow Covers', hasMenu: true,  href: '/products/pillows' },
  { label: 'Shop All',      hasMenu: false, href: '/products' },
]

const sidebarLinks = [
  {
    group: 'Collections',
    items: [
      { label: 'New Arrivals',  href: '/products?sort=newest' },
      { label: 'Best Sellers',  href: '/products?sort=popular' },
      { label: 'Shop All',      href: '/products' },
    ],
  },
  {
    group: 'Bedding',
    items: [
      { label: 'Single Bed Sheet',       href: '/products/bedsheets?size=single' },
      { label: 'Double Bed Sheet',       href: '/products/bedsheets?size=double' },
      { label: 'Pure Cotton Bed Sheet',  href: '/products/bedsheets?material=cotton' },
      { label: 'Mixed Fabric Bed Sheet', href: '/products/bedsheets?material=mixed' },
      { label: 'Dewan Size',             href: '/products/bedsheets?size=dewan' },
    ],
  },
  {
    group: 'Curtains',
    items: [
      { label: 'Window Curtain',       href: '/products/curtains?type=window' },
      { label: 'Door Curtain',         href: '/products/curtains?type=door' },
      { label: 'Curtain Fabric Rolls', href: '/products/curtains?type=fabric' },
    ],
  },
  {
    group: 'Blankets',
    items: [
      { label: 'Single Bed Blanket', href: '/products/quilts?size=single' },
      { label: 'Double Bed Blanket', href: '/products/quilts?size=double' },
    ],
  },
  {
    group: 'More Categories',
    items: [
      { label: 'Pillow Covers',   href: '/products/pillows' },
      { label: 'Towels',          href: '/products/towels' },
      { label: 'Shawls',          href: '/products?category=shawls' },
      { label: 'Mats',            href: '/products?category=mats' },
      { label: 'Pillows',         href: '/products?category=pillows' },
      { label: 'Home-Made Items', href: '/products?category=handmade' },
      { label: 'Traditional',     href: '/products?category=traditional' },
      { label: 'Cottons',         href: '/products?category=cottons' },
    ],
  },
  {
    group: 'Account',
    items: [
      { label: 'My Account',  href: '/account' },
      { label: 'My Orders',   href: '/orders' },
      { label: 'Wishlist',    href: '/wishlist' },
      { label: 'Track Order', href: '/track' },
    ],
  },
]

const trendingSearches = [
  'cotton bedsheet double',
  'blackout curtains 7ft',
  'silk pillow cover',
  'winter quilt king size',
  'bath towel set',
]

export default function Navbar() {
  const [menuOpen,     setMenuOpen]     = useState(false)
  const [activeMenu,   setActiveMenu]   = useState<string | null>(null)
  const [searchQuery,  setSearchQuery]  = useState('')
  const [showSugg,     setShowSugg]     = useState(false)
  const [mobileSearch, setMobileSearch] = useState(false)
  const [suggestions,  setSuggestions]  = useState<any[]>([])
  const [mounted,      setMounted]      = useState(false)

  const router   = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const mobileInputRef = useRef<HTMLInputElement>(null)

  const { user, isLoggedIn, logout } = useAuthStore()
  const itemCount = useCartStore(state => state.itemCount())

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2) {
      setSuggestions([])
      return
    }
    const timer = setTimeout(async () => {
      try {
        const data = await api.getProducts({ limit: '30' })
        const products = data.data.products || []
        const matches = products
          .filter((p: any) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.material?.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .slice(0, 6)
        setSuggestions(matches)
        setShowSugg(true)
      } catch { }
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleSearch = (q: string) => {
    if (!q.trim()) return
    setShowSugg(false)
    setMobileSearch(false)
    setSearchQuery('')
    router.push(`/search?q=${encodeURIComponent(q.trim())}`)
  }

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  return (
    <>
      {/* ── Announcement Bar ─────────────────────── */}
      <div className="bg-espresso overflow-hidden py-2 relative z-50">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
          className="flex whitespace-nowrap w-max"
        >
          {[...Array(2)].map((_, r) => (
            <span key={r} className="flex">
              {[
                '🎉 Grand Launch Offer – Get 10% OFF on Your First Order!',
                '🚚 Free Shipping on Orders Above ₹999 Across India',
                '✨ New Arrivals Added Weekly – Shop the Latest Handloom Collection',
                "🎁 Limited-Time Launch Sale – Don't Miss Exclusive Deals on Handloom",
              ].map((msg, i) => (
                <span key={i} className="text-xs font-body text-ivory/90 font-medium mx-10">
                  {msg}
                  <span className="ml-10 text-gold-warm">✦</span>
                </span>
              ))}
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── Main Navbar ──────────────────────────── */}
      <nav
        className="relative z-40 bg-petal/95 border-0 sticky top-0"
        onMouseLeave={() => setActiveMenu(null)}
      >
        <div className="px-4 md:px-10 py-3">
          <div className="flex items-center justify-between relative">

            {/* Left — Mobile Hamburger & Desktop Links */}
            <div className="flex items-center gap-5">
              <button className="text-mocha" onClick={() => setMenuOpen(true)}>
                <Menu size={22} />
              </button>
              <div className="hidden md:flex items-center gap-5">
                {navLinks.map(link => (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => link.hasMenu ? setActiveMenu(link.label) : setActiveMenu(null)}
                  >
                    <Link
                      href={link.href}
                      className="flex items-center gap-1 text-[14px] text-mocha hover:text-gold-deep transition-colors font-body py-4"
                    >
                      {link.label}
                      {link.hasMenu && <ChevronDown size={13} />}
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Center — Logo (Responsive Layout Adjustments) */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
              <Link href="/">
                <div className="w-12 h-12 md:w-16 md:h-16 relative">
                  <Image
                  
                    src="/images/logo.png"
                    alt="City Handloom"
                    width={192}
                    height={192}
                    className="object-cover scale-150 w-full h-full"
                    style={{ backgroundColor: 'transparent', position: 'absolute',
  left: '50%',
  top: '0px',
  // Shifts the logo left by 50% of its width to perfectly center it horizontally,
  // and down by 40% of its height to let it overlap the navbar.
  transform: 'translate(-50%, 30%)', 
  zIndex: 50,}}
                    priority
          
                  />
                </div>
              </Link>
            </div>

            {/* Right — Search icon trigger + Action Icons */}
            <div className="flex items-center gap-3 md:gap-4 relative z-20">

              {/* Mobile View Search Icon Trigger */}
              <button 
                onClick={() => setMobileSearch(!mobileSearch)}
                className="block md:hidden text-mocha hover:text-gold-deep transition-colors"
              >
                <Search size={20} />
              </button>

              {/* Desktop Search Component */}
              <div className="hidden md:block relative">
                <div className="flex items-center bg-white/70 rounded-full px-4 py-2 w-96 focus-within:ring-2 focus-within:ring-gold-warm/30 transition-all">
                  <Sparkles size={14} className="text-gold-deep mr-2 flex-shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={e => { setSearchQuery(e.target.value); setShowSugg(true) }}
                    onFocus={() => setShowSugg(true)}
                    onBlur={() => setTimeout(() => setShowSugg(false), 200)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch(searchQuery)}
                    placeholder='Try: "cotton bedsheet under ₹2000"'
                    className="bg-transparent outline-none text-sm text-mocha placeholder:text-mocha/40 font-body w-full"
                  />
                  {searchQuery && (
                    <button onClick={() => { setSearchQuery(''); setSuggestions([]); setShowSugg(false) }}>
                      <X size={13} className="text-mocha/40 hover:text-mocha" />
                    </button>
                  )}
                </div>

                {/* Desktop Dropdown suggestions content */}
                <AnimatePresence>
                  {showSugg && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white border border-petal/60 rounded-2xl shadow-xl z-50 overflow-hidden"
                    >
                      {suggestions.length > 0 && (
                        <div className="py-2">
                          <p className="px-4 py-1 text-[10px] font-bold text-mocha/35 font-body uppercase tracking-widest">Products</p>
                          {suggestions.map((s: any) => (
                            <button
                              key={s._id}
                              onMouseDown={() => {
                                router.push(`/product/${s.slug}`)
                                setShowSugg(false)
                                setSearchQuery('')
                              }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-petal/30 transition-colors text-left"
                            >
                              <div
                                className="w-8 h-8 rounded-lg bg-cover bg-center flex-shrink-0 bg-petal/20"
                                style={{ backgroundImage: `url('${s.images?.[0]}')` }}
                              />
                              <div>
                                <p className="text-sm text-mocha font-body line-clamp-1">{s.name}</p>
                                <p className="text-[10px] text-mocha/45 font-body capitalize">
                                  {s.category} · ₹{s.price?.toLocaleString()}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                      {(searchQuery.length < 2 || suggestions.length === 0) && (
                        <div className="py-2">
                          <p className="px-4 py-1 text-[10px] font-bold text-mocha/35 font-body uppercase tracking-widest">
                            {searchQuery.length >= 2 ? 'No results — try' : 'Trending'}
                          </p>
                          {trendingSearches.map((s, i) => (
                            <button
                              key={i}
                              onMouseDown={() => handleSearch(s)}
                              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-petal/30 transition-colors text-left"
                            >
                              <TrendingUp size={13} className="text-gold-deep flex-shrink-0" />
                              <span className="text-sm text-mocha/70 font-body">{s}</span>
                            </button>
                          ))}
                        </div>
                      )}
                      {searchQuery.length >= 2 && (
                        <button
                          onMouseDown={() => handleSearch(searchQuery)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-petal/30 transition-colors border-t border-petal/40"
                        >
                          <Search size={13} className="text-gold-deep flex-shrink-0" />
                          <p className="text-sm text-gold-deep font-body font-semibold">
                            Search all results for "{searchQuery}"
                          </p>
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Wishlist */}
              <Link href="/wishlist">
                <button className="text-mocha hover:text-gold-deep transition-colors flex items-center">
                  <Heart size={20} />
                </button>
              </Link>

              {/* Desktop Profile Icon Only */}
              {isLoggedIn ? (
                <div className="hidden md:block relative group pb-2">
                  <button className="w-8 h-8 rounded-full bg-gold-warm flex items-center justify-center hover:bg-gold-deep transition-colors">
                    <span className="text-xs font-bold text-espresso font-body">
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </button>
                  <div className="absolute right-0 top-8 pt-3 w-44 hidden group-hover:block z-50">
                    <div className="bg-white border border-petal rounded-xl shadow-lg p-2">
                      <p className="px-3 py-2 text-xs font-semibold text-mocha font-body truncate border-b border-petal/60 mb-1">
                        {user?.name}
                      </p>
                      <Link href="/account" className="block px-3 py-2 text-xs text-mocha font-body hover:bg-petal/30 rounded-lg">My Account</Link>
                      <Link href="/orders" className="block px-3 py-2 text-xs text-mocha font-body hover:bg-petal/30 rounded-lg">My Orders</Link>
                      <Link href="/wishlist" className="block px-3 py-2 text-xs text-mocha font-body hover:bg-petal/30 rounded-lg">Wishlist</Link>
                      {user?.role === 'admin' && (
                        <Link href="/login_kit_city03" className="block px-3 py-2 text-xs text-gold-deep font-semibold font-body hover:bg-petal/30 rounded-lg">
                          ⚙ Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-3 py-2 text-xs text-red-400 font-body hover:bg-red-50 rounded-lg"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link href="/login" className="hidden md:block">
                  <button className="text-mocha hover:text-gold-deep transition-colors flex items-center">
                    <User size={20} />
                  </button>
                </Link>
              )}

              {/* Cart Button */}
              <Link href="/cart">
                <button className="text-mocha hover:text-gold-deep transition-colors relative flex items-center">
                  <ShoppingBag size={20} />
                  {mounted && itemCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gold-warm text-espresso text-[9px] font-bold rounded-full flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* ── Mobile AI Interactive Search Bar Dropdown Overlay ────────────────── */}
        <AnimatePresence>
          {mobileSearch && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="block md:hidden bg-white border-t border-petal/60 w-full absolute top-full left-0 shadow-lg z-50 overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-center bg-petal/30 rounded-full px-4 py-2">
                  <Sparkles size={14} className="text-gold-deep mr-2 flex-shrink-0" />
                  <input
                    ref={mobileInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch(searchQuery)}
                    placeholder='Try: "cotton bedsheet under ₹2000"'
                    className="bg-transparent outline-none text-sm text-mocha placeholder:text-mocha/40 font-body w-full"
                  />
                  {searchQuery && (
                    <button onClick={() => { setSearchQuery(''); setSuggestions([]) }}>
                      <X size={14} className="text-mocha/50" />
                    </button>
                  )}
                </div>

                {/* Mobile Search Live Suggestion Results */}
                {searchQuery.length >= 2 && (
                  <div className="mt-3 max-h-60 overflow-y-auto divide-y divide-petal/20">
                    {suggestions.map((s: any) => (
                      <div
                        key={s._id}
                        onClick={() => {
                          router.push(`/product/${s.slug}`)
                          setMobileSearch(false)
                          setSearchQuery('')
                        }}
                        className="flex items-center gap-3 py-2.5 active:bg-petal/20 text-left cursor-pointer"
                      >
                        <div
                          className="w-9 h-9 rounded-lg bg-cover bg-center flex-shrink-0 bg-petal/20"
                          style={{ backgroundImage: `url('${s.images?.[0]}')` }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-mocha font-body truncate">{s.name}</p>
                          <p className="text-[11px] text-mocha/45 font-body capitalize">
                            {s.category} · ₹{s.price?.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {suggestions.length === 0 && (
                      <div className="py-4 text-center text-sm text-mocha/50 font-body">
                        No immediate matches found
                      </div>
                    )}
                    <button
                      onClick={() => handleSearch(searchQuery)}
                      className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-gold-deep font-body mt-2 border-t border-petal/40"
                    >
                      <Search size={14} /> View All Results for "{searchQuery}"
                    </button>
                  </div>
                )}

                {/* Mobile Search Suggestions Landing Block */}
                {searchQuery.length < 2 && (
                  <div className="mt-4">
                    <p className="text-[10px] font-bold text-mocha/40 font-body uppercase tracking-widest mb-2">Trending Content AI Suggestions</p>
                    <div className="flex flex-wrap gap-2">
                      {trendingSearches.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => handleSearch(s)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-petal/20 hover:bg-petal/40 transition-colors rounded-full text-xs text-mocha/80 font-body"
                        >
                          <TrendingUp size={11} className="text-gold-deep" />
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Desktop Mega Menu Dropdown ──────────────────── */}
        <AnimatePresence>
          {activeMenu && megaMenus[activeMenu] && (
            <motion.div
              key={activeMenu}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="hidden md:block absolute left-0 right-0 top-full bg-white border-t border-petal/60 shadow-xl z-50"
              onMouseEnter={() => setActiveMenu(activeMenu)}
            >
              <div className="max-w-7xl mx-auto px-8 py-6 grid grid-cols-4 gap-6">
                <div className="col-span-3">
                  <p className="text-[10px] font-bold text-mocha/40 font-body uppercase tracking-widest mb-4">{activeMenu}</p>
                  <div className="grid grid-cols-3 gap-3">
                    {megaMenus[activeMenu].map(item => (
                      <Link key={item.label} href={item.href} onClick={() => setActiveMenu(null)}>
                        <motion.div whileHover={{ x: 4 }} className="flex items-center gap-2 py-2 group cursor-pointer">
                          <ChevronRight size={13} className="text-gold-warm flex-shrink-0" />
                          <div>
                            <p className="text-sm text-mocha font-body font-medium group-hover:text-gold-deep transition-colors">
                              {item.label}
                            </p>
                            {item.desc && <p className="text-xs text-mocha/45 font-body">{item.desc}</p>}
                          </div>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="h-full min-h-[140px] rounded-xl bg-espresso/80 relative overflow-hidden p-4">
                    <p className="text-[10px] text-gold-warm font-body tracking-widest uppercase mb-1">Special Offer</p>
                    <p className="text-sm font-semibold text-white font-body leading-snug mb-2">10% OFF on your first order</p>
                    <Link href="/products" onClick={() => setActiveMenu(null)}>
                      <span className="text-[11px] font-bold text-gold-warm font-body hover:underline">Shop Now →</span>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Sidebar Drawer Container ───────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-espresso/50 z-50 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={SPRING}
              className="fixed left-0 top-0 bottom-0 z-50 w-80 bg-white shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 py-4 bg-espresso">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gold-warm flex items-center justify-center">
                    <span className="text-xs font-bold text-espresso font-body">CH</span>
                  </div>
                  <p className="text-sm font-semibold text-ivory font-body">City Handloom</p>
                </div>
                <button onClick={() => setMenuOpen(false)} className="text-ivory/70 hover:text-ivory">
                  <X size={20} />
                </button>
              </div>

              {/* Mobile Sidebar Interactive Account Integration Profile Section */}
              {isLoggedIn && (
                <div className="md:hidden px-5 py-4 bg-petal/20 border-b border-petal/40 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold-warm flex items-center justify-center text-espresso font-bold font-body">
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-mocha font-body truncate">{user?.name}</p>
                    <p className="text-xs text-mocha/60 font-body truncate">{user?.email}</p>
                  </div>
                </div>
              )}

              {/* Sidebar Search */}
              <div className="px-4 py-3 border-b border-petal/60">
                <div className="flex items-center gap-2 bg-petal/30 rounded-full px-3 py-2">
                  <Search size={14} className="text-mocha/50 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="bg-transparent outline-none text-sm text-mocha font-body w-full placeholder:text-mocha/40"
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        const val = (e.target as HTMLInputElement).value
                        if (val.trim()) {
                          router.push(`/search?q=${encodeURIComponent(val.trim())}`)
                          setMenuOpen(false)
                        }
                      }
                    }}
                  />
                </div>
              </div>

              {/* Navigation Dynamic Groups Links */}
              <div className="flex-1 overflow-y-auto py-2">
                {sidebarLinks.map(group => (
                  <div key={group.group} className="mb-2">
                    <p className="px-5 py-2 text-[10px] font-bold text-mocha/40 font-body uppercase tracking-widest">
                      {group.group}
                    </p>
                    {group.items.map(item => (
                      <Link key={item.label} href={item.href}>
                        <motion.div
                          whileHover={{ x: 6, backgroundColor: '#FDF0EC' }}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center justify-between px-5 py-2.5 cursor-pointer transition-colors"
                        >
                          <span className="text-sm text-mocha font-body">{item.label}</span>
                          <ChevronRight size={13} className="text-mocha/30" />
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>

              {/* Footer Account Entry Controls */}
              <div className="px-5 py-4 border-t border-petal/60 bg-petal/20">
                {isLoggedIn ? (
                  <div className="flex items-center justify-between">
                    <div className="hidden md:flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gold-warm flex items-center justify-center">
                        <span className="text-xs font-bold text-espresso">{user?.name?.[0]?.toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-mocha font-body">{user?.name}</p>
                        <p className="text-[10px] text-mocha/50 font-body">{user?.email}</p>
                      </div>
                    </div>
                    <button onClick={handleLogout} className="text-xs text-red-400 font-body hover:text-red-600 w-full text-center md:w-auto py-2 bg-red-50 md:bg-transparent rounded-lg">
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Link href="/login" className="flex-1" onClick={() => setMenuOpen(false)}>
                      <button className="w-full py-2.5 bg-gold-warm text-espresso text-sm font-semibold font-body rounded-full hover:bg-gold-deep transition-colors">
                        Login
                      </button>
                    </Link>
                    <Link href="/login" className="flex-1" onClick={() => setMenuOpen(false)}>
                      <button className="w-full py-2.5 border border-mocha/20 text-mocha text-sm font-semibold font-body rounded-full hover:bg-petal/40 transition-colors">
                        Register
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}