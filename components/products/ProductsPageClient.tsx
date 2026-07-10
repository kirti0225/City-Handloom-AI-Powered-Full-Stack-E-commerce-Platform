'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Heart, ChevronDown, SlidersHorizontal, X } from 'lucide-react'
import { Cormorant_Garamond } from 'next/font/google'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/store/authStore'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600'],
})

interface Product {
  _id: string
  name: string
  slug: string
  shortDesc: string
  price: number
  mrp: number
  discount: number
  images: string[]
  category: string
  rating: number
  reviewCount: number
}

const brands = ['Jaipuriya', 'Handloom Co', 'Cotton House', 'Royal Weaves']
const categories = ['bedsheets', 'quilts', 'pillows', 'curtains', 'towels']

const bannerSlides = [
  {
    title: 'Wink',
    titleHighlight: 'Collection',
    sub: "Don't miss out to shopping collection from us, you'll not be let down",
    image: '/images/banner-1.jpg',
  },
  {
    title: 'New Season',
    titleHighlight: 'Arrivals',
    sub: 'Handwoven pieces crafted fresh for this season — limited stock',
    image: '/images/banner-2.jpg',
  },
]

export default function ProductsPageClient() {
  const [products, setProducts] = useState<Product[]>([])
  const [aiPicks, setAiPicks] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [wishlist, setWishlist] = useState<string[]>([])
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOpen, setSortOpen] = useState(false)

  const { isLoggedIn } = useAuthStore()

  // ── Fetch products from real API ──────────────────────────
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      setError('')
      try {
        const params: Record<string, string> = {
          sortBy: sortBy === 'priceAsc' || sortBy === 'priceDesc' ? 'price' : sortBy,
          sortOrder: sortBy === 'priceDesc' ? 'desc' : sortBy === 'priceAsc' ? 'asc' : 'desc',
        }
        if (selectedCategories.length > 0) {
          params.category = selectedCategories[0]
        }
        const data = await api.getProducts(params)
        setProducts(data.data.products)
      } catch (err: any) {
        setError(err.message || 'Failed to load products')
      } finally {
        setIsLoading(false)
      }
    }
    fetchProducts()
  }, [selectedCategories, sortBy])

  // ── Fetch AI picks (featured products) ────────────────────
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await api.getProducts({ featured: 'true', limit: '4' })
        setAiPicks(data.data.products)
      } catch (err) {
        // silent fail for recommendations
      }
    }
    fetchFeatured()
  }, [])

  // ── Load wishlist if logged in ────────────────────────────
  useEffect(() => {
    if (!isLoggedIn) return
    const loadWishlist = async () => {
      try {
        const data = await api.getWishlist()
        setWishlist(data.data.map((p: Product) => p._id))
      } catch { }
    }
    loadWishlist()
  }, [isLoggedIn])

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    )
  }

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  const toggleWishlist = async (productId: string) => {
    if (!isLoggedIn) {
      window.location.href = '/login'
      return
    }
    try {
      const data = await api.toggleWishlist(productId)
      setWishlist(data.data.wishlist)
    } catch { }
  }

  return (
    <main className="bg-white min-h-screen">
      <Navbar />

      <div className="-mt-0">

        {/* Full width promotional banner — edge to edge */}
        <div className="mb-10">
          <ProductsBanner />
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8">

          {/* Mobile filter toggle */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="md:hidden flex items-center gap-2 mb-4 px-4 py-2 border border-petal rounded-full text-sm text-mocha font-body"
          >
            <SlidersHorizontal size={15} />
            Filters
          </button>

          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 pb-16">

            {/* Sidebar filters — desktop */}
            <aside className="hidden md:block">
              <FilterContent
                selectedBrands={selectedBrands}
                toggleBrand={toggleBrand}
                selectedCategories={selectedCategories}
                toggleCategory={toggleCategory}
              />
            </aside>

            {/* Mobile filter drawer */}
            {mobileFiltersOpen && (
              <div className="fixed inset-0 z-50 md:hidden">
                <div
                  className="absolute inset-0 bg-espresso/40"
                  onClick={() => setMobileFiltersOpen(false)}
                />
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ type: 'spring', damping: 30 }}
                  className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`${cormorant.className} text-lg font-semibold text-mocha`}>
                      Filters
                    </h3>
                    <button onClick={() => setMobileFiltersOpen(false)}>
                      <X size={20} className="text-mocha" />
                    </button>
                  </div>
                  <FilterContent
                    selectedBrands={selectedBrands}
                    toggleBrand={toggleBrand}
                    selectedCategories={selectedCategories}
                    toggleCategory={toggleCategory}
                  />
                </motion.div>
              </div>
            )}

            {/* Product grid */}
            <div>
              {/* Sort row */}
              <div className="flex items-center justify-between mb-5">
                <span className="text-xs text-mocha/50 font-body">
                  {isLoading ? 'Loading...' : `${products.length} products`}
                </span>
                <div className="relative">
                  <button
                    onClick={() => setSortOpen(!sortOpen)}
                    className="flex items-center gap-1.5 text-xs text-mocha font-body border border-petal rounded-full px-3 py-1.5"
                  >
                    Sort: {sortBy === 'priceAsc' ? 'Price ↑' : sortBy === 'priceDesc' ? 'Price ↓' : 'Latest'}
                    <ChevronDown size={13} />
                  </button>
                  {sortOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 top-8 bg-white border border-petal/60 rounded-xl shadow-lg z-20 overflow-hidden min-w-[160px]"
                    >
                      {[
                        { key: 'createdAt', label: 'Latest' },
                        { key: 'priceAsc', label: 'Price: Low to High' },
                        { key: 'priceDesc', label: 'Price: High to Low' },
                      ].map(opt => (
                        <button
                          key={opt.key}
                          onClick={() => { setSortBy(opt.key); setSortOpen(false) }}
                          className={`block w-full text-left px-4 py-2.5 text-xs font-body transition-colors ${
                            sortBy === opt.key ? 'bg-petal text-mocha font-semibold' : 'text-mocha/70 hover:bg-petal/30'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Error state */}
              {error && (
                <div className="text-center py-10 bg-red-50 rounded-2xl mb-5">
                  <p className="text-sm text-red-500 font-body">{error}</p>
                </div>
              )}

              {/* Loading skeleton */}
              {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="aspect-[3/4] bg-petal/30 rounded-lg mb-3" />
                      <div className="h-4 bg-petal/30 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-petal/20 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-16">
                  <p className={`${cormorant.className} text-2xl text-mocha/30 mb-2`}>
                    No products found
                  </p>
                  <p className="text-sm text-mocha/40 font-body">Try adjusting your filters</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                  {products.map((product, i) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: (i % 6) * 0.08 }}
                      whileHover={{ y: -4 }}
                      className="cursor-pointer group"
                    >
                      <Link href={`/product/${product.slug}`}>
                        <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-petal/30 mb-3">
                          <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                            style={{ backgroundImage: `url('${product.images[0]}')` }}
                          />

                          {product.discount > 0 && (
                            <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold font-body px-2 py-0.5 rounded-full">
                              -{product.discount}%
                            </span>
                          )}

                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              toggleWishlist(product._id)
                            }}
                            className="absolute bottom-3 right-3 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center"
                          >
                            <Heart
                              size={14}
                              className={wishlist.includes(product._id) ? 'fill-red-500 text-red-500' : 'text-mocha/50'}
                            />
                          </button>
                        </div>

                        <h3 className="text-sm font-semibold text-mocha font-body mb-0.5">
                          {product.name}
                        </h3>
                        <p className="text-[11px] text-mocha/45 font-body mb-1.5 leading-snug line-clamp-1">
                          {product.shortDesc}
                        </p>
                        <p className="text-sm font-bold text-mocha font-body">
                          ₹ {product.price.toLocaleString()}
                          {product.mrp > product.price && (
                            <span className="text-xs text-mocha/35 line-through font-body ml-1.5">
                              ₹{product.mrp.toLocaleString()}
                            </span>
                          )}
                        </p>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* AI Picks for You */}
              {aiPicks.length > 0 && (
                <div className="mt-14 pt-10 border-t border-petal">
                  <div className="flex items-center gap-1.5 mb-5">
                    <Sparkles size={16} className="text-gold-deep" />
                    <h2 className={`${cormorant.className} text-xl font-semibold text-mocha`}>
                      AI Picks for You
                    </h2>
                  </div>
                  <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {aiPicks.map((product) => (
                      <Link key={product._id} href={`/product/${product.slug}`}>
                        <motion.div
                          whileHover={{ y: -4 }}
                          className="flex-shrink-0 w-44 cursor-pointer"
                        >
                          <div
                            className="h-44 rounded-lg bg-cover bg-center mb-2"
                            style={{ backgroundImage: `url('${product.images[0]}')` }}
                          />
                          <p className="text-xs font-medium text-mocha font-body truncate">
                            {product.name}
                          </p>
                          <p className="text-xs font-bold text-gold-deep font-body">
                            ₹ {product.price.toLocaleString()}
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
      </div>

      <Footer />
    </main>
  )
}

function ProductsBanner() {
  const [slide, setSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setSlide((prev) => (prev + 1) % bannerSlides.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative h-[380px] md:h-[460px] w-full overflow-hidden">
      {bannerSlides.map((b, i) => (
        <motion.div
          key={i}
          initial={false}
          animate={{ opacity: i === slide ? 1 : 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${b.image}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-espresso/75 via-espresso/25 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 max-w-2xl">
            <p className="text-[11px] text-white/60 font-body mb-2">
              Home <span className="mx-1">/</span> {b.title} {b.titleHighlight}
            </p>
            <p className="text-xs text-gold-warm font-body tracking-widest uppercase mb-2">
              Collections
            </p>
            <h1 className={`${cormorant.className} text-3xl md:text-5xl font-semibold text-white leading-tight mb-3`}>
              {b.title} <span className="italic text-gold-warm">{b.titleHighlight}</span>
            </h1>
            <p className="text-sm text-white/75 font-body leading-relaxed max-w-md">
              {b.sub}
            </p>
          </div>
        </motion.div>
      ))}

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {bannerSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setSlide(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === slide ? 'w-7 bg-gold-warm' : 'w-2 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

function FilterContent({
  selectedBrands,
  toggleBrand,
  selectedCategories,
  toggleCategory,
}: {
  selectedBrands: string[]
  toggleBrand: (b: string) => void
  selectedCategories: string[]
  toggleCategory: (c: string) => void
}) {
  return (
    <div className="space-y-7">
      <div>
        <h4 className="text-sm font-semibold text-mocha font-body mb-3">Brand</h4>
        <div className="space-y-2">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className="w-4 h-4 accent-gold-warm"
              />
              <span className="text-xs text-mocha/70 font-body">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-mocha font-body mb-3">Category</h4>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() => toggleCategory(cat)}
                className="w-4 h-4 accent-gold-warm"
              />
              <span className="text-xs text-mocha/70 font-body capitalize">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-mocha font-body mb-3">Price</h4>
        <input
          type="range"
          min="0"
          max="5000"
          className="w-full accent-gold-warm"
        />
        <div className="flex justify-between text-[11px] text-mocha/50 font-body mt-1">
          <span>₹0</span>
          <span>₹5,000</span>
        </div>
      </div>
    </div>
  )
}