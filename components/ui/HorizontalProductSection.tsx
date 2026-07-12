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
  _id?: string
  id?: string
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

function Card({ product }: { product: Product }) {
  const [hovered,   setHovered]   = useState(false)
  const [wishlisted, setWishlisted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { addItem }    = useCartStore()
  const { isLoggedIn } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  const productId = product._id || product.id || ''

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isLoggedIn) { router.push('/login'); return }
    if (!productId) return
    try {
      const data = await api.toggleWishlist(productId)
      setWishlisted(data.data.wishlisted)
    } catch { }
  }

  const handleCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!productId) return
    addItem({
      id:    productId,
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
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ flexShrink: 0, width: '100%' }}
    >
      <div style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '1/1',
        overflow: 'hidden',
        background: '#F5EDE8',
        marginBottom: 8,
        borderRadius: '12px',
      }}>
        <Link
          href={`/product/${product.slug}`}
          style={{ position: 'absolute', inset: 0, display: 'block', zIndex: 1 }}
        >
          {product.discount > 0 && (
            <span style={{
              position: 'absolute', top: 6, left: 6, zIndex: 3,
              background: '#AD8F2E', color: '#fff',
              fontSize: 9, fontWeight: 700,
              padding: '2px 6px', borderRadius: 999,
            }}>
              -{product.discount}%
            </span>
          )}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url('${product.images?.[0] || ''}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.4s ease',
          }} />
        </Link>

        <button
          onClick={handleWishlist}
          style={{
            position: 'absolute', top: 6, right: 6, zIndex: 10,
            width: 26, height: 26, borderRadius: '50%',
            background: 'rgba(255,255,255,0.92)',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
          }}
        >
          <Heart size={12} style={{
            fill: wishlisted ? '#ef4444' : 'none',
            color: wishlisted ? '#ef4444' : '#3D2B1F88',
          }} />
        </button>

        <button
          onClick={handleCart}
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10,
            background: '#AD8F2E', color: '#fff',
            border: 'none', cursor: 'pointer',
            padding: '8px 0',
            fontSize: 11, fontWeight: 700,
            fontFamily: 'inherit',
            transform: (hovered || isMobile) ? 'translateY(0)' : 'translateY(100%)',
            transition: 'transform 0.3s ease',
          }}
        >
          Quick add
        </button>
      </div>

      <Link href={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
        <p style={{
          fontSize: 12, fontWeight: 600, color: '#3D2B1F',
          margin: '0 0 2px',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {product.name}
        </p>
        {product.shortDesc && (
          <p style={{
            fontSize: 10, color: '#3D2B1F88', margin: '0 0 4px',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
          }}>
            {product.shortDesc}
          </p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#3D2B1F' }}>
            ₹{product.price?.toLocaleString()}
          </span>
          {product.mrp > product.price && (
            <span style={{ fontSize: 11, color: '#3D2B1F55', textDecoration: 'line-through' }}>
              ₹{product.mrp?.toLocaleString()}
            </span>
          )}
        </div>
      </Link>
    </div>
  )
}

export default function HorizontalProductSection({
  title, viewAllHref = '#', products = [], bg = '#fff',
}: Props) {
  const ref  = useRef<HTMLDivElement>(null)
  const [canL, setCanL] = useState(false)
  const [canR, setCanR] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const checkScroll = () => {
    const el = ref.current
    if (!el) return
    setCanL(el.scrollLeft > 4)
    setCanR(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }

  useEffect(() => { checkScroll() }, [products])

  const go = (dir: 'l' | 'r') => {
    const el = ref.current
    if (!el) return
    const scrollAmount = isMobile ? el.clientWidth * 0.8 : 260
    el.scrollBy({ left: dir === 'r' ? scrollAmount : -scrollAmount, behavior: 'smooth' })
    setTimeout(checkScroll, 350)
  }

  const cleanProducts = products || []
  const cardWidth = isMobile ? 'calc(50vw - 22px)' : '220px'
  const sectionPad = isMobile ? '32px 0' : '48px 0'

  return (
    <section style={{ padding: sectionPad, background: bg }}>

      {/* Header Container */}
      <div style={{
        padding: isMobile ? '0 16px' : '0 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
      }}>
        <h2
          className={cormorant.className}
          style={{
            fontSize: isMobile ? 22 : 30,
            fontWeight: 600,
            color: '#3D2B1F',
            margin: 0,
          }}
        >
          {title}
        </h2>
        <Link
          href={viewAllHref}
          style={{ fontSize: 11, fontWeight: 600, color: '#3D2B1F', textDecoration: 'none' }}
        >
          View All →
        </Link>
      </div>

      {/* Content Scroller Container */}
     {/* Content Scroller Container */}
      {!cleanProducts || cleanProducts.length === 0 ? (
        <div style={{
          display: 'flex', gap: 12,
          padding: isMobile ? '0 16px' : '0 40px',
          overflow: 'hidden',
        }}>
          {[...Array(isMobile ? 2 : 4)].map((_, i) => (
            <div key={i} style={{ width: cardWidth, flexShrink: 0 }}>
              <div style={{
                width: '100%', aspectRatio: '1/1',
                background: '#F5EDE8', borderRadius: 12,
                marginBottom: 8, opacity: 0.5,
              }} />
              <div style={{ height: 11, background: '#F5EDE8', borderRadius: 4, marginBottom: 5, width: '75%' }} />
              <div style={{ height: 10, background: '#F5EDE8', borderRadius: 4, width: '50%' }} />
            </div>
          ))}
        </div>
      ) : (
        <div
          ref={ref}
          onScroll={checkScroll}
          style={{
            display: 'flex',
            marginLeft:'10px',
            gap: 12,
            padding: isMobile ? '4px 0px 8px' : '4px 40px 8px', // Set mobile horizontal padding to 0 so spacer controls edge
            overflowX: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            scrollSnapType: isMobile ? 'x mandatory' : 'none',
          }}
        >
          {/* Forced Left Edge Gutter Margin for Mobile */}
          {isMobile && <div style={{ width: 16, flexShrink: 0 }} />}

          {cleanProducts.map((p, idx) => (
            <div
              key={p._id || p.id || idx}
              style={{
                flexShrink: 0,
                width: cardWidth,
                scrollSnapAlign: isMobile ? 'start' : 'none',
              }}
            >
              <Card product={p} />
            </div>
          ))}

          {/* Forced Right Edge Gutter Margin for Mobile */}
          {isMobile && <div style={{ width: 16, flexShrink: 0 }} />}
        </div>
      )}

      {/* Slider Control Arrows */}
      {isMobile ? (
        cleanProducts.length > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 24, // Clean space between the left and right arrows
            marginTop: 16,
            padding: '0 16px',
          }}>
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
              <ChevronLeft size={16} color="#3D2B1F" />
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
              <ChevronRight size={16} color="#3D2B1F" />
            </button>
          </div>
        )
      ) : (
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 8,
          padding: '12px 40px 0',
        }}>
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
      )}
    </section>
  )
}