import Link from "next/link";
import { notFound } from "next/navigation";
import { Globe, Mail, MapPin, Tag } from "lucide-react";
import { Footer } from "@/components/shared/footer";
import { NavbarShell } from "@/components/shared/navbar-shell";
import { ContentImage } from "@/components/shared/content-image";
import { TaskPostCard } from "@/components/shared/task-post-card";
import { Button } from "@/components/ui/button";
import { SchemaJsonLd } from "@/components/seo/schema-jsonld";
import { RichContent, formatRichHtml } from "@/components/shared/rich-content";
import { buildPostUrl, fetchTaskPostBySlug, fetchTaskPosts } from "@/lib/task-data";
import { buildPostMetadata, buildTaskMetadata } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/site-config";

export const revalidate = 3;

export async function generateStaticParams() {
  const posts = await fetchTaskPosts("profile", 50);
  if (!posts.length) {
    return [{ username: "placeholder" }];
  }
  return posts.map((post) => ({ username: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;
  try {
    const post = await fetchTaskPostBySlug("profile", resolvedParams.username);
    return post ? await buildPostMetadata("profile", post) : await buildTaskMetadata("profile");
  } catch (error) {
    console.warn("Profile metadata lookup failed", error);
    return await buildTaskMetadata("profile");
  }
}

export default async function ProfileDetailPage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;
  const post = await fetchTaskPostBySlug("profile", resolvedParams.username);
  if (!post) {
    notFound();
  }

  const content = (post.content || {}) as Record<string, any>;
  const logoUrl = typeof content.logo === "string" ? content.logo : undefined;
  const galleryImages = Array.isArray(content.images)
    ? content.images.filter((value: unknown): value is string => typeof value === "string" && value.length > 0)
    : [];
  const fallbackMedia = Array.isArray(post.media)
    ? post.media.map((item) => item?.url).filter((value): value is string => typeof value === "string" && value.length > 0)
    : [];
  const coverImage = galleryImages[0] || fallbackMedia[0] || logoUrl || "/placeholder.svg?height=1200&width=1600";
  const brandName =
    (content.brandName as string | undefined) ||
    (content.companyName as string | undefined) ||
    (content.name as string | undefined) ||
    post.title;
  const website = content.website as string | undefined;
  const email = content.email as string | undefined;
  const location = (content.location as string | undefined) || (content.address as string | undefined);
  const domain = website ? website.replace(/^https?:\/\//, "").replace(/\/.*$/, "") : undefined;
  const description =
    (content.description as string | undefined) ||
    post.summary ||
    "Profile details will appear here once available.";
  const descriptionHtml = formatRichHtml(description);
  const rawCategory = (content.category as string | undefined) || post.tags?.[0] || "Profile";
  const suggestedArticles = (await fetchTaskPosts("article", 6)).slice(0, 3);
  const baseUrl = SITE_CONFIG.baseUrl.replace(/\/$/, "");
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Profiles",
        item: `${baseUrl}/profile`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: brandName,
        item: `${baseUrl}/profile/${post.slug}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffaf7_0%,#f8efff_54%,#fff7f0_100%)]">
      <NavbarShell />
      <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <SchemaJsonLd data={breadcrumbData} />
        <Link href="/profile" className="mb-6 inline-flex items-center text-sm text-slate-500 hover:text-slate-900">
          <span aria-hidden="true" className="mr-2">←</span>
          Back to profiles
        </Link>

        <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-stretch">
          <div className="overflow-hidden rounded-[2.4rem] border border-white/70 bg-white/80 shadow-[0_24px_80px_rgba(149,166,230,0.16)] backdrop-blur-xl">
            <div className="relative h-[280px]">
              <ContentImage src={coverImage} alt={brandName} fill className="object-cover" intrinsicWidth={1600} intrinsicHeight={1200} />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,18,31,0.08)_0%,rgba(10,18,31,0.52)_100%)]" />
            </div>
            <div className="relative px-6 pb-6">
              <div className="-mt-10 flex h-20 w-20 items-center justify-center overflow-hidden rounded-[1.7rem] border border-white/90 bg-white text-2xl font-semibold text-slate-900 shadow-[0_18px_50px_rgba(15,23,42,0.16)]">
                {logoUrl ? (
                  <div className="relative h-full w-full">
                    <ContentImage src={logoUrl} alt={`${brandName} logo`} fill className="object-cover" sizes="80px" intrinsicWidth={160} intrinsicHeight={160} />
                  </div>
                ) : (
                  brandName.slice(0, 1).toUpperCase()
                )}
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-1 rounded-full bg-[linear-gradient(135deg,#ffc6b7_0%,#c777ff_100%)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                  <Tag className="h-3.5 w-3.5" />
                  {rawCategory}
                </span>
                {domain ? (
                  <span className="rounded-full bg-white/88 px-3 py-1 text-[11px] font-medium text-slate-700">
                    {domain}
                  </span>
                ) : null}
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-500">A profile-first layout that keeps the identity, brand surface, and discovery cues together instead of scattering them across the page.</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2.4rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(246,247,255,0.94))] p-8 shadow-[0_24px_80px_rgba(149,166,230,0.16)] backdrop-blur-xl">
              <h1 className="text-4xl font-semibold tracking-[-0.05em] text-slate-900 sm:text-5xl">{brandName}</h1>
              <p className="mt-4 max-w-3xl text-sm leading-8 text-slate-500">The profile detail page now reads like a polished introduction card: strong identity first, concise overview second, and quick actions close by.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {website ? (
                  <Button className="bg-[linear-gradient(135deg,#ffc6b7_0%,#c777ff_100%)] text-white hover:opacity-90" asChild>
                    <Link href={website} target="_blank" rel="noopener noreferrer">
                      Visit official site
                    </Link>
                  </Button>
                ) : null}
                {email ? (
                  <Button variant="outline" className="rounded-full border-slate-200 bg-white/90" asChild>
                    <a href={`mailto:${email}`}>Email profile</a>
                  </Button>
                ) : null}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.8rem] border border-white/70 bg-white/78 p-5 shadow-[0_18px_48px_rgba(149,166,230,0.12)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Profile cue</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">{domain || "Independent presence"}</p>
              </div>
              <div className="rounded-[1.8rem] border border-white/70 bg-white/78 p-5 shadow-[0_18px_48px_rgba(149,166,230,0.12)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Contact path</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">{email || "Website first"}</p>
              </div>
              <div className="rounded-[1.8rem] border border-white/70 bg-white/78 p-5 shadow-[0_18px_48px_rgba(149,166,230,0.12)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Location</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">{location || "Remote or not listed"}</p>
              </div>
            </div>

            <div className="rounded-[2.2rem] border border-white/70 bg-white/82 p-7 shadow-[0_24px_80px_rgba(149,166,230,0.16)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">About this profile</p>
              <RichContent html={descriptionHtml} className="mt-5 max-w-none text-slate-600" />
            </div>

            {(website || email || location) ? (
              <div className="rounded-[2.2rem] border border-white/70 bg-white/82 p-7 shadow-[0_24px_80px_rgba(149,166,230,0.16)]">
                <h2 className="text-lg font-semibold text-slate-900">Profile details</h2>
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  {website ? (
                    <div className="flex items-start gap-2">
                      <Globe className="mt-0.5 h-4 w-4" />
                      <a href={website} className="break-all text-slate-900 hover:underline" target="_blank" rel="noreferrer">
                        {website}
                      </a>
                    </div>
                  ) : null}
                  {email ? (
                    <div className="flex items-start gap-2">
                      <Mail className="mt-0.5 h-4 w-4" />
                      <a href={`mailto:${email}`} className="break-all text-slate-900 hover:underline">
                        {email}
                      </a>
                    </div>
                  ) : null}
                  {location ? (
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4" />
                      <span>{location}</span>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </section>

        {suggestedArticles.length ? (
          <section className="mt-12">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Suggested articles</h2>
              <Link href="/articles" className="text-sm font-medium text-slate-700 hover:underline">
                View all
              </Link>
            </div>
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {suggestedArticles.map((article) => (
                <TaskPostCard
                  key={article.id}
                  post={article}
                  href={buildPostUrl("article", article.slug)}
                  compact
                />
              ))}
            </div>
          </section>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
