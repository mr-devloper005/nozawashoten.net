import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Grid3X3, Search } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { getEditableCategory, getEditableExcerpt, getEditablePostImage, postHref } from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const container = 'mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-8 lg:px-12'

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  return posts.filter((post) => {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function allPosts(posts: SitePost[], sections: HomeTimeSection[]) {
  return dedupePosts([...posts, ...sections.flatMap((section) => section.posts)])
}

function PostImage({ post, className = '' }: { post: SitePost; className?: string }) {
  return <img src={getEditablePostImage(post)} alt={post.title || 'Featured post'} className={className} loading="lazy" />
}

export function EditableHomeHero({ primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = allPosts(posts, timeSections)
  const lead = pool[0]

  return (
    <section className="editable-grain relative isolate min-h-[690px] overflow-hidden bg-[var(--slot4-dark-bg)] text-[var(--slot4-dark-text)] sm:min-h-[760px] lg:min-h-[calc(100vh-88px)]">
      <div className="pointer-events-none absolute left-1/2 top-[47%] h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(200,149,149,0.28),rgba(108,74,74,0.08)_43%,transparent_70%)] blur-2xl" />
      <div className={`${container} relative flex min-h-[690px] flex-col pt-16 sm:min-h-[760px] sm:pt-20 lg:min-h-[calc(100vh-88px)] lg:pt-[9vh]`}>
        <div className="relative z-20 mx-auto max-w-[1400px] text-center">
          <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.38em] text-[var(--slot4-accent)] sm:text-xs">Independent business intelligence</p>
          <h1 className="editable-tech-type text-balance text-[clamp(4rem,10.2vw,11.5rem)] font-medium leading-[0.78] text-[#f4efea]">
            Build <span className="editable-outline-text">brighter.</span><br />Grow smarter.
          </h1>
        </div>

        <div className="relative z-10 mx-auto mt-[-1.5rem] flex w-full max-w-[940px] flex-1 items-end justify-center sm:mt-[-3rem]">
          {lead ? (
            <Link href={postHref('image', lead, primaryRoute)} className="group relative block h-[360px] w-full max-w-[840px] overflow-hidden sm:h-[460px] lg:h-[52vh] lg:max-h-[610px]">
              <PostImage post={lead} className="h-full w-full object-contain object-bottom drop-shadow-[0_35px_70px_rgba(0,0,0,0.72)] transition duration-700 group-hover:scale-[1.025]" />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(transparent,rgba(13,13,16,0.46))]" />
              <div className="absolute bottom-6 left-5 right-5 flex items-end justify-between gap-4 sm:bottom-10 sm:left-10 sm:right-10">
                <div className="max-w-md text-left">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-white/55">Current perspective</p>
                  <p className="mt-2 line-clamp-2 text-xl font-medium text-white sm:text-2xl">{lead.title}</p>
                </div>
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[var(--slot4-accent)] text-[#171415] transition group-hover:rotate-45"><ArrowUpRight className="h-5 w-5" /></span>
              </div>
            </Link>
          ) : (
            <div className="mb-16 max-w-xl text-center text-white/60">Fresh ideas and visual stories will appear here as they are published.</div>
          )}
        </div>

        <div className="absolute bottom-7 left-5 z-30 hidden items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-white/45 sm:flex lg:left-12">
          <span className="h-px w-10 bg-[var(--slot4-accent)]" /> Scroll to explore
        </div>
        <Link href={primaryRoute} className="absolute bottom-7 right-5 z-30 hidden items-center gap-2 text-xs font-medium text-white/70 transition hover:text-white sm:flex lg:right-12">
          All stories <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}

export function EditableStoryRail({ posts, timeSections }: HomeSectionProps) {
  const pool = allPosts(posts, timeSections)
  const portrait = pool[1] || pool[0]

  return (
    <section className="bg-[var(--slot4-cream)]">
      <div className={`${container} grid min-h-[760px] items-center gap-16 py-20 lg:grid-cols-[0.78fr_1.22fr] lg:py-28`}>
        <div className="relative mx-auto w-full max-w-[470px] lg:mx-0">
          <div className="aspect-[4/5] overflow-hidden rounded-[1.15rem] bg-[var(--slot4-media-bg)]">
            {portrait ? <PostImage post={portrait} className="h-full w-full object-cover grayscale-[18%]" /> : <div className="h-full w-full bg-[var(--slot4-panel-bg)]" />}
          </div>
          <div className="absolute -bottom-5 -right-3 max-w-[70%] rotate-[-4deg] border border-[var(--editable-border)] bg-[var(--slot4-cream)] px-5 py-3 font-serif text-lg italic shadow-sm sm:-right-10">Small moves. Lasting momentum.</div>
        </div>
        <div className="lg:pl-[7vw]">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--slot4-accent-fill)]">About this collection</p>
          <h2 className="editable-tech-type mt-6 max-w-4xl text-[clamp(2.4rem,4.5vw,5.2rem)] font-medium leading-[1.02]">
            Practical perspectives for people building something of their own.
          </h2>
          <p className="mt-8 max-w-3xl text-lg leading-8 text-[var(--slot4-muted-text)] sm:text-xl sm:leading-9">
            We bring together visual stories, practical ideas, and useful resources for independent teams. Every piece is selected to make the next decision clearer—and the next step easier.
          </p>
          <Link href="/about" className="mt-10 inline-flex items-center gap-3 border-b border-current pb-2 text-sm font-semibold transition hover:text-[var(--slot4-accent-fill)]">
            Read more about us <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
      <div className="overflow-hidden border-y border-[var(--editable-border)] py-4">
        <div className="editable-marquee-track flex w-max gap-12 whitespace-nowrap text-xs font-semibold uppercase tracking-[0.28em] text-[var(--slot4-muted-text)]">
          {[0, 1].map((set) => <span key={set}>Visual stories · Local ideas · Independent voices · Useful resources · Better business · Fresh perspectives ·</span>)}
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group relative min-h-[560px] overflow-hidden rounded-[1.15rem] bg-[#171415] text-white sm:min-h-[680px]">
      <PostImage post={post} className="absolute inset-0 h-full w-full object-cover opacity-76 transition duration-700 group-hover:scale-[1.035]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05),rgba(0,0,0,0.84))]" />
      <div className="absolute inset-x-0 bottom-0 p-7 sm:p-10">
        <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--slot4-accent)]">Featured perspective</p>
        <h3 className="mt-4 max-w-2xl text-3xl font-medium leading-tight sm:text-5xl">{post.title}</h3>
        <p className="mt-4 max-w-xl text-sm leading-7 text-white/68">{getEditableExcerpt(post, 170) || 'Open this story for the full perspective.'}</p>
        <span className="mt-7 inline-flex items-center gap-2 border-b border-white/50 pb-2 text-sm font-semibold">Open story <ArrowUpRight className="h-4 w-4" /></span>
      </div>
    </Link>
  )
}

function ProductCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group block min-w-0">
      <div className={`relative overflow-hidden rounded-[1.15rem] border border-white bg-[var(--slot4-media-bg)] ${index % 3 === 0 ? 'aspect-[4/3]' : 'aspect-[5/4]'}`}>
        <PostImage post={post} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.045]" />
        <span className="absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-full bg-[#171415]/75 text-white opacity-0 backdrop-blur transition group-hover:rotate-45 group-hover:opacity-100"><ArrowUpRight className="h-4 w-4" /></span>
      </div>
      <div className="mt-5 flex items-start justify-between gap-5">
        <div><p className="text-[10px] uppercase tracking-[0.22em] text-[var(--slot4-muted-text)]">{getEditableCategory(post)}</p><h3 className="mt-2 line-clamp-2 text-2xl font-medium leading-tight">{post.title}</h3></div>
        <span className="pt-1 text-xs text-[var(--slot4-muted-text)]">0{index + 1}</span>
      </div>
    </Link>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = allPosts(posts, timeSections)
  if (!pool.length) return null
  const href = (post: SitePost) => postHref(primaryTask, post, primaryRoute)

  return (
    <section className="bg-[var(--slot4-page-bg)]">
      <div className={`${container} py-20 sm:py-28`}>
        <div className="mb-14 flex flex-col gap-7 border-b border-[var(--editable-border)] pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--slot4-accent-fill)]">Selected stories</p>
            <h2 className="editable-tech-type mt-4 text-[clamp(3rem,7vw,8rem)] font-medium leading-[0.85]">Beyond the expected.</h2>
          </div>
          <Link href={primaryRoute} className="inline-flex shrink-0 items-center gap-3 text-sm font-semibold">See all stories <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid gap-10 xl:grid-cols-[1.06fr_0.94fr]">
          <FeatureCard post={pool[0]} href={href(pool[0])} />
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2">
            {pool.slice(1, 5).map((post, index) => <ProductCard key={post.id || post.slug} post={post} href={href(post)} index={index} />)}
          </div>
        </div>
      </div>
    </section>
  )
}

function EditorialRow({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group grid gap-5 border-t border-[var(--editable-border)] py-7 sm:grid-cols-[48px_minmax(0,1fr)_160px_28px] sm:items-center">
      <span className="text-xs text-[var(--slot4-muted-text)]">{String(index + 1).padStart(2, '0')}</span>
      <div><p className="text-[10px] uppercase tracking-[0.24em] text-[var(--slot4-accent-fill)]">{getEditableCategory(post)}</p><h3 className="mt-2 text-2xl font-medium leading-tight sm:text-3xl">{post.title}</h3></div>
      <div className="hidden aspect-[16/10] overflow-hidden rounded-xl bg-[var(--slot4-media-bg)] sm:block"><PostImage post={post} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /></div>
      <ArrowUpRight className="h-5 w-5 transition group-hover:-translate-y-1 group-hover:translate-x-1" />
    </Link>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = allPosts(posts, timeSections).slice(5, 11)
  if (!pool.length) return null
  return (
    <section className="bg-[var(--slot4-cream)]">
      <div className={`${container} py-20 sm:py-28`}>
        <div className="grid gap-10 lg:grid-cols-[0.58fr_1.42fr]">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--slot4-accent-fill)]">The field notes</p>
            <h2 className="mt-5 max-w-md text-5xl font-medium leading-[0.94] sm:text-6xl">Ideas worth carrying forward.</h2>
            <form action="/search" className="mt-9 flex max-w-sm border-b border-[var(--slot4-page-text)] pb-3">
              <Search className="h-4 w-4" /><input name="q" placeholder="Search the collection" className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none" /><button aria-label="Search"><ArrowRight className="h-4 w-4" /></button>
            </form>
          </div>
          <div>
            {pool.map((post, index) => <EditorialRow key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />)}
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableHomeCta() {
  return (
    <section className="bg-[var(--slot4-panel-bg)]">
      <div className={`${container} py-24 text-center sm:py-32`}>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--slot4-accent-fill)]">Find your next idea</p>
        <Link href={SITE_CONFIG.tasks.find((task) => task.enabled)?.route || '/'} className="group mx-auto mt-5 inline-flex max-w-5xl items-center gap-5 border-b border-[var(--slot4-page-text)] pb-3">
          <span className="editable-tech-type text-[clamp(3.1rem,7vw,8rem)] font-medium leading-none">Explore everything</span>
          <ArrowRight className="h-10 w-10 shrink-0 transition duration-500 group-hover:translate-x-3 sm:h-16 sm:w-16" />
        </Link>
        <div className="mt-16 flex flex-wrap justify-center gap-3">
          <Link href="/create" className="inline-flex items-center gap-3 bg-[var(--slot4-accent-fill)] px-7 py-4 text-sm font-semibold text-[var(--slot4-on-accent)]"><Grid3X3 className="h-4 w-4" /> Share your work</Link>
          <Link href="/contact" className="border border-[var(--slot4-page-text)] px-7 py-4 text-sm font-semibold">Contact us</Link>
        </div>
      </div>
    </section>
  )
}
