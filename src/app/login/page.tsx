 'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Bookmark, Building2, FileText, Image as ImageIcon, Sparkles, MessageCircleHeart, Wand2, ShieldCheck } from 'lucide-react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { getProductKind } from '@/design/factory/get-product-kind'
import { useAuth } from '@/lib/auth-context'
import { LOGIN_PAGE_OVERRIDE_ENABLED, LoginPageOverride } from '@/overrides/login-page'

function getLoginConfig(kind: ReturnType<typeof getProductKind>) {
  if (kind === 'directory') {
    return {
      shell: 'bg-[#f8fbff] text-slate-950',
      panel: 'border border-slate-200 bg-white',
      side: 'border border-slate-200 bg-slate-50',
      muted: 'text-slate-600',
      action: 'bg-slate-950 text-white hover:bg-slate-800',
      icon: Building2,
      title: 'Access your business dashboard',
      body: 'Manage listings, verification details, contact info, and local discovery surfaces from one place.',
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
      title: 'Sign in to your publication workspace',
      body: 'Draft, review, and publish long-form work with the calmer reading system intact.',
    }
  }
  if (kind === 'visual') {
    return {
      shell: 'bg-[linear-gradient(180deg,#fffaf7_0%,#f9f1ff_52%,#fff6ef_100%)] text-slate-900',
      panel: 'border border-white/70 bg-white/88 shadow-[0_24px_80px_rgba(209,173,230,0.16)] backdrop-blur-xl',
      side: 'border border-white/70 bg-white/76 shadow-[0_20px_60px_rgba(209,173,230,0.12)] backdrop-blur-xl',
      muted: 'text-slate-500',
      action:
        'bg-[linear-gradient(135deg,#fdb9ad_0%,#d88bf7_52%,#b56fff_100%)] text-white transition-all duration-200 hover:bg-[linear-gradient(135deg,#f9afa2_0%,#cf7ff4_52%,#aa61fb_100%)] hover:shadow-[0_18px_36px_rgba(190,115,247,0.28)]',
      icon: ImageIcon,
      title: 'Welcome back to your visual assistant',
      body: 'Step back into a softer AI-guided gallery flow with profile tools, image discovery, and publishing access in one place.',
    }
  }
  return {
    shell: 'bg-[#f7f1ea] text-[#261811]',
    panel: 'border border-[#ddcdbd] bg-[#fffaf4]',
    side: 'border border-[#e8dbce] bg-[#f3e8db]',
    muted: 'text-[#71574a]',
    action: 'bg-[#5b2b3b] text-[#fff0f5] hover:bg-[#74364b]',
    icon: Bookmark,
    title: 'Open your curated collections',
    body: 'Manage saved resources, collection notes, and curator identity from a calmer workspace.',
  }
}

export default function LoginPage() {
  if (LOGIN_PAGE_OVERRIDE_ENABLED) {
    return <LoginPageOverride />
  }

  const router = useRouter()
  const { login, isLoading } = useAuth()
  const { recipe } = getFactoryState()
  const productKind = getProductKind(recipe)
  const config = getLoginConfig(productKind)
  const Icon = config.icon
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (!email.trim() || !password.trim()) {
      setError('Enter both your email address and password.')
      return
    }

    try {
      await login(email.trim(), password)
      router.push('/dashboard')
    } catch {
      setError('Unable to sign in right now. Please try again.')
    }
  }

  return (
    <div className={`min-h-screen ${config.shell}`}>
      <NavbarShell />
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
          <div className={`rounded-[2rem] p-8 ${config.side}`}>
            <div className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#ffe3d7_0%,#f3d7ff_100%)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8a5fa7]">
              <Icon className="h-3.5 w-3.5" />
              Assistant access
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.05em]">{config.title}</h1>
            <p className={`mt-5 text-sm leading-8 ${config.muted}`}>{config.body}</p>
            <div className="mt-8 rounded-[1.7rem] bg-[linear-gradient(135deg,#fff0ea_0%,#f8e6ff_58%,#fff7ee_100%)] p-5 shadow-[0_14px_40px_rgba(209,173,230,0.14)]">
              <p className="text-sm font-semibold">Talk to your assistant</p>
              <p className={`mt-2 text-sm leading-7 ${config.muted}`}>
                Resume drafts, open your gallery, and move between image discovery and publishing without losing the softer home-page theme.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/85 px-4 py-2 text-xs font-semibold text-[#8a5fa7]">
                <MessageCircleHeart className="h-3.5 w-3.5" />
                Start a guided session
              </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {[
                { icon: Wand2, title: 'Guided publishing', body: 'Pick up from where your last image flow ended.' },
                { icon: Sparkles, title: 'Cleaner discovery', body: 'Open collections and visual lanes faster.' },
                { icon: ShieldCheck, title: 'Profile continuity', body: 'Keep identity, drafts, and publishing in sync.' },
              ].map((item) => (
                <div key={item.title} className="rounded-[1.5rem] border border-white/70 bg-white/70 px-4 py-4 text-sm shadow-[0_8px_24px_rgba(209,173,230,0.1)]">
                  <item.icon className="h-4 w-4 text-[#b36a9d]" />
                  <p className="mt-3 font-semibold">{item.title}</p>
                  <p className={`mt-2 leading-6 ${config.muted}`}>{item.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={`self-start rounded-[2rem] p-8 ${config.panel}`}>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] opacity-70">Welcome back</p>
            <div className="mt-4 rounded-[1.6rem] bg-[linear-gradient(135deg,#fff4ee_0%,#f7e8ff_100%)] p-5 shadow-[0_12px_30px_rgba(209,173,230,0.12)]">
              <p className="text-sm font-semibold">Sign in and continue your assistant-led workspace.</p>
              <p className={`mt-2 text-sm leading-7 ${config.muted}`}>Open your saved visuals, continue creator conversations, and jump back into the main image lane with the same soft interface as the homepage.</p>
            </div>
            <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
              <input
                className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-[#d895f7]"
                placeholder="Email address"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
              />
              <input
                className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-[#d895f7]"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
              />
              {error ? (
                <p className="text-sm font-medium text-rose-500">{error}</p>
              ) : null}
              <button
                type="submit"
                disabled={isLoading}
                className={`inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-70 ${config.action}`}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
            <div className={`mt-6 flex items-center justify-between text-sm ${config.muted}`}>
              <Link href="/forgot-password" className="hover:underline">Forgot password?</Link>
              <Link href="/register" className="inline-flex items-center gap-2 font-semibold hover:underline">
                <Sparkles className="h-4 w-4" />
                Create account
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
