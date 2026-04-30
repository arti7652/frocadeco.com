import Link from 'next/link'
import { Sparkles, Wand2, GalleryVerticalEnd, Users } from 'lucide-react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { Button } from '@/components/ui/button'
import { SITE_CONFIG } from '@/lib/site-config'

const highlights = [
  { label: 'Visual spaces shaped', value: '12k+' },
  { label: 'Collections connected', value: '180k' },
  { label: 'Creator moments surfaced', value: '8.6k' },
]

const values = [
  { title: 'Assistant-style clarity', description: 'The interface now feels lighter, softer, and more intentional across discovery and publishing.' },
  { title: 'Visual-first discovery', description: 'Images lead the experience while supporting routes stay connected without overwhelming the main flow.' },
  { title: 'Human curation with product polish', description: 'Profiles, collections, and community still matter, but they now live inside a fresher gallery language.' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffaf7_0%,#f9f1ff_52%,#fff6ef_100%)] text-slate-900">
      <NavbarShell />
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
          <div className="rounded-[2rem] border border-white/70 bg-white/78 p-8 shadow-[0_24px_80px_rgba(209,173,230,0.16)] backdrop-blur-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#ffe3d7_0%,#f3d7ff_100%)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8a5fa7]">
              <Sparkles className="h-3.5 w-3.5" />
              About {SITE_CONFIG.name}
            </div>
            <h1 className="mt-5 text-5xl font-semibold tracking-[-0.05em]">A visual platform rebuilt around a softer gallery rhythm.</h1>
            <p className="mt-5 max-w-2xl text-sm leading-8 text-slate-500">
              {SITE_CONFIG.name} now presents publishing, discovery, and community through a brighter assistant-style interface that keeps the product feeling focused on visuals first.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {highlights.map((item) => (
                <div key={item.label} className="rounded-[1.5rem] border border-white/70 bg-[linear-gradient(135deg,#fff4ee_0%,#f7e8ff_100%)] p-5 shadow-[0_10px_30px_rgba(209,173,230,0.12)]">
                  <div className="text-2xl font-semibold">{item.value}</div>
                  <div className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500">{item.label}</div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="outline" className="rounded-full border-white bg-white/80" asChild>
                <Link href="/team">Meet the team</Link>
              </Button>
              <Button className="rounded-full bg-[linear-gradient(135deg,#ffc6b7_0%,#c777ff_100%)] text-white hover:opacity-90" asChild>
                <Link href="/contact">Contact us</Link>
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { icon: Wand2, title: values[0].title, body: values[0].description },
              { icon: GalleryVerticalEnd, title: values[1].title, body: values[1].description },
              { icon: Users, title: values[2].title, body: values[2].description },
            ].map((value) => (
              <div key={value.title} className="rounded-[1.7rem] border border-white/70 bg-white/76 p-6 shadow-[0_16px_42px_rgba(209,173,230,0.12)] backdrop-blur-xl">
                <value.icon className="h-5 w-5 text-[#b36a9d]" />
                <h2 className="mt-4 text-xl font-semibold">{value.title}</h2>
                <p className="mt-2 text-sm leading-7 text-slate-500">{value.body}</p>
              </div>
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
