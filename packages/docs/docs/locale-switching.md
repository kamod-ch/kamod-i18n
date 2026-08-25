# Locale Switching

Switching is asynchronous because the target may be lazy loaded:

```ts
await i18n.setLocale('de')
console.log(i18n.locale) // de
```

`setLocale()` validates the locale, loads it once, activates it, and notifies subscribers. Re-selecting the active locale does not notify subscribers. Failed lazy loads can be retried.

If switches overlap, the most recently requested locale wins even when an older network request finishes later.

```ts
const unsubscribe = i18n.subscribe(() => {
  console.log('active locale:', i18n.locale)
})

await i18n.setLocale('fr')
unsubscribe()
```

Unknown locale values reject with an error listing the available locales. TypeScript prevents them when locale names are inferred from the `messages` object.
