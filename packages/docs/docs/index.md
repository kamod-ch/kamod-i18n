# Kamod i18n Documentation

Kamod i18n is a small, type-safe internationalization runtime for TypeScript and Preact. It combines synchronous typed message lookup with native `Intl` formatting and optional lazy loading for locale switches.

## Start here

- [Introduction](./introduction)
- [Installation](./installation)
- [Getting Started](./getting-started)
- [Translations](./translations)
- [TypeScript](./typescript)

## Runtime behavior

- [Interpolation](./interpolation)
- [Pluralization](./pluralization)
- [Locale Switching](./locale-switching)
- [Lazy Loading](./lazy-loading)
- [Fallbacks](./fallbacks)
- [Formatting](./formatting)

## Integration

- [Preact](./preact)
- [Server-Side Rendering](./ssr)
- [API Reference](./api-reference)
- [Roadmap](./roadmap)

## Important invariant

The initial and fallback locales must be eager message objects. This guarantees that synchronous translation and fallback lookup work during the first client or server render. Other locales may use lazy loaders.

Kamod i18n intentionally excludes translation management, extraction, custom ICU parsing, cloud services, and React compatibility layers.
