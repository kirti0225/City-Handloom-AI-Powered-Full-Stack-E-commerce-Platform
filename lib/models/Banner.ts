import mongoose, { Schema, Document } from 'mongoose'

export interface IBanner extends Document {
  section: string
  title: string
  subtitle: string
  image: string
  link: string
  isActive: boolean
  order: number
}

const BannerSchema = new Schema<IBanner>({
  section: { type: String, required: true }, // 'hero', 'gif', 'category'
  title: { type: String },
  subtitle: { type: String },
  image: { type: String, required: true },
  link: { type: String },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true })

export default mongoose.models.Banner || mongoose.model<IBanner>('Banner', BannerSchema)