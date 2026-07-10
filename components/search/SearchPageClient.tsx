'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Cormorant_Garamond } from 'next/font/google'
import {
  Sparkles, Search, Heart, ChevronDown,
  SlidersHorizontal, X, Star, TrendingUp,
  Clock, ArrowRight, Filter, Check
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/store/authStore'
import { useCartStore } from '@/lib/store/cartStore'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

const SPRING = { type: 'spring' as const, stiffness: 80, damping: 14, mass: 1.1 }

const trendingSearches = [
  'cotton bedsheet double',
  'blackout curtains',
  'silk pillow cover',
  'winter quilt king size',
  'bath towel set',
  'handloom curtains',
]

const recentSearches = [
  'soft cotton bedsheet under 2000',
  'curtains 7ft',
  'pillow cover set',
]

// ── Star rating ───────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={11}
          className={s <= Math.floor(rating || 0) ? 'fill-gold-warm text-gold-warm' : 'text-mocha/20'} />
      ))}
    </div>
  )
}

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { ...SPRING, delay: i * 0.07 },
  }),
}

// ── Inner component ───────────────────────────────────────────
function SearchPageInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQuery = searchParams.get('q') || ''

  const [query, setQuery] = useState(initialQuery)
  const [inputValue, setInputValue] = useState(initialQuery)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [aiChips, setAiChips] = useState<{ label: string; value: string }[]>([])
  const [wishlist, setWishlist] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])

  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState(5000)
  const [minRating, setMinRating] = useState(0)
  const [sortBy, setSortBy] = useState('Relevance')
  const [sortOpen, setSortOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const inputRef = useRef<HTMLInputElement>(null)
  const { isLoggedIn } = useAuthStore()
  const { addItem } = useCartStore()

  // ── Fetch search results from real API ────────────────────
  useEffect(() => {
    if (!query) {
      setSearchResults([])
      setAiChips([])
      return
    }
    const fetchResults = async () => {
      setIsLoading(true)
      try {
        // Build params
        const params: Record<string, string> = { limit: '20' }

        // Simple keyword matching for category
        const q = query.toLowerCase()
        if (q.includes('bedsheet') || q.includes('bed sheet')) params.category = 'bedsheets'
        else if (q.includes('curtain')) params.category = 'curtains'
        else if (q.includes('quilt') || q.includes('blanket')) params.category = 'quilts'
        else if (q.includes('pillow')) params.category = 'pillows'
        else if (q.includes('towel')) params.category = 'towels'

        // Build AI chips for display
        const chips: { label: string; value: string }[] = []
        if (params.category) chips.push({ label: 'Category', value: params.category.charAt(0).toUpperCase() + params.category.slice(1) })
        if (q.includes('cotton')) chips.push({ label: 'Material', value: 'Cotton' })
        if (q.includes('silk')) chips.push({ label: 'Material', value: 'Silk' })
        if (q.includes('king')) chips.push({ label: 'Size', value: 'King Size' })
        if (q.includes('double')) chips.push({ label: 'Size', value: 'Double' })
        const underMatch = q.match(/under\s*[₹]?\s*(\d+)/)
        if (underMatch) chips.push({ label: 'Price', value: `Under ₹${parseInt(underMatch[1]).toLocaleString()}` })
        setAiChips(chips)

        const data = await api.getProducts(params)
        let results = data.data.products || []

        // Client-side text filter
        if (results.length === 0 || !params.category) {
          const allData = await api.getProducts({ limit: '50' })
          results = (allData.data.products || []).filter((p: any) =>
            p.name.toLowerCase().includes(q) ||
            p.shortDesc?.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.material?.toLowerCase().includes(q)
          )
        }

        setSearchResults(results)

        // Load related products from other categories
        const relData = await api.getProducts({ limit: '8' })
        setRelatedProducts(
          (relData.data.products || []).filter((p: any) =>
            !results.find((r: any) => r._id === p._id)
          ).slice(0, 4)
        )
      } catch (err) {
        console.error('Search error:', err)
        setSearchResults([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchResults()
  }, [query])

  // ── Live suggestions as user types ───────────────────────
  useEffect(() => {
    if (!inputValue || inputValue.length < 2) {
      setSuggestions([])
      return
    }
    const timer = setTimeout(async () => {
      try {
        const data = await api.getProducts({ limit: '20' })
        const products = data.data.products || []
        const matches = products
          .filter((p: any) =>
            p.name.toLowerCase().includes(inputValue.toLowerCase()) ||
            p.category.toLowerCase().includes(inputValue.toLowerCase())
          )
          .map((p: any) => p.name)
          .slice(0, 5)

        // Also add category suggestions
        const catSuggestions = ['bedsheets', 'curtains', 'quilts', 'pillows', 'towels']
          .filter(c => c.includes(inputValue.toLowerCase()))
          .map(c => c.charAt(0).toUpperCase() + c.slice(1))

        setSuggestions([...new Set([...catSuggestions, ...matches])])
      } catch { }
    }, 300)
    return () => clearTimeout(timer)
  }, [inputValue])

  // ── Load wishlist ─────────────────────────────────────────
  useEffect(() => {
    if (!isLoggedIn) return
    api.getWishlist()
      .then(d => setWishlist(d.data.map((p: any) => p._id)))
      .catch(() => { })
  }, [isLoggedIn])

  const handleSearch = (q: string) => {
    setQuery(q)
    setInputValue(q)
    setShowSuggestions(false)
    setSuggestions([])
    router.push(`/search?q=${encodeURIComponent(q)}`)
  }

  const toggleWishlist = async (productId: string) => {
    if (!isLoggedIn) { router.push('/login'); return }
    try {
      const data = await api.toggleWishlist(productId)
      setWishlist(data.data.wishlist || [])
    } catch { }
  }

  const handleAddToCart = (product: any) => {
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0],
      qty: 1,
      size: product.sizes?.[0] || 'Standard',
      color: product.colors?.[0]?.name || 'Default',
    })
  }

  const toggleCategory = (cat: string) =>
    setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])

  const toggleMaterial = (mat: string) =>
    setSelectedMaterials(prev => prev.includes(mat) ? prev.filter(m => m !== mat) : [...prev, mat])

  // ── Client-side filtering on top of API results ───────────
  const filteredResults = searchResults
    .filter(p => selectedCategories.length === 0 || selectedCategories.includes(p.category))
    .filter(p => selectedMaterials.length === 0 || selectedMaterials.some(m => p.material?.toLowerCase().includes(m.toLowerCase())))
    .filter(p => p.price <= priceRange)
    .filter(p => (p.rating || 0) >= minRating)
    .sort((a, b) => {
      if (sortBy === 'Price: Low to High') return a.price - b.price
      if (sortBy === 'Price: High to Low') return b.price - a.price
      if (sortBy === 'Rating') return (b.rating || 0) - (a.rating || 0)
      if (sortBy === 'Discount') return (b.discount || 0) - (a.discount || 0)
      return 0
    })

  const categories = ['bedsheets', 'quilts', 'pillows', 'curtains', 'towels']
  const materials = ['Cotton', 'Silk', 'Linen', 'Polyester']
  const sortOptions = ['Relevance', 'Price: Low to High', 'Price: High to Low', 'Rating', 'Discount']

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-semibold text-mocha font-body mb-3">Category</h4>
        <div className="space-y-2">
          {categories.map(cat => (
            <label key={cat} className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-2.5">
                <input type="checkbox" checked={selectedCategories.includes(cat)}
                  onChange={() => toggleCategory(cat)} className="w-4 h-4 accent-gold-warm" />
                <span className="text-xs text-mocha/70 font-body group-hover:text-mocha transition-colors capitalize">{cat}</span>
              </div>
              <span className="text-[10px] text-mocha/40 font-body">
                {searchResults.filter(p => p.category === cat).length}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-mocha font-body mb-3">Material</h4>
        <div className="space-y-2">
          {materials.map(mat => (
            <label key={mat} className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={selectedMaterials.includes(mat)}
                onChange={() => toggleMaterial(mat)} className="w-4 h-4 accent-gold-warm" />
              <span className="text-xs text-mocha/70 font-body">{mat}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-mocha font-body mb-1">
          Price: Up to ₹{priceRange.toLocaleString()}
        </h4>
        <input type="range" min="200" max="5000" step="100"
          value={priceRange} onChange={e => setPriceRange(Number(e.target.value))}
          className="w-full accent-gold-warm" />
        <div className="flex justify-between text-[11px] text-mocha/50 font-body mt-1">
          <span>₹200</span><span>₹5,000</span>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-mocha font-body mb-3">Minimum Rating</h4>
        <div className="space-y-2">
          {[4, 3, 2, 0].map(r => (
            <label key={r} className="flex items-center gap-2.5 cursor-pointer">
              <input type="radio" name="rating" checked={minRating === r}
                onChange={() => setMinRating(r)} className="accent-gold-warm" />
              <div className="flex items-center gap-1">
                {r > 0 ? (
                  <><span className="text-xs text-mocha/70 font-body">{r}+</span><StarRating rating={r} /></>
                ) : (
                  <span className="text-xs text-mocha/70 font-body">All ratings</span>
                )}
              </div>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={() => { setSelectedCategories([]); setSelectedMaterials([]); setPriceRange(5000); setMinRating(0) }}
        className="w-full py-2 text-xs font-semibold font-body text-red-400 border border-red-200 rounded-full hover:bg-red-50 transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  )

  return (
    <main className="bg-white min-h-screen">
      <Navbar />

      <div className="pt-28 md:pt-32 px-4 md:px-8 lg:px-16">

        {/* ── Search bar ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto mb-8"
        >
          <div className="relative">
            <div className="flex items-center gap-3 bg-white border-2 border-gold-warm/30 rounded-2xl px-5 py-4 shadow-md focus-within:border-gold-warm transition-all">
              <Sparkles size={20} className="text-gold-deep flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={e => { setInputValue(e.target.value); setShowSuggestions(true) }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onKeyDown={e => e.key === 'Enter' && handleSearch(inputValue)}
                placeholder='Try: "soft cotton double bedsheet under ₹2000"'
                className="flex-1 bg-transparent outline-none text-sm text-mocha placeholder:text-mocha/35 font-body"
              />
              {inputValue && (
                <button onClick={() => { setInputValue(''); setSuggestions([]); inputRef.current?.focus() }}>
                  <X size={16} className="text-mocha/40 hover:text-mocha transition-colors" />
                </button>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSearch(inputValue)}
                className="bg-gold-warm text-espresso px-5 py-2 rounded-xl text-sm font-semibold font-body hover:bg-gold-deep transition-colors flex items-center gap-1.5"
              >
                <Search size={14} /> Search
              </motion.button>
            </div>

            {/* ── Suggestions dropdown ────────────────────────── */}
            <AnimatePresence>
              {showSuggestions && (inputValue.length >= 2 ? suggestions.length > 0 : true) && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-petal/60 rounded-2xl shadow-xl z-50 overflow-hidden"
                >
                  {/* Live product suggestions when typing */}
                  {inputValue.length >= 2 && suggestions.length > 0 && (
                    <div className="p-3 border-b border-petal/40">
                      <p className="text-[10px] font-semibold text-mocha/40 font-body uppercase tracking-wider mb-2 px-2">
                        Suggestions
                      </p>
                      {suggestions.map((s, i) => (
                        <button key={i} onClick={() => handleSearch(s)}
                          className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-petal/30 transition-colors text-left">
                          <Search size={13} className="text-mocha/30 flex-shrink-0" />
                          <span className="text-sm text-mocha/70 font-body">{s}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Recent searches */}
                  {inputValue.length < 2 && recentSearches.length > 0 && (
                    <div className="p-3 border-b border-petal/40">
                      <p className="text-[10px] font-semibold text-mocha/40 font-body uppercase tracking-wider mb-2 px-2">
                        Recent
                      </p>
                      {recentSearches.map((s, i) => (
                        <button key={i} onClick={() => handleSearch(s)}
                          className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-petal/30 transition-colors text-left">
                          <Clock size={13} className="text-mocha/30 flex-shrink-0" />
                          <span className="text-sm text-mocha/70 font-body">{s}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Trending */}
                  {inputValue.length < 2 && (
                    <div className="p-3">
                      <p className="text-[10px] font-semibold text-mocha/40 font-body uppercase tracking-wider mb-2 px-2">
                        Trending
                      </p>
                      {trendingSearches.map((s, i) => (
                        <button key={i} onClick={() => handleSearch(s)}
                          className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-petal/30 transition-colors text-left">
                          <TrendingUp size={13} className="text-gold-deep flex-shrink-0" />
                          <span className="text-sm text-mocha/70 font-body">{s}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* AI chips */}
          {query && aiChips.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 flex flex-wrap items-center gap-2"
            >
              <div className="flex items-center gap-1.5 mr-1">
                <Sparkles size={12} className="text-gold-deep" />
                <span className="text-[11px] font-semibold text-mocha/50 font-body">AI understood:</span>
              </div>
              {aiChips.map((chip, i) => (
                <motion.span key={i}
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-1 text-xs bg-petal text-mocha px-2.5 py-1 rounded-full font-body">
                  <span className="text-mocha/50">{chip.label}:</span>
                  <span className="font-semibold">{chip.value}</span>
                </motion.span>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* ── Empty state — no query ──────────────────────────── */}
        {!query && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto pb-20"
          >
            <div className="text-center mb-10">
              <div className="w-16 h-16 rounded-full bg-petal flex items-center justify-center mx-auto mb-4">
                <Sparkles size={24} className="text-gold-deep" />
              </div>
              <h2 className={`${cormorant.className} text-2xl font-semibold text-mocha mb-2`}>
                What are you looking for?
              </h2>
              <p className="text-sm text-mocha/55 font-body">
                Try natural language — our AI understands what you mean
              </p>
            </div>

            <div className="mb-8">
              <p className="text-xs font-semibold text-mocha/40 font-body uppercase tracking-wider mb-3">
                Try searching for
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  'soft cotton double bedsheet under ₹2000',
                  'blackout curtains 7ft',
                  'king size quilt',
                  'silk pillow covers',
                  'handloom curtains floral',
                  'bath towel set',
                ].map((s, i) => (
                  <motion.button key={i}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSearch(s)}
                    className="flex items-center gap-1.5 text-xs text-mocha font-body border border-petal px-4 py-2 rounded-full hover:border-gold-warm hover:bg-gold-warm/5 transition-colors">
                    <ArrowRight size={11} className="text-gold-deep" />
                    {s}
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-mocha/40 font-body uppercase tracking-wider mb-4">
                Browse by category
              </p>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {[
                  { label: 'Bedsheets', href: '/products/bedsheets', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=300' },
                  { label: 'Quilts',    href: '/products/quilts',    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300' },
                  { label: 'Pillows',   href: '/products/pillows',   image: 'https://images.unsplash.com/photo-1592789705501-f9ae4278a9c9?w=300' },
                  { label: 'Curtains',  href: '/products/curtains',  image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300' },
                  { label: 'Towels',    href: '/products/towels',    image: 'https://images.unsplash.com/photo-1607006483879-7bd8e4e5b5f4?w=300' },
                ].map((cat, i) => (
                  <Link key={cat.label} href={cat.href}>
                    <motion.div custom={i} whileHover={{ y: -4 }}
                      className="cursor-pointer text-center">
                      <div className="aspect-square rounded-xl bg-cover bg-center bg-petal/20 mb-2"
                        style={{ backgroundImage: `url('${cat.image}')` }} />
                      <p className="text-xs font-semibold text-mocha font-body">{cat.label}</p>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Search results ──────────────────────────────────── */}
        {query && (
          <div>
            {/* Results header */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap items-center justify-between gap-3 mb-6"
            >
              <div>
                <h1 className={`${cormorant.className} text-xl md:text-2xl font-semibold text-mocha`}>
                  Results for "{query}"
                </h1>
                <p className="text-xs text-mocha/50 font-body mt-0.5">
                  {isLoading ? 'Searching...' : `${filteredResults.length} products found`}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Grid/List toggle */}
                <div className="hidden md:flex items-center border border-petal rounded-lg overflow-hidden">
                  {(['grid', 'list'] as const).map(mode => (
                    <button key={mode} onClick={() => setViewMode(mode)}
                      className={`px-3 py-1.5 text-xs font-body transition-colors ${
                        viewMode === mode ? 'bg-mocha text-ivory' : 'text-mocha/60 hover:bg-petal/30'
                      }`}>
                      {mode === 'grid' ? '⊞ Grid' : '☰ List'}
                    </button>
                  ))}
                </div>

                {/* Sort */}
                <div className="relative">
                  <button onClick={() => setSortOpen(!sortOpen)}
                    className="flex items-center gap-1.5 text-xs text-mocha font-body border border-petal rounded-full px-3 py-1.5">
                    Sort: {sortBy}
                    <ChevronDown size={13} />
                  </button>
                  {sortOpen && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 top-8 bg-white border border-petal/60 rounded-xl shadow-lg z-20 overflow-hidden min-w-[200px]">
                      {sortOptions.map(opt => (
                        <button key={opt} onClick={() => { setSortBy(opt); setSortOpen(false) }}
                          className={`block w-full text-left px-4 py-2.5 text-xs font-body transition-colors ${
                            sortBy === opt ? 'bg-petal text-mocha font-semibold' : 'text-mocha/70 hover:bg-petal/30'
                          }`}>
                          {opt}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 pb-16">

              {/* Filter sidebar */}
              <motion.aside
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={SPRING}
                className="hidden md:block h-fit sticky top-32"
              >
                <div className="bg-white border border-petal/60 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`${cormorant.className} text-lg font-semibold text-mocha`}>Filters</h3>
                  </div>
                  <FilterSidebar />
                </div>
              </motion.aside>

              {/* Results */}
              <div>
                {isLoading ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="aspect-square bg-petal/30 rounded-lg mb-3" />
                        <div className="h-3 bg-petal/30 rounded w-3/4 mb-2" />
                        <div className="h-3 bg-petal/20 rounded w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : filteredResults.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-20"
                  >
                    <div className="w-16 h-16 rounded-full bg-petal/50 flex items-center justify-center mx-auto mb-4">
                      <Search size={24} className="text-mocha/30" />
                    </div>
                    <p className={`${cormorant.className} text-2xl text-mocha/40 mb-2`}>No results found</p>
                    <p className="text-sm text-mocha/40 font-body mb-6">
                      Try adjusting your filters or search with different keywords
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {trendingSearches.slice(0, 4).map((s, i) => (
                        <button key={i} onClick={() => handleSearch(s)}
                          className="text-xs text-mocha font-body border border-petal px-4 py-2 rounded-full hover:border-gold-warm transition-colors">
                          {s}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ) : viewMode === 'grid' ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                    {filteredResults.map((product, i) => (
                      <motion.div
                        key={product._id}
                        custom={i}
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-40px' }}
                        className="group relative"
                      >
                        {/* ── Full card is a Link ── */}
                        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-petal/20 mb-3">
  <Link href={`/product/${product.slug}`} className="absolute inset-0 z-0">
    <motion.div
      whileHover={{ scale: 1.07 }}
      transition={{ duration: 0.4 }}
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url('${product.images?.[0]}')` }}
    />
    {product.discount > 0 && (
      <span className="absolute top-2.5 left-2.5 text-[10px] font-bold font-body px-2 py-0.5 rounded-full"
        style={{ backgroundColor: '#AD8F2E', color: '#fff' }}>
        -{product.discount}%
      </span>
    )}
  </Link>

  {/* Quick Add — outside Link */}
  <button
    onClick={(e) => {
      e.preventDefault()
      e.stopPropagation()
      handleAddToCart(product)
    }}
    className="absolute bottom-0 left-0 right-0 py-2.5 text-white text-xs font-bold font-body text-center translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10"
    style={{ backgroundColor: '#AD8F2E' }}
  >
    Quick Add
  </button>
</div>

{/* Product info — separate Link */}
<Link href={`/product/${product.slug}`}>
  <h3 className="text-sm font-semibold text-mocha font-body mb-0.5 line-clamp-1">
    {product.name}
  </h3>
  ...
</Link>

                        {/* Wishlist — outside Link */}
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product._id) }}
                          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm z-10"
                        >
                          <Heart size={14}
                            className={wishlist.includes(product._id) ? 'fill-red-500 text-red-500' : 'text-mocha/50'} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  // List view
                  <div className="space-y-4">
                    {filteredResults.map((product, i) => (
                      <motion.div key={product._id}
                        custom={i} variants={cardVariants} initial="hidden"
                        whileInView="visible" viewport={{ once: true, margin: '-40px' }}>
                        <Link href={`/product/${product.slug}`}>
                          <div className="flex gap-4 bg-white border border-petal/60 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                            <div className="w-28 h-28 md:w-32 md:h-32 flex-shrink-0 rounded-xl bg-cover bg-center bg-petal/20"
                              style={{ backgroundImage: `url('${product.images?.[0]}')` }} />
                            <div className="flex-1 min-w-0">
                              <h3 className={`${cormorant.className} text-lg font-semibold text-mocha leading-snug`}>
                                {product.name}
                              </h3>
                              {product.shortDesc && (
                                <p className="text-xs text-mocha/55 font-body mt-1 mb-2 line-clamp-2">{product.shortDesc}</p>
                              )}
                              <div className="flex items-center gap-1.5 mb-2">
                                <StarRating rating={product.rating || 0} />
                                <span className="text-[11px] text-mocha/50 font-body">({product.reviewCount || 0})</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-base font-bold text-mocha font-body">
                                  ₹{product.price.toLocaleString()}
                                </span>
                                {product.mrp > product.price && (
                                  <span className="text-sm text-mocha/35 line-through font-body">
                                    ₹{product.mrp.toLocaleString()}
                                  </span>
                                )}
                                {product.discount > 0 && (
                                  <span className="text-xs font-semibold font-body"
                                    style={{ color: '#AD8F2E' }}>
                                    -{product.discount}%
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Related products */}
                {filteredResults.length > 0 && relatedProducts.length > 0 && (
                  <div className="mt-14 pt-10 border-t border-petal">
                    <div className="flex items-center gap-1.5 mb-5">
                      <Sparkles size={16} className="text-gold-deep" />
                      <h2 className={`${cormorant.className} text-xl font-semibold text-mocha`}>
                        You might also like
                      </h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                      {relatedProducts.map((product, i) => (
                        <Link key={product._id} href={`/product/${product.slug}`}>
                          <motion.div custom={i} variants={cardVariants}
                            initial="hidden" whileInView="visible" viewport={{ once: true }}
                            whileHover={{ y: -4 }} className="cursor-pointer group">
                            <div className="aspect-square rounded-xl bg-cover bg-center bg-petal/20 mb-2 overflow-hidden"
                              style={{ backgroundImage: `url('${product.images?.[0]}')` }} />
                            <p className="text-xs font-medium text-mocha font-body truncate">{product.name}</p>
                            <p className="text-xs font-bold font-body" style={{ color: '#AD8F2E' }}>
                              ₹{product.price.toLocaleString()}
                            </p>
                          </motion.div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}

// ── Export with Suspense ──────────────────────────────────────
export default function SearchPageClient() {
  return (
    <Suspense fallback={
      <main className="bg-white min-h-screen">
        <Navbar />
        <div className="pt-32 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gold-warm border-t-transparent rounded-full animate-spin" />
        </div>
      </main>
    }>
      <SearchPageInner />
    </Suspense>
  )
}