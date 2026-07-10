'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Cormorant_Garamond } from 'next/font/google'
import { Search, Clock, Tag, ChevronRight, TrendingUp } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

const SPRING = { type: 'spring' as const, stiffness: 80, damping: 14 }

export const blogPosts = [
  {
    slug: 'how-to-wash-handloom-bedsheet',
    title: 'How to Wash and Care for Your Handloom Bedsheet',
    excerpt: 'Proper care of handloom fabric extends the life of your bedsheet by years. Learn the right way to wash, dry and store handloom products.',
    category: 'Care Tips',
    author: 'Priya Gupta',
    date: 'June 20, 2026',
    readTime: '5 min read',
    image: '/images/product-1.jpg',
    featured: true,
    tags: ['care tips', 'handloom', 'bedsheet', 'washing'],
  },
  {
    slug: 'best-cotton-bedsheet-guide',
    title: 'The Ultimate Guide to Choosing the Best Cotton Bedsheet in India',
    excerpt: 'Thread count, weave type, cotton variety — navigating bedsheet specs can be confusing. This guide breaks it all down for you.',
    category: 'Buying Guide',
    author: 'Rahul Sharma',
    date: 'June 15, 2026',
    readTime: '8 min read',
    image: '/images/product-2.jpg',
    featured: true,
    tags: ['buying guide', 'cotton', 'bedsheet', 'thread count'],
  },
  {
    slug: 'handloom-curtains-bedroom-ideas',
    title: '10 Beautiful Bedroom Ideas with Handloom Curtains',
    excerpt: 'Transform your bedroom with the warmth and texture of handloom curtains. Here are 10 stunning décor ideas from our customers.',
    category: 'Home Decor',
    author: 'Sunita Devi',
    date: 'June 10, 2026',
    readTime: '6 min read',
    image: '/images/product-3.jpg',
    featured: false,
    tags: ['home decor', 'curtains', 'bedroom', 'interior design'],
  },
  {
    slug: 'history-of-kanpur-handloom',
    title: 'The Rich History of Handloom Weaving in Kanpur',
    excerpt: "Kanpur has been India's textile hub for over 200 years. Discover the fascinating history of handloom weaving and how it shaped the city.",
    category: 'Heritage',
    author: 'Rahul Sharma',
    date: 'June 5, 2026',
    readTime: '10 min read',
    image: '/images/product-4.jpg',
    featured: false,
    tags: ['heritage', 'kanpur', 'handloom', 'history'],
  },
  {
    slug: 'thread-count-myth',
    title: 'The Thread Count Myth: What Really Matters in a Bedsheet',
    excerpt: 'Most people think higher thread count = better quality. The truth is more nuanced. We explain what actually determines bedsheet quality.',
    category: 'Education',
    author: 'Priya Gupta',
    date: 'May 28, 2026',
    readTime: '7 min read',
    image: '/images/product-1.jpg',
    featured: false,
    tags: ['education', 'thread count', 'quality', 'bedsheet'],
  },
  {
    slug: 'summer-bedsheet-guide',
    title: 'Best Bedsheets for Indian Summers: A Complete Guide',
    excerpt: 'Struggling to sleep in the heat? The right bedsheet material can make a huge difference. Here are the best options for hot weather.',
    category: 'Seasonal',
    author: 'Amit Verma',
    date: 'May 20, 2026',
    readTime: '5 min read',
    image: '/images/product-2.jpg',
    featured: false,
    tags: ['summer', 'seasonal', 'bedsheet', 'cool fabric'],
  },
]

const categories = ['All', 'Care Tips', 'Buying Guide', 'Home Decor', 'Heritage', 'Education', 'Seasonal']

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { ...SPRING, delay: i * 0.08 },
  }),
}

export default function BlogPageClient() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = blogPosts.filter(post => {
    const matchCat = activeCategory === 'All' || post.category === activeCategory
    const matchSearch = !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(t => t.includes(searchQuery.toLowerCase()))
    return matchCat && matchSearch
  })

  const featured = blogPosts.filter(p => p.featured)
  const rest = filtered.filter(p => !p.featured)

  return (
    <main className="bg-white min-h-screen">
      <Navbar />

      {/* Hero */}
      <div className="relative w-full overflow-hidden" style={{ minHeight: '260px' }}>
        <div className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/images/lifestyle-main.jpg')` }} />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(90deg, rgba(253,240,236,0.98) 0%, rgba(253,240,236,0.90) 50%, rgba(253,240,236,0.3) 100%)' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-16 flex items-center"
          style={{ minHeight: '260px', paddingTop: '120px', paddingBottom: '40px' }}>
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-mocha/50 font-body mb-2"
            >
              HOME <span className="mx-1.5">›</span> BLOG
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={SPRING}
              className={`${cormorant.className} text-4xl md:text-6xl font-semibold text-mocha mb-2`}
            >
              Stories & Tips
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING, delay: 0.1 }}
              className="text-sm text-mocha/60 font-body"
            >
              Care guides, décor ideas, buying tips and handloom heritage
            </motion.p>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 lg:px-16 py-12">
        <div className="max-w-7xl mx-auto">

          {/* Search + filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-10">
            <div className="flex items-center gap-2 bg-petal/30 rounded-full px-4 py-2.5 flex-1 max-w-md">
              <Search size={15} className="text-mocha/40 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none text-sm text-mocha placeholder:text-mocha/35 font-body w-full"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {categories.map(cat => (
                <motion.button
                  key={cat}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold font-body transition-all ${
                    activeCategory === cat
                      ? 'bg-mocha text-ivory'
                      : 'bg-petal/40 text-mocha/70 hover:bg-petal hover:text-mocha'
                  }`}
                >
                  {cat}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Featured posts */}
          {activeCategory === 'All' && !searchQuery && (
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp size={16} className="text-gold-deep" />
                <h2 className={`${cormorant.className} text-2xl font-semibold text-mocha`}>
                  Featured Articles
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featured.map((post, i) => (
                  <motion.div
                    key={post.slug}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ y: -6 }}
                    className="cursor-pointer group"
                  >
                    <Link href={`/blog/${post.slug}`}>
                      <div className="relative h-56 rounded-2xl overflow-hidden mb-4">
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                          style={{ backgroundImage: `url('${post.image}')` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-espresso/70 to-transparent" />
                        <div className="absolute top-3 left-3">
                          <span className="text-[10px] font-bold text-espresso bg-gold-warm px-2.5 py-1 rounded-full font-body">
                            {post.category}
                          </span>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className={`${cormorant.className} text-xl font-semibold text-white leading-tight`}>
                            {post.title}
                          </h3>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-6 h-6 rounded-full bg-petal flex items-center justify-center">
                          <span className={`${cormorant.className} text-[10px] font-bold text-gold-deep`}>
                            {post.author[0]}
                          </span>
                        </div>
                        <span className="text-xs text-mocha/60 font-body">{post.author}</span>
                        <span className="text-mocha/30">·</span>
                        <span className="text-xs text-mocha/60 font-body">{post.date}</span>
                        <span className="text-mocha/30">·</span>
                        <div className="flex items-center gap-1">
                          <Clock size={11} className="text-mocha/40" />
                          <span className="text-xs text-mocha/60 font-body">{post.readTime}</span>
                        </div>
                      </div>
                      <p className="text-sm text-mocha/65 font-body leading-relaxed line-clamp-2">
                        {post.excerpt}
                      </p>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* All posts grid */}
          <div>
            {(activeCategory !== 'All' || searchQuery) ? (
              <div className="mb-4">
                <p className="text-sm text-mocha/50 font-body">
                  {filtered.length} article{filtered.length !== 1 ? 's' : ''} found
                  {activeCategory !== 'All' && ` in "${activeCategory}"`}
                  {searchQuery && ` for "${searchQuery}"`}
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-6">
                <h2 className={`${cormorant.className} text-2xl font-semibold text-mocha`}>
                  All Articles
                </h2>
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <p className={`${cormorant.className} text-2xl text-mocha/30 mb-2`}>No articles found</p>
                <p className="text-sm text-mocha/40 font-body">Try a different search term or category</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(activeCategory !== 'All' || searchQuery ? filtered : rest).map((post, i) => (
                  <motion.div
                    key={post.slug}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-40px' }}
                    whileHover={{ y: -6 }}
                    className="cursor-pointer group"
                  >
                    <Link href={`/blog/${post.slug}`}>
                      <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-4">
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                          style={{ backgroundImage: `url('${post.image}')` }}
                        />
                        <div className="absolute top-2 left-2">
                          <span className="text-[10px] font-bold text-espresso bg-gold-warm/90 px-2 py-0.5 rounded-full font-body">
                            {post.category}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          <Clock size={11} className="text-mocha/40" />
                          <span className="text-xs text-mocha/50 font-body">{post.readTime}</span>
                        </div>
                        <span className="text-mocha/30">·</span>
                        <span className="text-xs text-mocha/50 font-body">{post.date}</span>
                      </div>
                      <h3 className={`${cormorant.className} text-lg font-semibold text-mocha mb-2 leading-snug group-hover:text-gold-deep transition-colors`}>
                        {post.title}
                      </h3>
                      <p className="text-xs text-mocha/60 font-body leading-relaxed line-clamp-2 mb-3">
                        {post.excerpt}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {post.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-[10px] text-gold-deep font-body bg-petal/50 px-2 py-0.5 rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gold-deep font-body font-semibold group-hover:gap-2 transition-all">
                        Read more <ChevronRight size={13} />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* SEO Newsletter CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={SPRING}
            className="mt-16 bg-espresso rounded-3xl p-8 md:p-12 text-center"
          >
            <h2 className={`${cormorant.className} text-2xl md:text-3xl font-semibold text-ivory mb-2`}>
              Get Décor Tips in Your Inbox
            </h2>
            <p className="text-sm text-ivory/60 font-body mb-6 max-w-md mx-auto">
              Weekly handloom care tips, décor ideas, and exclusive offers — delivered straight to you.
            </p>
            <div className="flex gap-2 max-w-sm mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2.5 text-sm text-ivory placeholder:text-ivory/40 font-body outline-none focus:border-gold-warm"
              />
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="bg-gold-warm text-espresso font-semibold text-sm font-body px-5 py-2.5 rounded-full hover:bg-gold-deep transition-colors flex-shrink-0"
              >
                Subscribe
              </motion.button>
            </div>
          </motion.div>

        </div>
      </div>

      <Footer />
    </main>
  )
}