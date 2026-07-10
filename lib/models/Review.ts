import mongoose, { Schema, Document } from 'mongoose'

export interface IReview extends Document {
  product: mongoose.Types.ObjectId
  user: mongoose.Types.ObjectId
  order: mongoose.Types.ObjectId
  rating: number
  title: string
  body: string
  images: string[]
  isVerified: boolean
  helpful: number
  createdAt: Date
}

const ReviewSchema = new Schema<IReview>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, required: true },
  body: { type: String, required: true },
  images: [{ type: String }],
  isVerified: { type: Boolean, default: false },
  helpful: { type: Number, default: 0 },
}, { timestamps: true })

ReviewSchema.index({ product: 1, user: 1 }, { unique: true })

export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema)