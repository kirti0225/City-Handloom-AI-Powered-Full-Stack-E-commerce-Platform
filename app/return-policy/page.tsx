import PolicyLayout from '@/components/policy/PolicyLayout'

export default function ReturnPolicyPage() {
  return (
    <PolicyLayout
      title="Return & Exchange Policy"
      lastUpdated="June 1, 2026"
      intro="At City Handloom, we want you to love every product you receive. If for any reason you are not satisfied, we offer a hassle-free return and exchange process. Please read our policy carefully before initiating a request."
      sections={[
        {
          title: 'Return Window',
          content: [
            'You have 10 days from the date of delivery to initiate a return or exchange.',
            'After 10 days, we are unable to accept returns or exchanges.',
            'The return window starts from the delivery date shown in your order tracking.',
            'To initiate: Go to My Account → Orders → Select Order → Click Return/Exchange.',
          ],
        },
        {
          title: 'Eligible Items for Return',
          content: [
            'Items that are unused, unwashed, and in their original condition.',
            'Products with all original tags, packaging, and accessories intact.',
            'Items received damaged or defective (report within 48 hours of delivery).',
            'Wrong item received — different from what was ordered.',
            'Size or color mismatch from the product page description.',
          ],
        },
        {
          title: 'Items NOT Eligible for Return',
          content: [
            'Items that have been washed, used, or altered in any way.',
            'Products without original tags or packaging.',
            'Items purchased during special sales or clearance events (marked as non-returnable).',
            'Customized or personalized products made to order.',
            'Items returned after the 10-day window has expired.',
          ],
        },
        {
          title: 'Exchange Policy',
          content: [
            'Exchanges are accepted for size or color within the same product only.',
            'Exchange window is 10 days from delivery — same as returns.',
            'If the desired size/color is unavailable, a refund will be processed instead.',
            'Only one exchange is permitted per order item.',
            'Exchange shipping is free for the first request; subsequent exchanges may incur charges.',
          ],
        },
        {
          title: 'Return Pickup Process',
          content: [
            'Once your return request is approved, a pickup will be scheduled within 2-3 business days.',
            'Ensure the product is repacked in its original or similar packaging.',
            'Our delivery partner will collect the item from your delivery address.',
            'You will receive a confirmation email/SMS once the pickup is completed.',
          ],
        },
        {
          title: 'Refund Process',
          content: [
            'Refunds are initiated within 2-3 business days after we receive and inspect the returned item.',
            'Refund is credited to your original payment method within 5-7 business days.',
            'UPI and wallet refunds are typically faster (1-2 days).',
            'Bank transfer refunds may take 5-7 business days depending on your bank.',
            'COD orders are refunded via bank transfer or store credits.',
          ],
        },
        {
          title: 'Damaged or Defective Items',
          content: 'If you receive a damaged or defective product, please contact us within 48 hours of delivery with photos of the damage. We will arrange an immediate replacement or full refund at no cost to you. Do not attempt to wash or use a defective item as this may void the return eligibility.',
        },
        {
          title: 'Contact for Returns',
          content: [
            'Email: returns@cityhandloom.com',
            'Phone: +91 98765 43210 (Mon-Sat, 9AM-6PM)',
            'WhatsApp: +91 98765 43210',
            'Online: Contact Us page → My Orders tab → Select your order',
          ],
        },
      ]}
    />
  )
}