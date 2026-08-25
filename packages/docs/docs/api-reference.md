# API Reference

## `createI18n(options)`

Creates an isolated `I18n` instance.

- `locale`: initial locale; must be eager
- `fallbackLocale`: fallback and schema locale; must be eager
- `messages`: locale names mapped to message objects or lazy loaders
- `onMissingKey?`: callback for keys missing from the complete lookup chain

## `I18n`

- `locale`: active locale
- `fallbackLocale`: configured fallback locale
- `locales`: available locale names
- `t(key, values?)`: translate and interpolate synchronously
- `setLocale(locale)`: load and activate a locale
- `subscribe(listener)`: subscribe to locale changes; returns an unsubscribe function
- `number(value, options?)`: format with `Intl.NumberFormat`
- `date(value, options?)`: format with `Intl.DateTimeFormat`
- `relativeTime(value, unit, options?)`: format with `Intl.RelativeTimeFormat`
- `list(values, options?)`: format with `Intl.ListFormat`

## Exported types

The core entry point exports `Messages`, `MessageKey`, `MessageTree`, `PluralMessage`, `PluralCategory`, `InterpolationValues`, `MissingKeyInfo`, `CreateI18nOptions`, `I18n`, `Listener`, and `Unsubscribe`.

The Preact entry point exports `I18nProvider`, `useI18n`, `useLocale`, `I18nProviderProps`, and `UseLocaleResult`.
