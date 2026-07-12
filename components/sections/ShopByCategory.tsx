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
  const [isMobile, setIsMobile] = useState(false)

  const check = () => {
    const el = ref.current
    if (!el) return
    setCanL(el.scrollLeft > 4)
    setCanR(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }

  useEffect(() => {
    check()
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const go = (dir: 'l' | 'r') => {
    const el = ref.current
    if (!el) return
    const scrollAmount = isMobile ? el.clientWidth * 0.8 : 280
    el.scrollBy({ left: dir === 'r' ? scrollAmount : -scrollAmount, behavior: 'smooth' })
    setTimeout(check, 350)
  }

  const cardWidth = isMobile ? 'calc(50vw - 22px)' : '260px'

  return (
    <section style={{ padding: isMobile ? '32px 0' : '56px 0', background: '#fff' }}>
      {/* Header Container */}
      <div style={{
        padding: isMobile ? '0 16px' : '0 64px',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: isMobile ? 20 : 32,
      }}>
        <div>
          <h2
            className={cormorant.className}
            style={{ fontSize: isMobile ? 24 : 36, fontWeight: 600, color: '#3D2B1F', margin: 0 }}
          >
            Shop By Category
          </h2>
          <p style={{ fontSize: isMobile ? 12 : 13, color: '#3D2B1F99', marginTop: 4, fontFamily: 'inherit' }}>
            Say yes to the finest handloom brands from Kanpur
          </p>
        </div>

        {/* Top Navigation Controls — Desktop Only */}
        {!isMobile && (
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
        )}
      </div>

      {/* Horizontal Flex Slider Track Layout */}
      <div
        ref={ref}
        onScroll={check}
        style={{
          display: 'flex',
          marginLeft:'10px',
          gap: 12,
          padding: isMobile ? '4px 0px 8px' : '4px 64px 8px',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          scrollSnapType: isMobile ? 'x mandatory' : 'none',
        }}
      >
        {/* Fixed Left Margin Gutter Block for Mobile Alignment */}
        {isMobile && <div style={{ width: 16, flexShrink: 0 }} />}

        {categories.map((cat) => (
          <Link
            key={cat.label}
            href={cat.href}
            style={{ 
              flexShrink: 0, 
              textDecoration: 'none', 
              width: cardWidth,
              scrollSnapAlign: isMobile ? 'start' : 'none'
            }}
          >
            <div className="w-full cursor-pointer group">
              {/* Image Container Layout Card */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: isMobile ? '200px' : '320px',
                  
                  overflow: 'hidden',
                  marginBottom: 10,
                  backgroundColor: cat.bg,
                }}
              >
                {/* Background Image Layer */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url('${cat.image}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center top',
                    backgroundRepeat: 'no-repeat',
                    transition: 'transform 0.4s ease',
                  }}
                />

                {/* Ambient Dark Gradient Layer Overlay */}
                {!cat.contain && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: '',
                    }}
                  />
                )}

                {/* Bottom Overlay Text Box Labels */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '12px',
                    background: cat.contain ? 'rgba(61,43,31,0.7)' : 'transparent',
                  }}
                >
                  <p style={{
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: isMobile ? 12 : 14,
                    margin: 0,
                    fontFamily: 'inherit',
                  }}>
                    {cat.label}
                  </p>
                  <p style={{
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: isMobile ? 10 : 11,
                    marginTop: 2,
                    marginBottom: 0,
                    fontFamily: 'inherit',
                  }}>
                    {cat.sub}
                  </p>
                </div>
              </div>

              {/* Action Indicator */}
              <p style={{
                textAlign: 'center',
                fontSize: 11,
                color: '#3D2B1F88',
                fontFamily: 'inherit',
                margin: '4px 0 0',
              }}>
                Shop Now →
              </p>
            </div>
          </Link>
        ))}

        {/* Fixed Right Margin Gutter Block for Mobile Alignment */}
        {isMobile && <div style={{ width: 16, flexShrink: 0 }} />}
      </div>

      {/* Navigation Controls Container — Mobile Only Bottom Center Position */}
      {isMobile && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 16 }}>
          <button
            onClick={() => go('l')}
            disabled={!canL}
            style={{
              width: 36, height: 36, borderRadius: '50%',
              border: '1px solid #3D2B1F33', background: '#fff',
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
              opacity: canR ? 1 : 0.3,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <ChevronRight size={16} color="#3D2B1F" />
          </button>
        </div>
      )}
    </section>
  )
}