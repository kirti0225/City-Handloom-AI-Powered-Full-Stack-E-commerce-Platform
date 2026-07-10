'use client'
import { useRef, useState, useEffect } from 'react'
import { Cormorant_Garamond } from 'next/font/google'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['500', '600'] })

const categories = [
  {
    label: 'Bedsheets',
    sub: 'Pure handloom cotton',
    href: '/products/bedsheets',
    image: '/images/bedsheet-cat.png',
    bg: 'transparent',
    contain: false,
  },
  {
    label: 'Curtains',
    sub: 'Natural fiber drapes',
    href: '/products/curtains',
    image: '/images/curtains-cat.png',
    bg: 'transparent',
    contain: false,
  },
  {
    label: 'Pillow Covers',
    sub: 'Soft & elegant',
    href: '/products/pillows',
    image: '/images/pillow-cover-cat.png',
    bg: 'transparent',
contain: false,
  },
  {
    label: 'Blankets',
    sub: 'Warm & cozy quilts',
    href: '/products/quilts',
    image: '/images/blanket-cat.png',
    bg: 'transparent',
    contain: false,
  },
  {
    label: 'Towels',
    sub: 'Premium 600 GSM',
    href: '/products/towels',
    image: '/images/towel-cat.png',
    bg: 'transparent',
    contain: false,
  },
  {
    label: 'Mattress',
    sub: 'Comfort & support',
    href: '/products?category=mattress',
    image: '/images/mattress-cat.png',
    bg: 'transparent',
    contain: false,
  },
  {
    label: 'Pillows',
    sub: 'Neck & back support',
    href: '/products?category=pillows',
    image: '/images/pillow-cat.png',
    bg: 'transparent',
    contain: false,
  },
]

export default function ShopByCategory() {
  const ref = useRef<HTMLDivElement>(null)
  const [canL, setCanL] = useState(false)
  const [canR, setCanR] = useState(true)

  const check = () => {
    const el = ref.current
    if (!el) return
    setCanL(el.scrollLeft > 4)
    setCanR(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }

  useEffect(() => {
    check()
  }, [])

  const go = (dir: 'l' | 'r') => {
    ref.current?.scrollBy({ left: dir === 'r' ? 280 : -280, behavior: 'smooth' })
    setTimeout(check, 350)
  }

  return (
    <section style={{ paddingTop: 56, paddingBottom: 56, background: '#fff' }}>
      {/* Header */}
      <div style={{
        padding: '0 64px',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: 32,
      }}>
        <div>
          <h2
            className={cormorant.className}
            style={{ fontSize: 36, fontWeight: 600, color: '#3D2B1F', margin: 0 }}
          >
            Shop By Category
          </h2>
          <p style={{ fontSize: 13, color: '#3D2B1F99', marginTop: 4, fontFamily: 'inherit' }}>
            Say yes to the finest handloom brands from Kanpur
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
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

      {/* Scrollable row */}
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
        {categories.map((cat) => (
          <Link
            key={cat.label}
            href={cat.href}
            style={{ flexShrink: 0, textDecoration: 'none' }}
          >
            <div
              style={{ width: 260, cursor: 'pointer' }}
              className="group"
            >
              {/* Image card */}
              <div
                style={{
                  position: 'relative',
                  width: 260,
                  height: 320,
                  borderRadius: 16,
                  overflow: 'hidden',
                  marginBottom: 10,
                  backgroundColor: cat.bg,
                }}
              >
                {/* Background image */}
                
<div
  style={{
    position: 'absolute',
    inset: 0,
    backgroundImage: `url('${cat.image}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center top',   // ← shows top of image
    backgroundRepeat: 'no-repeat',
    transition: 'transform 0.4s ease',
  }}
/>

                {/* Dark gradient overlay — only for cover images */}
                {!cat.contain && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: '',
                    }}
                  />
                )}

                {/* Label overlay — bottom for cover, bottom for contain too */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: cat.contain ? '10px 14px' : '14px 16px',
                    background: cat.contain ? 'rgba(61,43,31,0.7)' : 'transparent',
                  }}
                >
                  <p style={{
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 14,
                    margin: 0,
                    fontFamily: 'inherit',
                  }}>
                    {cat.label}
                  </p>
                  <p style={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: 11,
                    marginTop: 2,
                    fontFamily: 'inherit',
                  }}>
                    {cat.sub}
                  </p>
                </div>
              </div>

              {/* Shop Now text */}
              <p style={{
                textAlign: 'center',
                fontSize: 11,
                color: '#3D2B1F88',
                fontFamily: 'inherit',
              }}>
                Shop Now →
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}