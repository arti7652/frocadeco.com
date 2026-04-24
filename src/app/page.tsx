import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Bookmark, Building2, Compass, FileText, Globe2, Image as ImageIcon, LayoutGrid, MapPin, ShieldCheck, Tag, User } from 'lucide-react'
import { ContentImage } from '@/components/shared/content-image'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { SchemaJsonLd } from '@/components/seo/schema-jsonld'
import { TaskPostCard } from '@/components/shared/task-post-card'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { buildPageMetadata } from '@/lib/seo'
import { fetchTaskPosts } from '@/lib/task-data'
import { siteContent } from '@/config/site.content'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { getProductKind, type ProductKind } from '@/design/factory/get-product-kind'
import type { SitePost } from '@/lib/site-connector'
import { HOME_PAGE_OVERRIDE_ENABLED, HomePageOverride } from '@/overrides/home-page'

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/',
    title: siteContent.home.metadata.title,
    description: siteContent.home.metadata.description,
    openGraphTitle: siteContent.home.metadata.openGraphTitle,
    openGraphDescription: siteContent.home.metadata.openGraphDescription,
    image: SITE_CONFIG.defaultOgImage,
    keywords: [...siteContent.home.metadata.keywords],
  })
}

type EnabledTask = (typeof SITE_CONFIG.tasks)[number]
type TaskFeedItem = { task: EnabledTask; posts: SitePost[] }

const taskIcons: Record<TaskKey, any> = {
  article: FileText,
  listing: Building2,
  sbm: Bookmark,
  classified: Tag,
  image: ImageIcon,
  profile: User,
}

function resolveTaskKey(value: unknown, fallback: TaskKey): TaskKey {
  if (value === 'listing' || value === 'classified' || value === 'article' || value === 'image' || value === 'profile' || value === 'sbm') return value
  return fallback
}

function getTaskHref(task: TaskKey, slug: string) {
  const route = SITE_CONFIG.tasks.find((item) => item.key === task)?.route || `/${task}`
  return `${route}/${slug}`
}

function getPostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const contentImage = typeof post?.content === 'object' && post?.content && Array.isArray((post.content as any).images)
    ? (post.content as any).images.find((url: unknown) => typeof url === 'string' && url)
    : null
  const logo = typeof post?.content === 'object' && post?.content && typeof (post.content as any).logo === 'string'
    ? (post.content as any).logo
    : null
  return mediaUrl || contentImage || logo || '/placeholder.svg?height=900&width=1400'
}

function getPostMeta(post?: SitePost | null) {
  if (!post || typeof post.content !== 'object' || !post.content) return { location: '', category: '' }
  const content = post.content as Record<string, unknown>
  return {
    location: typeof content.address === 'string' ? content.address : typeof content.location === 'string' ? content.location : '',
    category: typeof content.category === 'string' ? content.category : typeof post.tags?.[0] === 'string' ? post.tags[0] : '',
  }
}

function getDirectoryTone(brandPack: string) {
  if (brandPack === 'market-utility') {
    return {
      shell: 'bg-[#f5f7f1] text-[#1f2617]',
      hero: 'bg-[linear-gradient(180deg,#eef4e4_0%,#f8faf4_100%)]',
      panel: 'border border-[#d5ddc8] bg-white shadow-[0_24px_64px_rgba(64,76,34,0.08)]',
      soft: 'border border-[#d5ddc8] bg-[#eff3e7]',
      muted: 'text-[#5b664c]',
      title: 'text-[#1f2617]',
      badge: 'bg-[#1f2617] text-[#edf5dc]',
      action: 'bg-[#1f2617] text-[#edf5dc] hover:bg-[#2f3a24]',
      actionAlt: 'border border-[#d5ddc8] bg-white text-[#1f2617] hover:bg-[#eef3e7]',
    }
  }
  return {
    shell: 'bg-[#f8fbff] text-slate-950',
    hero: 'bg-[linear-gradient(180deg,#eef6ff_0%,#ffffff_100%)]',
    panel: 'border border-slate-200 bg-white shadow-[0_24px_64px_rgba(15,23,42,0.08)]',
    soft: 'border border-slate-200 bg-slate-50',
    muted: 'text-slate-600',
    title: 'text-slate-950',
    badge: 'bg-slate-950 text-white',
    action: 'bg-slate-950 text-white hover:bg-slate-800',
    actionAlt: 'border border-slate-200 bg-white text-slate-950 hover:bg-slate-100',
  }
}

function getEditorialTone() {
  return {
    shell: 'bg-[#fbf6ee] text-[#241711]',
    panel: 'border border-[#dcc8b7] bg-[#fffdfa] shadow-[0_24px_60px_rgba(77,47,27,0.08)]',
    soft: 'border border-[#e6d6c8] bg-[#fff4e8]',
    muted: 'text-[#6e5547]',
    title: 'text-[#241711]',
    badge: 'bg-[#241711] text-[#fff1e2]',
    action: 'bg-[#241711] text-[#fff1e2] hover:bg-[#3a241b]',
    actionAlt: 'border border-[#dcc8b7] bg-transparent text-[#241711] hover:bg-[#f5e7d7]',
  }
}

function getVisualTone() {
  return {
    shell: 'bg-[linear-gradient(180deg,#fffbf8_0%,#f9f3ff_50%,#fef8f2_100%)] text-slate-900',
    panel: 'border border-white/70 bg-white/84 shadow-[0_30px_100px_rgba(209,173,230,0.16)] backdrop-blur-xl',
    soft: 'border border-white/70 bg-white/76 backdrop-blur-md',
    muted: 'text-slate-500',
    title: 'text-slate-900',
    badge: 'bg-[linear-gradient(135deg,#ffc6b7_0%,#d48cff_100%)] text-[#6d3a8a]',
    action: 'bg-[linear-gradient(135deg,#ffc6b7_0%,#c777ff_100%)] text-white hover:opacity-90',
    actionAlt: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
  }
}

function getCurationTone() {
  return {
    shell: 'bg-[#f7f1ea] text-[#261811]',
    panel: 'border border-[#ddcdbd] bg-[#fffaf4] shadow-[0_24px_60px_rgba(91,56,37,0.08)]',
    soft: 'border border-[#e8dbce] bg-[#f3e8db]',
    muted: 'text-[#71574a]',
    title: 'text-[#261811]',
    badge: 'bg-[#5b2b3b] text-[#fff0f5]',
    action: 'bg-[#5b2b3b] text-[#fff0f5] hover:bg-[#74364b]',
    actionAlt: 'border border-[#ddcdbd] bg-transparent text-[#261811] hover:bg-[#efe3d6]',
  }
}

function DirectoryHome({ primaryTask, enabledTasks, listingPosts, classifiedPosts, profilePosts, brandPack }: {
  primaryTask?: EnabledTask
  enabledTasks: EnabledTask[]
  listingPosts: SitePost[]
  classifiedPosts: SitePost[]
  profilePosts: SitePost[]
  brandPack: string
}) {
  const tone = getDirectoryTone(brandPack)
  const featuredListings = (listingPosts.length ? listingPosts : classifiedPosts).slice(0, 3)
  const featuredTaskKey: TaskKey = listingPosts.length ? 'listing' : 'classified'
  const quickRoutes = enabledTasks.slice(0, 4)

  return (
    <main>
      <section className={tone.hero}>
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
          <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div>
              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${tone.badge}`}>
                <Compass className="h-3.5 w-3.5" />
                Local discovery product
              </span>
              <h1 className={`mt-6 max-w-4xl text-5xl font-semibold tracking-[-0.06em] sm:text-6xl ${tone.title}`}>
                Search businesses, compare options, and act fast without digging through generic feeds.
              </h1>
              <p className={`mt-6 max-w-2xl text-base leading-8 ${tone.muted}`}>{SITE_CONFIG.description}</p>

              <div className={`mt-8 grid gap-3 rounded-[2rem] p-4 ${tone.panel} md:grid-cols-[1.25fr_0.8fr_auto]`}>
                <div className="rounded-full bg-black/5 px-4 py-3 text-sm">What do you need today?</div>
                <div className="rounded-full bg-black/5 px-4 py-3 text-sm">Choose area or city</div>
                <Link href={primaryTask?.route || '/listings'} className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${tone.action}`}>
                  Browse now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  ['Verified businesses', `${featuredListings.length || 3}+ highlighted surfaces`],
                  ['Fast scan rhythm', 'More utility, less filler'],
                  ['Action first', 'Call, visit, shortlist, compare'],
                ].map(([label, value]) => (
                  <div key={label} className={`rounded-[1.4rem] p-4 ${tone.soft}`}>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] opacity-70">{label}</p>
                    <p className="mt-2 text-lg font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              <div className={`rounded-[2rem] p-6 ${tone.panel}`}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] opacity-70">Primary lane</p>
                    <h2 className="mt-2 text-3xl font-semibold">{primaryTask?.label || 'Listings'}</h2>
                  </div>
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <p className={`mt-4 text-sm leading-7 ${tone.muted}`}>{primaryTask?.description || 'Structured discovery for services, offers, and business surfaces.'}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {quickRoutes.map((task) => {
                  const Icon = taskIcons[task.key as TaskKey] || LayoutGrid
                  return (
                    <Link key={task.key} href={task.route} className={`rounded-[1.6rem] p-5 ${tone.soft}`}>
                      <Icon className="h-5 w-5" />
                      <h3 className="mt-4 text-lg font-semibold">{task.label}</h3>
                      <p className={`mt-2 text-sm leading-7 ${tone.muted}`}>{task.description}</p>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 border-b border-border pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Featured businesses</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">Strong listings with clearer trust cues.</h2>
          </div>
          <Link href="/listings" className="text-sm font-semibold text-primary hover:opacity-80">Open listings</Link>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {featuredListings.map((post) => (
            <TaskPostCard key={post.id} post={post} href={getTaskHref(featuredTaskKey, post.slug)} taskKey={featuredTaskKey} />
          ))}
        </div>
      </section>

      <section className={`${tone.shell}`}>
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
          <div className={`rounded-[2rem] p-7 ${tone.panel}`}>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] opacity-70">What makes this different</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">Built like a business directory, not a recolored content site.</h2>
            <ul className={`mt-6 space-y-3 text-sm leading-7 ${tone.muted}`}>
              <li>Search-first hero instead of a magazine headline.</li>
              <li>Action-oriented listing cards with trust metadata.</li>
              <li>Support lanes for offers, businesses, and profiles.</li>
            </ul>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {(profilePosts.length ? profilePosts : classifiedPosts).slice(0, 4).map((post) => {
              const meta = getPostMeta(post)
              const taskKey = resolveTaskKey(post.task, profilePosts.length ? 'profile' : 'classified')
              return (
                <Link key={post.id} href={getTaskHref(taskKey, post.slug)} className={`overflow-hidden rounded-[1.8rem] ${tone.panel}`}>
                  <div className="relative h-44 overflow-hidden">
                    <ContentImage src={getPostImage(post)} alt={post.title} fill className="object-cover" />
                  </div>
                  <div className="p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] opacity-70">{meta.category || post.task || 'Profile'}</p>
                    <h3 className="mt-2 text-xl font-semibold">{post.title}</h3>
                    <p className={`mt-2 text-sm leading-7 ${tone.muted}`}>{post.summary || 'Quick access to local information and related surfaces.'}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}

function EditorialHome({ primaryTask, articlePosts, supportTasks }: { primaryTask?: EnabledTask; articlePosts: SitePost[]; supportTasks: EnabledTask[] }) {
  const tone = getEditorialTone()
  const lead = articlePosts[0]
  const side = articlePosts.slice(1, 5)

  return (
    <main className={tone.shell}>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div>
            <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${tone.badge}`}>
              <FileText className="h-3.5 w-3.5" />
              Reading-first publication
            </span>
            <h1 className={`mt-6 max-w-4xl text-5xl font-semibold tracking-[-0.06em] sm:text-6xl ${tone.title}`}>
              Essays, analysis, and slower reading designed like a publication, not a dashboard.
            </h1>
            <p className={`mt-6 max-w-2xl text-base leading-8 ${tone.muted}`}>{SITE_CONFIG.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={primaryTask?.route || '/articles'} className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${tone.action}`}>
                Start reading
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/about" className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${tone.actionAlt}`}>
                About the publication
              </Link>
            </div>
          </div>

          <aside className={`rounded-[2rem] p-6 ${tone.panel}`}>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] opacity-70">Inside this issue</p>
            <div className="mt-5 space-y-5">
              {side.map((post) => (
                <Link key={post.id} href={`/articles/${post.slug}`} className="block border-b border-black/10 pb-5 last:border-b-0 last:pb-0">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] opacity-60">Feature</p>
                  <h3 className="mt-2 text-xl font-semibold">{post.title}</h3>
                  <p className={`mt-2 text-sm leading-7 ${tone.muted}`}>{post.summary || 'Long-form perspective with a calmer reading rhythm.'}</p>
                </Link>
              ))}
            </div>
          </aside>
        </div>

        {lead ? (
          <div className={`mt-12 overflow-hidden rounded-[2.5rem] ${tone.panel}`}>
            <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
              <div className="relative min-h-[360px] overflow-hidden">
                <ContentImage src={getPostImage(lead)} alt={lead.title} fill className="object-cover" />
              </div>
              <div className="p-8 lg:p-10">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] opacity-70">Lead story</p>
                <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">{lead.title}</h2>
                <p className={`mt-4 text-sm leading-8 ${tone.muted}`}>{lead.summary || 'A more deliberate lead story surface with room for a proper narrative setup.'}</p>
                <Link href={`/articles/${lead.slug}`} className={`mt-8 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${tone.action}`}>
                  Read article
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {supportTasks.slice(0, 3).map((task) => (
            <Link key={task.key} href={task.route} className={`rounded-[1.8rem] p-6 ${tone.soft}`}>
              <h3 className="text-xl font-semibold">{task.label}</h3>
              <p className={`mt-3 text-sm leading-7 ${tone.muted}`}>{task.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}

function VisualHome({ primaryTask, imagePosts, profilePosts, articlePosts }: { primaryTask?: EnabledTask; imagePosts: SitePost[]; profilePosts: SitePost[]; articlePosts: SitePost[] }) {
  const tone = getVisualTone()
  const gallery = imagePosts.length ? imagePosts.slice(0, 8) : articlePosts.slice(0, 8)
  const heroGallery = gallery.slice(0, 6)
  const lead = gallery[3] || gallery[0]
  const stream = gallery.slice(4, 8)
  const creators = profilePosts.length ? profilePosts.slice(0, 3) : gallery.slice(0, 3)
  const archiveRoutes = SITE_CONFIG.tasks.filter((task) => task.key !== primaryTask?.key).slice(0, 5)
  const leftPost = heroGallery[0] || lead
  const centerPost = heroGallery[1] || leftPost
  const rightPost = heroGallery[2] || lead
  const leftHref = leftPost ? getTaskHref(resolveTaskKey(leftPost.task, 'image'), leftPost.slug) : '/images'
  const centerHref = centerPost ? getTaskHref(resolveTaskKey(centerPost.task, 'image'), centerPost.slug) : '/images'
  const rightHref = rightPost ? getTaskHref(resolveTaskKey(rightPost.task, 'image'), rightPost.slug) : '/images'

  return (
    <main className={tone.shell}>
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-10 sm:px-6 lg:px-8 lg:pb-16 lg:pt-6">
        <div className="relative overflow-hidden rounded-[2.8rem] border border-white/70 bg-[linear-gradient(135deg,rgba(249,239,232,0.96)_0%,rgba(248,237,255,0.96)_52%,rgba(255,247,235,0.94)_100%)] px-6 py-12 shadow-[0_30px_100px_rgba(209,173,230,0.14)] sm:px-8">
          <div className="pointer-events-none absolute left-8 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border border-white/80 bg-white/50" />
          <div className="pointer-events-none absolute right-6 top-20 h-8 w-8 rounded-full border-2 border-white/70" />
          <div className="pointer-events-none absolute left-8 top-32 h-0 w-0 rotate-12 border-b-[12px] border-l-[10px] border-r-[10px] border-b-white/60 border-l-transparent border-r-transparent opacity-70" />
          <div className="pointer-events-none absolute left-5 bottom-5 grid grid-cols-4 gap-2 opacity-60">
            {Array.from({ length: 16 }).map((_, index) => (
              <span key={index} className="h-1.5 w-1.5 rounded-full bg-white/90" />
            ))}
          </div>
          <div className="mx-auto max-w-3xl text-center">
            <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${tone.badge}`}>
              <Compass className="h-3.5 w-3.5" />
              Visual AI companion
            </span>
            <h1 className={`mt-6 text-5xl font-semibold tracking-[-0.07em] sm:text-6xl ${tone.title}`}>
              A softer assistant to help you create, explore, and organize visuals.
            </h1>
            <p className={`mx-auto mt-6 max-w-2xl text-base leading-8 ${tone.muted}`}>
              {SITE_CONFIG.description} The layout now follows the reference more literally: warm blush gradients, elevated white devices, and an AI-assistant style composition that feels distinct from the shared base repo.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href={primaryTask?.route || '/images'} className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${tone.action}`}>
                Start exploring
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/create/image" className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${tone.actionAlt}`}>
                Create a visual
              </Link>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-center gap-8 lg:flex-row lg:items-end lg:gap-10">
            <Link href={leftHref} className="phone-frame ambient-ring relative w-full max-w-[292px] p-3 lg:mb-4">
              <div className="relative min-h-[525px] overflow-hidden rounded-[2rem]">
                <ContentImage src={getPostImage(leftPost)} alt={leftPost?.title || 'Assistant visual'} fill className="object-cover" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(233,189,255,0.18)_45%,rgba(118,76,152,0.58)_100%)]" />
                <div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 py-4 text-[11px] font-semibold text-slate-900">
                  <span>9:41</span>
                  <span className="rounded-full bg-white/72 px-2 py-1 text-[10px] text-[#8e59a8]">Assistant</span>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/72">Experience AI Assistant</p>
                  <h2 className="mt-3 text-[2.25rem] font-semibold leading-[1.05] tracking-[-0.06em]">
                    Your smart AI assistant is ready helping you..
                  </h2>
                  <p className="mt-4 text-sm leading-6 text-white/78">
                    Explore image-led posts and collections through a calmer assistant-style flow with faster discovery.
                  </p>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="rounded-full bg-white/20 px-4 py-2 text-xs font-semibold backdrop-blur">Open gallery</span>
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-8 rounded-full bg-white/90" />
                      <span className="h-1.5 w-2 rounded-full bg-white/50" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            <Link href={centerHref} className="phone-frame ambient-ring relative z-10 w-full max-w-[312px] p-3">
              <div className="rounded-[2rem] bg-white p-4">
                <div className="rounded-[1.8rem] bg-[linear-gradient(180deg,#fff8f4_0%,#f7e8ff_54%,#fff4ea_100%)] p-5 shadow-[0_16px_38px_rgba(209,173,230,0.16)]">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-900">
                    <span>9:41</span>
                    <span className="rounded-full bg-white px-2 py-1 text-[10px] text-[#b36a9d]">AI</span>
                  </div>
                  <div className="mt-5 text-center">
                    <p className="text-xl font-semibold tracking-[-0.05em] text-[#564080]">Hey Arafat</p>
                    <p className="mt-1 text-2xl font-semibold tracking-[-0.05em] text-[#423066]">How can I help you?</p>
                  </div>

                  <div className="mt-5 rounded-[1.4rem] border border-white/70 bg-white/88 p-3 shadow-[0_8px_26px_rgba(209,173,230,0.12)]">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
                        Ask me anything
                      </div>
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#ffcfbd_0%,#b97cff_100%)] text-white">
                        <Compass className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-4 gap-2 text-[11px] font-medium text-slate-500">
                      {['Images', 'Ideas', 'Tasks', 'Voice'].map((item) => (
                        <div key={item} className="rounded-full bg-[#fff7f1] px-3 py-2 text-center">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-[1.5rem] bg-[linear-gradient(135deg,#f2b8ff_0%,#f9d7ff_36%,#ffd9be_100%)] p-4 text-[#5a3a74] shadow-[0_12px_32px_rgba(209,173,230,0.18)]">
                  <p className="text-sm font-semibold">Talk to {SITE_CONFIG.name} AI</p>
                  <p className="mt-1 text-xs opacity-80">Enhance ideas with a softer assistant-led interface.</p>
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold">
                    <Globe2 className="h-3.5 w-3.5" />
                    Get Start
                  </div>
                </div>

                <div className="mt-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">Quick Tools</p>
                    <span className="text-xs text-slate-500">View all</span>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    {[
                      ['Strategic', 'Prompt planning'],
                      ['Trending', 'Explore fresh visuals'],
                      ['Content', 'Organize image ideas'],
                    ].map(([title, body]) => (
                      <div key={title} className="rounded-[1.25rem] border border-slate-100 bg-white p-3 shadow-[0_10px_24px_rgba(209,173,230,0.1)]">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(135deg,#fff0ea_0%,#f6d8ff_100%)] text-[#b36a9d]">
                          <ImageIcon className="h-4 w-4" />
                        </div>
                        <p className="mt-3 text-sm font-semibold text-slate-900">{title}</p>
                        <p className="mt-1 text-[11px] leading-5 text-slate-500">{body}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-5 gap-2 rounded-[1.3rem] border border-slate-100 bg-white p-2 text-center text-[11px] font-medium text-slate-500 shadow-[0_8px_20px_rgba(209,173,230,0.08)]">
                  {['Home', 'Tasks', 'Chat', 'Projects', 'Profile'].map((item, index) => (
                    <div key={item} className={`rounded-full px-2 py-2 ${index === 2 ? 'bg-[linear-gradient(135deg,#ffd5c8_0%,#c781ff_100%)] text-white' : ''}`}>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </Link>

            <Link href={rightHref} className="phone-frame ambient-ring relative w-full max-w-[236px] p-3 lg:mb-4">
              <div className="min-h-[465px] rounded-[2rem] bg-[linear-gradient(180deg,#ffe5d6_0%,#f4d2ff_46%,#fff0df_100%)] p-5">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-900">
                  <span>9:41</span>
                  <span>•••</span>
                </div>
                <div className="mt-14 flex justify-center">
                  <div className="flex h-40 w-40 items-center justify-center rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.55)_0%,rgba(241,198,255,0.42)_48%,rgba(226,160,255,0.22)_100%)] shadow-[0_20px_60px_rgba(209,173,230,0.2)]">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/70 bg-white/40 text-[#ba77ac]">
                      <Compass className="h-10 w-10" />
                    </div>
                  </div>
                </div>
                <div className="mt-12 text-center">
                  <p className="text-xs leading-6 text-[#8d739d]">
                    and can’t find peace though heavy and forget to breathe
                  </p>
                  <p className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-[#54405c]">
                    Emptiness settles where it used to be.
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <div className={`overflow-hidden rounded-[2.2rem] ${tone.panel}`}>
            {lead ? (
              <div className="grid lg:grid-cols-[1.02fr_0.98fr]">
                <div className="relative min-h-[340px] overflow-hidden">
                  <ContentImage src={getPostImage(lead)} alt={lead.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,201,184,0.08)_0%,rgba(221,171,255,0.16)_50%,rgba(255,255,255,0.16)_100%)]" />
                </div>
                <div className="p-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Spotlight visual</p>
                  <h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em]">{lead.title}</h2>
                  <p className={`mt-4 text-sm leading-8 ${tone.muted}`}>
                    {lead.summary || 'A lead visual surface with softer spacing, warmer gradients, and a calmer assistant-led rhythm pulled closer to the reference interface.'}
                  </p>
                  <Link href={getTaskHref(resolveTaskKey(lead.task, 'image'), lead.slug)} className={`mt-7 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${tone.action}`}>
                    View image post
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ) : null}
          </div>

          <div className="grid gap-4">
            <div className={`rounded-[2rem] p-6 ${tone.panel}`}>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Assistant notes</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">Less marketing site, more soft assistant product.</h2>
              <p className={`mt-4 text-sm leading-8 ${tone.muted}`}>
                The new system leans on warm blush gradients, elevated white cards, and softer assistant-app framing so the site tracks much closer to the supplied reference.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {creators.map((post) => (
                <Link key={post.id} href={getTaskHref(resolveTaskKey(post.task, 'image'), post.slug)} className={`rounded-[1.8rem] p-5 ${tone.soft}`}>
                  <div className="relative h-40 overflow-hidden rounded-[1.2rem]">
                    <ContentImage src={getPostImage(post)} alt={post.title} fill className="object-cover" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{post.title}</h3>
                  <p className={`mt-2 text-sm leading-7 ${tone.muted}`}>{post.summary || 'Supporting visual lane with a quieter presentation.'}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12">
          <div className="grid gap-4 md:grid-cols-3">
            {stream.map((post, index) => (
              <Link key={post.id} href={getTaskHref(resolveTaskKey(post.task, 'image'), post.slug)} className={`overflow-hidden rounded-[1.8rem] ${index === 1 ? tone.panel : tone.soft}`}>
                <div className="relative h-56 overflow-hidden">
                  <ContentImage src={getPostImage(post)} alt={post.title} fill className="object-cover" />
                </div>
                <div className="p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">Lane {index + 1}</p>
                  <h3 className="mt-3 text-xl font-semibold">{post.title}</h3>
                  <p className={`mt-2 text-sm leading-7 ${tone.muted}`}>{post.summary || 'A supporting gallery tile in the homepage stream.'}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

function CurationHome({ primaryTask, bookmarkPosts, profilePosts, articlePosts }: { primaryTask?: EnabledTask; bookmarkPosts: SitePost[]; profilePosts: SitePost[]; articlePosts: SitePost[] }) {
  const tone = getCurationTone()
  const collections = bookmarkPosts.length ? bookmarkPosts.slice(0, 4) : articlePosts.slice(0, 4)
  const people = profilePosts.slice(0, 3)

  return (
    <main className={tone.shell}>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-start">
          <div>
            <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${tone.badge}`}>
              <Bookmark className="h-3.5 w-3.5" />
              Curated collections
            </span>
            <h1 className={`mt-6 max-w-4xl text-5xl font-semibold tracking-[-0.06em] sm:text-6xl ${tone.title}`}>
              Save, organize, and revisit resources through shelves, boards, and curated collections.
            </h1>
            <p className={`mt-6 max-w-2xl text-base leading-8 ${tone.muted}`}>{SITE_CONFIG.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={primaryTask?.route || '/sbm'} className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${tone.action}`}>
                Open collections
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/profile" className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${tone.actionAlt}`}>
                Explore curators
              </Link>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {collections.map((post) => (
              <Link key={post.id} href={getTaskHref(resolveTaskKey(post.task, 'sbm'), post.slug)} className={`rounded-[1.8rem] p-6 ${tone.panel}`}>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] opacity-70">Collection</p>
                <h3 className="mt-3 text-2xl font-semibold">{post.title}</h3>
                <p className={`mt-3 text-sm leading-8 ${tone.muted}`}>{post.summary || 'A calmer bookmark surface with room for context and grouping.'}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className={`rounded-[2rem] p-7 ${tone.panel}`}>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] opacity-70">Why this feels different</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">More like saved boards and reading shelves than a generic post feed.</h2>
            <p className={`mt-4 max-w-2xl text-sm leading-8 ${tone.muted}`}>The structure is calmer, the cards are less noisy, and the page encourages collecting and returning instead of forcing everything into a fast-scrolling list.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {people.map((post) => (
              <Link key={post.id} href={`/profile/${post.slug}`} className={`rounded-[1.8rem] p-5 ${tone.soft}`}>
                <div className="relative h-32 overflow-hidden rounded-[1.2rem]">
                  <ContentImage src={getPostImage(post)} alt={post.title} fill className="object-cover" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{post.title}</h3>
                <p className={`mt-2 text-sm leading-7 ${tone.muted}`}>Curator profile, saved resources, and collection notes.</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default async function HomePage() {
  if (HOME_PAGE_OVERRIDE_ENABLED) {
    return <HomePageOverride />
  }

  const enabledTasks = SITE_CONFIG.tasks.filter((task) => task.enabled)
  const { recipe } = getFactoryState()
  const productKind = getProductKind(recipe)
  const taskFeed: TaskFeedItem[] = (
    await Promise.all(
      enabledTasks.map(async (task) => ({
        task,
        posts: await fetchTaskPosts(task.key, 8, { allowMockFallback: false, fresh: true }),
      }))
    )
  ).filter(({ posts }) => posts.length)

  const primaryTask = enabledTasks.find((task) => task.key === recipe.primaryTask) || enabledTasks[0]
  const supportTasks = enabledTasks.filter((task) => task.key !== primaryTask?.key)
  const listingPosts = taskFeed.find(({ task }) => task.key === 'listing')?.posts || []
  const classifiedPosts = taskFeed.find(({ task }) => task.key === 'classified')?.posts || []
  const articlePosts = taskFeed.find(({ task }) => task.key === 'article')?.posts || []
  const imagePosts = taskFeed.find(({ task }) => task.key === 'image')?.posts || []
  const profilePosts = taskFeed.find(({ task }) => task.key === 'profile')?.posts || []
  const bookmarkPosts = taskFeed.find(({ task }) => task.key === 'sbm')?.posts || []

  const schemaData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.baseUrl,
      logo: `${SITE_CONFIG.baseUrl.replace(/\/$/, '')}${SITE_CONFIG.defaultOgImage}`,
      sameAs: [],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.baseUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_CONFIG.baseUrl.replace(/\/$/, '')}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavbarShell />
      <SchemaJsonLd data={schemaData} />
      {productKind === 'directory' ? (
        <DirectoryHome
          primaryTask={primaryTask}
          enabledTasks={enabledTasks}
          listingPosts={listingPosts}
          classifiedPosts={classifiedPosts}
          profilePosts={profilePosts}
          brandPack={recipe.brandPack}
        />
      ) : null}
      {productKind === 'editorial' ? (
        <EditorialHome primaryTask={primaryTask} articlePosts={articlePosts} supportTasks={supportTasks} />
      ) : null}
      {productKind === 'visual' ? (
        <VisualHome primaryTask={primaryTask} imagePosts={imagePosts} profilePosts={profilePosts} articlePosts={articlePosts} />
      ) : null}
      {productKind === 'curation' ? (
        <CurationHome primaryTask={primaryTask} bookmarkPosts={bookmarkPosts} profilePosts={profilePosts} articlePosts={articlePosts} />
      ) : null}
      <Footer />
    </div>
  )
}
