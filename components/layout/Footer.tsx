'use client'
import { useState } from 'react'
import { Cormorant_Garamond } from 'next/font/google'
import Link from 'next/link'
import { ArrowRight, MapPin, Phone, Mail } from 'lucide-react'

const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['400', '500', '600'] })

const footerLinks = {
  'Quick Buy': [
    { label: 'Buy Bedsheets',      href: '/products/bedsheets' },
    { label: 'Buy Curtains',       href: '/products/curtains' },
    { label: 'Buy Blankets',       href: '/products/quilts' },
    { label: 'Buy Cushion Covers', href: '/products/pillows' },
    { label: 'Buy Pillows',        href: '/products?category=pillows' },
    { label: 'Buy Towels',         href: '/products/towels' },
  ],
  'Important Links': [
    { label: 'Track Order',           href: '/track' },
    { label: 'About Us',              href: '/about' },
    { label: 'Contact Us',            href: '/contact' },
    { label: 'Shipping Policy',       href: '/shipping-policy' },
    { label: 'Exchange & Refund',     href: '/return-policy' },
    { label: 'Privacy Policy',        href: '/privacy-policy' },
    { label: 'Terms & Conditions',    href: '/terms' },
    { label: 'Blogs',                 href: '/blog' },
  ],
  'Collection Pages': [
    { label: 'Buy Cotton Curtains',         href: '/products/curtains?material=cotton' },
    { label: 'Buy Mats',                    href: '/products?category=mats' },
    { label: 'Buy Bedding Combos',          href: '/products?category=combos' },
    { label: 'Buy Sofa Covers',             href: '/products?category=sofa-covers' },
    { label: 'Buy Shawls',                  href: '/products?category=shawls' },
    { label: 'Buy Curtain Fabric',          href: '/products/curtains?type=fabric' },
    { label: 'Traditional Print Bedsheets', href: '/products/bedsheets?material=traditional' },
  ],
}

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = () => {
    if (!email.trim() || !email.includes('@')) return
    setSubscribed(true)
    setEmail('')
    setTimeout(() => setSubscribed(false), 4000)
  }

  return (
    <footer style={{ background: '#1A0F0A', color: '#FDF0EC' }}>

      {/* ── Top section ── */}
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '56px 40px 40px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 40,
      }}>

        {/* Stay Updated */}
        <div>
          <h3 className={cormorant.className} style={{
            fontSize: 18, fontWeight: 600,
            color: '#D4AF37', marginBottom: 8,
          }}>
            Stay Updated
          </h3>
          <p style={{ fontSize: 12, color: '#FDF0EC99', lineHeight: 1.6, marginBottom: 16 }}>
            Be the first to get latest offers, decor tips, celebrity tie-ups and blogs
          </p>
          <div style={{ display: 'flex', gap: 0 }}>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubscribe()}
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRight: 'none',
                color: '#FDF0EC',
                fontSize: 12,
                padding: '10px 14px',
                outline: 'none',
                borderRadius: '6px 0 0 6px',
              }}
            />
            <button
              onClick={handleSubscribe}
              style={{
                background: subscribed ? '#22c55e' : '#D4AF37',
                border: 'none',
                color: '#1A0F0A',
                padding: '10px 14px',
                cursor: 'pointer',
                borderRadius: '0 6px 6px 0',
                display: 'flex',
                alignItems: 'center',
                transition: 'background 0.3s',
              }}
            >
              {subscribed
                ? <span style={{ fontSize: 11, fontWeight: 700 }}>✓</span>
                : <ArrowRight size={16} />
              }
            </button>
          </div>
          {subscribed && (
            <p style={{ fontSize: 11, color: '#22c55e', marginTop: 6 }}>
              ✓ Subscribed successfully!
            </p>
          )}

          {/* Social icons */}
          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            <a
              href="https://instagram.com/cityhandloom"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: 34, height: 34, borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#FDF0EC99', textDecoration: 'none', transition: 'all 0.2s',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
              </svg>
            </a>
            <a
              href="https://facebook.com/cityhandloom"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: 34, height: 34, borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#FDF0EC99', textDecoration: 'none', transition: 'all 0.2s',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
              </svg>
            </a>
            <a
              href="https://youtube.com/@cityhandloom"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: 34, height: 34, borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#FDF0EC99', textDecoration: 'none', transition: 'all 0.2s',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93 .502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(footerLinks).map(([group, links]) => (
          <div key={group}>
            <h3 className={cormorant.className} style={{
              fontSize: 16, fontWeight: 600,
              color: '#D4AF37', marginBottom: 14,
            }}>
              {group}
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {links.map(link => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    style={{ fontSize: 12, color: '#FDF0EC88', textDecoration: 'none', transition: 'color 0.2s' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Address */}
        <div>
          <h3 className={cormorant.className} style={{
            fontSize: 16, fontWeight: 600,
            color: '#D4AF37', marginBottom: 14,
          }}>
            Address
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <MapPin size={14} color="#D4AF37" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <p style={{ fontSize: 12, color: '#FDF0EC', fontWeight: 600, margin: '0 0 2px' }}>
                  City Handloom Store
                </p>
                <p style={{ fontSize: 12, color: '#FDF0EC88', margin: 0, lineHeight: 1.5 }}>
                  Kanpur, Uttar Pradesh, India
                </p>
              </div>
            </div>

            <a
              href="https://wa.me/911234567899"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'flex', gap: 10, alignItems: 'center', textDecoration: 'none' }}
            >
              <Phone size={14} color="#D4AF37" style={{ flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 10, color: '#FDF0EC55', margin: '0 0 1px' }}>WhatsApp Support</p>
                <p style={{ fontSize: 12, color: '#FDF0EC88', margin: 0 }}>+91 1234567899</p>
              </div>
            </a>

            <a
              href="mailto:cityadmin@gmail.com"
              style={{ display: 'flex', gap: 10, alignItems: 'center', textDecoration: 'none' }}
            >
              <Mail size={14} color="#D4AF37" style={{ flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 10, color: '#FDF0EC55', margin: '0 0 1px' }}>Email Support</p>
                <p style={{ fontSize: 12, color: '#FDF0EC88', margin: 0 }}>cityadmin@gmail.com</p>
              </div>
            </a>

            {/* Download app buttons */}
            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <p style={{ fontSize: 10, color: '#FDF0EC55', margin: 0 }}>Download our apps</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <a href="#" style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 6, padding: '6px 10px',
                  textDecoration: 'none',
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#FDF0EC">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.39-1.32 2.76-2.53 3.99M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div>
                    <p style={{ fontSize: 8, color: '#FDF0EC88', margin: 0 }}>Download on the</p>
                    <p style={{ fontSize: 11, color: '#FDF0EC', fontWeight: 600, margin: 0 }}>App Store</p>
                  </div>
                </a>
                <a href="#" style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 6, padding: '6px 10px',
                  textDecoration: 'none',
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#FDF0EC">
                    <path d="M3.18 23.76c.3.17.64.24.99.19l11.53-11.53L12 8.72 3.18 23.76zm16.4-12.05L17.21 10l-2.13 2.13 2.13 2.12 2.37-1.35c.68-.38.68-1.47 0-1.85v-.19zM3.54.27C3.2.05 2.8.03 2.43.25L13.27 11.1l-1.8 1.8L2.44 23.75c.36.22.76.2 1.1-.02L14.67 17 3.54.27zm9.9 12.01L2.43.25c0 .01-.01.01-.01.02L2.43.27C2.8.05 3.2.07 3.54.27L14.69 7l-1.25 5.28z"/>
                  </svg>
                  <div>
                    <p style={{ fontSize: 8, color: '#FDF0EC88', margin: 0 }}>Get it on</p>
                    <p style={{ fontSize: 11, color: '#FDF0EC', fontWeight: 600, margin: 0 }}>Google Play</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Divider ── */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.08)',
        maxWidth: 1280,
        margin: '0 auto',
        padding: '20px 40px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
      }}>
        <p style={{ fontSize: 11, color: '#FDF0EC44', margin: 0 }}>
          © {new Date().getFullYear()} City Handloom. All rights reserved.
        </p>

        {/* Payment icons */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {['Visa', 'Mastercard', 'UPI', 'PayTM', 'PhonePe', 'Razorpay'].map(pay => (
            <span key={pay} style={{
              fontSize: 9, fontWeight: 700,
              color: '#FDF0EC55',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '3px 7px',
              borderRadius: 4,
            }}>
              {pay}
            </span>
          ))}
        </div>

        <p style={{ fontSize: 11, color: '#FDF0EC44', margin: 0 }}>
          Made with ❤️ in India
        </p>
      </div>
    </footer>
  )
}