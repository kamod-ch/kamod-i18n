# Kamod i18n Documentation

Kamod i18n is a small, type-safe internationalization runtime for TypeScript and Preact. It combines synchronous typed message lookup with native `Intl` formatting and optional lazy loading for locale switches.

## Start here

- [Introduction](/docs/introduction)
- [Installation](/docs/installation)
- [Getting Started](/docs/getting-started)
- [Translations](/docs/translations)
- [TypeScript](/docs/typescript)

## Runtime behavior

- [Interpolation](/docs/interpolation)
- [Pluralization](/docs/pluralization)
- [Locale Switching](/docs/locale-switching)
- [Lazy Loading](/docs/lazy-loading)
- [Fallbacks](/docs/fallbacks)
- [Formatting](/docs/formatting)

## Integration

- [Preact](/docs/preact)
- [Server-Side Rendering](/docs/ssr)
- [API Reference](/docs/api-reference)
- [Roadmap](/docs/roadmap)

## Important invariant

The initial and fallback locales must be eager message objects. This guarantees that synchronous translation and fallback lookup work during the first client or server render. Other locales may use lazy loaders.

Kamod i18n intentionally excludes translation management, extraction, custom ICU parsing, cloud services, and React compatibility layers.
