'use client'

import type { ReactNode } from 'react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'

export function PageShell({
  title,
  description,
  actions,
  children,
}: {
  title: string
  description?: string
  actions?: ReactNode
  children?: ReactNode
}) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffaf7_0%,#f9f1ff_52%,#fff6ef_100%)] text-slate-900">
      <NavbarShell />
      <main>
        <section className="border-b border-white/70 bg-transparent">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6 rounded-[2rem] border border-white/70 bg-white/78 p-8 shadow-[0_24px_80px_rgba(209,173,230,0.16)] backdrop-blur-xl sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
                {description && (
                  <p className="mt-2 max-w-2xl text-slate-500">{description}</p>
                )}
              </div>
              {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          {children}
        </section>
      </main>
      <Footer />
    </div>
  )
}
