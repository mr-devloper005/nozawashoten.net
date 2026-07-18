'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, ImageIcon, Lock, Send } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'
const fieldClass = 'w-full border-b border-[var(--editable-border)] bg-transparent px-0 py-3 text-base font-medium text-[var(--slot4-page-text)] outline-none transition placeholder:text-[var(--slot4-muted-text)]/65 focus:border-[var(--slot4-accent-fill)]'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const enabledTasks = useMemo(() => SITE_CONFIG.tasks.filter((item) => item.enabled), [])
  const task = (enabledTasks[0]?.key || 'image') as TaskKey
  const activeTask = enabledTasks[0]
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
          <section className="editable-grain bg-[var(--slot4-dark-bg)] text-[var(--slot4-dark-text)]">
            <div className="mx-auto grid min-h-[620px] max-w-[var(--editable-container)] items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:px-12">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--slot4-accent)]">{pagesContent.create.locked.badge}</p>
                <h1 className="editable-tech-type mt-7 max-w-4xl text-[clamp(3.8rem,8vw,8.5rem)] font-medium leading-[0.84]">Bring your next story into focus.</h1>
                <p className="mt-8 max-w-xl text-lg leading-8 text-white/55">{pagesContent.create.locked.description}</p>
                <div className="mt-10 flex flex-wrap gap-3">
                  <Link href="/login" className="inline-flex items-center gap-3 bg-[var(--slot4-accent)] px-7 py-4 text-sm font-semibold text-[#171415]">Login <ArrowRight className="h-4 w-4" /></Link>
                  <Link href="/signup" className="border border-white/25 px-7 py-4 text-sm font-semibold text-white">Sign up</Link>
                </div>
              </div>
              <div className="relative mx-auto grid aspect-square w-full max-w-md place-items-center rounded-full border border-white/15 bg-[radial-gradient(circle,rgba(200,149,149,0.22),transparent_65%)]">
                <div className="grid h-32 w-32 place-items-center rounded-full border border-[var(--slot4-accent)] text-[var(--slot4-accent)]"><Lock className="h-12 w-12" /></div>
              </div>
            </div>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <header className="editable-grain relative overflow-hidden bg-[var(--slot4-dark-bg)] text-[var(--slot4-dark-text)]">
          <div className="pointer-events-none absolute right-[-8rem] top-[-14rem] h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(200,149,149,0.25),transparent_68%)]" />
          <div className="relative mx-auto max-w-[var(--editable-container)] px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--slot4-accent)]">{pagesContent.create.hero.badge}</p>
            <div className="mt-6 grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
              <h1 className="editable-tech-type max-w-5xl text-[clamp(3.8rem,8vw,8.8rem)] font-medium leading-[0.84]">Share something worth seeing.</h1>
              <p className="max-w-lg text-base leading-8 text-white/55 lg:pb-2">{pagesContent.create.hero.description}</p>
            </div>
          </div>
        </header>

        <section className="mx-auto grid max-w-[var(--editable-container)] gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[0.48fr_1.52fr] lg:px-12">
          <aside className="lg:sticky lg:top-32 lg:self-start">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--slot4-accent-fill)]">Publishing desk</p>
            <h2 className="mt-5 text-4xl font-medium leading-tight">One clear path from idea to post.</h2>
            <div className="mt-10 border-t border-[var(--editable-border)]">
              {['Shape the idea', 'Add the context', 'Review and publish'].map((label, index) => (
                <div key={label} className="flex items-center gap-5 border-b border-[var(--editable-border)] py-5">
                  <span className="text-xs text-[var(--slot4-accent-fill)]">0{index + 1}</span><span className="text-sm font-medium">{label}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 flex items-center gap-3 text-sm text-[var(--slot4-muted-text)]"><ImageIcon className="h-4 w-4" /> Publishing as {activeTask?.label || 'post'}</div>
          </aside>

          <form onSubmit={submit} className="border border-[var(--editable-border)] bg-[var(--slot4-cream)] p-6 sm:p-10 lg:p-14">
            <div className="flex flex-col gap-4 border-b border-[var(--editable-border)] pb-8 sm:flex-row sm:items-end sm:justify-between">
              <div><p className="text-xs uppercase tracking-[0.25em] text-[var(--slot4-muted-text)]">New submission</p><h2 className="mt-3 text-4xl font-medium">{pagesContent.create.formTitle}</h2></div>
              <span className="text-sm text-[var(--slot4-muted-text)]">Signed in as <strong className="text-[var(--slot4-page-text)]">{session.name}</strong></span>
            </div>

            <div className="mt-8 grid gap-x-8 gap-y-7">
              <label><span className="text-xs font-semibold uppercase tracking-[0.2em]">Title *</span><input className={fieldClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Give the post a clear title" required /></label>
              <div className="grid gap-7 sm:grid-cols-2">
                <label><span className="text-xs font-semibold uppercase tracking-[0.2em]">Category</span><input className={fieldClass} value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Choose a useful category" /></label>
                <label><span className="text-xs font-semibold uppercase tracking-[0.2em]">Source URL</span><input className={fieldClass} value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://" /></label>
              </div>
              <label><span className="text-xs font-semibold uppercase tracking-[0.2em]">Featured image</span><input className={fieldClass} value={image} onChange={(event) => setImage(event.target.value)} placeholder="Paste an image URL" /></label>
              <label><span className="text-xs font-semibold uppercase tracking-[0.2em]">Short summary *</span><textarea className={`${fieldClass} min-h-28 resize-y`} value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="What should readers know first?" required /></label>
              <label><span className="text-xs font-semibold uppercase tracking-[0.2em]">Main content *</span><textarea className={`${fieldClass} min-h-64 resize-y`} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Add the complete story, details, or description" required /></label>
            </div>

            {created ? <div className="mt-8 border border-[var(--slot4-accent-fill)] bg-[var(--slot4-accent-soft)] p-5"><p className="flex items-center gap-2 text-sm font-semibold"><CheckCircle2 className="h-5 w-5" /> {pagesContent.create.successTitle}</p><p className="mt-1 text-sm text-[var(--slot4-muted-text)]">{created.title}</p></div> : null}

            <div className="mt-10 flex justify-end">
              <button type="submit" className="inline-flex min-h-14 items-center justify-center gap-3 bg-[var(--slot4-accent-fill)] px-8 text-sm font-semibold text-[var(--slot4-on-accent)] transition hover:bg-[#171415]">
                <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
              </button>
            </div>
          </form>
        </section>
      </main>
    </EditableSiteShell>
  )
}
