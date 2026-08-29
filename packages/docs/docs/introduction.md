# Introduction

`@kamod-ch/i18n` is a small, type-safe internationalization runtime for TypeScript and Preact. It provides nested message lookup, interpolation, plural selection, locale switching, lazy loading, fallbacks, and native `Intl` formatting without runtime dependencies.

## Design goals

- Use one eager locale as the TypeScript message schema.
- Keep translation files as ordinary TypeScript objects.
- Use browser and Node.js `Intl` implementations instead of a custom formatter.
- Keep each i18n instance isolated and safe for server-side rendering.
- Integrate directly with Preact without a React compatibility layer.

Kamod i18n intentionally does not provide message extraction, translation management, an ICU parser, routing, or cloud services.

## Runtime model

`createI18n()` creates an independent instance. Translation calls are synchronous, while switching to a lazy locale is asynchronous. Because the first render and fallback lookup must remain synchronous, the initial and fallback locales must use eager message objects.
