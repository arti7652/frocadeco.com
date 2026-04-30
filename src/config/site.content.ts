import type { TaskKey } from '@/lib/site-config'

export const siteContent = {
  navbar: {},
  footer: {
    tagline: 'Files, galleries, and visual collections',
  },
  hero: {
    badge: 'Cloud image system',
    title: ['Organize your visuals in', 'a softer, cleaner gallery workspace.'],
    description:
      'Explore image-led posts, creator showcases, and visual collections through a pastel app-style interface inspired by modern file and gallery mobile products, while keeping all existing platform behavior intact.',
    primaryCta: {
      label: 'Open my gallery',
      href: '/images',
    },
    secondaryCta: {
      label: 'Upload visuals',
      href: '/create/image',
    },
    searchPlaceholder: 'Search images, files, creators, and collections',
    focusLabel: 'Workspace focus',
    featureCardBadge: 'storage-inspired layout',
    featureCardTitle: 'A softer cloud-gallery interface now shapes the homepage rhythm.',
    featureCardDescription:
      'Primary image-sharing flows still lead the experience, while supporting routes remain available without overwhelming the cleaner layout.',
  },
  home: {
    metadata: {
      title: 'Image-led galleries, visual notes, and discoverable surfaces',
      description:
        'Explore image-led posts, creator surfaces, archives, and supporting content through a cinematic gallery-first experience.',
      openGraphTitle: 'Image-led galleries, visual notes, and discoverable surfaces',
      openGraphDescription:
        'Discover galleries, visual posts, and connected platform content through a cinematic image-sharing interface.',
      keywords: ['image sharing', 'gallery platform', 'visual discovery', 'creative publishing'],
    },
    introBadge: 'About the workspace',
    introTitle: 'Built to feel like a visual storage and gallery product first, with every supporting route still connected underneath.',
    introParagraphs: [
      'The visual system now follows a lighter cloud-gallery direction with pastel gradients, elevated white cards, and softer mobile-style framing.',
      'Image posts still lead the homepage and main navigation, while articles, profiles, bookmarks, and other supported routes remain available through secondary discovery layers, footer links, search, and direct URLs.',
      'That keeps the underlying platform logic unchanged while making the site feel much closer to a standalone gallery workspace instead of a generic shared-repo clone.',
    ],
    sideBadge: 'Design notes',
    sidePoints: [
      'Image-sharing remains the only strongly emphasized surface.',
      'Phone-like framing replaces generic desktop marketing blocks.',
      'Pastel gradients and white cards define the new brand tone.',
      'Supporting routes stay live but visually quieter.',
      'The overall rhythm now follows a clean storage-app layout.',
    ],
    primaryLink: {
      label: 'Browse the gallery',
      href: '/images',
    },
    secondaryLink: {
      label: 'Search the workspace',
      href: '/search',
    },
  },
  cta: {
    badge: 'Open the workspace',
    title: 'Move from the hero workspace into image posts, creator pages, and the rest of the platform without losing the product feel.',
    description:
      'Create an account to publish visuals, build collections, and move through the full platform inside a cleaner cloud-gallery interface.',
    primaryCta: {
      label: 'Create an account',
      href: '/register',
    },
    secondaryCta: {
      label: 'Search the archive',
      href: '/search',
    },
  },
  taskSectionHeading: 'Latest {label}',
  taskSectionDescriptionSuffix: 'Browse the newest posts in this lane.',
} as const

export const taskPageMetadata: Record<Exclude<TaskKey, 'comment' | 'org' | 'social'>, { title: string; description: string }> = {
  article: {
    title: 'Articles and field notes',
    description: 'Read essays, process notes, and long-form pieces that add context around visual work and collections.',
  },
  listing: {
    title: 'Studios, spaces, and featured places',
    description: 'Explore listings, studios, services, and featured places surfaced through the same connected platform.',
  },
  classified: {
    title: 'Calls, drops, and timely posts',
    description: 'Browse time-sensitive notices, opportunities, and fast-moving posts without losing the gallery-first tone.',
  },
  image: {
    title: 'Images, galleries, and visual stories',
    description: 'Explore image-led posts, galleries, and visual stories through the site’s primary discovery surface.',
  },
  profile: {
    title: 'Profiles and creative identities',
    description: 'Discover artists, studios, curators, and public profile pages connected to image-led content.',
  },
  sbm: {
    title: 'Curated links and visual references',
    description: 'Browse saved references, links, and supporting resources arranged like research shelves.',
  },
  pdf: {
    title: 'PDF decks and downloadable resources',
    description: 'Open documents, lookbooks, and downloadable resources shared across the platform.',
  },
}

export const taskIntroCopy: Record<
  TaskKey,
  { title: string; paragraphs: string[]; links: { label: string; href: string }[] }
> = {
  listing: {
    title: 'Studios, spaces, and featured places',
    paragraphs: [
      'This section holds structured discovery surfaces such as studios, featured spaces, services, and other listing-style pages.',
      'Even though image sharing leads the overall experience, these routes stay available for supporting context, practical discovery, and direct access by URL.',
      'Browse by category to compare entries quickly, then move back into galleries, articles, or profiles without leaving the shared platform.',
    ],
    links: [
      { label: 'Browse images', href: '/images' },
      { label: 'Read articles', href: '/articles' },
      { label: 'View profiles', href: '/profile' },
    ],
  },
  article: {
    title: 'Articles, essays, and visual context',
    paragraphs: [
      'This section is designed for essays, notes, explainers, and slower reading that sits beside the image stream rather than replacing it.',
      'Articles connect with galleries, profiles, and resource surfaces so visitors can move from visuals into deeper context when they want it.',
      'Use it to browse thoughtful writing, behind-the-work stories, and supporting long-form material tied to the visual archive.',
    ],
    links: [
      { label: 'Open images', href: '/images' },
      { label: 'Explore profiles', href: '/profile' },
      { label: 'Browse resources', href: '/pdf' },
    ],
  },
  classified: {
    title: 'Calls, opportunities, and timely posts',
    paragraphs: [
      'Classified-style posts surface short-lived opportunities, notices, drops, and calls in a faster-scanning format.',
      'They live alongside image posts and editorial pieces, giving the platform a quicker response layer without changing any task behavior.',
      'Browse by category to move fast, then step into related galleries, articles, or profiles when you want more depth.',
    ],
    links: [
      { label: 'Open images', href: '/images' },
      { label: 'Read articles', href: '/articles' },
      { label: 'View profiles', href: '/profile' },
    ],
  },
  image: {
    title: 'Image-led posts, galleries, and visual stories',
    paragraphs: [
      'This is the primary lane of the product: image-led posts, visual stories, mood-driven collections, and gallery-style browsing.',
      'Large imagery, taller cards, and quieter interface chrome make this section feel intentionally different from the rest of the platform.',
      'Browse the latest visual updates here first, then branch into articles, profiles, and supporting routes when you want more context.',
    ],
    links: [
      { label: 'Read articles', href: '/articles' },
      { label: 'Meet creators', href: '/profile' },
      { label: 'Search the archive', href: '/search' },
    ],
  },
  profile: {
    title: 'Profiles, identities, and creative pages',
    paragraphs: [
      'Profiles reveal the people, studios, and public identities behind the visuals appearing across the site.',
      'They act as trust and attribution layers, helping visitors move from an image into the broader body of work or related supporting surfaces.',
      'Browse profiles when you want to understand the maker, the studio mood, or the connected body of posts behind a visual thread.',
    ],
    links: [
      { label: 'Browse images', href: '/images' },
      { label: 'Read articles', href: '/articles' },
      { label: 'Open bookmarks', href: '/sbm' },
    ],
  },
  sbm: {
    title: 'Curated links, references, and saved finds',
    paragraphs: [
      'This section collects useful links, references, tools, and saved discoveries in a calmer research-oriented format.',
      'Bookmarks stay connected to galleries, essays, and profiles so saved references feel like part of the same visual ecosystem.',
      'Use it to keep sources, inspiration, and supporting material close to the image stream without forcing everything into one feed.',
    ],
    links: [
      { label: 'Browse images', href: '/images' },
      { label: 'Browse articles', href: '/articles' },
      { label: 'Open PDFs', href: '/pdf' },
    ],
  },
  pdf: {
    title: 'PDFs, decks, and downloadable files',
    paragraphs: [
      'The PDF library hosts decks, guides, lookbooks, downloadable files, and other longer-form resources.',
      'These documents work alongside image posts and written context, helping downloadable material stay connected to the same discovery system.',
      'Browse by category to find relevant files quickly, then continue into related galleries, profiles, or articles when you want more context.',
    ],
    links: [
      { label: 'Browse images', href: '/images' },
      { label: 'Read articles', href: '/articles' },
      { label: 'Explore profiles', href: '/profile' },
    ],
  },
  social: {
    title: 'Short updates and community signals',
    paragraphs: [
      'Short updates add quick signals that keep activity flowing across the platform.',
      'They work well with stories, listings, and resources by helping visitors move from brief updates into deeper content.',
      'Use these posts as lightweight entry points into the broader site experience.',
    ],
    links: [
      { label: 'Open listings', href: '/listings' },
      { label: 'Read articles', href: '/articles' },
      { label: 'View PDFs', href: '/pdf' },
    ],
  },
  comment: {
    title: 'Comments and contextual responses',
    paragraphs: [
      'Comments surface responses connected directly to articles and help keep discussion close to the writing it belongs to.',
      'This layer adds perspective and reaction without needing a separate standalone content format.',
      'Use comments as supporting context beneath stories, then continue exploring related content from the same topic area.',
    ],
    links: [
      { label: 'Explore articles', href: '/articles' },
      { label: 'View listings', href: '/listings' },
      { label: 'See classifieds', href: '/classifieds' },
    ],
  },
  org: {
    title: 'Organizations, teams, and structured entities',
    paragraphs: [
      'Organization pages provide structured identity surfaces for teams, brands, communities, and agencies.',
      'Used with listings, stories, profiles, and resources, they help create stronger structure across the platform.',
      'Connect organization pages with related content to build a clearer and more unified site presence.',
    ],
    links: [
      { label: 'Business listings', href: '/listings' },
      { label: 'Read articles', href: '/articles' },
      { label: 'PDF library', href: '/pdf' },
    ],
  },
}
