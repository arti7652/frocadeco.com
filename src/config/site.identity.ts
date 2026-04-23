export const siteIdentity = {
  code: process.env.NEXT_PUBLIC_SITE_CODE || 'hfvmo9r9vl',
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'Frocadeco',
  tagline: process.env.NEXT_PUBLIC_SITE_TAGLINE || 'Image Sharing platform',
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    'A visual discovery platform for image-led posts, galleries, and creative media browsing.',
  domain: process.env.NEXT_PUBLIC_SITE_DOMAIN || 'frocadeco.com',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://frocadeco.com',
  ogImage: process.env.NEXT_PUBLIC_SITE_OG_IMAGE || '/og-default.png',
  googleMapsEmbedApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY || 'AIzaSyBco7dIECu3rJWjP3J0MImnR_uxlbeqAe0',

} as const

export const defaultAuthorProfile = {
  name: siteIdentity.name,
  avatar: '/placeholder.svg?height=80&width=80',
} as const

