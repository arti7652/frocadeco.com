import { Building2, FileText, Image as ImageIcon, Mail, MapPin, Phone, Sparkles, Bookmark, Wand2, MessageSquareMore } from 'lucide-react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { SITE_CONFIG } from '@/lib/site-config'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { getProductKind } from '@/design/factory/get-product-kind'
import { CONTACT_PAGE_OVERRIDE_ENABLED, ContactPageOverride } from '@/overrides/contact-page'

function getTone(kind: ReturnType<typeof getProductKind>) {
  if (kind === 'directory') {
    return {
      shell: 'bg-[#f8fbff] text-slate-950',
      panel: 'border border-slate-200 bg-white',
      soft: 'border border-slate-200 bg-slate-50',
      muted: 'text-slate-600',
      action: 'bg-slate-950 text-white hover:bg-slate-800',
    }
  }
  if (kind === 'editorial') {
    return {
      shell: 'bg-[#fbf6ee] text-[#241711]',
      panel: 'border border-[#dcc8b7] bg-[#fffdfa]',
      soft: 'border border-[#e6d6c8] bg-[#fff4e8]',
      muted: 'text-[#6e5547]',
      action: 'bg-[#241711] text-[#fff1e2] hover:bg-[#3a241b]',
    }
  }
  if (kind === 'visual') {
    return {
      shell: 'bg-[linear-gradient(180deg,#fffaf7_0%,#f9f1ff_52%,#fff6ef_100%)] text-slate-900',
      panel: 'border border-white/70 bg-white/88 shadow-[0_24px_80px_rgba(209,173,230,0.16)] backdrop-blur-xl',
      soft: 'border border-white/70 bg-white/76 shadow-[0_16px_42px_rgba(209,173,230,0.12)] backdrop-blur-xl',
      muted: 'text-slate-500',
      action: 'bg-[linear-gradient(135deg,#ffc6b7_0%,#c777ff_100%)] text-white hover:opacity-90',
    }
  }
  return {
    shell: 'bg-[#f7f1ea] text-[#261811]',
    panel: 'border border-[#ddcdbd] bg-[#fffaf4]',
    soft: 'border border-[#e8dbce] bg-[#f3e8db]',
    muted: 'text-[#71574a]',
    action: 'bg-[#5b2b3b] text-[#fff0f5] hover:bg-[#74364b]',
  }
}

export default function ContactPage() {
  if (CONTACT_PAGE_OVERRIDE_ENABLED) {
    return <ContactPageOverride />
  }

  const siteDomain = SITE_CONFIG.baseUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')
  const contactEmail =
    process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ||
    `hello@${siteDomain.replace(/^www\./, '')}`
  const contactEmailLabel =
    process.env.NEXT_PUBLIC_CONTACT_EMAIL_LABEL?.trim() || contactEmail

  const { recipe } = getFactoryState()
  const productKind = getProductKind(recipe)
  const tone = getTone(productKind)
  const lanes =
    productKind === 'directory'
      ? [
          { icon: Building2, title: 'Business onboarding', body: 'Add listings, verify operational details, and bring your business surface live quickly.' },
          { icon: Phone, title: 'Partnership support', body: 'Talk through bulk publishing, local growth, and operational setup questions.' },
          { icon: MapPin, title: 'Coverage requests', body: 'Need a new geography or category lane? We can shape the directory around it.' },
        ]
      : productKind === 'editorial'
        ? [
            { icon: FileText, title: 'Editorial submissions', body: 'Pitch essays, columns, and long-form ideas that fit the publication.' },
            { icon: Mail, title: 'Newsletter partnerships', body: 'Coordinate sponsorships, collaborations, and issue-level campaigns.' },
            { icon: Sparkles, title: 'Contributor support', body: 'Get help with voice, formatting, and publication workflow questions.' },
          ]
        : productKind === 'visual'
          ? [
              { icon: ImageIcon, title: 'Creator collaborations', body: 'Discuss gallery launches, creator features, and visual campaigns.' },
              { icon: Sparkles, title: 'Licensing and use', body: 'Reach out about usage rights, commercial requests, and visual partnerships.' },
              { icon: Mail, title: 'Media kits', body: 'Request creator decks, editorial support, or visual feature placement.' },
            ]
          : [
              { icon: Bookmark, title: 'Collection submissions', body: 'Suggest resources, boards, and links that deserve a place in the library.' },
              { icon: Mail, title: 'Resource partnerships', body: 'Coordinate curation projects, reference pages, and link programs.' },
              { icon: Sparkles, title: 'Curator support', body: 'Need help organizing shelves, collections, or profile-connected boards?' },
            ]

  return (
    <div className={`min-h-screen ${tone.shell}`}>
      <NavbarShell />
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#ffe3d7_0%,#f3d7ff_100%)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8a5fa7]">
              <MessageSquareMore className="h-3.5 w-3.5" />
              Contact {SITE_CONFIG.name}
            </div>
            <h1 className="mt-4 text-5xl font-semibold tracking-[-0.05em]">Reach the team through the same soft assistant-style experience.</h1>
            <p className={`mt-5 max-w-2xl text-sm leading-8 ${tone.muted}`}>Share what you are trying to publish, launch, or resolve and we will route it through the right visual lane instead of a flat generic support bucket.</p>
            <div className="mt-8 rounded-[1.7rem] bg-[linear-gradient(135deg,#fff0ea_0%,#f8e6ff_58%,#fff7ee_100%)] p-5 shadow-[0_14px_40px_rgba(209,173,230,0.14)]">
              <div className="flex items-start gap-3">
                <Wand2 className="mt-1 h-5 w-5 text-[#b36a9d]" />
                <div>
                  <p className="text-sm font-semibold">Visual support, not plain ticketing</p>
                  <p className={`mt-2 text-sm leading-7 ${tone.muted}`}>
                    Collaboration requests, licensing questions, creator features, and publishing support now sit inside a page layout that matches the home experience.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-8 space-y-4">
              {lanes.map((lane) => (
                <div key={lane.title} className={`rounded-[1.6rem] p-5 ${tone.soft}`}>
                  <lane.icon className="h-5 w-5" />
                  <h2 className="mt-3 text-xl font-semibold">{lane.title}</h2>
                  <p className={`mt-2 text-sm leading-7 ${tone.muted}`}>{lane.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-[2rem] p-7 ${tone.panel}`}>
            <h2 className="text-2xl font-semibold">Send a message</h2>
            <p className={`mt-3 text-sm leading-7 ${tone.muted}`}>Use the form below to reach the right team with full context. The interface keeps the same pastel card rhythm and lighter visual tone already introduced on the homepage.</p>
            <form className="mt-6 grid gap-4">
              <input className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm" placeholder="Your name" />
              <input className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm" placeholder="Email address" />
              <input className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm" placeholder="What do you need help with?" />
              <textarea className="min-h-[180px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" placeholder="Share the full context so we can respond with the right next step." />
              <button type="submit" className={`inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold ${tone.action}`}>Send message</button>
            </form>
            <div className={`mt-6 rounded-[1.6rem] p-5 ${tone.soft}`}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold">Prefer email?</p>
                  <p className={`mt-1 text-sm leading-7 ${tone.muted}`}>Reach the team directly through the mailbox managed from your environment settings.</p>
                </div>
                <a
                  href={`mailto:${contactEmail}`}
                  className={`inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-semibold ${tone.action}`}
                >
                  Email us
                </a>
              </div>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-slate-700">
                <Mail className="h-4 w-4" />
                {contactEmailLabel}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
