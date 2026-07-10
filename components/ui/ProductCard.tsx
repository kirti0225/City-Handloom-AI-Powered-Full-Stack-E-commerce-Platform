'use client'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import Link from 'next/link'
import { useCartStore } from '@/lib/store/cartStore'
import { useAuthStore } from '@/lib/store/authStore'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'

interface Props {
  product: {
    _id: string
    name: string
    slug: string
    shortDesc?: string
    price: number
    mrp: number
    discount: number
    rating: number
    images: string[]
  }
  wishlisted?: boolean
  onWishlistToggle?: (id: string) => void
  index?: number
}

export default function ProductCard({ product, wishlisted = false, onWishlistToggle, index = 0 }: Props) {
  const { addItem } = useCartStore()
  const { isLoggedIn } = useAuthStore()
  const router = useRouter()

console.log('CARD PRODUCT:', product)

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isLoggedIn) { router.push('/login'); return }
    if (onWishlistToggle) onWishlistToggle(product._id)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0],
      qty: 1,
      size: 'Standard',
      color: 'Default',
    })
  }
  

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 80, damping: 14, delay: (index % 5) * 0.07 }}
      className="cursor-pointer group relative bg-white"
    >
      <Link href={`/product/${product.slug}`}>
        {/* Image container */}
        <div className="relative aspect-square overflow-hidden bg-petal/20 mb-3">
          {/* Discount badge — gold/espresso color */}
          {product.discount > 0 && (
            <span className="absolute top-2 left-2 z-10 text-[10px] font-bold px-2 py-0.5 rounded-full font-body"
              style={{ backgroundColor: '#AD8F2E', color: '#fff' }}>
              -{product.discount}%
            </span>
          )}

          {/* Product image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url('${product.images?.[0] || ''}')` }}
          />

          {/* Wishlist button — top right */}
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleWishlist}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow-sm z-10"
          >
            <Heart size={13} className={wishlisted ? 'fill-red-500 text-red-500' : 'text-mocha/50'} />
          </motion.button>

          {/* Quick add button — slides up on hover */}
          <motion.button
            onClick={handleAddToCart}
            className="absolute bottom-0 left-0 right-0 py-3 text-white text-xs font-semibold font-body text-center translate-y-full group-hover:translate-y-0 transition-transform duration-300"
            style={{ backgroundColor: '#AD8F2E' }}
          >
            Quick add
          </motion.button>
        </div>

        {/* Product info — matches Figma */}
        <div className="px-1">
          <h3 className="text-sm font-semibold text-mocha font-body mb-0.5 line-clamp-1">
            {product.name}
          </h3>
          {product.shortDesc && (
            <p className="text-xs text-mocha/55 font-body mb-1.5 line-clamp-2 leading-snug">
              {product.shortDesc}
            </p>
          )}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-mocha font-body">
              ₹ {product.price?.toLocaleString()}
            </span>
            {product.mrp > product.price && (
              <span className="text-xs text-mocha/40 line-through font-body">
                ₹ {product.mrp?.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}