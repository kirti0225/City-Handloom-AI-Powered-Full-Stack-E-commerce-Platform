import mongoose, { Schema, Document } from 'mongoose'

export interface IProduct extends Document {
  name: string
  slug: string
  description: string
  shortDesc: string
  price: number
  mrp: number
  discount: number
  category: string
  subCategory?: string
  brand: string
  images: string[]
  sizes: string[]
  colors: { name: string; hex: string }[]
  material: string
  threadCount?: number
  stock: number
  sold: number
  rating: number
  reviewCount: number
  tags: string[]
  isFeatured: boolean
  showInBestSellers: boolean
  showInTrending: boolean
  showInNewArrivals: boolean
  isActive: boolean
  aiDescription?: string
  createdAt: Date
  updatedAt: Date
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, required: true },
  shortDesc: { type: String, required: true },
  price: { type: Number, required: true },
  mrp: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  category: { type: String, required: true, enum: ['bedsheets', 'quilts', 'pillows', 'curtains', 'towels'] },
  subCategory: { type: String },
  brand: { type: String, default: 'City Handloom' },
  images: [{ type: String }],
  sizes: [{ type: String }],
  colors: [{ name: String, hex: String }],
  material: { type: String, required: true },
  threadCount: { type: Number },
  stock: { type: Number, default: 0 },
  sold: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  tags: [{ type: String }],
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  aiDescription: { type: String },
  showInBestSellers: { type: Boolean, default: false },
showInTrending:    { type: Boolean, default: false },
showInNewArrivals: { type: Boolean, default: false },
}, { timestamps: true })

ProductSchema.index({ name: 'text', description: 'text', tags: 'text' })
ProductSchema.index({ category: 1, price: 1 })


export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema)