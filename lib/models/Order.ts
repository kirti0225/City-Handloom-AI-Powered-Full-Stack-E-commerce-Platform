import mongoose, { Schema, Document } from 'mongoose'

export interface IOrderItem {
  product: mongoose.Types.ObjectId
  name: string
  image: string
  price: number
  qty: number
  size: string
  color: string
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId
  items: IOrderItem[]
  shippingAddress: {
    name: string
    phone: string
    address: string
    city: string
    state: string
    pin: string
  }
  paymentMethod: 'razorpay' | 'cod'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  razorpayOrderId?: string
  razorpayPaymentId?: string
  razorpaySignature?: string
  subtotal: number
  discount: number
  deliveryFee: number
  total: number
  couponCode?: string
  status: 'placed' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled' | 'return_requested' | 'returned'
  trackingNumber?: string
  courier?: string
  estimatedDelivery?: Date
  deliveredAt?: Date
  cancelReason?: string
  returnReason?: string
  createdAt: Date
  updatedAt: Date
}

const OrderSchema = new Schema<IOrder>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    image: String,
    price: Number,
    qty: Number,
    size: String,
    color: String,
  }],
  shippingAddress: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pin: { type: String, required: true },
  },
  paymentMethod: { type: String, enum: ['razorpay', 'cod'], required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 0 },
  total: { type: Number, required: true },
  couponCode: String,
  status: {
    type: String,
    enum: ['placed', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled', 'return_requested', 'returned'],
    default: 'placed',
  },
  trackingNumber: String,
  courier: String,
  estimatedDelivery: Date,
  deliveredAt: Date,
  cancelReason: String,
  returnReason: String,
}, { timestamps: true })

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema)