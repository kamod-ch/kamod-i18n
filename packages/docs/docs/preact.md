# Preact

Provide an i18n instance at the application boundary:

```tsx
import { I18nProvider, useI18n, useLocale } from "@kamod-ch/i18n/preact";

function App() {
  const { t } = useI18n<typeof en, "en" | "de">();
  const { locale, locales, setLocale } = useLocale<"en" | "de">();

  return (
    <main>
      <h1>{t("common.title")}</h1>
      {locales.map((item) => (
        <button disabled={item === locale} onClick={() => void setLocale(item)}>
          {item}
        </button>
      ))}
    </main>
  );
}

render(
  <I18nProvider i18n={i18n}>
    <App />
  </I18nProvider>,
  document.getElementById("app")!,
);
```

Hooks subscribe to locale changes and rerender consumers. `useI18n()` outside a provider throws an explanatory error. Nested providers are supported and use the nearest instance.
