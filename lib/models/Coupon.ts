import mongoose, { Schema, Document } from 'mongoose'

export interface ICoupon extends Document {
  code: string
  type: 'percentage' | 'fixed'
  value: number
  minOrder: number
  maxDiscount?: number
  usageLimit: number
  usedCount: number
  isActive: boolean
  expiresAt: Date
}

const CouponSchema = new Schema<ICoupon>({
  code: { type: String, required: true, unique: true, uppercase: true },
  type: { type: String, enum: ['percentage', 'fixed'], required: true },
  value: { type: Number, required: true },
  minOrder: { type: Number, default: 0 },
  maxDiscount: { type: Number },
  usageLimit: { type: Number, default: 100 },
  usedCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  expiresAt: { type: Date, required: true },
}, { timestamps: true })

export default mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', CouponSchema)