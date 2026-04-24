import Link from 'next/link'
import { FileText, Building2, LayoutGrid, Tag, Github, Twitter, Linkedin, Image as ImageIcon, User, ArrowRight, Sparkles } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { siteContent } from '@/config/site.content'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { FOOTER_OVERRIDE_ENABLED, FooterOverride } from '@/overrides/footer'

const taskIcons: Record<TaskKey, any> = {
  article: FileText,
  listing: Building2,
  sbm: LayoutGrid,
  classified: Tag,
  image: ImageIcon,
  profile: User,
  social: LayoutGrid,
  pdf: FileText,
  org: Building2,
  comment: FileText,
}

const footerLinks = {
  platform: SITE_CONFIG.tasks.filter((task) => task.enabled && task.key === 'image').map((task) => ({
    name: task.label,
    href: task.route,
    icon: taskIcons[task.key] || LayoutGrid,
  })),
  company: [
    { name: 'About', href: '/about' },
    { name: 'Team', href: '/team' },
    { name: 'Careers', href: '/careers' },
    { name: 'Blog', href: '/blog' },
    { name: 'Press', href: '/press' },
  ],
  resources: [
    { name: 'Help Center', href: '/help' },
    { name: 'Community', href: '/community' },
    { name: 'Developers', href: '/developers' },
    { name: 'Status', href: '/status' },
    { name: 'Contact', href: '/contact' },
  ],
  legal: [
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
    { name: 'Cookies', href: '/cookies' },
    { name: 'Licenses', href: '/licenses' },
  ],
}

const socialLinks = [
  { name: 'Twitter', href: 'https://twitter.com', icon: Twitter },
  { name: 'GitHub', href: 'https://github.com', icon: Github },
  { name: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
]

export function Footer() {
  if (FOOTER_OVERRIDE_ENABLED) {
    return <FooterOverride />
  }

  const { recipe } = getFactoryState()
  const enabledTasks = SITE_CONFIG.tasks.filter((task) => task.enabled)
  const primaryTask = enabledTasks.find((task) => task.key === recipe.primaryTask) || enabledTasks[0]

  if (recipe.footer === 'minimal-footer') {
    return (
      <footer className="border-t border-[#d7deca] bg-[#f4f6ef] text-[#1f2617]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-lg font-semibold">{SITE_CONFIG.name}</p>
            <p className="mt-1 text-sm text-[#56604b]">{SITE_CONFIG.description}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {footerLinks.platform.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-lg border border-[#d7deca] bg-white px-3 py-2 text-sm font-medium text-[#1f2617] hover:bg-[#ebefdf]">
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    )
  }

  if (recipe.footer === 'dense-footer') {
    return (
      <footer className="border-t border-white/70 bg-[linear-gradient(180deg,#fffaf7_0%,#f9f1ff_52%,#fff6ef_100%)] text-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr_1fr]">
            <div className="rounded-[2.25rem] border border-white/70 bg-white/78 p-7 shadow-[0_24px_80px_rgba(209,173,230,0.16)] backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] border border-white/70 bg-[linear-gradient(135deg,#fff4ee_0%,#f7e8ff_100%)] p-1 shadow-[0_10px_30px_rgba(209,173,230,0.12)]">
                  <img src="/favicon.png?v=20260401" alt={`${SITE_CONFIG.name} logo`} width="56" height="56" className="h-full w-full object-contain scale-110" />
                </div>
                <div>
                  <p className="text-lg font-semibold">{SITE_CONFIG.name}</p>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{siteContent.footer.tagline}</p>
                </div>
              </div>
              <p className="mt-5 max-w-md text-sm leading-7 text-slate-600">{SITE_CONFIG.description}</p>
              {primaryTask ? (
                <Link href={primaryTask.route} className="mt-6 inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#ffc6b7_0%,#c777ff_100%)] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90">
                  Explore {primaryTask.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : null}
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {['Warm gradient shell', 'Assistant-app framing', 'Focused gallery navigation', 'Fast CSS-first motion'].map((item) => (
                  <div key={item} className="rounded-[1.25rem] border border-white/70 bg-[linear-gradient(135deg,#fff6ef_0%,#f7ecff_100%)] px-4 py-3 text-sm text-slate-600 shadow-[0_10px_30px_rgba(209,173,230,0.1)]">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-3">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Primary</h3>
                <ul className="mt-4 space-y-3 text-sm text-slate-700">
                  {footerLinks.platform.map((item: any) => (
                    <li key={item.name}><Link href={item.href} className="flex items-center gap-2 hover:text-slate-950">{item.icon ? <item.icon className="h-4 w-4" /> : null}{item.name}</Link></li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Resources</h3>
                <ul className="mt-4 space-y-3 text-sm text-slate-700">
                  {footerLinks.resources.map((item) => (
                    <li key={item.name}><Link href={item.href} className="hover:text-slate-950">{item.name}</Link></li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Connect</h3>
                <div className="mt-4 flex gap-3">
                  {socialLinks.map((item) => (
                    <Link key={item.name} href={item.href} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/70 bg-white/82 p-2.5 text-slate-600 shadow-[0_10px_24px_rgba(209,173,230,0.1)] hover:bg-white hover:text-slate-950">
                      <item.icon className="h-4 w-4" />
                    </Link>
                  ))}
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-500">
                  The footer now stays focused on the gallery experience while support pages remain easy to reach.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-10 border-t border-white/70 pt-5 text-sm text-slate-500">&copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.</div>
        </div>
      </footer>
    )
  }

  if (recipe.footer === 'editorial-footer') {
    return (
      <footer className="border-t border-[#dbc6b6] bg-[linear-gradient(180deg,#fff9f0_0%,#fff1df_100%)] text-[#2f1d16]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr_0.9fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#dbc6b6] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#72594a]">
                <Sparkles className="h-3.5 w-3.5" />
                Editorial desk
              </div>
              <h3 className="mt-5 text-3xl font-semibold tracking-[-0.04em]">{SITE_CONFIG.name}</h3>
              <p className="mt-4 max-w-md text-sm leading-7 text-[#72594a]">{SITE_CONFIG.description}</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8b6d5a]">Sections</h4>
              <ul className="mt-4 space-y-3 text-sm">
                {footerLinks.platform.map((item: any) => (
                  <li key={item.name}><Link href={item.href} className="hover:text-[#2f1d16]">{item.name}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8b6d5a]">Company</h4>
              <ul className="mt-4 space-y-3 text-sm">
                {footerLinks.company.map((item) => (
                  <li key={item.name}><Link href={item.href} className="hover:text-[#2f1d16]">{item.name}</Link></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className="border-t border-white/70 bg-[linear-gradient(180deg,#fffaf7_0%,#f9f1ff_52%,#fff6ef_100%)] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_0.8fr]">
          <div className="rounded-[2rem] border border-white/70 bg-white/78 p-6 shadow-[0_24px_80px_rgba(209,173,230,0.16)] backdrop-blur-xl">
            <Link href="/" className="flex items-center gap-3">
              <div className="h-14 w-14 overflow-hidden rounded-2xl border border-white/70 bg-[linear-gradient(135deg,#fff4ee_0%,#f7e8ff_100%)] p-1 shadow-[0_10px_30px_rgba(209,173,230,0.12)]">
                <img src="/favicon.png?v=20260401" alt={`${SITE_CONFIG.name} logo`} width="56" height="56" className="h-full w-full object-contain scale-110" />
              </div>
              <div>
                <span className="block text-lg font-semibold">{SITE_CONFIG.name}</span>
                <span className="text-xs uppercase tracking-[0.22em] text-slate-500">{siteContent.footer.tagline}</span>
              </div>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-600">{SITE_CONFIG.description}</p>
          </div>
          {(['platform', 'company', 'resources', 'legal'] as const).map((section) => (
            <div key={section}>
              <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">{section}</h3>
              <ul className="mt-5 space-y-3 text-sm text-slate-600">
                {footerLinks[section].map((item: any) => (
                  <li key={item.name}><Link href={item.href} className="flex items-center gap-2 hover:text-slate-950">{item.icon ? <item.icon className="h-4 w-4" /> : null}{item.name}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-white/70 pt-6 text-center text-sm text-slate-500">&copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.</div>
      </div>
    </footer>
  )
}
