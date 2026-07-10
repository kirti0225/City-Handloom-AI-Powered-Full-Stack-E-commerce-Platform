'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cormorant_Garamond } from 'next/font/google'
import { ChevronDown, SlidersHorizontal, X, Sparkles, Heart } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/store/authStore'
import { useCartStore } from '@/lib/store/cartStore'
import { useRouter } from 'next/navigation'

const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['500', '600'] })
const SPRING = { type: 'spring' as const, stiffness: 80, damping: 14 }

interface CategoryConfig {
  title: string
  subtitle: string
  banner: string
  gradient: string
}

const categoryConfig: Record<string, CategoryConfig> = {
  bedsheets: {
    title: 'Bedsheets',
    subtitle: 'Pure cotton handloom bedsheets crafted with tradition and comfort',
    banner: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1400',
    gradient: 'linear-gradient(90deg, rgba(61,43,31,0.80) 0%, rgba(200,155,109,0.40) 100%)',
  },
  quilts: {
    title: 'Quilts & Blankets',
    subtitle: 'Soft, breathable quilts handcrafted by skilled artisans for every season',
    banner: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1400',
    gradient: 'linear-gradient(90deg, rgba(61,43,31,0.80) 0%, rgba(180,130,80,0.40) 100%)',
  },
  pillows: {
    title: 'Pillow Covers',
    subtitle: 'Premium pillow covers in silk, cotton and handloom fabrics',
    banner: 'https://images.unsplash.com/photo-1592789705501-f9ae4278a9c9?w=1400',
    gradient: 'linear-gradient(90deg, rgba(61,43,31,0.80) 0%, rgba(200,155,109,0.40) 100%)',
  },
  curtains: {
    title: 'Curtains',
    subtitle: 'Elegant handwoven curtains that bring warmth to every window',
    banner: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1400',
    gradient: 'linear-gradient(90deg, rgba(61,43,31,0.80) 0%, rgba(139,105,20,0.40) 100%)',
  },
  towels: {
    title: 'Towels',
    subtitle: 'Absorbent, soft and durable handloom towels for everyday luxury',
    banner: 'https://images.unsplash.com/photo-1607006483879-7bd8e4e5b5f4?w=1400',
    gradient: 'linear-gradient(90deg, rgba(61,43,31,0.85) 0%, rgba(200,155,109,0.40) 100%)',
  },
}

const sortOptions = [
  { key: 'latest',    label: 'Latest' },
  { key: 'priceAsc',  label: 'Price: Low to High' },
  { key: 'priceDesc', label: 'Price: High to Low' },
  { key: 'discount',  label: 'Discount' },
]

export default function CategoryPageClient({ category }: { category: string }) {
  const config = categoryConfig[category] || {
    title: category.charAt(0).toUpperCase() + category.slice(1),
    subtitle: 'Handloom products crafted with care',
    banner: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1400',
    gradient: 'linear-gradient(90deg, rgba(61,43,31,0.80) 0%, rgba(200,155,109,0.40) 100%)',
  }

  const [products, setProducts]                   = useState<any[]>([])
  const [isLoading, setIsLoading]                 = useState(true)
  const [wishlist, setWishlist]                   = useState<string[]>([])
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [priceRange, setPriceRange]               = useState(5000)
  const [sortBy, setSortBy]                       = useState('latest')
  const [sortOpen, setSortOpen]                   = useState(false)

  const { isLoggedIn } = useAuthStore()
  const { addItem }    = useCartStore()
  const router         = useRouter()

  // Fetch products from real API
  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      try {
        const params: Record<string, string> = {
          category,
          limit: '20',
          sortBy:    sortBy === 'priceAsc' || sortBy === 'priceDesc' ? 'price' : 'createdAt',
          sortOrder: sortBy === 'priceAsc' ? 'asc' : 'desc',
        }
        const data = await api.getProducts(params)
        setProducts(data.data.products || [])
      } catch (err) {
        console.error('Category fetch error:', err)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [category, sortBy])

  // Load wishlist
  useEffect(() => {
    if (!isLoggedIn) return
    api.getWishlist()
      .then(d => setWishlist(d.data.map((p: any) => p._id)))
      .catch(() => {})
  }, [isLoggedIn])

  const toggleWishlist = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isLoggedIn) { router.push('/login'); return }
    try {
      const data = await api.toggleWishlist(productId)
      setWishlist(data.data.wishlist || [])
    } catch (err) {
      console.error(err)
    }
  }

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      id:    product._id,
      name:  product.name,
      price: product.price,
      image: product.images?.[0],
      qty:   1,
      size:  'Standard',
      color: 'Default',
    })
  }

  // Client-side price filter
  const filteredProducts = products.filter(p => p.price <= priceRange)
  const otherCategories  = Object.entries(categoryConfig).filter(([key]) => key !== category)

  return (
    <main className="bg-white min-h-screen">
      <Navbar />

      {/* Banner */}
      <div className="relative h-[320px] md:h-[400px] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${config.banner}')` }}
        />
        <div className="absolute inset-0" style={{ background: config.gradient }} />
        <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-16 pb-10 pt-32">
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-xs text-white/70 font-body mb-2"
          >
            Home <span className="mx-1">/</span> Products <span className="mx-1">/</span>
            <span className="text-white font-semibold">{config.title}</span>
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 0.1 }}
            className={`${cormorant.className} text-3xl md:text-5xl font-semibold text-white mb-2`}
          >
            {config.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-white/80 font-body max-w-lg"
          >
            {config.subtitle}
          </motion.p>
        </div>
      </div>

      {/* Category pills */}
      <div className="px-4 md:px-8 lg:px-16 py-4 flex gap-2 overflow-x-auto scrollbar-hide border-b border-petal/60">
        {Object.entries(categoryConfig).map(([key, cat]) => (
          <Link key={key} href={`/products/${key}`}>
            <span className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold font-body border transition-all cursor-pointer ${
              key === category
                ? 'bg-mocha text-ivory border-mocha'
                : 'border-mocha/15 text-mocha/70 hover:border-mocha/40 hover:text-mocha'
            }`}>
              {cat.title}
            </span>
          </Link>
        ))}
      </div>

      <div className="px-4 md:px-8 lg:px-16 py-8">

        {/* Mobile filter button */}
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="md:hidden flex items-center gap-2 mb-4 px-4 py-2 border border-petal rounded-full text-sm text-mocha font-body"
        >
          <SlidersHorizontal size={15} /> Filters
        </button>

        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8">

          {/* Sidebar */}
          <aside className="hidden md:block h-fit sticky top-32">
            <div className="bg-white border border-petal/60 rounded-2xl p-5 shadow-sm space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-mocha font-body mb-3">Price Range</h4>
                <p className="text-xs text-mocha/60 font-body mb-2">Up to ₹{priceRange.toLocaleString()}</p>
                <input
                  type="range" min="200" max="5000" step="100"
                  value={priceRange}
                  onChange={e => setPriceRange(Number(e.target.value))}
                  className="w-full accent-gold-warm"
                />
                <div className="flex justify-between text-[11px] text-mocha/50 font-body mt-1">
                  <span>₹200</span><span>₹5,000</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-mocha font-body mb-3">Categories</h4>
                <div className="space-y-1.5">
                  {Object.entries(categoryConfig).map(([key, cat]) => (
                    <Link key={key} href={`/products/${key}`}>
                      <div className={`px-3 py-2 rounded-lg text-xs font-body cursor-pointer transition-colors ${
                        key === category
                          ? 'bg-mocha text-ivory font-semibold'
                          : 'text-mocha/70 hover:bg-petal/30'
                      }`}>
                        {cat.title}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setPriceRange(5000)}
                className="w-full py-2 text-xs font-semibold font-body text-red-400 border border-red-200 rounded-full hover:bg-red-50 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </aside>

          {/* Mobile filter drawer */}
          <AnimatePresence>
            {mobileFiltersOpen && (
              <div className="fixed inset-0 z-50 md:hidden">
                <div className="absolute inset-0 bg-espresso/40" onClick={() => setMobileFiltersOpen(false)} />
                <motion.div
                  initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                  transition={{ type: 'spring', damping: 30 }}
                  className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`${cormorant.className} text-lg font-semibold text-mocha`}>Filters</h3>
                    <button onClick={() => setMobileFiltersOpen(false)}><X size={20} /></button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-mocha font-body mb-2">
                        Price: Up to ₹{priceRange.toLocaleString()}
                      </h4>
                      <input
                        type="range" min="200" max="5000" step="100" value={priceRange}
                        onChange={e => setPriceRange(Number(e.target.value))}
                        className="w-full accent-gold-warm"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="w-full mt-4 py-3 bg-gold-warm text-espresso font-semibold text-sm font-body rounded-full"
                  >
                    Show Results
                  </button>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Product grid */}
          <div>
            {/* Sort + count */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm text-mocha/60 font-body">
                <span className="font-semibold text-mocha">{filteredProducts.length}</span> products
              </span>
              <div className="relative">
                <button
                  onClick={() => setSortOpen(!sortOpen)}
                  className="flex items-center gap-1.5 text-xs text-mocha font-body border border-petal rounded-full px-3 py-1.5"
                >
                  Sort: {sortOptions.find(s => s.key === sortBy)?.label}
                  <ChevronDown size={13} />
                </button>
                <AnimatePresence>
                  {sortOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                      className="absolute right-0 top-9 bg-white border border-petal/60 rounded-xl shadow-lg z-20 overflow-hidden min-w-[180px]"
                    >
                      {sortOptions.map(opt => (
                        <button key={opt.key}
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
                </AnimatePresence>
              </div>
            </div>

            {/* Loading skeleton */}
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
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className={`${cormorant.className} text-2xl text-mocha/30 mb-2`}>No products found</p>
                <p className="text-sm text-mocha/40 font-body">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {filteredProducts.map((product) => (
                  <div key={product._id} className="group relative">

                    {/* Image container */}
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-petal/20 mb-3">

                      {/* Image link — only the image navigates */}
                      <Link
                        href={`/product/${product.slug}`}
                        className="absolute inset-0 block z-0"
                      >
                        {product.discount > 0 && (
                          <span
                            className="absolute top-2 left-2 z-10 text-[10px] font-bold px-2 py-0.5 rounded-full font-body"
                            style={{ backgroundColor: '#AD8F2E', color: '#fff' }}
                          >
                            -{product.discount}%
                          </span>
                        )}
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                          style={{ backgroundImage: `url('${product.images?.[0] || ''}')` }}
                        />
                      </Link>

                      {/* Wishlist — z-index above Link */}
                      <button
                        onClick={(e) => toggleWishlist(e, product._id)}
                        className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow-sm"
                      >
                        <Heart
                          size={13}
                          className={wishlist.includes(product._id) ? 'fill-red-500 text-red-500' : 'text-mocha/50'}
                        />
                      </button>

                      {/* Quick Add — z-index above Link, does NOT navigate */}
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className="absolute bottom-0 left-0 right-0 z-10 py-2.5 text-white text-xs font-bold font-body text-center translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                        style={{ backgroundColor: '#AD8F2E' }}
                      >
                        Quick add
                      </button>
                    </div>

                    {/* Product info — separate Link */}
                    <Link href={`/product/${product.slug}`}>
                      <h3 className="text-sm font-semibold text-mocha font-body mb-0.5 line-clamp-1">
                        {product.name}
                      </h3>
                      {product.shortDesc && (
                        <p className="text-xs text-mocha/55 font-body mb-1.5 line-clamp-1">
                          {product.shortDesc}
                        </p>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-mocha font-body">
                          ₹{product.price?.toLocaleString()}
                        </span>
                        {product.mrp > product.price && (
                          <span className="text-xs text-mocha/35 line-through font-body">
                            ₹{product.mrp?.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </Link>

                  </div>
                ))}
              </div>
            )}

            {/* You May Also Like */}
            {!isLoading && filteredProducts.length > 0 && (
              <div className="mt-14 pt-10 border-t border-petal">
                <div className="flex items-center gap-1.5 mb-5">
                  <Sparkles size={16} className="text-gold-deep" />
                  <h2 className={`${cormorant.className} text-xl font-semibold text-mocha`}>
                    You May Also Like
                  </h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {otherCategories.slice(0, 4).map(([key, cat]) => (
                    <Link key={key} href={`/products/${key}`}>
                      <div className="cursor-pointer group">
                        <div
                          className="aspect-square rounded-xl bg-cover bg-center mb-2 overflow-hidden"
                          style={{ backgroundImage: `url('${cat.banner}')` }}
                        />
                        <p className="text-xs font-semibold text-mocha font-body group-hover:text-gold-deep transition-colors">
                          {cat.title}
                        </p>
                        <p className="text-[11px] text-mocha/50 font-body">
                          {cat.subtitle.slice(0, 35)}...
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}