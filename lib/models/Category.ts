import mongoose, { Schema, Document } from 'mongoose'

export interface ICategory extends Document {
  name: string
  slug: string
  description: string
  image: string
  isActive: boolean
  order: number
}

const CategorySchema = new Schema<ICategory>({
  name:        { type: String, required: true },
  slug:        { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  image:       { type: String, default: '' },
  isActive:    { type: Boolean, default: true },
  order:       { type: Number, default: 0 },
}, { timestamps: true })

// --- THE FIX ---
// Force TypeScript to map the existing Next.js model cache directly to your ICategory blueprint
const Category = (mongoose.models.Category as mongoose.Model<ICategory>) || mongoose.model<ICategory>('Category', CategorySchema);

export default Category;