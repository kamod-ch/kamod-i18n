import { createContext, type ComponentChildren } from "preact";
import { useCallback, useContext, useLayoutEffect, useState } from "preact/hooks";
import type { I18n, MessageTree } from "../core/types";

const I18nContext = createContext<I18n<MessageTree, string> | undefined>(undefined);

export interface I18nProviderProps<
  TSchema extends MessageTree = MessageTree,
  TLocale extends string = string,
> {
  i18n: I18n<TSchema, TLocale>;
  children: ComponentChildren;
}

export interface UseLocaleResult<TLocale extends string = string> {
  locale: TLocale;
  locales: readonly TLocale[];
  setLocale: (locale: TLocale) => Promise<void>;
}

/** Provide an i18n instance to Preact components. */
export function I18nProvider<TSchema extends MessageTree, TLocale extends string>({
  i18n,
  children,
}: I18nProviderProps<TSchema, TLocale>) {
  return (
    <I18nContext.Provider value={i18n as unknown as I18n<MessageTree, string>}>
      {children}
    </I18nContext.Provider>
  );
}

/** Read the current i18n instance and rerender when its locale changes. */
export const useI18n = <
  TSchema extends MessageTree = MessageTree,
  TLocale extends string = string,
>(): I18n<TSchema, TLocale> => {
  const i18n = useContext(I18nContext);
  const [, forceUpdate] = useState(0);

  useLayoutEffect(() => {
    if (!i18n) return undefined;
    return i18n.subscribe(() => forceUpdate((version) => version + 1));
  }, [i18n]);

  if (!i18n) throw new Error("useI18n() must be used inside <I18nProvider>.");

  return i18n as unknown as I18n<TSchema, TLocale>;
};

/** Convenience hook for locale state and switching. */
export const useLocale = <TLocale extends string = string>(): UseLocaleResult<TLocale> => {
  const i18n = useI18n<MessageTree, TLocale>();
  const setLocale = useCallback((locale: TLocale) => i18n.setLocale(locale), [i18n]);

  return { locale: i18n.locale, locales: i18n.locales, setLocale };
};
