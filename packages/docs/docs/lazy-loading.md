# Lazy Loading

Non-initial locales can be loaded on demand:

```ts
const i18n = createI18n({
  locale: "en",
  fallbackLocale: "en",
  messages: {
    en,
    de: () => import("./locales/de"),
    fr: () => import("./locales/fr"),
  },
});
```

A loader may resolve directly to a message object or to an ES module with a default export. The first successful result is cached. Concurrent requests for the same locale share one promise, while failed requests are removed from the cache and may be retried.

## Required eager locales

The initial locale and fallback locale **must be eager message objects**:

```ts
// Invalid: `t()` is synchronous, so `en` is unavailable for the first render.
createI18n({ locale: "en", fallbackLocale: "en", messages: { en: () => import("./en") } });
```

This rule is enforced by TypeScript and by runtime validation. To start with a remotely loaded locale, load its messages before calling `createI18n()`.
