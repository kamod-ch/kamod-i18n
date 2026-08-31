# Server-Side Rendering

Create one i18n instance per request. Instances contain mutable locale state and must not be shared between users.

```ts
function handleRequest(request: Request) {
  const locale = detectLocale(request);
  const i18n = createI18n({
    locale,
    fallbackLocale: "en",
    messages: { en, de },
  });

  return renderApp({ request, i18n });
}
```

All possible initial locales must be eager because translation lookup is synchronous during rendering. Hydrate the client with the same locale and messages used by the server to avoid mismatched HTML.

Native `Intl` output may vary between runtime versions. Specify options such as `timeZone`, calendar, numbering system, and currency when deterministic server/client output matters.
