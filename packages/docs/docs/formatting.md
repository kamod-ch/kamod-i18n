# Formatting

Formatting uses native `Intl` APIs and the active locale.

```ts
i18n.number(12840, { style: 'currency', currency: 'CHF' })
i18n.date(new Date(), { dateStyle: 'medium' })
i18n.relativeTime(-2, 'day', { numeric: 'auto' })
i18n.list(['Preact', 'Otok', 'Kamod'], { type: 'conjunction' })
```

Methods map directly to:

- `number()` → `Intl.NumberFormat`
- `date()` → `Intl.DateTimeFormat`
- `relativeTime()` → `Intl.RelativeTimeFormat`
- `list()` → `Intl.ListFormat`

Formatter instances are cached by locale and options. Check runtime support or provide polyfills when targeting environments without `Intl.RelativeTimeFormat` or `Intl.ListFormat`. For deterministic SSR output, specify options such as `timeZone` explicitly.
