import { ContentImage } from "@/components/shared/content-image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Globe, Phone, Tag, Mail } from "lucide-react";
import { NavbarShell } from "@/components/shared/navbar-shell";
import { Footer } from "@/components/shared/footer";
import { TaskPostCard } from "@/components/shared/task-post-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buildPostUrl, fetchTaskPostBySlug, fetchTaskPosts } from "@/lib/task-data";
import { SITE_CONFIG, getTaskConfig, type TaskKey } from "@/lib/site-config";
import type { SitePost } from "@/lib/site-connector";
import { TaskImageCarousel } from "@/components/tasks/task-image-carousel";
import { cn } from "@/lib/utils";
import { ArticleComments } from "@/components/tasks/article-comments";
import { SchemaJsonLd } from "@/components/seo/schema-jsonld";
import { RichContent, formatRichHtml } from "@/components/shared/rich-content";
import { getFactoryState } from "@/design/factory/get-factory-state";
import { getProductKind } from "@/design/factory/get-product-kind";
import { DirectoryTaskDetailPage } from "@/design/products/directory/task-detail-page";
import { TASK_DETAIL_PAGE_OVERRIDE_ENABLED, TaskDetailPageOverride } from "@/overrides/task-detail-page";

type PostContent = {
  category?: string;
  location?: string;
  address?: string;
  website?: string;
  phone?: string;
  email?: string;
  description?: string;
  body?: string;
  excerpt?: string;
  author?: string;
  highlights?: string[];
  logo?: string;
  images?: string[];
  latitude?: number | string;
  longitude?: number | string;
};

const isValidImageUrl = (value?: string | null) =>
  typeof value === "string" && (value.startsWith("/") || /^https?:\/\//i.test(value));

const absoluteUrl = (value?: string | null) => {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  if (!value.startsWith("/")) return null;
  return `${SITE_CONFIG.baseUrl.replace(/\/$/, "")}${value}`;
};

const getContent = (post: SitePost): PostContent => {
  const content = post.content && typeof post.content === "object" ? post.content : {};
  return content as PostContent;
};

const formatArticleHtml = (content: PostContent, post: SitePost) => {
  const raw =
    (typeof content.body === "string" && content.body.trim()) ||
    (typeof content.description === "string" && content.description.trim()) ||
    (typeof post.summary === "string" && post.summary.trim()) ||
    "";

  return formatRichHtml(raw, "Details coming soon.");
};

const getImageUrls = (post: SitePost, content: PostContent) => {
  const media = Array.isArray(post.media) ? post.media : [];
  const mediaImages = media
    .map((item) => item?.url)
    .filter((url): url is string => isValidImageUrl(url));
  const contentImages = Array.isArray(content.images)
    ? content.images.filter((url): url is string => isValidImageUrl(url))
    : [];
  const merged = [...mediaImages, ...contentImages];
  if (merged.length) return merged;
  if (isValidImageUrl(content.logo)) return [content.logo as string];
  return ["/placeholder.svg?height=900&width=1400"];
};

const toNumber = (value?: number | string) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const buildMapEmbedUrl = (
  latitude?: number | string,
  longitude?: number | string,
  address?: string
) => {
  const lat = toNumber(latitude);
  const lon = toNumber(longitude);
  const normalizedAddress = typeof address === "string" ? address.trim() : "";
  const googleMapsEmbedApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY?.trim();

  if (googleMapsEmbedApiKey) {
    const query = lat !== null && lon !== null ? `${lat},${lon}` : normalizedAddress;
    if (!query) return null;
    return `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(
      googleMapsEmbedApiKey
    )}&q=${encodeURIComponent(query)}`;
  }

  if (lat !== null && lon !== null) {
    const delta = 0.01;
    const left = lon - delta;
    const right = lon + delta;
    const bottom = lat - delta;
    const top = lat + delta;
    const bbox = `${left},${bottom},${right},${top}`;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
      bbox
    )}&layer=mapnik&marker=${encodeURIComponent(`${lat},${lon}`)}`;
  }

  if (normalizedAddress) {
    return `https://www.google.com/maps?q=${encodeURIComponent(normalizedAddress)}&output=embed`;
  }

  return null;
};

export async function TaskDetailPage({ task, slug }: { task: TaskKey; slug: string }) {
  if (TASK_DETAIL_PAGE_OVERRIDE_ENABLED) {
    return await TaskDetailPageOverride({ task, slug });
  }

  const taskConfig = getTaskConfig(task);
  let post: SitePost | null = null;
  try {
    post = await fetchTaskPostBySlug(task, slug);
  } catch (error) {
    console.warn("Failed to load post detail", error);
  }

  if (!post) {
    notFound();
  }

  const content = getContent(post);
  const isClassified = task === "classified";
  const isArticle = task === "article";
  const category = content.category || post.tags?.[0] || taskConfig?.label || task;
  const description = content.description || post.summary || "Details coming soon.";
  const descriptionHtml = !isArticle ? formatRichHtml(description, "Details coming soon.") : "";
  const articleHtml = isArticle ? formatArticleHtml(content, post) : "";
  const articleSummary =
    post.summary ||
    (typeof content.excerpt === "string" ? content.excerpt : "") ||
    "";
  const articleAuthor =
    (typeof content.author === "string" && content.author.trim()) ||
    post.authorName ||
    "Editorial Team";
  const articleDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";
  const postTags = Array.isArray(post.tags) ? post.tags.filter((tag) => typeof tag === "string") : [];
  const location = content.address || content.location;
  const images = getImageUrls(post, content);
  const mapEmbedUrl = buildMapEmbedUrl(content.latitude, content.longitude, location);
  const isBookmark = task === "sbm" || task === "social";
  const hideSidebar = isClassified || isArticle || task === "image" || isBookmark;
  const related = (await fetchTaskPosts(task, 6))
    .filter((item) => item.slug !== post.slug)
    .filter((item) => {
      if (!content.category) return true;
      const itemContent = getContent(item);
      return itemContent.category === content.category;
    })
    .slice(0, 3);
  const articleUrl = `${SITE_CONFIG.baseUrl.replace(/\/$/, "")}${taskConfig?.route || "/articles"}/${post.slug}`;
  const articleImage = absoluteUrl(images[0]) || absoluteUrl(SITE_CONFIG.defaultOgImage);
  const articleSchema = isArticle
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: articleSummary || description,
        image: articleImage ? [articleImage] : [],
        author: {
          "@type": "Person",
          name: articleAuthor,
        },
        datePublished: post.publishedAt || undefined,
        dateModified: post.publishedAt || undefined,
        articleSection: category,
        keywords: postTags.join(", "),
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": articleUrl,
        },
      }
    : null;
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_CONFIG.baseUrl.replace(/\/$/, ""),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: taskConfig?.label || "Posts",
        item: `${SITE_CONFIG.baseUrl.replace(/\/$/, "")}${taskConfig?.route || "/"}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${SITE_CONFIG.baseUrl.replace(/\/$/, "")}${taskConfig?.route || "/posts"}/${post.slug}`,
      },
    ],
  };
  const schemaPayload = articleSchema ? [articleSchema, breadcrumbSchema] : breadcrumbSchema;
  const { recipe } = getFactoryState();
  const productKind = getProductKind(recipe);
  const isImage = task === "image";
  const detailTone =
    isArticle
      ? {
          shell: "bg-[linear-gradient(180deg,#faf4ed_0%,#fffdfa_100%)]",
          panel: "border border-[#ddc9b9] bg-white/92 shadow-[0_22px_70px_rgba(90,57,36,0.08)]",
          soft: "border border-[#e7d8cb] bg-[#fff8f0]",
          title: "text-[#241711]",
          body: "text-[#72594a]",
          badge: "bg-[#241711] text-[#fff1e2]",
          button: "bg-[#241711] text-[#fff1e2] hover:bg-[#3b241b]",
          link: "text-[#72594a] hover:text-[#241711]",
        }
      : {
          shell: "bg-[linear-gradient(180deg,#fffaf7_0%,#f9f1ff_52%,#fff6ef_100%)]",
          panel: "border border-[#d7ddff] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(246,247,255,0.94))] shadow-[0_24px_80px_rgba(149,166,230,0.16)] backdrop-blur-xl",
          soft: "border border-[#dfe5ff] bg-white/78 backdrop-blur-md",
          title: "text-slate-900",
          body: "text-slate-500",
          badge: "bg-[linear-gradient(135deg,#ffc6b7_0%,#c777ff_100%)] text-white",
          button: "bg-[linear-gradient(135deg,#ffc6b7_0%,#c777ff_100%)] text-white hover:opacity-90",
          link: "text-slate-500 hover:text-slate-900",
        };

  if (productKind === "directory" && (task === "listing" || task === "classified" || task === "profile")) {
    return (
      <div className="min-h-screen bg-[#f8fbff]">
        <NavbarShell />
        <DirectoryTaskDetailPage
          task={task}
          taskLabel={taskConfig?.label || task}
          taskRoute={taskConfig?.route || "/"}
          post={post}
          description={description}
          category={category}
          images={images}
          mapEmbedUrl={mapEmbedUrl}
          related={related}
        />
        <Footer />
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen", detailTone.shell)}>
      <NavbarShell />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SchemaJsonLd data={schemaPayload} />
        <Link
          href={taskConfig?.route || "/"}
          className={cn("mb-6 inline-flex items-center text-sm", detailTone.link)}
        >
          ← Back to {taskConfig?.label || "posts"}
        </Link>

        <div
          className={cn(
            "grid gap-10",
            hideSidebar ? "lg:grid-cols-1" : "lg:grid-cols-[2fr_1fr]"
          )}
        >
          <div className={cn(isClassified ? "space-y-8" : "")}>
            {isArticle ? (
              <div className="mx-auto w-full max-w-4xl space-y-6">
                <div className={cn("rounded-[2.25rem] p-8", detailTone.panel)}>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge className={cn("inline-flex items-center gap-1 border-0", detailTone.badge)}>
                      <Tag className="h-3.5 w-3.5" />
                      {category}
                    </Badge>
                    {articleDate ? <span className={cn("text-sm", detailTone.body)}>{articleDate}</span> : null}
                  </div>
                  <h1 className={cn("mt-5 text-4xl font-semibold leading-tight sm:text-5xl", detailTone.title)}>
                    {post.title}
                  </h1>
                  <div className={cn("mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm", detailTone.body)}>
                    <span>By {articleAuthor}</span>
                  </div>
                  {articleSummary ? (
                    <p className={cn("mt-5 text-base leading-8", detailTone.body)}>{articleSummary}</p>
                  ) : null}
                </div>
                {images[0] ? (
                  <div className={cn("relative aspect-[16/9] w-full overflow-hidden rounded-[2.25rem]", detailTone.panel)}>
                    <ContentImage
                      src={images[0]}
                      alt={`${post.title} featured image`}
                      fill
                      className="object-cover"
                      intrinsicWidth={1600}
                      intrinsicHeight={900}
                    />
                  </div>
                ) : null}
                {postTags.length ? (
                  <div className="flex flex-wrap gap-2">
                    {postTags.map((tag) => (
                      <Badge key={tag} variant="outline" className={cn("border-current/12 px-3 py-1", detailTone.body)}>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                ) : null}
                <RichContent html={articleHtml} className="leading-8 prose-p:my-6 prose-h2:my-8 prose-h3:my-6 prose-ul:my-6" />
                <div className={cn("rounded-[2rem] p-2", detailTone.panel)}>
                  <ArticleComments slug={post.slug} />
                </div>
              </div>
            ) : null}

            {!isArticle ? (
              <>
                {!isBookmark ? (
                  <div className={cn(isClassified ? "w-full" : "", isImage ? "overflow-hidden rounded-[2.4rem]" : "")}>
                    {isImage ? (
                      <div className={cn("overflow-hidden rounded-[2.4rem]", detailTone.panel)}>
                        <TaskImageCarousel images={images} />
                      </div>
                    ) : (
                      <TaskImageCarousel images={images} />
                    )}
                  </div>
                ) : null}

                <div className={cn(isClassified ? "mx-auto w-full max-w-4xl" : "mt-6")}>
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <Badge className={cn("inline-flex items-center gap-1 border-0", detailTone.badge)}>
                      <Tag className="h-3.5 w-3.5" />
                      {category}
                    </Badge>
                    {location && (
                      <span className={cn("inline-flex items-center gap-1", detailTone.body)}>
                        <MapPin className="h-4 w-4" />
                        {location}
                      </span>
                    )}
                  </div>
                  <h1 className={cn("mt-4 text-3xl font-semibold sm:text-5xl", detailTone.title)}>{post.title}</h1>
                  <div className={cn("mt-4 max-w-4xl rounded-[2rem] p-6", detailTone.panel)}>
                    <RichContent html={descriptionHtml} className="max-w-3xl text-slate-600" />
                  </div>
                </div>
              </>
            ) : null}

            {isClassified ? (
              <div className={cn("mx-auto w-full max-w-4xl rounded-[2rem] p-6", detailTone.panel)}>
                <h2 className={cn("text-lg font-semibold", detailTone.title)}>Business details</h2>
                <div className={cn("mt-4 space-y-3 text-sm", detailTone.body)}>
                  {content.website && (
                    <div className="flex items-start gap-2">
                      <Globe className="mt-0.5 h-4 w-4" />
                      <a
                        href={content.website}
                        className={cn("break-all hover:underline", detailTone.title)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {content.website}
                      </a>
                    </div>
                  )}
                  {content.phone && (
                    <div className="flex items-start gap-2">
                      <Phone className="mt-0.5 h-4 w-4" />
                      <span>{content.phone}</span>
                    </div>
                  )}
                  {content.email && (
                    <div className="flex items-start gap-2">
                      <Mail className="mt-0.5 h-4 w-4" />
                      <a
                        href={`mailto:${content.email}`}
                        className={cn("break-all hover:underline", detailTone.title)}
                      >
                        {content.email}
                      </a>
                    </div>
                  )}
                  {location && (
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4" />
                      <span>{location}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {content.highlights?.length && !isArticle ? (
              <div className={cn("mt-8 rounded-[2rem] p-6", detailTone.panel, isClassified ? "mx-auto w-full max-w-4xl" : "")}>
                <h2 className={cn("text-lg font-semibold", detailTone.title)}>Highlights</h2>
                <ul className={cn("mt-4 space-y-2 text-sm", detailTone.body)}>
                  {content.highlights.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {isClassified && mapEmbedUrl ? (
              <div className={cn("mx-auto w-full max-w-4xl rounded-[2rem] p-4", detailTone.panel)}>
                <p className={cn("text-sm font-semibold", detailTone.title)}>Location map</p>
                <div className={cn("mt-4 overflow-hidden rounded-xl", detailTone.soft)}>
                  <iframe
                    title="Business location map"
                    src={mapEmbedUrl}
                    className="h-56 w-full"
                    loading="lazy"
                  />
                </div>
              </div>
            ) : null}

          </div>

          {!hideSidebar ? (
            <aside className="space-y-6">
            <div className={cn("rounded-[2rem] p-6", detailTone.panel)}>
              <h2 className={cn("text-lg font-semibold", detailTone.title)}>Listing details</h2>
                <div className={cn("mt-4 space-y-3 text-sm", detailTone.body)}>
                  {content.website && (
                    <div className="flex items-start gap-2">
                      <Globe className="mt-0.5 h-4 w-4" />
                      <a
                        href={content.website}
                        className={cn("break-all hover:underline", detailTone.title)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {content.website}
                      </a>
                    </div>
                  )}
                  {content.phone && (
                    <div className="flex items-start gap-2">
                      <Phone className="mt-0.5 h-4 w-4" />
                      <span>{content.phone}</span>
                    </div>
                  )}
                  {content.email && (
                    <div className="flex items-start gap-2">
                      <Mail className="mt-0.5 h-4 w-4" />
                      <a
                        href={`mailto:${content.email}`}
                        className={cn("break-all hover:underline", detailTone.title)}
                      >
                        {content.email}
                      </a>
                    </div>
                  )}
                  {location && (
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4" />
                      <span>{location}</span>
                    </div>
                  )}
                </div>
              {content.website ? (
                <Button className={cn("mt-5 w-full", detailTone.button)} asChild>
                  <a href={content.website} target="_blank" rel="noreferrer">
                    Visit Website
                  </a>
                </Button>
              ) : null}
            </div>

            {mapEmbedUrl ? (
              <div className={cn("rounded-[2rem] p-4", detailTone.panel)}>
                <p className={cn("text-sm font-semibold", detailTone.title)}>Location map</p>
                <div className={cn("mt-4 overflow-hidden rounded-xl", detailTone.soft)}>
                  <iframe
                    title="Business location map"
                    src={mapEmbedUrl}
                    className="h-56 w-full"
                    loading="lazy"
                  />
                </div>
              </div>
            ) : null}

          </aside>
          ) : null}
        </div>

        <section className="mt-12">
          {related.length ? (
            <>
            <div className="mb-4 flex items-center justify-between">
              <h2 className={cn("text-xl font-semibold", detailTone.title)}>
                More in {category}
              </h2>
              {taskConfig?.route && (
                <Link
                  href={taskConfig.route}
                  className={cn("text-sm", detailTone.link)}
                >
                  View all
                </Link>
              )}
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <TaskPostCard
                  key={item.id}
                  post={item}
                  href={buildPostUrl(task, item.slug)}
                />
              ))}
            </div>
            </>
          ) : null}
          <nav className={cn("mt-6 rounded-[2rem] p-4", detailTone.panel)}>
            <p className={cn("text-sm font-semibold", detailTone.title)}>Related links</p>
            <ul className="mt-2 space-y-2 text-sm">
              {related.map((item) => (
                <li key={`link-${item.id}`}>
                  <Link
                    href={buildPostUrl(task, item.slug)}
                    className={cn("underline-offset-4 hover:underline", isArticle ? 'text-[#2f1d16]' : 'text-[#78ebd8]')}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
              {taskConfig?.route ? (
                <li>
                  <Link
                    href={taskConfig.route}
                    className={cn("underline-offset-4 hover:underline", isArticle ? 'text-[#2f1d16]' : 'text-[#78ebd8]')}
                  >
                    Browse all {taskConfig.label}
                  </Link>
                </li>
              ) : null}
              <li>
                <Link
                  href={`/search?q=${encodeURIComponent(category)}`}
                  className={cn("underline-offset-4 hover:underline", isArticle ? 'text-[#2f1d16]' : 'text-[#78ebd8]')}
                >
                  Search more in {category}
                </Link>
              </li>
            </ul>
          </nav>
        </section>
      </main>
      <Footer />
    </div>
  );
}
