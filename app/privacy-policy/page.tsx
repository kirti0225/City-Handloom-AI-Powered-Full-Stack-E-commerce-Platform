import PolicyLayout from '@/components/policy/PolicyLayout'

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout
      title="Privacy Policy"
      lastUpdated="June 1, 2026"
      intro="At City Handloom, we are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website or make a purchase from us."
      sections={[
        {
          title: 'Information We Collect',
          content: [
            'Personal identification information: name, email address, phone number, shipping address.',
            'Payment information: card details (processed securely via Razorpay — we do not store card data).',
            'Device and usage data: IP address, browser type, pages visited, time spent on site.',
            'Order history and wishlist items to personalize your shopping experience.',
            'Communications you send us via email, contact form, or chat support.',
          ],
        },
        {
          title: 'How We Use Your Information',
          content: [
            'To process and fulfill your orders, including shipping and delivery.',
            'To send order confirmations, shipping updates, and delivery notifications.',
            'To personalize your experience using AI-powered recommendations.',
            'To respond to your customer service queries and support requests.',
            'To send promotional emails and offers — only if you have opted in.',
            'To improve our website, products, and services through analytics.',
            'To detect and prevent fraud or unauthorized transactions.',
          ],
        },
        {
          title: 'Information Sharing',
          content: [
            'We do not sell, trade, or rent your personal information to third parties.',
            'We share necessary data with delivery partners (Delhivery, BlueDart) to fulfill your orders.',
            'Payment data is shared securely with Razorpay for transaction processing.',
            'We may disclose information if required by law or to protect our legal rights.',
            'Analytics providers (like Google Analytics) may receive anonymized usage data.',
          ],
        },
        {
          title: 'Data Security',
          content: 'We implement industry-standard security measures including SSL encryption, secure servers, and regular security audits to protect your personal information. However, no method of transmission over the internet is 100% secure. We encourage you to use strong passwords and keep your account credentials confidential.',
        },
        {
          title: 'Cookies',
          content: [
            'We use cookies to enhance your browsing experience and remember your preferences.',
            'Session cookies are deleted when you close your browser.',
            'Persistent cookies remember your login and cart across sessions.',
            'You can disable cookies in your browser settings, but some features may not work correctly.',
          ],
        },
        {
          title: 'Your Rights',
          content: [
            'Access: You can request a copy of the personal data we hold about you.',
            'Correction: You can update your account information at any time via My Account.',
            'Deletion: You can request deletion of your account and personal data.',
            'Opt-out: You can unsubscribe from marketing emails at any time.',
            'Portability: You can request your data in a portable format.',
          ],
        },
        {
          title: 'Children\'s Privacy',
          content: 'Our services are not directed to children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us immediately.',
        },
        {
          title: 'Changes to This Policy',
          content: 'We may update this Privacy Policy from time to time. We will notify you of any significant changes by email or by posting a notice on our website. Your continued use of our services after changes constitutes acceptance of the updated policy.',
        },
      ]}
    />
  )
}