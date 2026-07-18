import { notFound } from 'next/navigation'

export const revalidate = 3

export async function generateStaticParams() {
  return []
}

export async function generateMetadata({ params: _params }: { params: Promise<{ username: string }> }) {
  return { title: 'Not Found', robots: { index: false, follow: false } }
}

export default async function ProfileDetailPage({ params }: { params: Promise<{ username: string }> }) {
  await params
  return notFound()
}
