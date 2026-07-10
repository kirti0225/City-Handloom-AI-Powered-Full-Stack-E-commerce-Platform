'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cormorant_Garamond } from 'next/font/google'
import { X, Heart } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/store/authStore'
import { useCartStore } from '@/lib/store/cartStore'
import { useRouter } from 'next/navigation'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600'],
})

const SPRING = { type: 'spring' as const, stiffness: 80, damping: 14, mass: 1.1 }

interface WishlistProduct {
  _id: string
  name: string
  slug: string
  price: number
  mrp: number
  discount: number
  images: string[]
}

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { ...SPRING, delay: (i % 10) * 0.05 },
  }),
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.25 } },
}

export default function WishlistPageClient() {
  const { isLoggedIn } = useAuthStore()
  const { addItem } = useCartStore()
  const router = useRouter()

  const [items, setItems] = useState<WishlistProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [movedIds, setMovedIds] = useState<string[]>([])

  useEffect(() => {
    if (!isLoggedIn) {
      setIsLoading(false)
      return
    }
    const loadWishlist = async () => {
      try {
        const data = await api.getWishlist()
        setItems(data.data)
      } catch {
        // silent fail
      } finally {
        setIsLoading(false)
      }
    }
    loadWishlist()
  }, [isLoggedIn])

  const removeItem = async (productId: string) => {
    setItems(prev => prev.filter(item => item._id !== productId))
    try {
      await api.toggleWishlist(productId)
    } catch { }
  }

  const moveToBag = async (item: WishlistProduct) => {
    addItem({
      id: item._id,
      name: item.name,
      price: item.price,
      image: item.images[0],
      qty: 1,
      size: 'Standard',
      color: 'Default',
    })
    setMovedIds(prev => [...prev, item._id])
    setTimeout(() => {
      removeItem(item._id)
    }, 600)
  }

  if (!isLoggedIn) {
    return (
      <main className="bg-white min-h-screen">
        <Navbar />
        <div className="pt-32 flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-5">
            <Heart size={32} className="text-red-300" />
          </div>
          <h2 className={`${cormorant.className} text-2xl font-semibold text-mocha mb-2`}>
            Please login to view your wishlist
          </h2>
          <p className="text-sm text-mocha/55 font-body mb-6">
            Sign in to access items you've saved for later
          </p>
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/login')}
            className="bg-gold-warm text-espresso font-semibold text-sm font-body px-8 py-3 rounded-full hover:bg-gold-deep transition-colors"
          >
            Login
          </motion.button>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="bg-white min-h-screen">
      <Navbar />

      <div className="pt-28 md:pt-32 px-4 md:px-8 lg:px-16 pb-0">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className={`${cormorant.className} text-2xl md:text-3xl font-semibold text-mocha`}>
            My Wishlist {!isLoading && <span className="text-mocha/40 text-lg">{items.length} items</span>}
          </h1>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-5 pb-16">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-petal/30 rounded-lg mb-3" />
                <div className="h-3 bg-petal/30 rounded w-3/4 mb-2" />
                <div className="h-3 bg-petal/20 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
              <Heart size={32} className="text-red-300" />
            </div>
            <h2 className={`${cormorant.className} text-2xl font-semibold text-mocha mb-2`}>
              Your wishlist is empty
            </h2>
            <p className="text-sm text-mocha/55 font-body mb-6">
              Save items you love by clicking the heart icon on any product
            </p>
            <Link href="/products">
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="bg-gold-warm text-espresso font-semibold text-sm font-body px-8 py-3 rounded-full hover:bg-gold-deep transition-colors"
              >
                Explore Products
              </motion.button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5 pb-16">
            <AnimatePresence mode="popLayout">
              {items.map((item, i) => (
                <motion.div
                  key={item._id}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  className="border border-petal/60 rounded-lg overflow-hidden bg-white"
                >
                  {/* Image with remove X */}
                  <div className="relative">
                    <Link href={`/product/${item.slug}`}>
                      <div
                        className="aspect-[3/4] bg-cover bg-center bg-petal/20"
                        style={{ backgroundImage: `url('${item.images[0]}')` }}
                      />
                    </Link>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeItem(item._id)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center text-mocha/50 hover:text-red-500 transition-colors"
                    >
                      <X size={14} />
                    </motion.button>
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <Link href={`/product/${item.slug}`}>
                      <p className="text-xs text-mocha font-body font-medium line-clamp-1 mb-1.5 hover:text-gold-deep transition-colors">
                        {item.name}
                      </p>
                    </Link>
                    <div className="flex items-baseline gap-1.5 mb-3 flex-wrap">
                      <span className="text-sm font-bold text-mocha font-body">
                        ₹{item.price.toLocaleString()}
                      </span>
                      {item.mrp > item.price && (
                        <>
                          <span className="text-xs text-mocha/40 line-through font-body">
                            ₹{item.mrp.toLocaleString()}
                          </span>
                          <span className="text-xs text-green-600 font-body">
                            ({item.discount}% OFF)
                          </span>
                        </>
                      )}
                    </div>

                    {/* Move to bag */}
                    <div className="border-t border-petal/40 pt-2.5">
                      <motion.button
                        whileTap={{ scale: 0.96 }}
                        onClick={() => moveToBag(item)}
                        className="w-full text-xs font-bold font-body text-gold-deep tracking-wide hover:text-gold-warm transition-colors flex items-center justify-center gap-1"
                      >
                        {movedIds.includes(item._id) ? '✓ MOVED TO BAG' : 'MOVE TO BAG'}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}