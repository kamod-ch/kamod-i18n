# TypeScript

The fallback locale is the canonical message schema:

```ts
const en = {
  common: { save: "Save" },
  users: { one: "{count} user", other: "{count} users" },
} as const;

const de = {
  common: { save: "Speichern" },
  users: { one: "{count} Benutzer", other: "{count} Benutzer" },
} satisfies Messages<typeof en>;
```

`as const` preserves nested keys and plural shape. `satisfies Messages<typeof en>` verifies another locale without requiring identical literal text.

`createI18n()` infers:

- valid locale names from `messages`
- valid translation keys from `fallbackLocale`
- eager initial/fallback locale requirements

```ts
const i18n = createI18n({ locale: "en", fallbackLocale: "en", messages: { en, de } });
i18n.t("common.save"); // valid
i18n.t("common.unknown"); // TypeScript error
i18n.setLocale("fr"); // TypeScript error
```

The Preact hooks cannot infer a provider's generic type through context, so pass schema and locale types to `useI18n()` where strict key typing is required.
