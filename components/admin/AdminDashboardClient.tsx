'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cormorant_Garamond } from 'next/font/google'
import {
  LayoutDashboard, ShoppingBag, Users, Package,
  TrendingUp, Settings, LogOut, Bell, Search,
  ArrowUp, ArrowDown, Edit, Trash2,
  Sparkles, DollarSign, ShoppingCart,
  Menu, Download, RefreshCw,
  Plus, X, Tag, ChevronDown,
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar,
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/store/authStore'
import { useRouter } from 'next/navigation'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

// ── Chart data ────────────────────────────────────────────────
const revenueData = [
  { month: 'Jan', revenue: 42000, orders: 85 },
  { month: 'Feb', revenue: 38000, orders: 72 },
  { month: 'Mar', revenue: 55000, orders: 110 },
  { month: 'Apr', revenue: 48000, orders: 95 },
  { month: 'May', revenue: 62000, orders: 128 },
  { month: 'Jun', revenue: 71000, orders: 145 },
  { month: 'Jul', revenue: 65000, orders: 132 },
  { month: 'Aug', revenue: 78000, orders: 158 },
  { month: 'Sep', revenue: 69000, orders: 140 },
  { month: 'Oct', revenue: 85000, orders: 172 },
  { month: 'Nov', revenue: 92000, orders: 185 },
  { month: 'Dec', revenue: 110000, orders: 220 },
]

const categoryData = [
  { name: 'Bedsheets', value: 38, color: '#D4AF37' },
  { name: 'Curtains',  value: 25, color: '#E8A898' },
  { name: 'Quilts',    value: 20, color: '#3D2B1F' },
  { name: 'Pillows',   value: 12, color: '#B8860B' },
  { name: 'Towels',    value: 5,  color: '#8B6914' },
]

const aiInsights = [
  { icon: '📈', text: 'Bedsheet sales up 23% this week. Consider restocking Jaipuriya collection.', type: 'opportunity' },
  { icon: '⚠️', text: 'Silk Pillow Cover Set is critically low on stock. Reorder recommended.', type: 'warning' },
  { icon: '🌟', text: 'Customer satisfaction rate is 94.2% this month — highest in 6 months!', type: 'positive' },
  { icon: '💡', text: 'Tuesday and Thursday have highest order volume. Run flash sales on these days.', type: 'insight' },
]

const statusColors: Record<string, string> = {
  placed:    'bg-blue-100 text-blue-700',
  confirmed: 'bg-indigo-100 text-indigo-700',
  packed:    'bg-purple-100 text-purple-700',
  shipped:   'bg-amber-100 text-amber-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

const nextStatus: Record<string, string> = {
  placed: 'confirmed', confirmed: 'packed',
  packed: 'shipped',   shipped: 'delivered',
}

type SidebarKey = 'dashboard' | 'orders' | 'products' | 'customers' | 'analytics' | 'categories' | 'attributes'

const cardVariants = {
  hidden:  { opacity: 0, y: 30, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring' as const, stiffness: 80, damping: 14, delay: i * 0.07 },
  }),
}

const inp = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400 transition-colors bg-white'

// ─────────────────────────────────────────────────────────────
// PRODUCTS TAB
// ─────────────────────────────────────────────────────────────
function AdminProductsTab() {
  const [products,       setProducts]       = useState<any[]>([])
  const [dbCategories,   setDbCategories]   = useState<any[]>([])
  const [dbAttributes,   setDbAttributes]   = useState<any[]>([])
  const [isLoading,      setIsLoading]      = useState(true)
  const [showForm,       setShowForm]       = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [uploading,      setUploading]      = useState(false)
  const [saving,         setSaving]         = useState(false)
  const [newSize,        setNewSize]        = useState('')
  const [newColorName,   setNewColorName]   = useState('')
  const [newColorHex,    setNewColorHex]    = useState('#AD8F2E')

  const defaultForm = {
    name: '', shortDesc: '', description: '',
    price: '', mrp: '', discount: '',
    category: 'bedsheets', material: 'Cotton',
    stock: '', isFeatured: false,
    showInBestSellers: false, showInTrending: false, showInNewArrivals: false,
    images: [] as string[],
    sizes:  [] as string[],
    colors: [] as { name: string; hex: string }[],
  }

  const [form, setForm] = useState({ ...defaultForm })

  const resetForm = () => {
    setForm({ ...defaultForm })
    setNewSize('')
    setNewColorName('')
    setNewColorHex('#AD8F2E')
    setEditingProduct(null)
    setShowForm(false)
  }

  useEffect(() => {
    const load = async () => {
      try {
        const [prodData, catData] = await Promise.allSettled([
          api.adminGetProducts(),
          api.getCategories(),
        ])
        if (prodData.status === 'fulfilled') setProducts(prodData.value.data)
        if (catData.status  === 'fulfilled') setDbCategories(catData.value.data)
      } catch (err) { console.error(err) }
      finally { setIsLoading(false) }
    }
    load()
  }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const data = await api.uploadImage(file)
      setForm(p => ({ ...p, images: [...p.images, data.data.url] }))
    } catch (err: any) {
      alert('Image upload failed: ' + err.message)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.stock) {
      alert('Name, price and stock are required'); return
    }
    setSaving(true)
    try {
      const body = {
        ...form,
        price:    Number(form.price),
        mrp:      Number(form.mrp) || Number(form.price),
        discount: Number(form.discount) || 0,
        stock:    Number(form.stock),
      }
      if (editingProduct) {
        const data = await api.adminUpdateProduct(editingProduct._id, body)
        setProducts(prev => prev.map(p => p._id === editingProduct._id ? data.data : p))
      } else {
        const data = await api.adminCreateProduct(body)
        setProducts(prev => [data.data, ...prev])
      }
      resetForm()
    } catch (err: any) {
      alert(err.message || 'Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product? This cannot be undone.')) return
    try {
      await api.adminDeleteProduct(id)
      setProducts(prev => prev.filter(p => p._id !== id))
    } catch (err: any) {
      alert(err.message || 'Failed to delete')
    }
  }

  const startEdit = (product: any) => {
    setEditingProduct(product)
    setForm({
      name:              product.name        || '',
      shortDesc:         product.shortDesc   || '',
      description:       product.description || '',
      price:             product.price?.toString()    || '',
      mrp:               product.mrp?.toString()      || '',
      discount:          product.discount?.toString() || '',
      category:          product.category   || 'bedsheets',
      material:          product.material   || 'Cotton',
      stock:             product.stock?.toString()    || '',
      isFeatured:        product.isFeatured        || false,
      showInBestSellers: product.showInBestSellers || false,
      showInTrending:    product.showInTrending    || false,
      showInNewArrivals: product.showInNewArrivals || false,
      images: product.images || [],
      sizes:  product.sizes  || [],
      colors: product.colors || [],
    })
    setShowForm(true)
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className={`${cormorant.className} text-2xl font-semibold text-gray-800`}>
          {showForm ? (editingProduct ? 'Edit Product' : 'Add New Product') : 'Products'}
        </h1>
        {!showForm ? (
          <button onClick={() => { resetForm(); setShowForm(true) }}
            className="flex items-center gap-1.5 text-xs bg-amber-400 text-amber-900 font-semibold px-4 py-2 rounded-lg hover:bg-amber-500 transition-colors">
            <Plus size={14} /> Add Product
          </button>
        ) : (
          <button onClick={resetForm}
            className="flex items-center gap-1.5 text-xs border border-gray-200 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50">
            ← Back to Products
          </button>
        )}
      </div>

      {/* ── Product Form ── */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="col-span-2">
              <label className="text-xs font-semibold text-gray-600 block mb-1">Product Name *</label>
              <input type="text" placeholder="e.g. Jaipuriya Cotton Bedsheet" value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className={inp} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Price (₹) *</label>
              <input type="number" placeholder="1255" value={form.price}
                onChange={e => setForm(p => ({ ...p, price: e.target.value }))} className={inp} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">MRP (₹)</label>
              <input type="number" placeholder="2370" value={form.mrp}
                onChange={e => setForm(p => ({ ...p, mrp: e.target.value }))} className={inp} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Discount (%)</label>
              <input type="number" placeholder="47" value={form.discount}
                onChange={e => setForm(p => ({ ...p, discount: e.target.value }))} className={inp} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Stock *</label>
              <input type="number" placeholder="50" value={form.stock}
                onChange={e => setForm(p => ({ ...p, stock: e.target.value }))} className={inp} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Category</label>
              <select value={form.category}
                onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                className={inp}>
                {dbCategories.length > 0
                  ? dbCategories.map(cat => (
                      <option key={cat._id} value={cat.slug}>{cat.name}</option>
                    ))
                  : ['bedsheets', 'quilts', 'pillows', 'curtains', 'towels'].map(c => (
                      <option key={c} value={c} className="capitalize">{c}</option>
                    ))
                }
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Material</label>
              <input type="text" placeholder="Cotton, Silk, Linen..." value={form.material}
                onChange={e => setForm(p => ({ ...p, material: e.target.value }))} className={inp} />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-semibold text-gray-600 block mb-1">Short Description</label>
              <input type="text" placeholder="Brief 1-line description" value={form.shortDesc}
                onChange={e => setForm(p => ({ ...p, shortDesc: e.target.value }))} className={inp} />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-semibold text-gray-600 block mb-1">Full Description</label>
              <textarea rows={3} placeholder="Detailed product description..." value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                className={`${inp} resize-none`} />
            </div>

            {/* Sizes */}
            <div className="col-span-2">
              <label className="text-xs font-semibold text-gray-600 block mb-2">Sizes / Variants</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.sizes.map((size, i) => (
                  <span key={i} className="flex items-center gap-1 text-xs bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full">
                    {size}
                    <button type="button" onClick={() => setForm(p => ({ ...p, sizes: p.sizes.filter((_, j) => j !== i) }))}
                      className="text-amber-400 hover:text-red-500 ml-0.5 text-base leading-none">×</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="text" placeholder='e.g. Single, Double, King, 90×108"'
                  value={newSize}
                  onChange={e => setNewSize(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && newSize.trim()) {
                      setForm(p => ({ ...p, sizes: [...p.sizes, newSize.trim()] }))
                      setNewSize('')
                    }
                  }}
                  className={`${inp} flex-1`} />
                <button type="button"
                  onClick={() => { if (newSize.trim()) { setForm(p => ({ ...p, sizes: [...p.sizes, newSize.trim()] })); setNewSize('') } }}
                  className="px-3 py-2 bg-amber-400 text-amber-900 text-xs font-semibold rounded-lg hover:bg-amber-500">
                  + Add
                </button>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Press Enter or click Add. E.g: Single, Double, King Size, 60×90, etc.</p>
            </div>

            {/* Colors */}
            <div className="col-span-2">
              <label className="text-xs font-semibold text-gray-600 block mb-2">Colors / Shades</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.colors.map((color, i) => (
                  <span key={i} className="flex items-center gap-1.5 text-xs bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full">
                    <span className="w-3.5 h-3.5 rounded-full border border-gray-300 flex-shrink-0"
                      style={{ backgroundColor: color.hex }} />
                    {color.name}
                    <button type="button"
                      onClick={() => setForm(p => ({ ...p, colors: p.colors.filter((_, j) => j !== i) }))}
                      className="text-gray-400 hover:text-red-500 ml-0.5 text-base leading-none">×</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap">
                <input type="text" placeholder="Color name (e.g. White, Navy Blue)"
                  value={newColorName} onChange={e => setNewColorName(e.target.value)}
                  className={`${inp} flex-1 min-w-[160px]`} />
                <div className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-2 bg-white">
                  <label className="text-[11px] text-gray-400">Hex:</label>
                  <input type="color" value={newColorHex}
                    onChange={e => setNewColorHex(e.target.value)}
                    className="w-8 h-7 cursor-pointer border-0 bg-transparent" />
                  <span className="text-[11px] text-gray-500 font-mono">{newColorHex}</span>
                </div>
                <button type="button"
                  onClick={() => {
                    if (newColorName.trim()) {
                      setForm(p => ({ ...p, colors: [...p.colors, { name: newColorName.trim(), hex: newColorHex }] }))
                      setNewColorName('')
                      setNewColorHex('#AD8F2E')
                    }
                  }}
                  className="px-3 py-2 bg-amber-400 text-amber-900 text-xs font-semibold rounded-lg hover:bg-amber-500">
                  + Add
                </button>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Add color name + pick hex color. Shows as swatches on product page.</p>
            </div>
          </div>

          {/* Image upload */}
          <div className="mb-4">
            <label className="text-xs font-semibold text-gray-600 block mb-2">Product Images (via Cloudinary)</label>
            <div className="flex gap-2 flex-wrap mb-2">
              {form.images.map((img, i) => (
                <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${img}')` }} />
                  <button onClick={() => setForm(p => ({ ...p, images: p.images.filter((_, j) => j !== i) }))}
                    className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[8px]">✕</button>
                </div>
              ))}
              {form.images.length < 4 && (
                <label className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-amber-400 transition-colors flex-shrink-0">
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                  {uploading
                    ? <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                    : <Plus size={18} className="text-gray-400" />
                  }
                </label>
              )}
            </div>
            <p className="text-[11px] text-gray-400">Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in .env.local</p>
          </div>

          {/* Homepage visibility */}
          <div className="mb-4">
            <label className="text-xs font-semibold text-gray-600 block mb-2">Show in Homepage Sections</label>
            <div className="grid grid-cols-2 gap-2 p-3 bg-gray-50 rounded-xl">
              {[
                { key: 'isFeatured',        label: '⭐ Featured / AI Picks' },
                { key: 'showInBestSellers', label: '🏆 Best Sellers section' },
                { key: 'showInTrending',    label: '🔥 Trending section' },
                { key: 'showInNewArrivals', label: '✨ New Arrivals section' },
              ].map(opt => (
                <label key={opt.key} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox"
                    checked={(form as any)[opt.key]}
                    onChange={e => setForm(p => ({ ...p, [opt.key]: e.target.checked }))}
                    className="w-4 h-4 accent-amber-400" />
                  <span className="text-xs text-gray-600">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={handleSubmit} disabled={saving}
              className="flex-1 py-2.5 bg-amber-400 text-amber-900 font-semibold text-sm rounded-lg hover:bg-amber-500 transition-colors disabled:opacity-60">
              {saving ? 'Saving...' : editingProduct ? 'Save Changes' : 'Add Product'}
            </button>
            <button onClick={resetForm}
              className="px-4 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Products Table ── */}
      {!showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : products.length === 0 ? (
            <div className="p-10 text-center text-gray-400">
              <Package size={32} className="mx-auto mb-2 opacity-30" />
              <p>No products yet. Add your first product above.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    {['Product', 'Category', 'Price', 'Stock', 'Status', 'Sections', 'Actions'].map(h => (
                      <th key={h} className="text-left text-[11px] font-semibold text-gray-500 px-5 py-3 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, i) => (
                    <motion.tr key={product._id}
                      custom={i} variants={cardVariants} initial="hidden" animate="visible"
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                            {product.images?.[0] && (
                              <div className="w-full h-full bg-cover bg-center"
                                style={{ backgroundImage: `url('${product.images[0]}')` }} />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-gray-700 line-clamp-1">{product.name}</p>
                            <p className="text-[10px] text-gray-400">{product.material}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-xs text-gray-600 capitalize">{product.category}</td>
                      <td className="px-5 py-3">
                        <p className="text-xs font-bold text-gray-800">₹{product.price?.toLocaleString()}</p>
                        <p className="text-[10px] text-gray-400 line-through">₹{product.mrp?.toLocaleString()}</p>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-xs font-semibold ${product.stock < 10 ? 'text-red-600' : 'text-green-600'}`}>
                          {product.stock} {product.stock < 10 && '⚠️'}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${
                          product.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                        }`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex flex-col gap-0.5">
                          {product.isFeatured        && <span className="text-[10px] text-amber-600">⭐ Featured</span>}
                          {product.showInBestSellers && <span className="text-[10px] text-blue-600">🏆 Bestseller</span>}
                          {product.showInTrending    && <span className="text-[10px] text-orange-600">🔥 Trending</span>}
                          {product.showInNewArrivals && <span className="text-[10px] text-green-600">✨ New</span>}
                          {!product.isFeatured && !product.showInBestSellers && !product.showInTrending && !product.showInNewArrivals && (
                            <span className="text-[10px] text-gray-400">None</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => startEdit(product)}
                            className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 hover:bg-amber-100 transition-colors">
                            <Edit size={12} />
                          </button>
                          <button onClick={() => handleDelete(product._id)}
                            className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-100 transition-colors">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// ORDERS TAB
// ─────────────────────────────────────────────────────────────
function AdminOrdersTab() {
  const [orders,     setOrders]     = useState<any[]>([])
  const [isLoading,  setIsLoading]  = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [activeTab,  setActiveTab]  = useState('All')

  useEffect(() => {
    api.adminGetOrders()
      .then(d => setOrders(d.data))
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  const updateStatus = async (orderId: string, status: string) => {
    setUpdatingId(orderId)
    try {
      const data = await api.adminUpdateOrder(orderId, { status })
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: data.data.status } : o))
    } catch (err: any) {
      alert(err.message || 'Failed to update')
    } finally {
      setUpdatingId(null)
    }
  }

  const tabs    = ['All', 'placed', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled']
  const filtered = orders.filter(o => activeTab === 'All' || o.status === activeTab)

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className={`${cormorant.className} text-2xl font-semibold text-gray-800`}>Orders</h1>
        <p className="text-sm text-gray-500">{orders.length} total orders</p>
      </div>
      <div className="flex gap-1 overflow-x-auto mb-4 bg-white rounded-xl p-1.5 border border-gray-100 shadow-sm">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all capitalize ${
              activeTab === tab ? 'bg-gray-800 text-white' : 'text-gray-500 hover:bg-gray-100'
            }`}>
            {tab} ({tab === 'All' ? orders.length : orders.filter(o => o.status === tab).length})
          </button>
        ))}
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-gray-400">No orders in this category</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  {['Order ID', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', 'Action'].map(h => (
                    <th key={h} className="text-left text-[11px] font-semibold text-gray-500 px-4 py-3 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((order, i) => (
                  <motion.tr key={order._id}
                    custom={i} variants={cardVariants} initial="hidden" animate="visible"
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-xs font-bold text-gray-700">#{order._id?.slice(-8).toUpperCase()}</td>
                    <td className="px-4 py-3">
                      <p className="text-xs font-semibold text-gray-700">{order.user?.name || 'N/A'}</p>
                      <p className="text-[10px] text-gray-400 truncate max-w-[120px]">{order.user?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">{order.items?.length}</td>
                    <td className="px-4 py-3 text-xs font-bold text-gray-800">₹{order.total?.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>{order.paymentStatus}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </td>
                    <td className="px-4 py-3">
                      {nextStatus[order.status] && (
                        <button onClick={() => updateStatus(order._id, nextStatus[order.status])}
                          disabled={updatingId === order._id}
                          className="text-[10px] font-semibold bg-amber-400 text-amber-900 px-2.5 py-1.5 rounded-lg hover:bg-amber-500 disabled:opacity-50 capitalize whitespace-nowrap">
                          {updatingId === order._id ? '...' : `→ ${nextStatus[order.status]}`}
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// CUSTOMERS TAB
// ─────────────────────────────────────────────────────────────
function AdminCustomersTab() {
  const [customers, setCustomers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    api.adminGetOrders()
      .then(d => {
        const map = new Map()
        d.data.forEach((order: any) => {
          if (order.user?._id) {
            const ex = map.get(order.user._id)
            if (ex) { ex.orders++; ex.spent += order.total || 0 }
            else map.set(order.user._id, { ...order.user, orders: 1, spent: order.total || 0 })
          }
        })
        setCustomers(Array.from(map.values()))
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className={`${cormorant.className} text-2xl font-semibold text-gray-800`}>Customers</h1>
        <p className="text-sm text-gray-500">{customers.length} total</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center"><div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : customers.length === 0 ? (
          <div className="p-10 text-center text-gray-400">No customers yet</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                {['Customer', 'Email', 'Orders', 'Total Spent'].map(h => (
                  <th key={h} className="text-left text-[11px] font-semibold text-gray-500 px-5 py-3 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.map((c, i) => (
                <motion.tr key={c._id} custom={i} variants={cardVariants} initial="hidden" animate="visible"
                  className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center">
                        <span className="text-xs font-bold text-amber-700">{c.name?.[0]?.toUpperCase()}</span>
                      </div>
                      <span className="text-xs font-semibold text-gray-700">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs text-gray-500">{c.email}</td>
                  <td className="px-5 py-3 text-xs font-semibold text-gray-700">{c.orders}</td>
                  <td className="px-5 py-3 text-xs font-bold text-gray-800">₹{c.spent?.toLocaleString()}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// ANALYTICS TAB
// ─────────────────────────────────────────────────────────────
function AdminAnalyticsTab() {
  return (
    <div>
      <h1 className={`${cormorant.className} text-2xl font-semibold text-gray-800 mb-6`}>Analytics</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className={`${cormorant.className} text-lg font-semibold text-gray-800 mb-4`}>Monthly Orders</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="orders" fill="#D4AF37" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className={`${cormorant.className} text-lg font-semibold text-gray-800 mb-4`}>Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false}
                tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Revenue']} />
              <Line type="monotone" dataKey="revenue" stroke="#3D2B1F" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={16} className="text-amber-500" />
          <h3 className={`${cormorant.className} text-lg font-semibold text-gray-800`}>AI Insights</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {aiInsights.map((insight, i) => (
            <div key={i} className={`flex gap-3 p-3 rounded-xl border ${
              insight.type === 'warning'     ? 'bg-red-50 border-red-100' :
              insight.type === 'opportunity' ? 'bg-blue-50 border-blue-100' :
              insight.type === 'positive'    ? 'bg-green-50 border-green-100' :
              'bg-amber-50 border-amber-100'
            }`}>
              <span className="text-lg">{insight.icon}</span>
              <p className="text-xs text-gray-700 leading-relaxed">{insight.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// CATEGORIES TAB
// ─────────────────────────────────────────────────────────────
function AdminCategoriesTab() {
  const [categories, setCategories] = useState<any[]>([])
  const [isLoading,  setIsLoading]  = useState(true)
  const [showForm,   setShowForm]   = useState(false)
  const [saving,     setSaving]     = useState(false)
  const [form, setForm] = useState({ name: '', description: '', image: '', order: 0 })

  useEffect(() => {
    api.getCategories()
      .then(d => setCategories(d.data))
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  const handleSave = async () => {
    if (!form.name.trim()) { alert('Category name is required'); return }
    setSaving(true)
    try {
      const data = await api.createCategory(form)
      setCategories(prev => [...prev, data.data])
      setShowForm(false)
      setForm({ name: '', description: '', image: '', order: 0 })
    } catch (err: any) {
      alert(err.message || 'Failed to create category')
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = async (cat: any) => {
    try {
      await api.updateCategory({ id: cat._id, isActive: !cat.isActive })
      setCategories(prev => prev.map(c => c._id === cat._id ? { ...c, isActive: !c.isActive } : c))
    } catch (err: any) { alert(err.message) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return
    try {
      await api.deleteCategory(id)
      setCategories(prev => prev.filter(c => c._id !== id))
    } catch (err: any) { alert(err.message) }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`${cormorant.className} text-2xl font-semibold text-gray-800`}>Categories</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage product categories shown on the website</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 text-xs bg-amber-400 text-amber-900 font-semibold px-4 py-2 rounded-lg hover:bg-amber-500">
          + Add Category
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">New Category</h3>
              <button onClick={() => setShowForm(false)}><X size={18} className="text-gray-400" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Category Name *</label>
                <input type="text" placeholder="e.g. Mattresses" value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className={inp} />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Display Order</label>
                <input type="number" value={form.order}
                  onChange={e => setForm(p => ({ ...p, order: Number(e.target.value) }))} className={inp} />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold text-gray-600 block mb-1">Description</label>
                <input type="text" placeholder="Short description" value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className={inp} />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold text-gray-600 block mb-1">Image URL (optional)</label>
                <input type="text" placeholder="https://..." value={form.image}
                  onChange={e => setForm(p => ({ ...p, image: e.target.value }))} className={inp} />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleSave} disabled={saving}
                className="flex-1 py-2.5 bg-amber-400 text-amber-900 font-semibold text-sm rounded-lg hover:bg-amber-500 disabled:opacity-60">
                {saving ? 'Saving...' : 'Create Category'}
              </button>
              <button onClick={() => setShowForm(false)}
                className="px-4 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="p-8 text-center"><div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" /></div>
      ) : (
        <div className="space-y-3">
          {categories.map((cat, i) => (
            <motion.div key={cat._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                {cat.image
                  ? <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${cat.image}')` }} />
                  : <div className="w-full h-full flex items-center justify-center text-gray-300 text-lg">📦</div>
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold text-gray-700">{cat.name}</p>
                  <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded font-mono">/{cat.slug}</span>
                  <span className="text-[10px] text-gray-400">Order: {cat.order}</span>
                </div>
                <p className="text-xs text-gray-400 truncate">{cat.description || 'No description'}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${
                  cat.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {cat.isActive ? 'Active' : 'Hidden'}
                </span>
                <button onClick={() => handleToggle(cat)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50">
                  {cat.isActive ? 'Hide' : 'Show'}
                </button>
                <button onClick={() => handleDelete(cat._id)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50">
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
          {categories.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
              <p className="mb-2">No categories yet.</p>
              <a href="/api/categories/seed" target="_blank" className="text-amber-600 underline text-xs">
                Click here to seed default categories
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// ATTRIBUTES TAB
// ─────────────────────────────────────────────────────────────
function AdminAttributesTab() {
  const [attributes, setAttributes] = useState<any[]>([])
  const [showForm,   setShowForm]   = useState(false)
  const [saving,     setSaving]     = useState(false)
  const [editingId,  setEditingId]  = useState<string | null>(null)
  const [newValue,   setNewValue]   = useState('')
  const [form, setForm] = useState({ name: '', type: 'text', values: [] as string[] })

  // Load from localStorage (no DB needed for attributes)
  useEffect(() => {
    const saved = localStorage.getItem('ch-attributes')
    if (saved) setAttributes(JSON.parse(saved))
    else {
      // Default attributes
      const defaults = [
        { id: '1', name: 'Size',    type: 'text',  values: ['Single', 'Double', 'King Size', '90×108"', '60×90"'] },
        { id: '2', name: 'Color',   type: 'color', values: ['White', 'Beige', 'Grey', 'Navy Blue', 'Brown'] },
        { id: '3', name: 'Pattern', type: 'text',  values: ['Plain', 'Floral', 'Geometric', 'Striped', 'Checks'] },
        { id: '4', name: 'Weight',  type: 'text',  values: ['200 GSM', '400 GSM', '600 GSM', '800 GSM'] },
        { id: '5', name: 'Thread Count', type: 'text', values: ['180 TC', '210 TC', '300 TC', '400 TC', '600 TC'] },
      ]
      setAttributes(defaults)
      localStorage.setItem('ch-attributes', JSON.stringify(defaults))
    }
  }, [])

  const save = (updated: any[]) => {
    setAttributes(updated)
    localStorage.setItem('ch-attributes', JSON.stringify(updated))
  }

  const handleCreate = () => {
    if (!form.name.trim()) { alert('Attribute name required'); return }
    setSaving(true)
    const newAttr = { id: Date.now().toString(), ...form }
    save([...attributes, newAttr])
    setForm({ name: '', type: 'text', values: [] })
    setShowForm(false)
    setSaving(false)
  }

  const addValue = (attrId: string, value: string) => {
    if (!value.trim()) return
    save(attributes.map(a => a.id === attrId ? { ...a, values: [...a.values, value.trim()] } : a))
  }

  const removeValue = (attrId: string, idx: number) => {
    save(attributes.map(a => a.id === attrId ? { ...a, values: a.values.filter((_: any, i: number) => i !== idx) } : a))
  }

  const deleteAttr = (id: string) => {
    if (!confirm('Delete this attribute?')) return
    save(attributes.filter(a => a.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`${cormorant.className} text-2xl font-semibold text-gray-800`}>Attributes</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage product attributes like Size, Color, Pattern etc.</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 text-xs bg-amber-400 text-amber-900 font-semibold px-4 py-2 rounded-lg hover:bg-amber-500">
          + New Attribute
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">New Attribute</h3>
              <button onClick={() => setShowForm(false)}><X size={18} className="text-gray-400" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Attribute Name *</label>
                <input type="text" placeholder="e.g. Material, Finish, GSM"
                  value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className={inp} />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Type</label>
                <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} className={inp}>
                  <option value="text">Text (shows as buttons)</option>
                  <option value="color">Color (shows as swatches)</option>
                  <option value="number">Number</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleCreate} disabled={saving}
                className="flex-1 py-2.5 bg-amber-400 text-amber-900 font-semibold text-sm rounded-lg hover:bg-amber-500 disabled:opacity-60">
                Create Attribute
              </button>
              <button onClick={() => setShowForm(false)}
                className="px-4 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {attributes.map((attr, i) => (
          <motion.div key={attr.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-800">{attr.name}</h3>
                <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full capitalize">
                  {attr.type}
                </span>
                <span className="text-[10px] text-gray-400">{attr.values.length} values</span>
              </div>
              <button onClick={() => deleteAttr(attr.id)}
                className="text-xs text-red-400 hover:text-red-600 font-semibold">
                Delete
              </button>
            </div>

            {/* Values */}
            <div className="flex flex-wrap gap-2 mb-3">
              {attr.values.map((val: string, j: number) => (
                <span key={j} className="flex items-center gap-1 text-xs bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full">
                  {attr.type === 'color' && (
                    <span className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: val }} />
                  )}
                  {val}
                  <button onClick={() => removeValue(attr.id, j)}
                    className="text-gray-400 hover:text-red-500 text-base leading-none ml-0.5">×</button>
                </span>
              ))}
            </div>

            {/* Add new value */}
            <div className="flex gap-2">
              <input type="text"
                placeholder={`Add new ${attr.name.toLowerCase()} value...`}
                id={`attr-input-${attr.id}`}
                className={`${inp} flex-1 text-xs py-1.5`}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    const input = e.target as HTMLInputElement
                    addValue(attr.id, input.value)
                    input.value = ''
                  }
                }}
              />
              <button
                onClick={() => {
                  const input = document.getElementById(`attr-input-${attr.id}`) as HTMLInputElement
                  if (input) { addValue(attr.id, input.value); input.value = '' }
                }}
                className="px-3 py-1.5 bg-amber-400 text-amber-900 text-xs font-semibold rounded-lg hover:bg-amber-500">
                Add
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-4">
        <h4 className="text-sm font-semibold text-blue-800 mb-2">How Attributes Work</h4>
        <div className="text-xs text-blue-700 space-y-1">
          <p>• <strong>Size</strong> attribute values appear as size buttons on the product page</p>
          <p>• <strong>Color</strong> attribute values appear as color swatches</p>
          <p>• Other attributes appear as selectable options in the product form</p>
          <p>• When adding a product, use the Size and Color fields to pick from these values</p>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────────────────────────────────────
export default function AdminDashboardClient() {
  const { user, isLoggedIn } = useAuthStore()
  const router = useRouter()
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => {
      setAuthChecked(true)
      if (!isLoggedIn || !user) { router.push('/login'); return }
      if (user.role !== 'admin') { router.push('/'); return }
    }, 150)
    return () => clearTimeout(t)
  }, [isLoggedIn, user])

  const [activePage,    setActivePage]    = useState<SidebarKey>('dashboard')
  const [sidebarOpen,   setSidebarOpen]   = useState(true)
  const [notifications, setNotifications] = useState(3)
  const [dbOrders,      setDbOrders]      = useState<any[]>([])
  const [dbProducts,    setDbProducts]    = useState<any[]>([])
  const [statsLoading,  setStatsLoading]  = useState(true)

  useEffect(() => {
    if (!authChecked || !isLoggedIn) return
    Promise.allSettled([api.adminGetOrders(), api.adminGetProducts()])
      .then(([o, p]) => {
        if (o.status === 'fulfilled') setDbOrders(o.value.data || [])
        if (p.status === 'fulfilled') setDbProducts(p.value.data || [])
      })
      .finally(() => setStatsLoading(false))
  }, [authChecked, isLoggedIn])

  if (!authChecked || !isLoggedIn || user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const totalRevenue    = dbOrders.reduce((sum, o) => sum + (o.total || 0), 0)
  const uniqueCustomers = new Set(dbOrders.map(o => o.user?._id)).size

  const stats = [
    { label: 'Total Revenue',  value: `₹${totalRevenue.toLocaleString()}`, change: '+18.2%', up: true, icon: <DollarSign size={20} />,  color: 'bg-green-50 text-green-600' },
    { label: 'Total Orders',   value: dbOrders.length.toString(),           change: '+12.5%', up: true, icon: <ShoppingCart size={20} />, color: 'bg-blue-50 text-blue-600' },
    { label: 'Customers',      value: uniqueCustomers.toString(),           change: '+8.1%',  up: true, icon: <Users size={20} />,        color: 'bg-purple-50 text-purple-600' },
    { label: 'Products',       value: dbProducts.length.toString(),         change: '',       up: true, icon: <Package size={20} />,      color: 'bg-amber-50 text-amber-600' },
  ]

  const sidebarItems: { key: SidebarKey; label: string; icon: React.ReactNode }[] = [
    { key: 'dashboard',  label: 'Dashboard',  icon: <LayoutDashboard size={16} /> },
    { key: 'orders',     label: 'Orders',     icon: <ShoppingBag size={16} /> },
    { key: 'products',   label: 'Products',   icon: <Package size={16} /> },
    { key: 'categories', label: 'Categories', icon: <Tag size={16} /> },
    { key: 'attributes', label: 'Attributes', icon: <Settings size={16} /> },
    { key: 'customers',  label: 'Customers',  icon: <Users size={16} /> },
    { key: 'analytics',  label: 'Analytics',  icon: <TrendingUp size={16} /> },
  ]

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 240 : 64 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="bg-espresso text-ivory flex flex-col h-full flex-shrink-0 overflow-hidden"
      >
        <div className="px-4 py-5 border-b border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gold-warm flex items-center justify-center flex-shrink-0">
            <span className={`${cormorant.className} text-sm font-bold text-espresso`}>CH</span>
          </div>
          {sidebarOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className={`${cormorant.className} text-base font-semibold text-ivory`}>City Handloom</p>
              <p className="text-[10px] text-ivory/50">Admin Panel</p>
            </motion.div>
          )}
        </div>

        <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
          {sidebarItems.map(item => (
            <motion.button
              key={item.key}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActivePage(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                activePage === item.key
                  ? 'bg-gold-warm text-espresso font-semibold'
                  : 'text-ivory/60 hover:bg-white/10 hover:text-ivory'
              }`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </motion.button>
          ))}
        </nav>

        <div className="px-2 pb-4 border-t border-white/10 pt-3 space-y-1">
          <motion.button whileHover={{ x: 4 }}
            onClick={() => router.push('/')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-300 hover:bg-red-900/30 hover:text-red-200 transition-all">
            <LogOut size={16} className="flex-shrink-0" />
            {sidebarOpen && <span>Back to Site</span>}
          </motion.button>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 hover:text-gray-700">
              <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 w-64">
              <Search size={14} className="text-gray-400" />
              <input type="text" placeholder="Search orders, products..."
                className="bg-transparent outline-none text-sm text-gray-600 placeholder:text-gray-400 w-full" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setNotifications(0)}
              className="relative w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200">
              <Bell size={17} />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>
            {/* Admin avatar with dropdown */}
            <div className="relative group flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gold-warm flex items-center justify-center cursor-pointer">
                <span className={`${cormorant.className} text-xs font-bold text-espresso`}>
                  {user?.name?.[0]?.toUpperCase() || 'A'}
                </span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-gray-700">{user?.name || 'Admin'}</p>
                <p className="text-xs text-gray-400">Super Admin</p>
              </div>
              {/* Dropdown */}
              <div className="absolute right-0 top-10 w-44 hidden group-hover:block z-50">
                <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-2">
                  <button onClick={() => router.push('/')}
                    className="block w-full text-left px-3 py-2 text-xs text-gray-600 hover:bg-gray-50 rounded-lg">
                    🏠 View Store
                  </button>
                  <button
                    onClick={async () => {
                      await useAuthStore.getState().logout()
                      router.push('/login')
                    }}
                    className="block w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-50 rounded-lg">
                    🚪 Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto px-6 py-6">
          <AnimatePresence mode="wait">

            {activePage === 'dashboard' && (
              <motion.div key="dashboard"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.25 }}>

                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className={`${cormorant.className} text-2xl font-semibold text-gray-800`}>Dashboard</h1>
                    <p className="text-xs text-gray-500 mt-0.5">Welcome back, {user?.name?.split(' ')[0]}!</p>
                  </div>
                  <button onClick={() => window.location.reload()}
                    className="flex items-center gap-1.5 text-xs text-white bg-gold-warm px-3 py-2 rounded-lg hover:bg-gold-deep transition-colors">
                    <RefreshCw size={13} /> Refresh
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {stats.map((stat, i) => (
                    <motion.div key={stat.label}
                      custom={i} variants={cardVariants} initial="hidden" animate="visible"
                      whileHover={{ y: -4 }}
                      className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                          {stat.icon}
                        </div>
                        {stat.change && (
                          <div className="flex items-center gap-0.5 text-xs font-semibold text-green-600">
                            <ArrowUp size={12} />{stat.change}
                          </div>
                        )}
                      </div>
                      {statsLoading
                        ? <div className="h-7 bg-gray-100 rounded animate-pulse mb-1" />
                        : <p className={`${cormorant.className} text-2xl font-semibold text-gray-800 mb-0.5`}>{stat.value}</p>
                      }
                      <p className="text-xs text-gray-500">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                  <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <h3 className={`${cormorant.className} text-lg font-semibold text-gray-800 mb-4`}>Revenue Overview</h3>
                    <ResponsiveContainer width="100%" height={220}>
                      <AreaChart data={revenueData}>
                        <defs>
                          <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="#D4AF37" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false}
                          tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                        <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Revenue']} />
                        <Area type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={2.5} fill="url(#rev)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <h3 className={`${cormorant.className} text-lg font-semibold text-gray-800 mb-4`}>By Category</h3>
                    <ResponsiveContainer width="100%" height={140}>
                      <PieChart>
                        <Pie data={categoryData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                          {categoryData.map((e, idx) => <Cell key={idx} fill={e.color} />)}
                        </Pie>
                        <Tooltip formatter={(v: number) => [`${v}%`, 'Share']} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-1.5 mt-2">
                      {categoryData.map(cat => (
                        <div key={cat.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                            <span className="text-xs text-gray-600">{cat.name}</span>
                          </div>
                          <span className="text-xs font-semibold text-gray-700">{cat.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* AI Insights */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles size={16} className="text-amber-500" />
                    <h3 className={`${cormorant.className} text-lg font-semibold text-gray-800`}>AI Insights</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {aiInsights.map((insight, i) => (
                      <div key={i} className={`flex gap-3 p-3 rounded-xl border ${
                        insight.type === 'warning'     ? 'bg-red-50 border-red-100' :
                        insight.type === 'opportunity' ? 'bg-blue-50 border-blue-100' :
                        insight.type === 'positive'    ? 'bg-green-50 border-green-100' :
                        'bg-amber-50 border-amber-100'
                      }`}>
                        <span className="text-lg">{insight.icon}</span>
                        <p className="text-xs text-gray-700 leading-relaxed">{insight.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent orders */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <h3 className={`${cormorant.className} text-lg font-semibold text-gray-800`}>Recent Orders</h3>
                    <button onClick={() => setActivePage('orders')}
                      className="text-xs text-amber-600 font-semibold hover:underline">View all →</button>
                  </div>
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        {['Order ID', 'Customer', 'Items', 'Amount', 'Status', 'Date'].map(h => (
                          <th key={h} className="text-left text-[11px] font-semibold text-gray-500 px-5 py-3 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {statsLoading ? (
                        [...Array(3)].map((_, i) => (
                          <tr key={i} className="border-b border-gray-50">
                            <td colSpan={6} className="px-5 py-3">
                              <div className="h-4 bg-gray-100 rounded animate-pulse" />
                            </td>
                          </tr>
                        ))
                      ) : dbOrders.slice(0, 5).map((order, i) => (
                        <motion.tr key={order._id}
                          custom={i} variants={cardVariants} initial="hidden" animate="visible"
                          className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="px-5 py-3 text-xs font-bold text-gray-700">#{order._id?.slice(-8).toUpperCase()}</td>
                          <td className="px-5 py-3 text-xs text-gray-600">{order.user?.name || 'N/A'}</td>
                          <td className="px-5 py-3 text-xs text-gray-600">{order.items?.length}</td>
                          <td className="px-5 py-3 text-xs font-semibold text-gray-800">₹{order.total?.toLocaleString()}</td>
                          <td className="px-5 py-3">
                            <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-xs text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activePage === 'products' && (
              <motion.div key="products"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                <AdminProductsTab />
              </motion.div>
            )}

            {activePage === 'orders' && (
              <motion.div key="orders"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                <AdminOrdersTab />
              </motion.div>
            )}

            {activePage === 'customers' && (
              <motion.div key="customers"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                <AdminCustomersTab />
              </motion.div>
            )}

            {activePage === 'analytics' && (
              <motion.div key="analytics"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                <AdminAnalyticsTab />
              </motion.div>
            )}

            {activePage === 'categories' && (
              <motion.div key="categories"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                <AdminCategoriesTab />
              </motion.div>
            )}

            {activePage === 'attributes' && (
              <motion.div key="attributes"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                <AdminAttributesTab />
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}