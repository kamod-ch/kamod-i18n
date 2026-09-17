<p align="center">
  <img src=".github/assets/logo-kamod-i18n-dark.svg#gh-light-mode-only" alt="Kamod i18n" width="280" />
  <img src=".github/assets/logo-kamod-i18n-light.svg#gh-dark-mode-only" alt="Kamod i18n" width="280" />
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@kamod-ch/i18n"><img src="https://img.shields.io/npm/v/%40kamod-ch%2Fi18n" alt="npm version" /></a>
  <a href="https://github.com/kamod-ch/kamod-i18n/stargazers"><img src="https://img.shields.io/github/stars/kamod-ch/kamod-i18n?style=social" alt="GitHub stars" /></a>
  <a href="https://github.com/kamod-ch/kamod-i18n/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT license" /></a>
</p>

<p align="center">
  <strong><a href="https://www.npmjs.com/package/@kamod-ch/i18n">npm</a></strong> ·
  <strong><a href="https://github.com/kamod-ch/kamod-i18n">GitHub</a></strong> ·
  <strong><a href="https://github.com/kamod-ch/kamod-i18n/issues">Issues</a></strong>
</p>

> If Kamod i18n saves you time, **[star the repo](https://github.com/kamod-ch/kamod-i18n)** — it helps others discover the project.

# Kamod i18n

Type-safe, Preact-native internationalization with zero runtime dependencies.

```ts
import { createI18n, type Messages } from '@kamod-ch/i18n'

const en = {
  common: { save: 'Save' },
  dashboard: { welcome: 'Welcome {name}' },
} as const

const de = {
  common: { save: 'Speichern' },
  dashboard: { welcome: 'Willkommen {name}' },
} satisfies Messages<typeof en>

const i18n = createI18n({ locale: 'en', fallbackLocale: 'en', messages: { en, de } })

i18n.t('dashboard.welcome', { name: 'Klaus' })
```

Zero runtime dependencies in the core. Preact is an optional peer dependency for `@kamod-ch/i18n/preact`.
