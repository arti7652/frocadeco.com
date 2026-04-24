import { defineSiteTheme } from '@/config/site.theme.defaults'

export const SITE_THEME = defineSiteTheme({
  shell: 'studio',
  hero: {
    variant: 'gallery-mosaic',
    eyebrow: 'Curated image platform',
  },
  home: {
    layout: 'studio-showcase',
    primaryTask: 'image',
    featuredTaskKeys: ['image'],
  },
  navigation: {
    variant: 'capsule',
  },
  footer: {
    variant: 'dense',
  },
  cards: {
    listing: 'catalog-grid',
    article: 'editorial-feature',
    image: 'studio-panel',
    profile: 'studio-panel',
    classified: 'listing-elevated',
    pdf: 'editorial-feature',
    sbm: 'catalog-grid',
    social: 'studio-panel',
    org: 'studio-panel',
    comment: 'editorial-feature',
  },
})
