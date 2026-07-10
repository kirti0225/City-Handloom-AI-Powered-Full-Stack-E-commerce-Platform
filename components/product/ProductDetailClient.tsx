'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cormorant_Garamond } from 'next/font/google'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import {
  Star, Heart, Share2, ShoppingCart, Zap,
  ChevronDown, ChevronLeft, ChevronRight,
  Truck, RotateCcw, Shield, CreditCard, Sparkles
} from 'lucide-react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/store/authStore'
import { useCartStore } from '@/lib/store/cartStore'
import { useRouter } from 'next/navigation'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

interface Product {
  _id: string
  name: string
  slug: string
  description: string
  shortDesc: string
  price: number
  mrp: number
  discount: number
  category: string
  brand: string
  images: string[]
  sizes: string[]
  colors: { name: string; hex: string }[]
  material: string
  threadCount?: number
  stock: number
  rating: number
  reviewCount: number
}

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={star <= Math.floor(rating) ? 'fill-gold-warm text-gold-warm' : 'text-mocha/20'}
        />
      ))}
    </div>
  )
}

function AccordionItem({ title, content }: { title: string; content: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-mocha/10 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3.5 bg-petal/20 hover:bg-petal/40 transition-colors"
      >
        <span className="text-sm font-semibold text-mocha font-body">{title}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={16} className="text-mocha/60" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="px-4 py-3 text-sm text-mocha/70 font-body leading-relaxed">
              {content}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function ProductDetailClient({ slug }: { slug: string }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState(0)
  const [selectedSize, setSelectedSize] = useState(0)
  const [wishlisted, setWishlisted] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [relatedScroll, setRelatedScroll] = useState(0)

  const { isLoggedIn } = useAuthStore()
  const { addItem } = useCartStore()
  const router = useRouter()

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true)
      try {
        const data = await api.getProduct(slug)
        setProduct(data.data.product)
        setReviews(data.data.reviews || [])
      } catch (err) {
        console.error('Failed to load product', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProduct()
  }, [slug])

  useEffect(() => {
    if (!product) return
    const fetchRelated = async () => {
      try {
        const data = await api.getProducts({
          category: product.category,
          limit: '6',
        })
        setRelatedProducts(
          data.data.products.filter((p: Product) => p._id !== product._id)
        )
      } catch { }
    }
    fetchRelated()
  }, [product])

  useEffect(() => {
    if (!isLoggedIn || !product) return
    const checkWishlist = async () => {
      try {
        const data = await api.getWishlist()
        setWishlisted(data.data.some((p: any) => p._id === product._id))
      } catch { }
    }
    checkWishlist()
  }, [isLoggedIn, product])

  const toggleWishlist = async () => {
    if (!isLoggedIn) { router.push('/login'); return }
    if (!product) return
    try {
      const data = await api.toggleWishlist(product._id)
      setWishlisted(data.data.wishlisted)
    } catch (err) {
      console.error('Wishlist error:', err)
    }
  }

  const handleAddToCart = () => {
    if (!product) return
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      qty: 1,
      size: product.sizes[selectedSize] || 'Standard',
      color: product.colors[selectedColor]?.name || 'Default',
    })
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const scrollRelated = (dir: 'left' | 'right') => {
    setRelatedScroll(prev => {
      const next = dir === 'right' ? prev + 1 : prev - 1
      return Math.max(0, Math.min(relatedProducts.length - 3, next))
    })
  }

  if (isLoading) {
    return (
      <main className="bg-white min-h-screen">
        <Navbar />
        <div className="pt-32 flex items-center justify-center min-h-[60vh]">
          <div className="w-10 h-10 border-2 border-gold-warm border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </main>
    )
  }

  if (!product) {
    return (
      <main className="bg-white min-h-screen">
        <Navbar />
        <div className="pt-32 flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className={`${cormorant.className} text-2xl font-semibold text-mocha mb-4`}>
            Product not found
          </h2>
          <button onClick={() => router.push('/products')} className="text-gold-deep font-body text-sm underline">
            Back to Products
          </button>
        </div>
        <Footer />
      </main>
    )
  }

  const accordionItems = [
    { title: 'Item details', content: product.description },
    { title: 'Materials & Care', content: `Material: ${product.material}. Machine washable. Do not bleach. Iron on medium heat.` },
    { title: 'Style', content: `Category: ${product.category}. Brand: ${product.brand}.` },
    ...(product.threadCount ? [{ title: 'Measurements', content: `Thread Count: ${product.threadCount} TC.` }] : []),
  ]

  return (
    <main className="bg-white min-h-screen">
      <Navbar />

      <div className="pt-28 md:pt-32 max-w-7xl mx-auto px-4 md:px-8 pb-16">

        {/* Breadcrumb */}
        <p className="text-xs text-mocha/50 font-body mb-6">
          Home <span className="mx-1">/</span>
          <span className="capitalize">{product.category}</span>
          <span className="mx-1">/</span>
          <span className="text-mocha line-clamp-1">{product.name}</span>
        </p>

        {/* Top — image gallery + product info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-14">

          {/* Left — image gallery */}
          <div>
            <div className="relative aspect-square rounded-xl overflow-hidden bg-petal/20 mb-3 group">
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url('${product.images[selectedImage]}')` }}
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleWishlist}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-sm"
              >
                <Heart size={16} className={wishlisted ? 'fill-red-500 text-red-500' : 'text-mocha/50'} />
              </motion.button>
              <button className="absolute top-3 left-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
                <Share2 size={16} className="text-mocha/50" />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    i === selectedImage ? 'border-gold-warm' : 'border-transparent'
                  }`}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${img}')` }}
                  />
                </button>
              ))}
            </div>

            {/* Feature badges */}
            <div className="flex gap-3 mt-4 flex-wrap">
              {['Premium Quality', 'Soft & Smooth', 'Breathable', 'Durable', 'Eco-Safe'].map(badge => (
                <div key={badge} className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-full bg-petal/40 border border-gold-warm/30 flex items-center justify-center">
                    <Star size={14} className="text-gold-deep" />
                  </div>
                  <span className="text-[10px] text-mocha/60 font-body text-center leading-tight max-w-[60px]">
                    {badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — product info */}
          <div>
            <p className="text-sm text-gold-deep font-body font-semibold mb-1">
              Visit the {product.brand} Store
            </p>

            <h1 className={`${cormorant.className} text-xl md:text-2xl font-semibold text-mocha mb-3 leading-snug`}>
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-mocha/10">
              <StarRating rating={product.rating} />
              <span className="text-sm text-gold-deep font-body font-semibold">{product.rating}</span>
              <span className="text-sm text-mocha/50 font-body">({product.reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="mb-4">
              {product.discount > 0 && (
                <span className="text-xs font-semibold px-2 py-0.5 bg-red-100 text-red-600 rounded font-body">
                  Limited time deal
                </span>
              )}
              <div className="flex items-baseline gap-2 mt-2">
                {product.discount > 0 && (
                  <span className="text-red-500 text-sm font-body font-semibold">-{product.discount}%</span>
                )}
                <span className={`${cormorant.className} text-3xl font-semibold text-mocha`}>
                  ₹{product.price.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-mocha/50 font-body mt-0.5">
                M.R.P.: <span className="line-through">₹{product.mrp.toLocaleString()}</span>
              </p>
              <p className="text-xs text-mocha/60 font-body mt-0.5">Inclusive of all taxes</p>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-4 gap-2 mb-4 text-center">
              {[
                { icon: <CreditCard size={18} />, label: 'Pay on Delivery' },
                { icon: <RotateCcw size={18} />, label: '10 days Returnable' },
                { icon: <Truck size={18} />, label: 'Free Delivery' },
                { icon: <Shield size={18} />, label: 'Secure transaction' },
              ].map(item => (
                <div key={item.label} className="flex flex-col items-center gap-1">
                  <div className="text-gold-deep">{item.icon}</div>
                  <span className="text-[10px] text-mocha/60 font-body leading-tight">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Color variants */}
            {product.colors?.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-semibold text-mocha font-body mb-2">
                  Colour: <span className="font-normal text-mocha/70">{product.colors[selectedColor]?.name}</span>
                </p>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map((color, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedColor(i)}
                      title={color.name}
                      className={`w-9 h-9 rounded-full border-2 transition-all ${
                        i === selectedColor ? 'border-gold-warm scale-110' : 'border-mocha/15'
                      }`}
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size selector */}
            {product.sizes?.length > 0 && (
              <div className="mb-5">
                <p className="text-sm font-semibold text-mocha font-body mb-2">
                  Size: <span className="font-normal text-mocha/70">{product.sizes[selectedSize]}</span>
                </p>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((size, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedSize(i)}
                      className={`px-3 py-1.5 text-xs font-body border rounded-lg transition-all ${
                        i === selectedSize
                          ? 'border-gold-warm bg-gold-warm/10 text-mocha font-semibold'
                          : 'border-mocha/20 text-mocha/70 hover:border-mocha/40'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock */}
            <p className={`text-xs font-body mb-4 ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
              {product.stock > 0 ? `✓ In Stock (${product.stock} available)` : '✗ Out of Stock'}
            </p>

            {/* CTA buttons */}
            <div className="flex gap-3 mb-5">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 flex items-center justify-center gap-2 font-semibold text-sm font-body py-3 rounded-full transition-colors ${
                  addedToCart
                    ? 'bg-green-500 text-white'
                    : product.stock === 0
                    ? 'bg-mocha/10 text-mocha/40 cursor-not-allowed'
                    : 'bg-gold-warm text-espresso hover:bg-gold-deep'
                }`}
              >
                <ShoppingCart size={16} />
                {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { handleAddToCart(); router.push('/checkout') }}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 bg-espresso text-ivory font-semibold text-sm font-body py-3 rounded-full hover:bg-mocha transition-colors disabled:opacity-50"
              >
                <Zap size={16} />
                Buy Now
              </motion.button>
            </div>

            {/* AI Review Summary */}
            <div className="bg-petal/30 rounded-xl p-3 mb-5 border border-gold-warm/20">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Sparkles size={13} className="text-gold-deep" />
                <span className="text-xs font-semibold text-mocha/70 font-body">AI Review Summary</span>
              </div>
              <p className="text-xs text-mocha/70 font-body leading-relaxed">
                Customers say:{' '}
                <span className="font-semibold text-mocha">soft fabric</span>,{' '}
                <span className="font-semibold text-mocha">true to size</span>,{' '}
                <span className="font-semibold text-mocha">fast delivery</span>,{' '}
                <span className="font-semibold text-mocha">good value for money</span>.
                Most reviewers appreciate the {product.material.toLowerCase()} quality.
              </p>
            </div>

            {/* Specs table */}
            <div className="mb-4">
              <table className="w-full text-sm font-body">
                <tbody>
                  {[
                    { label: 'Material', value: product.material },
                    { label: 'Brand', value: product.brand },
                    { label: 'Category', value: product.category },
                    ...(product.threadCount ? [{ label: 'Thread Count', value: `${product.threadCount} TC` }] : []),
                  ].map((spec, i) => (
                    <tr key={spec.label} className={i % 2 === 0 ? 'bg-petal/20' : 'bg-white'}>
                      <td className="py-1.5 px-3 font-semibold text-mocha w-1/3 capitalize">{spec.label}</td>
                      <td className="py-1.5 px-3 text-mocha/70 capitalize">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* About this item */}
            <div>
              <h3 className={`${cormorant.className} text-lg font-semibold text-mocha mb-3`}>
                About this item
              </h3>
              <p className="text-xs text-mocha/70 font-body leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>
        </div>

        {/* Product information accordions */}
        <div className="mb-14 border-t border-mocha/10 pt-10">
          <h2 className={`${cormorant.className} text-2xl font-semibold text-mocha mb-6`}>
            Product information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {accordionItems.map(item => (
              <AccordionItem key={item.title} title={item.title} content={item.content} />
            ))}
          </div>
        </div>

        {/* Explore more / related products */}
        {relatedProducts.length > 0 && (
          <div className="mb-14 border-t border-mocha/10 pt-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className={`${cormorant.className} text-2xl font-semibold text-mocha`}>
                Explore more from across the store
              </h2>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => scrollRelated('left')}
                  className="w-9 h-9 rounded-full bg-petal/40 flex items-center justify-center text-mocha hover:bg-gold-warm hover:text-white transition-colors"
                >
                  <ChevronLeft size={18} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => scrollRelated('right')}
                  className="w-9 h-9 rounded-full bg-petal/40 flex items-center justify-center text-mocha hover:bg-gold-warm hover:text-white transition-colors"
                >
                  <ChevronRight size={18} />
                </motion.button>
              </div>
            </div>
            <div className="overflow-hidden">
              <motion.div
                animate={{ x: `-${relatedScroll * (220 + 16)}px` }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="flex gap-4"
              >
                {relatedProducts.map(p => (
                  <motion.div
                    key={p._id}
                    whileHover={{ y: -4 }}
                    onClick={() => router.push(`/product/${p.slug}`)}
                    className="flex-shrink-0 w-52 cursor-pointer"
                  >
                    <div
                      className="w-full h-52 bg-cover bg-center rounded-xl mb-2 bg-petal/20"
                      style={{ backgroundImage: `url('${p.images[0]}')` }}
                    />
                    <p className="text-xs text-mocha font-body leading-snug mb-1 line-clamp-2">{p.name}</p>
                    <StarRating rating={p.rating} size={12} />
                    <p className="text-xs text-mocha/50 font-body mb-1">({p.reviewCount})</p>
                    <div className="flex items-center gap-1.5">
                      {p.discount > 0 && (
                        <span className="text-xs text-red-500 font-body font-semibold">-{p.discount}%</span>
                      )}
                      <span className="text-sm font-bold text-mocha font-body">₹{p.price.toLocaleString()}</span>
                      <span className="text-xs text-mocha/40 line-through font-body">₹{p.mrp.toLocaleString()}</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        )}

        {/* Customer reviews */}
        <div className="border-t border-mocha/10 pt-10">
          <h2 className={`${cormorant.className} text-2xl font-semibold text-mocha mb-6`}>
            Customer reviews
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-10">

            {/* Rating breakdown */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <StarRating rating={product.rating} size={20} />
                <span className={`${cormorant.className} text-3xl font-semibold text-mocha`}>
                  {product.rating}
                </span>
              </div>
              <p className="text-sm text-mocha/60 font-body mb-4">
                {product.reviewCount} global ratings
              </p>
              {[
                { stars: 5, pct: 76 },
                { stars: 4, pct: 18 },
                { stars: 3, pct: 6 },
                { stars: 2, pct: 0 },
                { stars: 1, pct: 0 },
              ].map(row => (
                <div key={row.stars} className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs text-gold-deep font-body w-10 text-right flex-shrink-0">
                    {row.stars} star
                  </span>
                  <div className="flex-1 h-2.5 bg-mocha/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${row.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8 }}
                      className="h-full bg-gold-warm rounded-full"
                    />
                  </div>
                  <span className="text-xs text-mocha/60 font-body w-8 flex-shrink-0">
                    {row.pct}%
                  </span>
                </div>
              ))}

              <div className="mt-6 pt-4 border-t border-mocha/10">
                <p className={`${cormorant.className} text-base font-semibold text-mocha mb-1`}>
                  Review this product
                </p>
                <p className="text-xs text-mocha/60 font-body mb-3">
                  Share your thoughts with other customers
                </p>
                <button className="w-full py-2.5 border border-mocha/20 rounded-full text-sm text-mocha font-body hover:bg-petal/30 transition-colors">
                  Write a product review
                </button>
              </div>
            </div>

            {/* Review cards */}
            <div>
              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review: any) => (
                    <div key={review._id} className="border-b border-mocha/8 pb-6 last:border-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-petal flex items-center justify-center">
                          <span className="text-xs font-semibold text-mocha font-body">
                            {review.user?.name?.[0] || 'U'}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-mocha font-body">
                          {review.user?.name || 'Customer'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <StarRating rating={review.rating} size={13} />
                        <span className="text-sm font-semibold text-mocha font-body">{review.title}</span>
                      </div>
                      {review.isVerified && (
                        <p className="text-xs text-gold-deep font-body mb-1">Verified Purchase</p>
                      )}
                      <p className="text-sm text-mocha/80 font-body mt-2">{review.body}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center">
                  <p className={`${cormorant.className} text-xl text-mocha/40 mb-2`}>
                    No reviews yet
                  </p>
                  <p className="text-sm text-mocha/40 font-body">
                    Be the first to review this product
                  </p>
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