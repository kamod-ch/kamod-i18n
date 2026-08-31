# Fallbacks

Lookup follows this order:

1. active locale
2. its base locale, when applicable (`de-CH` → `de`)
3. configured fallback locale
4. the key itself

Duplicate entries are removed from the chain.

```ts
const i18n = createI18n({
  locale: "de",
  fallbackLocale: "en",
  messages: { en, de },
  onMissingKey(info) {
    console.warn(`Missing ${info.key} for ${info.locale}`);
  },
});
```

`onMissingKey` runs only when no message exists anywhere in the loaded chain. It receives the active locale and requested key.

The fallback locale is also the TypeScript schema and must therefore be an eager message object. A base locale participates only when its locale name exists in `messages` and its messages have already been loaded.
