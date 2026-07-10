'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cormorant_Garamond } from 'next/font/google'
import {
  User, Package, Heart, MapPin, Settings,
  ChevronRight, Trash2, Plus, Check, X,
  LogOut, ShoppingBag,
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/store/authStore'
import { useRouter } from 'next/navigation'

const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })
const SPRING = { type: 'spring' as const, stiffness: 80, damping: 14 }

const sidebarItems = [
  { key: 'overview',  label: 'My Account',  icon: <User size={16} /> },
  { key: 'orders',    label: 'My Orders',   icon: <Package size={16} /> },
  { key: 'wishlist',  label: 'Wishlist',    icon: <Heart size={16} /> },
  { key: 'addresses', label: 'Addresses',   icon: <MapPin size={16} /> },
  { key: 'profile',   label: 'Profile',     icon: <Settings size={16} /> },
]

interface Address {
  _id: string
  label: string
  name: string
  phone: string
  address: string
  city: string
  state: string
  pin: string
  isDefault: boolean
}

export default function AccountPageClient() {
  const [activeTab,      setActiveTab]      = useState('overview')
  const [userData,       setUserData]       = useState<any>(null)
  const [orders,         setOrders]         = useState<any[]>([])
  const [addresses,      setAddresses]      = useState<Address[]>([])
  const [isLoading,      setIsLoading]      = useState(true)
  const [profileForm,    setProfileForm]    = useState({ name: '', phone: '' })
  const [profileSaving,  setProfileSaving]  = useState(false)
  const [profileSaved,   setProfileSaved]   = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [addressForm,    setAddressForm]    = useState({
    label: 'Home', name: '', phone: '',
    address: '', city: '', state: '', pin: '',
    isDefault: false,
  })

  const { user, isLoggedIn, logout } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    // Redirect if not logged in
    if (!isLoggedIn || !user) {
      router.push('/login')
      return
    }

    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch in parallel — each call is independent
        const results = await Promise.allSettled([
          api.getProfile(),
          api.getOrders(),
          api.getAddresses(),
        ])

        // Profile
        if (results[0].status === 'fulfilled') {
          const profileData = results[0].value.data
          setUserData(profileData)
          setProfileForm({
            name:  profileData.name  || '',
            phone: profileData.phone || '',
          })
        }

        // Orders
        if (results[1].status === 'fulfilled') {
          setOrders(results[1].value.data || [])
        }

        // Addresses
        if (results[2].status === 'fulfilled') {
          setAddresses(results[2].value.data || [])
        }

      } catch (err) {
        console.error('Account fetch error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user, isLoggedIn])

  const handleProfileSave = async () => {
    setProfileSaving(true)
    try {
      const data = await api.updateProfile(profileForm)
      setUserData(data.data)
      setProfileSaved(true)
      setTimeout(() => setProfileSaved(false), 2500)
    } catch (err: any) {
      alert(err.message || 'Failed to update profile')
    } finally {
      setProfileSaving(false)
    }
  }

  const handleAddAddress = async () => {
    if (!addressForm.name || !addressForm.phone || !addressForm.address || !addressForm.city || !addressForm.pin) {
      alert('Please fill all required fields')
      return
    }
    try {
      const data = await api.addAddress(addressForm)
      setAddresses(data.data)
      setShowAddressForm(false)
      setAddressForm({
        label: 'Home', name: '', phone: '',
        address: '', city: '', state: '', pin: '',
        isDefault: false,
      })
    } catch (err: any) {
      alert(err.message || 'Failed to add address')
    }
  }

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Remove this address?')) return
    try {
      const data = await api.deleteAddress(addressId)
      setAddresses(data.data)
    } catch (err: any) {
      alert(err.message || 'Failed to remove address')
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  const inputClass = 'w-full border border-mocha/15 rounded-xl px-4 py-3 text-sm font-body outline-none focus:border-gold-warm transition-colors bg-white'

  // Loading state
  if (isLoading) {
    return (
      <main className="bg-ivory min-h-screen">
        <Navbar />
        <div className="pt-32 flex items-center justify-center min-h-[60vh]">
          <div className="w-10 h-10 border-2 border-gold-warm border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="bg-ivory min-h-screen">
      <Navbar />

      <div className="pt-28 md:pt-32 px-4 md:px-8 lg:px-16 pb-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">

          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={SPRING}
            className="h-fit"
          >
            {/* User card */}
            <div className="bg-white rounded-2xl p-5 border border-petal/60 shadow-sm mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gold-warm flex items-center justify-center">
                  <span className={`${cormorant.className} text-xl font-semibold text-espresso`}>
                    {(userData?.name || user?.name || 'U')[0].toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-mocha font-body truncate">
                    {userData?.name || user?.name}
                  </p>
                  <p className="text-xs text-mocha/50 font-body truncate">
                    {userData?.email || user?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Nav */}
            <div className="bg-white rounded-2xl border border-petal/60 shadow-sm overflow-hidden">
              {sidebarItems.map((item, i) => (
                <motion.button
                  key={item.key}
                  whileHover={{ x: 4 }}
                  onClick={() => {
                    if (item.key === 'orders')   { router.push('/orders');   return }
                    if (item.key === 'wishlist')  { router.push('/wishlist'); return }
                    setActiveTab(item.key)
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm font-body transition-colors ${
                    i < sidebarItems.length - 1 ? 'border-b border-petal/40' : ''
                  } ${activeTab === item.key
                    ? 'bg-petal/40 text-mocha font-semibold'
                    : 'text-mocha/70 hover:bg-petal/20'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-gold-deep">{item.icon}</span>
                    {item.label}
                  </div>
                  <ChevronRight size={14} className="text-mocha/30" />
                </motion.button>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-body text-red-400 hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </motion.aside>

          {/* Main content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={SPRING}
          >

            {/* Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-5">
                <h1 className={`${cormorant.className} text-2xl font-semibold text-mocha`}>
                  Welcome back, {(userData?.name || user?.name || '').split(' ')[0]}!
                </h1>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { label: 'Total Orders',   value: orders.length,                                         icon: <ShoppingBag size={20} />, color: 'bg-blue-50 text-blue-600' },
                    { label: 'Delivered',      value: orders.filter(o => o.status === 'delivered').length,   icon: <Check size={20} />,        color: 'bg-green-50 text-green-600' },
                    { label: 'Saved Addresses', value: addresses.length,                                    icon: <MapPin size={20} />,       color: 'bg-amber-50 text-amber-600' },
                  ].map(stat => (
                    <div key={stat.label} className="bg-white rounded-2xl border border-petal/60 shadow-sm p-5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
                        {stat.icon}
                      </div>
                      <p className={`${cormorant.className} text-2xl font-semibold text-mocha`}>{stat.value}</p>
                      <p className="text-xs text-mocha/50 font-body">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Recent orders */}
                <div className="bg-white rounded-2xl border border-petal/60 shadow-sm p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`${cormorant.className} text-lg font-semibold text-mocha`}>Recent Orders</h3>
                    <button onClick={() => router.push('/orders')}
                      className="text-xs text-gold-deep font-body hover:underline">
                      View all →
                    </button>
                  </div>
                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingBag size={28} className="text-mocha/20 mx-auto mb-2" />
                      <p className="text-sm text-mocha/40 font-body">No orders yet</p>
                      <Link href="/products">
                        <button className="mt-3 text-xs text-gold-deep font-body hover:underline">
                          Start Shopping →
                        </button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.slice(0, 3).map(order => (
                        <div key={order._id} className="flex items-center justify-between py-2 border-b border-petal/40 last:border-0">
                          <div>
                            <p className="text-xs font-semibold text-mocha font-body">
                              #{order._id?.slice(-8).toUpperCase()}
                            </p>
                            <p className="text-[11px] text-mocha/50 font-body">
                              {order.items?.length} item{order.items?.length > 1 ? 's' : ''} ·{' '}
                              {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-semibold font-body px-2 py-0.5 rounded-full capitalize ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                              order.status === 'shipped'   ? 'bg-amber-100 text-amber-700' :
                              order.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {order.status}
                            </span>
                            <span className={`${cormorant.className} text-sm font-semibold text-mocha`}>
                              ₹{order.total?.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Addresses */}
            {activeTab === 'addresses' && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className={`${cormorant.className} text-2xl font-semibold text-mocha`}>
                    Saved Addresses
                  </h2>
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setShowAddressForm(true)}
                    className="flex items-center gap-1.5 text-xs font-semibold font-body bg-gold-warm text-espresso px-4 py-2 rounded-full hover:bg-gold-deep transition-colors">
                    <Plus size={13} /> Add New Address
                  </motion.button>
                </div>

                {addresses.length === 0 && !showAddressForm ? (
                  <div className="bg-white rounded-2xl border border-petal/60 p-10 text-center">
                    <MapPin size={32} className="text-mocha/20 mx-auto mb-3" />
                    <p className={`${cormorant.className} text-xl text-mocha/40`}>No saved addresses</p>
                    <p className="text-sm text-mocha/40 font-body mt-1">Add an address for faster checkout</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map(addr => (
                      <div key={addr._id} className="bg-white rounded-2xl border border-petal/60 shadow-sm p-5 relative">
                        {addr.isDefault && (
                          <span className="absolute top-3 right-3 text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full font-body">
                            Default
                          </span>
                        )}
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin size={14} className="text-gold-deep" />
                          <span className="text-xs font-bold text-mocha font-body">{addr.label}</span>
                        </div>
                        <p className="text-sm font-semibold text-mocha font-body">{addr.name}</p>
                        <p className="text-xs text-mocha/60 font-body leading-relaxed">
                          {addr.address}, {addr.city}<br />
                          {addr.state} — {addr.pin}<br />
                          {addr.phone}
                        </p>
                        <button
                          onClick={() => handleDeleteAddress(addr._id)}
                          className="flex items-center gap-1 text-xs text-red-400 font-body hover:text-red-600 mt-3 transition-colors"
                        >
                          <Trash2 size={12} /> Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add address form */}
                <AnimatePresence>
                  {showAddressForm && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-white rounded-2xl border border-petal/60 shadow-sm p-5 mt-4"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className={`${cormorant.className} text-lg font-semibold text-mocha`}>Add New Address</h3>
                        <button onClick={() => setShowAddressForm(false)}>
                          <X size={18} className="text-mocha/40 hover:text-mocha" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="text-xs font-semibold text-mocha/70 font-body block mb-1.5">Label</label>
                          <select value={addressForm.label}
                            onChange={e => setAddressForm(p => ({ ...p, label: e.target.value }))}
                            className={inputClass}>
                            <option>Home</option>
                            <option>Work</option>
                            <option>Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-mocha/70 font-body block mb-1.5">Full Name</label>
                          <input type="text" placeholder="Full name"
                            value={addressForm.name}
                            onChange={e => setAddressForm(p => ({ ...p, name: e.target.value }))}
                            className={inputClass} />
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="text-xs font-semibold text-mocha/70 font-body block mb-1.5">Phone</label>
                        <input type="tel" placeholder="Phone number"
                          value={addressForm.phone}
                          onChange={e => setAddressForm(p => ({ ...p, phone: e.target.value }))}
                          className={inputClass} />
                      </div>
                      <div className="mb-3">
                        <label className="text-xs font-semibold text-mocha/70 font-body block mb-1.5">Address</label>
                        <input type="text" placeholder="Street address, flat no."
                          value={addressForm.address}
                          onChange={e => setAddressForm(p => ({ ...p, address: e.target.value }))}
                          className={inputClass} />
                      </div>
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div>
                          <label className="text-xs font-semibold text-mocha/70 font-body block mb-1.5">City</label>
                          <input type="text" placeholder="City"
                            value={addressForm.city}
                            onChange={e => setAddressForm(p => ({ ...p, city: e.target.value }))}
                            className={inputClass} />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-mocha/70 font-body block mb-1.5">State</label>
                          <input type="text" placeholder="State"
                            value={addressForm.state}
                            onChange={e => setAddressForm(p => ({ ...p, state: e.target.value }))}
                            className={inputClass} />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-mocha/70 font-body block mb-1.5">PIN</label>
                          <input type="text" placeholder="PIN code"
                            value={addressForm.pin}
                            onChange={e => setAddressForm(p => ({ ...p, pin: e.target.value }))}
                            className={inputClass} />
                        </div>
                      </div>
                      <label className="flex items-center gap-2.5 cursor-pointer mb-4">
                        <input type="checkbox" checked={addressForm.isDefault}
                          onChange={e => setAddressForm(p => ({ ...p, isDefault: e.target.checked }))}
                          className="w-4 h-4 accent-gold-warm" />
                        <span className="text-xs text-mocha/70 font-body">Set as default address</span>
                      </label>
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        onClick={handleAddAddress}
                        className="w-full py-3 bg-gold-warm text-espresso font-semibold text-sm font-body rounded-full hover:bg-gold-deep transition-colors">
                        Save Address
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Profile settings */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl border border-petal/60 shadow-sm p-6">
                <h2 className={`${cormorant.className} text-2xl font-semibold text-mocha mb-6`}>
                  Profile Settings
                </h2>
                <div className="max-w-md space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-mocha/70 font-body block mb-1.5">Full Name</label>
                    <input type="text" value={profileForm.name}
                      onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))}
                      className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-mocha/70 font-body block mb-1.5">Email</label>
                    <input type="email" value={userData?.email || user?.email || ''}
                      disabled className={`${inputClass} bg-petal/20 text-mocha/50 cursor-not-allowed`} />
                    <p className="text-[11px] text-mocha/40 font-body mt-1">Email cannot be changed</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-mocha/70 font-body block mb-1.5">Phone Number</label>
                    <input type="tel" value={profileForm.phone}
                      onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                      placeholder="+91 98765 43210"
                      className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-mocha/70 font-body block mb-1.5">Member Since</label>
                    <input type="text"
                      value={userData?.createdAt
                        ? new Date(userData.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
                        : '—'}
                      disabled className={`${inputClass} bg-petal/20 text-mocha/50 cursor-not-allowed`} />
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={handleProfileSave} disabled={profileSaving}
                    className={`w-full py-3 font-semibold text-sm font-body rounded-full transition-colors flex items-center justify-center gap-2 ${
                      profileSaved
                        ? 'bg-green-500 text-white'
                        : 'bg-gold-warm text-espresso hover:bg-gold-deep'
                    } disabled:opacity-60`}>
                    {profileSaving ? 'Saving...' : profileSaved ? <><Check size={16} /> Saved!</> : 'Save Changes'}
                  </motion.button>
                </div>
              </div>
            )}

          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  )
}