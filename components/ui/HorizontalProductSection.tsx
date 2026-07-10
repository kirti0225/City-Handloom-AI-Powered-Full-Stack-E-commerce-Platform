'use client'
import { useRef, useEffect, useState } from 'react'
import { Cormorant_Garamond } from 'next/font/google'
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react'
import Link from 'next/link'
import { useCartStore } from '@/lib/store/cartStore'
import { useAuthStore } from '@/lib/store/authStore'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'

const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['500', '600'] })

interface Product {
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

interface Props {
  title: string
  viewAllHref: string
  products: Product[]
  bg?: string
}

// ── Single product card ───────────────────────────────────────
function Card({ product }: { product: Product }) {
  const [hovered,   setHovered]   = useState(false)
  const [wishlisted, setWishlisted] = useState(false)
  const { addItem }    = useCartStore()
  const { isLoggedIn } = useAuthStore()
  const router = useRouter()

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isLoggedIn) { router.push('/login'); return }
    try {
      const data = await api.toggleWishlist(product._id)
      setWishlisted(data.data.wishlisted)
    } catch { }
  }

  const handleCart = (e: React.MouseEvent) => {
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

  return (
    <div
      style={{ width: 220, flexShrink: 0 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Image container ── */}
      <div style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '1/1',
        overflow: 'hidden',
        background: '#F5EDE8',
        marginBottom: 10,
      }}>

        {/* Product image — clicking navigates to product */}
        <Link
          href={`/product/${product.slug}`}
          style={{ position: 'absolute', inset: 0, display: 'block', zIndex: 1 }}
        >
          {/* Discount badge */}
          {product.discount > 0 && (
            <span style={{
              position: 'absolute', top: 8, left: 8, zIndex: 3,
              background: '#AD8F2E', color: '#fff',
              fontSize: 10, fontWeight: 700,
              padding: '2px 7px', borderRadius: 999,
            }}>
              -{product.discount}%
            </span>
          )}
          {/* Image */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url('${product.images?.[0] || ''}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.4s ease',
          }} />
        </Link>

        {/* Wishlist button — z-index above Link */}
        <button
          onClick={handleWishlist}
          style={{
            position: 'absolute', top: 8, right: 8, zIndex: 10,
            width: 28, height: 28, borderRadius: '50%',
            background: 'rgba(255,255,255,0.92)',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
          }}
        >
          <Heart
            size={13}
            style={{
              fill: wishlisted ? '#ef4444' : 'none',
              color: wishlisted ? '#ef4444' : '#3D2B1F88',
            }}
          />
        </button>

        {/* Quick Add — slides up on hover, z-index above Link */}
        <button
          onClick={handleCart}
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10,
            background: '#AD8F2E', color: '#fff',
            border: 'none', cursor: 'pointer',
            padding: '10px 0',
            fontSize: 12, fontWeight: 700,
            fontFamily: 'inherit', letterSpacing: '0.03em',
            transform: hovered ? 'translateY(0)' : 'translateY(100%)',
            transition: 'transform 0.3s ease',
          }}
        >
          Quick add
        </button>
      </div>

      {/* ── Product info — clicking navigates to product ── */}
      <Link href={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
        <p style={{
          fontSize: 13, fontWeight: 600, color: '#3D2B1F',
          margin: '0 0 3px',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {product.name}
        </p>
        {product.shortDesc && (
          <p style={{
            fontSize: 11, color: '#3D2B1F88', margin: '0 0 5px',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}>
            {product.shortDesc}
          </p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#3D2B1F' }}>
            ₹ {product.price?.toLocaleString()}
          </span>
          {product.mrp > product.price && (
            <span style={{ fontSize: 12, color: '#3D2B1F55', textDecoration: 'line-through' }}>
              ₹ {product.mrp?.toLocaleString()}
            </span>
          )}
        </div>
      </Link>
    </div>
  )
}

// ── Section wrapper ───────────────────────────────────────────
export default function HorizontalProductSection({
  title, viewAllHref, products, bg = '#fff',
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [canL, setCanL] = useState(false)
  const [canR, setCanR] = useState(true)

  const check = () => {
    const el = ref.current
    if (!el) return
    setCanL(el.scrollLeft > 4)
    setCanR(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }

  useEffect(() => { check() }, [products])

  const go = (dir: 'l' | 'r') => {
    ref.current?.scrollBy({ left: dir === 'r' ? 260 : -260, behavior: 'smooth' })
    setTimeout(check, 350)
  }

  return (
    <section style={{ padding: '48px 0', background: bg }}>

      {/* Header */}
      <div style={{
        padding: '0 64px',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 28,
      }}>
        <h2
          className={cormorant.className}
          style={{ fontSize: 34, fontWeight: 600, color: '#3D2B1F', margin: 0 }}
        >
          {title}
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link
            href={viewAllHref}
            style={{ fontSize: 12, fontWeight: 600, color: '#3D2B1F', textDecoration: 'none' }}
          >
            View All →
          </Link>
          <button
            onClick={() => go('l')}
            disabled={!canL}
            style={{
              width: 36, height: 36, borderRadius: '50%',
              border: '1px solid #3D2B1F33', background: '#fff',
              cursor: canL ? 'pointer' : 'not-allowed',
              opacity: canL ? 1 : 0.3,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <ChevronLeft size={18} color="#3D2B1F" />
          </button>
          <button
            onClick={() => go('r')}
            disabled={!canR}
            style={{
              width: 36, height: 36, borderRadius: '50%',
              border: '1px solid #3D2B1F33', background: '#fff',
              cursor: canR ? 'pointer' : 'not-allowed',
              opacity: canR ? 1 : 0.3,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <ChevronRight size={18} color="#3D2B1F" />
          </button>
        </div>
      </div>

      {/* Skeleton */}
      {products.length === 0 ? (
        <div style={{ display: 'flex', gap: 20, padding: '0 64px', overflow: 'hidden' }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ width: 220, flexShrink: 0 }}>
              <div style={{
                width: '100%', aspectRatio: '1/1',
                background: '#F5EDE8', borderRadius: 4,
                marginBottom: 10, opacity: 0.5,
              }} />
              <div style={{ height: 12, background: '#F5EDE8', borderRadius: 4, marginBottom: 6, width: '75%' }} />
              <div style={{ height: 10, background: '#F5EDE8', borderRadius: 4, width: '50%' }} />
            </div>
          ))}
        </div>
      ) : (
        /* Scrollable row — pure CSS overflow, no wheel hijack */
        <div
          ref={ref}
          onScroll={check}
          style={{
            display: 'flex',
            gap: 20,
            padding: '4px 64px 8px',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {products.map((p) => (
            <Card key={p._id} product={p} />
          ))}
        </div>
      )}
    </section>
  )
}