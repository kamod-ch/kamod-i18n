// src/preact/provider.tsx
import { createContext } from "preact";
import { useCallback, useContext, useLayoutEffect, useState } from "preact/hooks";
import { jsx } from "preact/jsx-runtime";
var I18nContext = createContext(void 0);
function I18nProvider({
  i18n,
  children
}) {
  return /* @__PURE__ */ jsx(I18nContext.Provider, { value: i18n, children });
}
var useI18n = () => {
  const i18n = useContext(I18nContext);
  const [, forceUpdate] = useState(0);
  useLayoutEffect(() => {
    if (!i18n) return void 0;
    return i18n.subscribe(() => forceUpdate((version) => version + 1));
  }, [i18n]);
  if (!i18n) throw new Error("useI18n() must be used inside <I18nProvider>.");
  return i18n;
};
var useLocale = () => {
  const i18n = useI18n();
  const setLocale = useCallback((locale) => i18n.setLocale(locale), [i18n]);
  return { locale: i18n.locale, locales: i18n.locales, setLocale };
};
export {
  I18nProvider,
  useI18n,
  useLocale
};
//# sourceMappingURL=preact.js.map