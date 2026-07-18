import { notFound } from 'next/navigation'

export const revalidate = 3

export const generateMetadata = () => ({ title: 'Not Found', robots: { index: false, follow: false } })

export async function ProfilePageTaskPage({
  searchParams: _searchParams,
  basePath: _basePath,
}: {
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  return notFound()
}

export default ProfilePageTaskPage

export const ProfileTaskPage = ProfilePageTaskPage
