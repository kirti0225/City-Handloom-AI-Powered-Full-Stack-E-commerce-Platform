import PolicyLayout from '@/components/policy/PolicyLayout'

export default function TermsPage() {
  return (
    <PolicyLayout
      title="Terms & Conditions"
      lastUpdated="June 1, 2026"
      intro="Welcome to City Handloom. By accessing or using our website and services, you agree to be bound by these Terms and Conditions. Please read them carefully before making a purchase or using our platform."
      sections={[
        {
          title: 'Acceptance of Terms',
          content: 'By using the City Handloom website, mobile app, or any of our services, you confirm that you are at least 18 years old (or have parental consent), and you agree to comply with these Terms and Conditions. If you do not agree, please do not use our services.',
        },
        {
          title: 'Account Registration',
          content: [
            'You must provide accurate, current, and complete information during registration.',
            'You are responsible for maintaining the confidentiality of your account credentials.',
            'You must notify us immediately of any unauthorized use of your account.',
            'City Handloom reserves the right to terminate accounts that violate these terms.',
            'One person may not maintain more than one active account.',
          ],
        },
        {
          title: 'Products and Pricing',
          content: [
            'All product descriptions, images, and specifications are provided in good faith.',
            'Prices are listed in Indian Rupees (₹) and include applicable taxes.',
            'Prices may change without notice. Orders placed before a price change are honored at the original price.',
            'In case of a pricing error, we reserve the right to cancel orders and refund payments.',
            'Product colors may vary slightly from images due to screen display differences.',
          ],
        },
        {
          title: 'Orders and Payments',
          content: [
            'Placing an order constitutes an offer to purchase — acceptance occurs upon shipping confirmation.',
            'We accept UPI, credit/debit cards, net banking, and cash on delivery.',
            'Payment is processed securely through Razorpay.',
            'We reserve the right to refuse or cancel orders at our discretion.',
            'COD orders are subject to additional verification.',
          ],
        },
        {
          title: 'Intellectual Property',
          content: 'All content on this website — including logos, product images, text, designs, and code — is the intellectual property of City Handloom and is protected by applicable copyright and trademark laws. You may not reproduce, distribute, or use our content without explicit written permission.',
        },
        {
          title: 'Prohibited Activities',
          content: [
            'Using our platform for any unlawful purpose or in violation of any regulations.',
            'Attempting to gain unauthorized access to any part of our systems.',
            'Posting false, misleading, or defamatory reviews or content.',
            'Using bots, scrapers, or automated tools to access our website.',
            'Reselling products purchased from City Handloom without our written consent.',
          ],
        },
        {
          title: 'Limitation of Liability',
          content: 'City Handloom shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services, including but not limited to loss of profits, data, or goodwill. Our total liability for any claim shall not exceed the amount paid by you for the specific order in question.',
        },
        {
          title: 'Governing Law',
          content: 'These Terms and Conditions are governed by the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Kanpur, Uttar Pradesh, India.',
        },
      ]}
    />
  )
}