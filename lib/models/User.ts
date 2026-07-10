import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role: 'customer' | 'admin';
  avatar?: string;
  googleId?: string;
  isVerified: boolean;
  otp?: string;
  otpExpiry?: Date;
  resetToken?: string;        // Moved to root level
  resetTokenExpiry?: Date;    // Moved to root level
  addresses: {
    _id?: mongoose.Types.ObjectId;
    label: string;
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pin: string;
    isDefault: boolean;
  }[];
  wishlist: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String },
  password: { type: String, select: false },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  avatar: { type: String },
  googleId: { type: String },
  isVerified: { type: Boolean, default: false },
  otp: { type: String, select: false },
  otpExpiry: { type: Date, select: false },
  resetToken: { type: String },       // Correctly placed at root
  resetTokenExpiry: { type: Date },   // Correctly placed at root
  addresses: [{
    label: { type: String, default: 'Home' },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pin: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  }],
  wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
}, { timestamps: true });

// --- THE FIX ---
// Force TypeScript to recognize the model type properly during the Next.js cache check
const User = (mongoose.models.User as mongoose.Model<IUser>) || mongoose.model<IUser>('User', UserSchema);

export default User;