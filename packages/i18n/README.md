# kamod-i18n

Type-safe, Preact-native internationalization with zero runtime dependencies.

`@kamod-ch/i18n` is deliberately small: a typed translation lookup, tiny interpolation, plural selection through `Intl.PluralRules`, and formatting through native JavaScript `Intl` APIs.

## Features

- Type-safe nested translation keys
- Default-locale-as-schema workflow
- Preact-native adapter (`preact`, `preact/hooks`) without React compatibility
- Framework-independent SSR-safe core
- Lazy-loaded locales with caching
- Fallback locale and final key fallback for missing translations
- Number, date, relative time, and list formatting via native `Intl`
- ESM-first and tree-shakeable
- Zero runtime dependencies in the core package

## Installation

```bash
pnpm add @kamod-ch/i18n
pnpm add preact # only when using @kamod-ch/i18n/preact
```

## Quick Start

```ts
import { createI18n, type Messages } from '@kamod-ch/i18n'

export const en = {
  common: { save: 'Save', cancel: 'Cancel' },
  dashboard: {
    welcome: 'Welcome {name}',
    users: { zero: 'No users', one: '{count} user', other: '{count} users' },
  },
} as const

export const de = {
  common: { save: 'Speichern', cancel: 'Abbrechen' },
  dashboard: {
    welcome: 'Willkommen {name}',
    users: { zero: 'Keine Benutzer', one: '{count} Benutzer', other: '{count} Benutzer' },
  },
} satisfies Messages<typeof en>

const i18n = createI18n({ locale: 'en', fallbackLocale: 'en', messages: { en, de } })

i18n.t('dashboard.welcome', { name: 'Klaus' })
```

## Preact

```tsx
import { I18nProvider, useI18n } from '@kamod-ch/i18n/preact'

function App() {
  const { t, setLocale } = useI18n<typeof en, 'en' | 'de'>()
  return <button onClick={() => void setLocale('de')}>{t('common.save')}</button>
}
```

## Lazy locales

```ts
const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    de: () => import('./locales/de'), // default export preferred
    fr: () => import('./locales/fr'),
  },
})
```

The initial and fallback locales must be eager message objects because `t()` and the first render are synchronous. Lazy loaders are supported for switch targets, cached after a successful load, and retried after failures.

## Pluralization

Plural messages use standard `Intl.PluralRules` categories: `zero`, `one`, `two`, `few`, `many`, and `other`. `other` is required and used as a fallback.

```ts
i18n.t('dashboard.users', { count: 5 })
```

## Formatting

```ts
i18n.number(12840, { style: 'currency', currency: 'CHF' })
i18n.date(new Date(), { dateStyle: 'medium' })
i18n.relativeTime(-2, 'day')
i18n.list(['Preact', 'Otok', 'Kamod'])
```

## SSR

Create one i18n instance per request. There is no global mutable locale state.

```ts
function handleRequest(request) {
  const i18n = createI18n({ locale: detectLocale(request), fallbackLocale: 'en', messages })
  return renderApp({ request, i18n })
}
```

Hydrate with the same initial locale used during SSR to avoid mismatched HTML.

## Why kamod-i18n?

Lingui, i18next, and FormatJS solve broad translation-management and ICU-message problems. Kamod i18n focuses on a smaller use case: typed app-local messages, native `Intl` formatting, Preact-first integration, and minimal runtime cost.

It does not include translation management, message extraction, a custom ICU runtime, cloud services, or React compatibility layers.

## Roadmap

- v0.1: Core engine, typed keys, interpolation, pluralization, Intl formatting, lazy locales, fallbacks, Preact hooks, SSR-safe architecture, docs, example
- v0.2: Improved interpolation typing, namespaces, SSR utilities, validation helpers
- v0.3: Otok middleware, locale routing, Accept-Language detection, cookie locale persistence
- v0.4: PreactPress integration
- v0.5: Potential validation CLI

## License

MIT
