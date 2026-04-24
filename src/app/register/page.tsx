import Link from 'next/link'
import { Bookmark, Building2, FileText, Image as ImageIcon, Sparkles, Wand2, LayoutGrid, UserRoundPlus } from 'lucide-react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { getProductKind } from '@/design/factory/get-product-kind'
import { REGISTER_PAGE_OVERRIDE_ENABLED, RegisterPageOverride } from '@/overrides/register-page'

function getRegisterConfig(kind: ReturnType<typeof getProductKind>) {
  if (kind === 'directory') {
    return {
      shell: 'bg-[#f8fbff] text-slate-950',
      panel: 'border border-slate-200 bg-white',
      side: 'border border-slate-200 bg-slate-50',
      muted: 'text-slate-600',
      action: 'bg-slate-950 text-white hover:bg-slate-800',
      icon: Building2,
      title: 'Create a business-ready account',
      body: 'List services, manage locations, and activate trust signals with a proper directory workflow.',
    }
  }
  if (kind === 'editorial') {
    return {
      shell: 'bg-[#fbf6ee] text-[#241711]',
      panel: 'border border-[#dcc8b7] bg-[#fffdfa]',
      side: 'border border-[#e6d6c8] bg-[#fff4e8]',
      muted: 'text-[#6e5547]',
      action: 'bg-[#241711] text-[#fff1e2] hover:bg-[#3a241b]',
      icon: FileText,
      title: 'Start your contributor workspace',
      body: 'Create a profile for essays, issue drafts, editorial review, and publication scheduling.',
    }
  }
  if (kind === 'visual') {
    return {
      shell: 'bg-[linear-gradient(180deg,#fffaf7_0%,#f9f1ff_52%,#fff6ef_100%)] text-slate-900',
      panel: 'border border-white/70 bg-white/88 shadow-[0_24px_80px_rgba(209,173,230,0.16)] backdrop-blur-xl',
      side: 'border border-white/70 bg-white/76 shadow-[0_20px_60px_rgba(209,173,230,0.12)] backdrop-blur-xl',
      muted: 'text-slate-500',
      action: 'bg-[linear-gradient(135deg,#ffc6b7_0%,#c777ff_100%)] text-white hover:opacity-90',
      icon: ImageIcon,
      title: 'Set up your visual assistant profile',
      body: 'Create an account for image publishing, guided discovery, and assistant-led creator workflows inside the new pastel interface.',
    }
  }
  return {
    shell: 'bg-[#f7f1ea] text-[#261811]',
    panel: 'border border-[#ddcdbd] bg-[#fffaf4]',
    side: 'border border-[#e8dbce] bg-[#f3e8db]',
    muted: 'text-[#71574a]',
    action: 'bg-[#5b2b3b] text-[#fff0f5] hover:bg-[#74364b]',
    icon: Bookmark,
    title: 'Create a curator account',
    body: 'Build shelves, save references, and connect collections to your profile without a generic feed setup.',
  }
}

export default function RegisterPage() {
  if (REGISTER_PAGE_OVERRIDE_ENABLED) {
    return <RegisterPageOverride />
  }

  const { recipe } = getFactoryState()
  const productKind = getProductKind(recipe)
  const config = getRegisterConfig(productKind)
  const Icon = config.icon

  return (
    <div className={`min-h-screen ${config.shell}`}>
      <NavbarShell />
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
          <div className={`rounded-[2rem] p-8 ${config.side}`}>
            <div className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#ffe3d7_0%,#f3d7ff_100%)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8a5fa7]">
              <Icon className="h-3.5 w-3.5" />
              New account
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.05em]">{config.title}</h1>
            <p className={`mt-5 text-sm leading-8 ${config.muted}`}>{config.body}</p>
            <div className="mt-8 rounded-[1.7rem] bg-[linear-gradient(135deg,#fff0ea_0%,#f8e6ff_58%,#fff7ee_100%)] p-5 shadow-[0_14px_40px_rgba(209,173,230,0.14)]">
              <p className="text-sm font-semibold">Launch with the assistant flow</p>
              <p className={`mt-2 text-sm leading-7 ${config.muted}`}>
                Start with identity, publishing intent, and your first collection so onboarding feels like part of the product instead of a plain form.
              </p>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {[
                { icon: UserRoundPlus, title: 'Profile-first setup', body: 'Create your visual identity before posting.' },
                { icon: Wand2, title: 'Assistant-guided flow', body: 'Start with a cleaner, softer account journey.' },
                { icon: LayoutGrid, title: 'Gallery-ready tools', body: 'Move directly into image publishing and discovery.' },
              ].map((item) => (
                <div key={item.title} className="rounded-[1.5rem] border border-white/70 bg-white/70 px-4 py-4 text-sm shadow-[0_8px_24px_rgba(209,173,230,0.1)]">
                  <item.icon className="h-4 w-4 text-[#b36a9d]" />
                  <p className="mt-3 font-semibold">{item.title}</p>
                  <p className={`mt-2 leading-6 ${config.muted}`}>{item.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-[2rem] p-8 ${config.panel}`}>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] opacity-70">Create account</p>
            <div className="mt-4 rounded-[1.6rem] bg-[linear-gradient(135deg,#fff4ee_0%,#f7e8ff_100%)] p-5 shadow-[0_12px_30px_rgba(209,173,230,0.12)]">
              <p className="text-sm font-semibold">Build your profile and open the assistant.</p>
              <p className={`mt-2 text-sm leading-7 ${config.muted}`}>Get access to image publishing, profile surfaces, and visual discovery through the same fresh layout language as the homepage.</p>
            </div>
            <form className="mt-6 grid gap-4">
              <input className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm" placeholder="Full name" />
              <input className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm" placeholder="Email address" />
              <input className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm" placeholder="Password" type="password" />
              <input className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm" placeholder="What are you creating or publishing?" />
              <button type="submit" className={`inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold ${config.action}`}>Create account</button>
            </form>
            <div className={`mt-6 flex items-center justify-between text-sm ${config.muted}`}>
              <span>Already have an account?</span>
              <Link href="/login" className="inline-flex items-center gap-2 font-semibold hover:underline">
                <Sparkles className="h-4 w-4" />
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
