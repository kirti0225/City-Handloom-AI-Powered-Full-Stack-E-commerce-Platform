import PolicyLayout from '@/components/policy/PolicyLayout'

export default function ShippingPolicyPage() {
  return (
    <PolicyLayout
      title="Shipping Policy"
      lastUpdated="June 1, 2026"
      intro="City Handloom delivers across India with reliable courier partners. We are committed to getting your order to you safely and on time. Here's everything you need to know about our shipping process."
      sections={[
        {
          title: 'Processing Time',
          content: [
            'Orders are processed within 1-2 business days after payment confirmation.',
            'Orders placed on weekends or public holidays are processed the next business day.',
            'You will receive an order confirmation email immediately after placing an order.',
            'A shipping confirmation with tracking details is sent once your order is dispatched.',
          ],
        },
        {
          title: 'Delivery Time',
          content: [
            'Standard Delivery: 5-7 business days across India.',
            'Express Delivery: 1-2 business days (available for select pin codes at ₹199 extra).',
            'Metro cities (Delhi, Mumbai, Bengaluru, Chennai): 3-4 business days.',
            'Tier-2 and Tier-3 cities: 5-7 business days.',
            'Remote locations: 7-10 business days.',
          ],
        },
        {
          title: 'Shipping Charges',
          content: [
            'Free shipping on all orders above ₹999.',
            'Standard shipping: ₹99 for orders below ₹999.',
            'Express shipping: ₹199 (available at checkout for eligible pin codes).',
            'COD (Cash on Delivery): Additional ₹49 handling charge.',
            'Shipping charges are non-refundable unless the item is defective.',
          ],
        },
        {
          title: 'Courier Partners',
          content: [
            'Delhivery — primary courier partner for most locations.',
            'BlueDart — used for express deliveries and select pin codes.',
            'DTDC — alternate partner for specific regions.',
            'India Post — for remote and rural locations.',
            'Courier partner is assigned automatically based on your location.',
          ],
        },
        {
          title: 'Order Tracking',
          content: [
            'A tracking number is shared via email and SMS once your order is shipped.',
            'Track your order at cityhandloom.com/track or on the courier partner\'s website.',
            'Tracking updates may take 24 hours to reflect after dispatch.',
            'For real-time tracking, use your AWB number on the courier\'s official website.',
          ],
        },
        {
          title: 'Delivery Attempts',
          content: [
            'Our courier partner will attempt delivery up to 3 times.',
            'If all attempts fail, the package is returned to our warehouse.',
            'A re-delivery fee of ₹99 applies for re-shipping returned packages.',
            'Ensure your delivery address and phone number are accurate at checkout.',
            'If you need to change your address after placing an order, contact us immediately.',
          ],
        },
        {
          title: 'International Shipping',
          content: 'Currently, City Handloom ships only within India. We are working on international shipping and hope to offer it soon. For bulk international orders, please contact us directly at hello@cityhandloom.com.',
        },
        {
          title: 'Damaged in Transit',
          content: [
            'If your package arrives visibly damaged, please refuse delivery and report to us.',
            'Take photos of the damaged package before opening and report within 24 hours.',
            'Email photos to support@cityhandloom.com with your order ID.',
            'We will arrange a replacement or full refund immediately.',
          ],
        },
      ]}
    />
  )
}