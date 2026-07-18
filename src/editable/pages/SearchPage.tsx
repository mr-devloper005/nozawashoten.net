import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Filter, Search } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { toPlainText } from '@/editable/cards/PostCards'
import { pagesContent } from '@/editable/content/pages.content'

export const revalidate = 3

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/search', title: pagesContent.search.metadata.title, description: pagesContent.search.metadata.description })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) => typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const compactRaw = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const getImage = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.find((item) => typeof item?.url === 'string')?.url : ''
  const images = Array.isArray(content.images) ? content.images.find((item) => typeof item === 'string') as string | undefined : ''
  return media || compactRaw(content.featuredImage) || compactRaw(content.image) || compactRaw(content.thumbnail) || images || ''
}
const summaryOf = (post: SitePost) => {
  const content = getContent(post)
  return toPlainText((typeof post.summary === 'string' && post.summary) || compactRaw(content.description) || compactRaw(content.excerpt) || compactRaw(content.body) || '')
}
const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function SearchResultCard({ post, index }: { post: SitePost; index: number }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const taskConfig = SITE_CONFIG.tasks.find((item) => item.key === task)
  const href = `${taskConfig?.route || `/${task || 'article'}`}/${post.slug}`
  const image = getImage(post)
  const summary = summaryOf(post)
  const feature = index === 0

  if (feature) {
    return (
      <Link href={href} className="group relative grid min-h-[520px] overflow-hidden bg-[#171415] text-white md:col-span-2 lg:grid-cols-[1.15fr_0.85fr] xl:col-span-3">
        <div className="relative min-h-[330px] overflow-hidden bg-[var(--slot4-media-bg)]">
          {image ? <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]" /> : null}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(23,20,21,0.18))]" />
        </div>
        <div className="flex flex-col justify-end p-8 sm:p-12">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--slot4-accent)]">Featured result · {taskConfig?.label || 'Story'}</p>
          <h2 className="mt-5 text-4xl font-medium leading-[1.02] sm:text-5xl">{post.title}</h2>
          {summary ? <p className="mt-5 line-clamp-4 text-sm leading-7 text-white/58">{summary}</p> : null}
          <span className="mt-8 inline-flex items-center gap-3 text-sm font-semibold">Open story <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-1 group-hover:translate-x-1" /></span>
        </div>
      </Link>
    )
  }

  return (
    <Link href={href} className="group grid gap-0 border-t border-[var(--editable-border)] py-7 sm:grid-cols-[150px_minmax(0,1fr)_28px] sm:items-center sm:gap-6">
      <div className="relative mb-5 aspect-[16/10] overflow-hidden bg-[var(--slot4-media-bg)] sm:mb-0">
        {image ? <img src={image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="grid h-full place-items-center text-xs uppercase tracking-[0.2em] text-[var(--slot4-muted-text)]">No image</div>}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--slot4-accent-fill)]">{taskConfig?.label || 'Story'} · {String(index + 1).padStart(2, '0')}</p>
        <h2 className="mt-2 line-clamp-2 text-2xl font-medium leading-tight">{post.title}</h2>
        {summary ? <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--slot4-muted-text)]">{summary}</p> : null}
      </div>
      <ArrowUpRight className="hidden h-5 w-5 transition group-hover:-translate-y-1 group-hover:translate-x-1 sm:block" />
    </Link>
  )
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled)
  const enabledTaskKeys = new Set(enabledTasks.map((item) => item.key))
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined)
  const posts = feed?.posts?.length ? feed.posts : useMaster ? [] : enabledTasks.flatMap((item) => getMockPostsForTask(item.key))
  const results = posts
    .filter((post) => {
      const postTask = getPostTaskKey(post)
      return Boolean(postTask && enabledTaskKeys.has(postTask))
    })
    .filter((post) => matches(post, normalized, category, task))
    .slice(0, normalized ? 80 : 36)

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <header className="editable-grain relative overflow-hidden bg-[var(--slot4-dark-bg)] text-[var(--slot4-dark-text)]">
          <div className="pointer-events-none absolute left-1/2 top-[-18rem] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(200,149,149,0.27),transparent_68%)]" />
          <div className="relative mx-auto max-w-[var(--editable-container)] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.34em] text-[var(--slot4-accent)]">{pagesContent.search.hero.badge}</p>
            <h1 className="editable-tech-type mx-auto mt-7 max-w-6xl text-center text-[clamp(4rem,9vw,10rem)] font-medium leading-[0.82]">Find the idea that moves you.</h1>
            <p className="mx-auto mt-8 max-w-2xl text-center text-base leading-8 text-white/52">{pagesContent.search.hero.description}</p>

            <form action="/search" className="mx-auto mt-12 max-w-5xl border border-white/16 bg-white/[0.055] p-3 backdrop-blur sm:p-4">
              <input type="hidden" name="master" value="1" />
              <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_220px_auto]">
                <label className="flex min-h-14 items-center gap-3 bg-[#f4efea] px-5 text-[#171415]">
                  <Search className="h-5 w-5 text-[var(--slot4-accent-fill)]" />
                  <input name="q" defaultValue={query} placeholder="Search stories and ideas" className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-[#6C5C5C]" />
                </label>
                <label className="flex min-h-14 items-center gap-3 border border-white/18 px-4 text-white">
                  <Filter className="h-4 w-4 text-[var(--slot4-accent)]" />
                  <input name="category" defaultValue={category} placeholder="Category" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-white/42" />
                </label>
                <select name="task" defaultValue={task} className="min-h-14 border border-white/18 bg-[#171415] px-4 text-sm text-white outline-none">
                  <option value="">All content types</option>
                  {enabledTasks.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
                </select>
                <button className="inline-flex min-h-14 items-center justify-center gap-2 bg-[var(--slot4-accent)] px-7 text-sm font-semibold text-[#171415] transition hover:bg-[var(--slot4-accent-soft)]" type="submit">Search <ArrowRight className="h-4 w-4" /></button>
              </div>
            </form>
          </div>
        </header>

        <section className="mx-auto max-w-[var(--editable-container)] px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
          <div className="flex flex-col gap-6 border-b border-[var(--editable-border)] pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--slot4-accent-fill)]">{results.length} results</p><h2 className="mt-3 text-4xl font-medium sm:text-5xl">{query ? `Results for “${query}”` : pagesContent.search.resultsTitle}</h2></div>
            <Link href={enabledTasks[0]?.route || '/'} className="inline-flex items-center gap-3 text-sm font-semibold">Browse latest <ArrowRight className="h-4 w-4" /></Link>
          </div>

          {results.length ? (
            <div className="mt-10 grid gap-x-10 lg:grid-cols-2 xl:grid-cols-3">
              {results.map((post, index) => <SearchResultCard key={post.id || post.slug} post={post} index={index} />)}
            </div>
          ) : (
            <div className="mt-10 border border-dashed border-[var(--editable-border)] bg-[var(--slot4-cream)] px-8 py-20 text-center">
              <Search className="mx-auto h-8 w-8 text-[var(--slot4-accent-fill)]" />
              <p className="mt-6 text-3xl font-medium">No matching stories found.</p>
              <p className="mt-3 text-sm text-[var(--slot4-muted-text)]">Try another keyword or clear one of the filters.</p>
            </div>
          )}
        </section>
      </main>
    </EditableSiteShell>
  )
}
