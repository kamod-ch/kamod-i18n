# Interpolation

Placeholders use `{name}` syntax and are replaced with values passed to `t()`.

```ts
const en = { welcome: "Welcome {name}; today is {date}" } as const;
const i18n = createI18n({ locale: "en", fallbackLocale: "en", messages: { en } });

i18n.t("welcome", { name: "Ada", date: new Date(0) });
```

Values may be strings, numbers, booleans, bigints, dates, `null`, or `undefined`. Missing, `null`, and `undefined` values leave the original placeholder unchanged. Values are converted with `String()`; locale-aware formatting must be performed with `number()`, `date()`, or another formatter before interpolation.

Placeholder names may contain letters, digits, `_`, and `$`, but cannot start with a digit. Interpolation values are currently key-agnostic; compile-time extraction of required placeholders is planned for a later release.
