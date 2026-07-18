'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Grid3X3, Menu, Search, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()
  const navItems = useMemo(
    () => SITE_CONFIG.tasks.filter((task) => task.enabled).map((task) => ({ label: task.label, href: task.route })),
    []
  )

  const links = navItems.slice(0, 4)

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[var(--editable-nav-bg)] text-[var(--editable-nav-text)]">
      <nav className="mx-auto flex min-h-[88px] w-full max-w-[var(--editable-container)] items-center gap-5 px-5 sm:px-8 lg:px-12">
        <Link href="/" className="group flex min-w-0 items-center gap-3" aria-label={`${SITE_CONFIG.name} home`}>
          <span className="editable-tech-type max-w-[220px] truncate text-[clamp(1.25rem,2vw,1.8rem)] font-semibold">
            {SITE_CONFIG.name}
          </span>
          <span className="relative h-7 w-7 shrink-0 rounded-full border-[7px] border-[var(--slot4-accent)] transition duration-500 group-hover:rotate-90">
            <span className="absolute -right-[7px] top-1/2 h-[6px] w-[11px] -translate-y-1/2 bg-[var(--editable-nav-bg)]" />
          </span>
        </Link>

        <div className="mx-auto hidden items-center gap-8 xl:flex">
          {links.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link key={item.href} href={item.href} className={`relative py-3 text-sm font-medium transition hover:text-white ${active ? 'text-white' : 'text-white/66'}`}>
                {item.label}
                {active ? <span className="absolute inset-x-0 bottom-0 h-px bg-[var(--slot4-accent)]" /> : null}
              </Link>
            )
          })}
        </div>

        <div className="ml-auto hidden items-center gap-3 md:flex">
          <Link href="/search" className="grid h-12 w-12 place-items-center border border-white/20 transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]" aria-label="Search">
            <Search className="h-4 w-4" />
          </Link>
          <Link href={session ? '/create' : '/login'} className="inline-flex h-12 items-center justify-center border border-white/30 px-6 text-sm font-semibold transition hover:border-white">
            {session ? 'Create' : 'Sign in'}
          </Link>
          <Link href={navItems[0]?.href || '/'} className="inline-flex h-12 items-center gap-3 bg-[var(--editable-cta-bg)] px-7 text-sm font-semibold text-[var(--editable-cta-text)] transition hover:bg-[var(--slot4-accent-soft)]">
            <Grid3X3 className="h-4 w-4" /> Explore
          </Link>
        </div>

        <button type="button" onClick={() => setOpen((value) => !value)} className="ml-auto grid h-12 w-12 place-items-center border border-white/25 md:hidden" aria-label="Toggle menu" aria-expanded={open}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open ? (
        <div className="border-t border-white/10 bg-[var(--editable-nav-bg)] px-5 py-6 md:hidden">
          <form action="/search" className="mb-5 flex items-center gap-3 border-b border-white/20 pb-3">
            <Search className="h-4 w-4 text-[var(--slot4-accent)]" />
            <input name="q" type="search" placeholder="Search the collection" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-white/40" />
          </form>
          <div className="grid">
            {[{ label: 'Home', href: '/' }, ...navItems, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }].map((item, index) => (
              <Link key={`${item.href}-${index}`} href={item.href} onClick={() => setOpen(false)} className="flex items-center justify-between border-b border-white/10 py-4 text-lg font-medium text-white/80 hover:text-white">
                {item.label}<span className="text-xs text-[var(--slot4-accent)]">0{index + 1}</span>
              </Link>
            ))}
            {session ? <button type="button" onClick={() => { logout(); setOpen(false) }} className="py-4 text-left text-sm text-white/60">Log out</button> : <Link href="/login" onClick={() => setOpen(false)} className="py-4 text-sm text-white/60">Sign in</Link>}
          </div>
        </div>
      ) : null}
    </header>
  )
}
