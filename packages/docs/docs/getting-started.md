# Getting Started

Define the schema locale with `as const`, then validate every eager translation against it.

```ts
import { createI18n, type Messages } from "@kamod-ch/i18n";

const en = {
  common: { save: "Save" },
  welcome: "Welcome {name}",
  users: { one: "{count} user", other: "{count} users" },
} as const;

const de = {
  common: { save: "Speichern" },
  welcome: "Willkommen {name}",
  users: { one: "{count} Benutzer", other: "{count} Benutzer" },
} satisfies Messages<typeof en>;

const i18n = createI18n({
  locale: "en",
  fallbackLocale: "en",
  messages: { en, de },
});

console.log(i18n.t("welcome", { name: "Ada" }));
await i18n.setLocale("de");
```

The fallback locale is the message schema used to infer valid keys. Both `locale` and `fallbackLocale` must initially reference eager message objects.
