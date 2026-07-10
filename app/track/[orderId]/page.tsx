import TrackOrderClient from '@/components/track/TrackOrderClient'

export default async function TrackOrderPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params
  return <TrackOrderClient orderId={orderId} />
}