import connectDB from '@/lib/mongodb'
import Product from '@/lib/models/Product'
import User from '@/lib/models/User'
import { successResponse, errorResponse } from '@/lib/utils/apiResponse'
import bcrypt from 'bcryptjs'

const products = [
  {
    name: 'Jaipuriya Cotton Bedsheet',
    slug: 'jaipuriya-cotton-bedsheet',
    description: 'Pure cotton handloom bedsheet crafted by skilled artisans in Kanpur. Features 186 thread count with natural breathability perfect for Indian climate. Comes with 2 matching pillow covers.',
    shortDesc: 'Pure cotton handloom bedsheet, 186 TC, soft and breathable',
    price: 1255,
    mrp: 2370,
    discount: 47,
    category: 'bedsheets',
    brand: 'City Handloom',
    images: ['/images/product-1.jpg', '/images/product-2.jpg'],
    sizes: ['Single (60x90)', 'Double (90x108)', 'Queen (90x108)', 'King (108x108)'],
    colors: [
      { name: 'Mint Green', hex: '#98D8C8' },
      { name: 'Ocean Blue', hex: '#4A90D9' },
      { name: 'Rose Pink', hex: '#F4A7B9' },
      { name: 'Ivory White', hex: '#FFFFF0' },
    ],
    material: 'Cotton',
    threadCount: 186,
    stock: 48,
    sold: 245,
    rating: 4.7,
    reviewCount: 128,
    tags: ['bedsheet', 'cotton', 'handloom', 'jaipuriya', 'double bed'],
    isFeatured: true,
    isActive: true,
  },
  {
    name: 'Royal Cotton Quilt King Size',
    slug: 'royal-cotton-quilt-king-size',
    description: 'Handcrafted quilt with traditional embroidery patterns. Made from 100% pure cotton with a soft inner fill. Perfect for all seasons — breathable in summer, warm in winter.',
    shortDesc: 'Handcrafted quilt with traditional embroidery, king size',
    price: 1299,
    mrp: 1799,
    discount: 28,
    category: 'quilts',
    brand: 'City Handloom',
    images: ['/images/product-2.jpg', '/images/product-3.jpg'],
    sizes: ['Single', 'Double', 'King'],
    colors: [
      { name: 'Ivory White', hex: '#FFFFF0' },
      { name: 'Beige', hex: '#F5F5DC' },
      { name: 'Dusty Rose', hex: '#DCAE96' },
    ],
    material: 'Cotton',
    stock: 23,
    sold: 182,
    rating: 4.5,
    reviewCount: 64,
    tags: ['quilt', 'cotton', 'handloom', 'king size', 'embroidery'],
    isFeatured: true,
    isActive: true,
  },
  {
    name: 'Handloom Curtain Set 5ft',
    slug: 'handloom-curtain-set-5ft',
    description: 'Elegant handwoven curtains in natural linen fibers. Set of 2 panels with rod pocket header. Provides excellent light filtering while maintaining privacy.',
    shortDesc: 'Woven curtains in natural fibers, set of 2 panels',
    price: 899,
    mrp: 1499,
    discount: 40,
    category: 'curtains',
    brand: 'City Handloom',
    images: ['/images/product-3.jpg', '/images/product-4.jpg'],
    sizes: ['4ft', '5ft', '7ft', '9ft'],
    colors: [
      { name: 'Dusty Rose', hex: '#DCAE96' },
      { name: 'Sage Green', hex: '#B2C5A8' },
      { name: 'Natural Beige', hex: '#F5F0E8' },
    ],
    material: 'Linen',
    stock: 67,
    sold: 156,
    rating: 4.2,
    reviewCount: 45,
    tags: ['curtains', 'linen', 'handloom', 'window', 'home decor'],
    isFeatured: false,
    isActive: true,
  },
  {
    name: 'Silk Pillow Cover Set of 2',
    slug: 'silk-pillow-cover-set-of-2',
    description: 'Premium silk-blend pillow covers with ultra-soft finish. Zip closure for easy removal. Hypoallergenic and skin-friendly. Perfect for a luxurious sleep experience.',
    shortDesc: 'Premium silk-blend pillow covers, set of 2, ultra-soft',
    price: 449,
    mrp: 599,
    discount: 25,
    category: 'pillows',
    brand: 'City Handloom',
    images: ['/images/product-4.jpg', '/images/product-1.jpg'],
    sizes: ['Standard (17x27)', 'King (20x36)'],
    colors: [
      { name: 'Dusty Rose', hex: '#DCAE96' },
      { name: 'Ivory', hex: '#FFFFF0' },
      { name: 'Gold', hex: '#D4AF37' },
    ],
    material: 'Silk',
    stock: 15,
    sold: 312,
    rating: 4.6,
    reviewCount: 212,
    tags: ['pillow cover', 'silk', 'luxury', 'soft', 'set of 2'],
    isFeatured: true,
    isActive: true,
  },
  {
    name: 'Cotton Bath Towel 600 GSM',
    slug: 'cotton-bath-towel-600-gsm',
    description: 'Ultra-soft absorbent bath towel made from 100% long-staple cotton. 600 GSM ensures maximum absorption. Quick-dry technology keeps it fresh between uses.',
    shortDesc: 'Ultra-soft absorbent bath towel, premium 600 GSM cotton',
    price: 399,
    mrp: 599,
    discount: 33,
    category: 'towels',
    brand: 'City Handloom',
    images: ['/images/product-2.jpg', '/images/product-3.jpg'],
    sizes: ['Hand Towel', 'Face Towel', 'Bath Towel', 'Bath Sheet'],
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Grey', hex: '#808080' },
      { name: 'Navy Blue', hex: '#000080' },
    ],
    material: 'Cotton',
    stock: 92,
    sold: 428,
    rating: 4.8,
    reviewCount: 342,
    tags: ['towel', 'cotton', '600 gsm', 'bath', 'absorbent'],
    isFeatured: false,
    isActive: true,
  },
  {
    name: 'Floral King Size Bedsheet',
    slug: 'floral-king-size-bedsheet',
    description: 'Beautiful floral printed king size bedsheet in 100% pure cotton. Hand-block printed using traditional Rajasthani techniques. Vibrant colors that stay bright wash after wash.',
    shortDesc: 'King size floral printed pure cotton bedsheet',
    price: 1399,
    mrp: 2199,
    discount: 36,
    category: 'bedsheets',
    brand: 'City Handloom',
    images: ['/images/product-3.jpg', '/images/product-4.jpg'],
    sizes: ['King (108x108)', 'Super King (120x120)'],
    colors: [
      { name: 'Peach', hex: '#FFCBA4' },
      { name: 'Mint', hex: '#98D8C8' },
      { name: 'Lavender', hex: '#E6E6FA' },
    ],
    material: 'Cotton',
    threadCount: 200,
    stock: 34,
    sold: 98,
    rating: 4.4,
    reviewCount: 156,
    tags: ['bedsheet', 'floral', 'king size', 'block print', 'rajasthani'],
    isFeatured: false,
    isActive: true,
  },
  {
    name: 'Blackout Curtains 7ft',
    slug: 'blackout-curtains-7ft',
    description: 'Heavy duty blackout curtains that block 99% of light. Perfect for bedrooms, home theaters, and nurseries. Machine washable with rod pocket header.',
    shortDesc: 'Heavy blackout curtains for bedroom privacy, machine washable',
    price: 1299,
    mrp: 1999,
    discount: 35,
    category: 'curtains',
    brand: 'City Handloom',
    images: ['/images/product-1.jpg', '/images/product-2.jpg'],
    sizes: ['5ft', '7ft', '9ft'],
    colors: [
      { name: 'Charcoal Grey', hex: '#36454F' },
      { name: 'Navy Blue', hex: '#000080' },
      { name: 'Dark Brown', hex: '#3D2B1F' },
    ],
    material: 'Polyester',
    stock: 41,
    sold: 87,
    rating: 4.1,
    reviewCount: 78,
    tags: ['curtains', 'blackout', 'bedroom', 'heavy', '7ft'],
    isFeatured: false,
    isActive: true,
  },
  {
    name: 'Winter Warm Quilt Double',
    slug: 'winter-warm-quilt-double',
    description: 'Double layer winter quilt with extra warmth for cold nights. Traditional kantha stitch pattern by Bengal artisans. Reversible design — two looks in one quilt.',
    shortDesc: 'Double layer winter quilt, kantha stitch, extra warmth',
    price: 1899,
    mrp: 2999,
    discount: 37,
    category: 'quilts',
    brand: 'City Handloom',
    images: ['/images/product-4.jpg', '/images/product-1.jpg'],
    sizes: ['Single', 'Double', 'King'],
    colors: [
      { name: 'Indigo Blue', hex: '#4B0082' },
      { name: 'Brick Red', hex: '#CB4154' },
      { name: 'Forest Green', hex: '#228B22' },
    ],
    material: 'Cotton',
    stock: 28,
    sold: 134,
    rating: 4.3,
    reviewCount: 91,
    tags: ['quilt', 'winter', 'kantha', 'warm', 'double'],
    isFeatured: false,
    isActive: true,
  },
]

export async function GET() {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
      return errorResponse('Seeding not allowed in production', 403)
    }

    await connectDB()

    // Clear existing data
    await Product.deleteMany({})
    await User.deleteMany({})

    // Insert products
await Product.insertMany(products as any)
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12)
    await User.create({
      name: 'Admin',
      email: 'admin@cityhandloom.com',
      password: hashedPassword,
      role: 'admin',
      isVerified: true,
    })

    // Create test customer
    const customerPassword = await bcrypt.hash('customer123', 12)
    await User.create({
      name: 'Kirti Singh',
      email: 'kirti@gmail.com',
      password: customerPassword,
      phone: '+919876543210',
      role: 'customer',
      isVerified: true,
    })

    return successResponse({
      products: products.length,
      users: 2,
    }, `Database seeded! ${products.length} products + 2 users created.`)
  } catch (error: any) {
    return errorResponse(`Seed failed: ${error.message}`, 500)
  }
}
