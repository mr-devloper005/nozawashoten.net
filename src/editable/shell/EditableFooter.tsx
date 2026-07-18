'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const taskLinks = SITE_CONFIG.tasks.filter((task) => task.enabled)
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="overflow-hidden bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      <div className="border-b border-white/10 px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto flex max-w-[var(--editable-container)] flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--slot4-accent)]">Stay curious</p>
            <h2 className="editable-tech-type mt-4 max-w-4xl text-[clamp(2.8rem,7vw,7.5rem)] font-medium leading-[0.86] text-[#f4efea]">
              Ideas built to move business forward.
            </h2>
          </div>
          <Link href="/contact" className="group inline-flex shrink-0 items-center gap-4 border-b border-white/40 pb-3 text-xl font-medium transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]">
            Start a conversation <ArrowUpRight className="h-5 w-5 transition group-hover:-translate-y-1 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      <div className="mx-auto grid max-w-[var(--editable-container)] gap-12 px-5 py-12 sm:px-8 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-12">
        <div>
          <Link href="/" className="editable-tech-type text-3xl font-semibold">{SITE_CONFIG.name}</Link>
          <p className="mt-5 max-w-md text-sm leading-7 text-white/55">{globalContent.footer?.description || SITE_CONFIG.description}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--slot4-accent)]">Discover</p>
          <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-3">
            {taskLinks.map((task) => <Link key={task.key} href={task.route} className="text-sm text-white/65 transition hover:text-white">{task.label}</Link>)}
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--slot4-accent)]">Connect</p>
          <div className="mt-5 grid gap-3">
            <Link href="/about" className="text-sm text-white/65 hover:text-white">About</Link>
            <Link href="/contact" className="text-sm text-white/65 hover:text-white">Contact</Link>
            {session ? <><Link href="/create" className="text-sm text-white/65 hover:text-white">Create</Link><button type="button" onClick={logout} className="text-left text-sm text-white/65 hover:text-white">Log out</button></> : <Link href="/login" className="text-sm text-white/65 hover:text-white">Sign in</Link>}
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-[var(--editable-container)] flex-col gap-2 border-t border-white/10 px-5 py-5 text-[11px] uppercase tracking-[0.18em] text-white/35 sm:flex-row sm:justify-between sm:px-8 lg:px-12">
        <span>© {year} {SITE_CONFIG.name}</span><span>Made for thoughtful discovery</span>
      </div>
    </footer>
  )
}
