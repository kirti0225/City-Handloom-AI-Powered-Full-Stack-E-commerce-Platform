'use client'
import { useState, useEffect } from 'react'
import HorizontalProductSection from '@/components/ui/HorizontalProductSection'
import { api } from '@/lib/api'

export default function BestHomeAccessories() {
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    api.getProducts({ sortBy: 'createdAt', sortOrder: 'desc', limit: '10' })
      .then(d => setProducts(d.data.products || []))
      .catch(() => {})
  }, [])

  return (
    <HorizontalProductSection
      title="Best Home Accessories"
      viewAllHref="/products"
      products={products}
      bg="#fff"
    />
  )
}