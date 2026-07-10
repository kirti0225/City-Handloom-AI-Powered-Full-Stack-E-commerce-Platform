'use client'
import { motion } from 'framer-motion'
import { Cormorant_Garamond } from 'next/font/google'
import { Clock, Tag, ChevronRight, ArrowLeft, Share2, Heart, Copy, Check } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { blogPosts } from './BlogPageClient'
import { useState } from 'react'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

const SPRING = { type: 'spring' as const, stiffness: 80, damping: 14 }

// ── Full post content ────────────────────────────────────────
const postContent: Record<string, { sections: { heading: string; body: string }[] }> = {
  'how-to-wash-handloom-bedsheet': {
    sections: [
      { heading: 'Why Proper Care Matters', body: 'Handloom fabrics are woven with natural fibers that require gentle care. Unlike machine-woven synthetic fabrics, handloom products have a natural weave structure that can loosen if treated harshly. Proper washing not only keeps your bedsheet looking fresh but significantly extends its lifespan — a well-cared-for handloom bedsheet can last 8-10 years.' },
      { heading: 'Before the First Wash', body: 'Always soak your new handloom bedsheet in cold water for 30 minutes before the first wash. This removes excess dye and softens the fibers. Add a tablespoon of salt to the soaking water — this helps fix the colors and prevents fading in subsequent washes. Do not wring or twist the fabric during this step.' },
      { heading: 'Machine Washing Tips', body: 'Use the delicate or gentle cycle with cold water (maximum 30°C). Use a mild liquid detergent — avoid powder detergents as they can leave residue in the weave. Do not use bleach or fabric softeners as they break down natural fibers. Wash handloom items separately from heavy fabrics like jeans to prevent friction damage.' },
      { heading: 'Hand Washing (Recommended)', body: 'Fill a tub with cold water and add a small amount of mild detergent. Gently swirl the bedsheet in the water for 5-10 minutes. Do not scrub or rub aggressively — instead, squeeze the soapy water through the fabric. Rinse thoroughly with cold water until no soap remains.' },
      { heading: 'Drying Your Bedsheet', body: 'Never tumble dry handloom fabrics — the heat damages the natural fibers. Dry in shade, not direct sunlight, as UV rays fade colors. Lay flat on a clean surface or hang on a wide clothesline to maintain shape. Avoid hanging on narrow ropes that can leave crease marks or stretch the weave.' },
      { heading: 'Ironing and Storage', body: 'Iron on medium heat while slightly damp for best results. Use a pressing cloth between the iron and the fabric to prevent shine marks. For storage, fold along natural weave lines and store in a cool, dry place. Avoid storing in plastic bags — use breathable cotton bags instead to prevent moisture buildup.' },
    ],
  },
  'best-cotton-bedsheet-guide': {
    sections: [
      { heading: 'Understanding Thread Count', body: 'Thread count refers to the number of threads woven per square inch of fabric. While many brands market 1000+ thread count as premium, the sweet spot for cotton bedsheets is actually 200-400 TC. Beyond 400, manufacturers often use twisted or multi-ply threads to inflate the count, which doesn\'t actually improve softness or durability.' },
      { heading: 'Types of Cotton to Know', body: 'Egyptian Cotton is the premium standard — long fibers, extremely soft, durable, but expensive. Supima Cotton (American-grown) is a close second with excellent quality at slightly lower prices. Pima Cotton offers similar properties to Supima. Regular Indian cotton is great value — our Jaipuriya bedsheets use hand-picked Indian cotton with natural softness that rivals imports.' },
      { heading: 'Weave Types Explained', body: 'Percale is a plain weave that creates a crisp, cool feel — great for hot climates. Sateen uses a satin weave technique for a silky, lustrous surface that feels warmer. Twill creates a diagonal pattern that\'s durable and slightly textured. Handloom weaves are unique — each product has slight variations that are marks of authentic hand-craftsmanship, not defects.' },
      { heading: 'Size Guide for Indian Beds', body: 'Single bed: 60"×90" (152×228 cm). Double bed: 90"×108" (228×274 cm). Queen size: 90"×108" with deeper pockets. King size: 108"×108" (274×274 cm). Always measure your mattress thickness — if your mattress is above 8 inches, look for fitted sheets with elastic pockets of at least 12 inches.' },
      { heading: 'What to Avoid', body: 'Avoid very low thread counts (below 150) — they feel rough and wear out quickly. Avoid "Egyptian cotton blend" labeling without certification — most blended fabrics have very little actual Egyptian cotton. Avoid polyester blends if you sleep hot — they trap heat and moisture. Check for OEKO-TEX certification which ensures no harmful chemicals were used in production.' },
      { heading: 'Our Recommendation', body: 'For Indian summers, we recommend 200-250 TC pure cotton in a percale weave. For winters, 300-350 TC sateen gives warmth and a luxurious feel. Our handloom bedsheets use hand-selected cotton with a 186 TC count that may seem low by comparison, but the hand-weaving process creates a much denser, more breathable fabric than machine-woven equivalents at the same thread count.' },
    ],
  },
}

// ── Default content for posts without full content ────────────
const defaultContent = {
  sections: [
    { heading: 'Introduction', body: 'Handloom textiles have been at the heart of Indian culture for centuries. Each piece tells a story of skilled craftsmanship passed down through generations of weavers who have dedicated their lives to this beautiful art form.' },
    { heading: 'The Craft', body: 'Unlike machine-made fabrics, handloom products are created on traditional wooden looms, where every thread is carefully placed by hand. This process creates fabrics with unique textures and slight variations that are actually marks of authenticity — no two handloom pieces are exactly alike.' },
    { heading: 'Why It Matters', body: 'Choosing handloom is choosing sustainability. Handloom weaving uses minimal electricity, creates zero carbon emissions from machinery, and supports local artisan communities. When you buy handloom, you\'re directly supporting the livelihood of skilled weavers and their families.' },
    { heading: 'Care and Maintenance', body: 'Handloom fabrics require gentle care to maintain their beauty. Always wash in cold water with mild detergent, avoid harsh chemicals, and dry in shade. With proper care, handloom products last significantly longer than their machine-made counterparts.' },
    { heading: 'Conclusion', body: 'We at City Handloom are proud to continue this tradition, working directly with artisans to bring authentic handloom products to your home. Every purchase supports a weaver family and keeps this ancient craft alive for future generations.' },
  ],
}

export default function BlogPostClient({ slug }: { slug: string }) {
  const post = blogPosts.find(p => p.slug === slug)
  const content = postContent[slug] || defaultContent
  const related = blogPosts.filter(p => p.slug !== slug).slice(0, 3)
  const [liked, setLiked] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!post) {
    return (
      <main className="bg-white min-h-screen">
        <Navbar />
        <div className="pt-32 flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
          <h2 className={`${cormorant.className} text-2xl font-semibold text-mocha mb-4`}>
            Article not found
          </h2>
          <Link href="/blog">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="bg-gold-warm text-espresso font-semibold text-sm font-body px-6 py-3 rounded-full">
              ← Back to Blog
            </motion.button>
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="bg-white min-h-screen">
      <Navbar />

      <div className="pt-28 md:pt-32 px-4 md:px-8 lg:px-16 pb-0">
        <div className="max-w-7xl mx-auto">

          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1.5 text-xs text-mocha/50 font-body mb-6"
          >
            <Link href="/" className="hover:text-mocha transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link href="/blog" className="hover:text-mocha transition-colors">Blog</Link>
            <ChevronRight size={12} />
            <span className="text-mocha font-medium line-clamp-1">{post.title}</span>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">

            {/* Main article */}
            <article>
              {/* Category + meta */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-5"
              >
                <span className="inline-block text-xs font-bold text-espresso bg-gold-warm px-3 py-1 rounded-full font-body mb-4">
                  {post.category}
                </span>
                <h1 className={`${cormorant.className} text-3xl md:text-4xl lg:text-5xl font-semibold text-mocha leading-tight mb-4`}>
                  {post.title}
                </h1>
                <p className="text-base text-mocha/65 font-body leading-relaxed mb-5 italic">
                  {post.excerpt}
                </p>
                <div className="flex flex-wrap items-center gap-4 pb-5 border-b border-petal/60">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-petal flex items-center justify-center">
                      <span className={`${cormorant.className} text-sm font-bold text-gold-deep`}>{post.author[0]}</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-mocha font-body">{post.author}</p>
                      <p className="text-[10px] text-mocha/50 font-body">City Handloom Team</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-mocha/50 font-body">
                    <span>{post.date}</span>
                    <span>·</span>
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-auto">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setLiked(!liked)}
                      className={`flex items-center gap-1.5 text-xs font-body px-3 py-1.5 rounded-full border transition-colors ${
                        liked ? 'border-red-300 bg-red-50 text-red-500' : 'border-petal text-mocha/60 hover:border-red-300'
                      }`}
                    >
                      <Heart size={12} className={liked ? 'fill-red-500' : ''} />
                      {liked ? 'Liked' : 'Like'}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={copyLink}
                      className="flex items-center gap-1.5 text-xs font-body px-3 py-1.5 rounded-full border border-petal text-mocha/60 hover:border-gold-warm transition-colors"
                    >
                      {copied ? <Check size={12} /> : <Copy size={12} />}
                      {copied ? 'Copied!' : 'Copy link'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Hero image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ...SPRING, delay: 0.1 }}
                className="relative h-[320px] md:h-[420px] rounded-2xl overflow-hidden mb-8"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('${post.image}')` }}
                />
              </motion.div>

              {/* Article content */}
              <div className="prose-article">
                {content.sections.map((section, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ ...SPRING, delay: i * 0.05 }}
                    className="mb-8"
                  >
                    <h2 className={`${cormorant.className} text-2xl font-semibold text-mocha mb-3`}>
                      {section.heading}
                    </h2>
                    <p className="text-sm text-mocha/70 font-body leading-relaxed">
                      {section.body}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-petal/60">
                <div className="flex items-center gap-1.5 text-xs text-mocha/50 font-body mr-2">
                  <Tag size={13} /> Tags:
                </div>
                {post.tags.map(tag => (
                  <span key={tag} className="text-xs text-gold-deep font-body bg-petal/50 px-3 py-1 rounded-full hover:bg-petal transition-colors cursor-pointer">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Back to blog */}
              <div className="mt-8">
                <Link href="/blog">
                  <motion.button
                    whileHover={{ scale: 1.03, x: -4 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 text-sm text-mocha/60 font-body hover:text-mocha transition-colors"
                  >
                    <ArrowLeft size={14} /> Back to all articles
                  </motion.button>
                </Link>
              </div>
            </article>

            {/* Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...SPRING, delay: 0.15 }}
              className="space-y-6 lg:sticky lg:top-32 h-fit"
            >
              {/* Related posts */}
              <div className="bg-petal/20 rounded-2xl p-5">
                <h3 className={`${cormorant.className} text-lg font-semibold text-mocha mb-4`}>
                  Related Articles
                </h3>
                <div className="space-y-4">
                  {related.map(relPost => (
                    <Link key={relPost.slug} href={`/blog/${relPost.slug}`}>
                      <motion.div whileHover={{ x: 4 }} className="flex gap-3 cursor-pointer group">
                        <div
                          className="w-14 h-14 rounded-xl bg-cover bg-center flex-shrink-0"
                          style={{ backgroundImage: `url('${relPost.image}')` }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-mocha font-body line-clamp-2 group-hover:text-gold-deep transition-colors leading-snug">
                            {relPost.title}
                          </p>
                          <p className="text-[10px] text-mocha/50 font-body mt-1">{relPost.readTime}</p>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white rounded-2xl border border-petal/60 p-5">
                <h3 className={`${cormorant.className} text-lg font-semibold text-mocha mb-4`}>
                  Categories
                </h3>
                <div className="space-y-2">
                  {['Care Tips', 'Buying Guide', 'Home Decor', 'Heritage', 'Education', 'Seasonal'].map(cat => (
                    <Link key={cat} href={`/blog?category=${cat}`}>
                      <div className="flex items-center justify-between py-1.5 text-sm font-body text-mocha/70 hover:text-gold-deep transition-colors cursor-pointer">
                        <span>{cat}</span>
                        <ChevronRight size={13} />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="bg-espresso rounded-2xl p-5">
                <h3 className={`${cormorant.className} text-lg font-semibold text-ivory mb-2`}>
                  Weekly Tips
                </h3>
                <p className="text-xs text-ivory/60 font-body mb-4">
                  Get handloom care tips and décor ideas in your inbox.
                </p>
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-xs text-ivory placeholder:text-ivory/40 font-body outline-none focus:border-gold-warm mb-2"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-2 bg-gold-warm text-espresso text-xs font-semibold font-body rounded-lg hover:bg-gold-deep transition-colors"
                >
                  Subscribe
                </motion.button>
              </div>
            </motion.aside>
          </div>

          {/* Bottom related grid */}
          <div className="mt-14 pt-10 border-t border-petal pb-16">
            <h2 className={`${cormorant.className} text-2xl font-semibold text-mocha mb-6`}>
              More Articles You'll Love
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((relPost, i) => (
                <motion.div
                  key={relPost.slug}
                  custom={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ ...SPRING, delay: i * 0.08 }}
                  whileHover={{ y: -6 }}
                  className="cursor-pointer group"
                >
                  <Link href={`/blog/${relPost.slug}`}>
                    <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-3">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundImage: `url('${relPost.image}')` }}
                      />
                      <div className="absolute top-2 left-2">
                        <span className="text-[10px] font-bold text-espresso bg-gold-warm/90 px-2 py-0.5 rounded-full font-body">
                          {relPost.category}
                        </span>
                      </div>
                    </div>
                    <h3 className={`${cormorant.className} text-lg font-semibold text-mocha group-hover:text-gold-deep transition-colors leading-snug mb-1`}>
                      {relPost.title}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-mocha/50 font-body">
                      <Clock size={11} />
                      <span>{relPost.readTime}</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  )
}