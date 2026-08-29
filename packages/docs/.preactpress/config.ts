import fs from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from '@kamod-ch/preactpress/config'

const configDir = dirname(fileURLToPath(import.meta.url))
const docsRoot = resolve(configDir, '..')
const i18nSrc = resolve(configDir, '../../i18n/src')
const preactpressTheme = resolve(
  docsRoot,
  'node_modules/@kamod-ch/preactpress/src/client/theme-default',
)
const isGithubPages =
  process.env.GITHUB_ACTIONS === 'true' || process.env.KAMOD_DOCS_BASE === 'github-pages'
const base = isGithubPages ? '/kamod-i18n/' : '/'
const matomoImageTracker = `<!-- Matomo Image Tracker-->
<img referrerpolicy="no-referrer-when-downgrade" src="https://matomo.kamod.ch/matomo.php?idsite=12&amp;rec=1" style="border:0" alt="" />
<!-- End Matomo -->`
const includeMatomoImageTracker = process.env.PREACTPRESS_INCLUDE_MATOMO === 'true'

const faviconFiles = new Map([
  ['/favicon.svg', { file: 'favicon.svg', type: 'image/svg+xml' }],
  ['/favicon-32.png', { file: 'favicon-32.png', type: 'image/png' }],
  ['/favicon.png', { file: 'favicon.png', type: 'image/png' }],
])

export default defineConfig({
  theme: './theme/Layout.tsx',
  srcExclude: ['README.md', 'components/**', 'dist/**', 'node_modules/**'],
  site: {
    title: 'Kamod i18n',
    description: 'Small, type-safe internationalization for TypeScript and Preact.',
    url: isGithubPages ? 'https://kamod-ch.github.io' : 'http://localhost:4173',
    base,
  },
  markdown: {
    html: false,
    linkify: true,
    typographer: true,
  },
  head: [
    ['meta', { name: 'theme-color', content: '#4f46e5' }],
    ['link', { rel: 'icon', href: `${base}favicon.svg`, type: 'image/svg+xml' }],
    ['link', { rel: 'icon', href: `${base}favicon-32.png`, type: 'image/png', sizes: '32x32' }],
    ['link', { rel: 'apple-touch-icon', href: `${base}favicon.png` }],
    ['link', { rel: 'stylesheet', href: `${base}styles/logo.css` }],
    ['link', { rel: 'stylesheet', href: `${base}styles/docs.css` }],
  ],
  transformHtml(html) {
    if (!includeMatomoImageTracker) return html
    return html.replace('</body>', `  ${matomoImageTracker}\n  </body>`)
  },
  vite: {
    plugins: [
      {
        name: 'kamod-i18n-favicon-dev',
        enforce: 'pre',
        configureServer(server) {
          const serveKamodFavicon = (req, res, next) => {
            const pathname = req.url?.split('?')[0] ?? ''
            const favicon = faviconFiles.get(pathname)

            if (!favicon) {
              next()
              return
            }

            void fs
              .readFile(join(docsRoot, 'public', favicon.file))
              .then((body) => {
                res.statusCode = 200
                res.setHeader('Content-Type', favicon.type)
                res.setHeader('Cache-Control', 'no-store, max-age=0')
                res.end(body)
              })
              .catch(() => next())
          }

          // PreactPress registers its own /favicon.* middleware. Put ours at the
          // very front so dev serves the project favicon, not PreactPress' default.
          const stack = server.middlewares.stack
          if (Array.isArray(stack)) {
            stack.unshift({ route: '', handle: serveKamodFavicon })
          } else {
            server.middlewares.use(serveKamodFavicon)
          }
        },
      },
    ],
    resolve: {
      alias: [
        { find: '@preactpress-theme', replacement: preactpressTheme },
        { find: '@kamod-ch/i18n/preact', replacement: resolve(i18nSrc, 'preact.ts') },
        { find: '@kamod-ch/i18n', replacement: resolve(i18nSrc, 'index.ts') },
      ],
      dedupe: ['preact', 'preact/hooks'],
    },
    ssr: {
      noExternal: ['@kamod-ch/brand', '@kamod-ch/i18n', 'preact'],
    },
  },
  themeConfig: {
    search: true,
    outline: true,
    lastUpdated: true,
    footer:
      'Released under the MIT License.\n\nCopyright © 2026 Klaus Zahiragic - www.kamod.ch',
    editLink: {
      text: 'Edit this page',
      pattern: 'https://github.com/kamod-ch/kamod-i18n/edit/main/packages/docs/:path',
    },
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/kamod-ch/kamod-i18n',
        ariaLabel: 'Kamod i18n on GitHub',
      },
    ],
    nav: [
      { text: 'Live example', link: '/' },
      { text: 'Guide', link: '/docs/introduction' },
      { text: 'API', link: '/docs/api-reference' },
    ],
    sidebar: [
      {
        text: 'Overview',
        items: [
          { text: 'Live example', link: '/' },
          { text: 'Documentation', link: '/docs/' },
          { text: 'Introduction', link: '/docs/introduction' },
          { text: 'Installation', link: '/docs/installation' },
          { text: 'Getting started', link: '/docs/getting-started' },
        ],
      },
      {
        text: 'Messages',
        items: [
          { text: 'Translations', link: '/docs/translations' },
          { text: 'Interpolation', link: '/docs/interpolation' },
          { text: 'Pluralization', link: '/docs/pluralization' },
          { text: 'Fallbacks', link: '/docs/fallbacks' },
        ],
      },
      {
        text: 'Runtime',
        items: [
          { text: 'Locale switching', link: '/docs/locale-switching' },
          { text: 'Lazy loading', link: '/docs/lazy-loading' },
          { text: 'Formatting', link: '/docs/formatting' },
          { text: 'Preact', link: '/docs/preact' },
          { text: 'SSR', link: '/docs/ssr' },
        ],
      },
      {
        text: 'Reference',
        items: [
          { text: 'TypeScript', link: '/docs/typescript' },
          { text: 'API reference', link: '/docs/api-reference' },
          { text: 'Roadmap', link: '/docs/roadmap' },
        ],
      },
    ],
  },
})
