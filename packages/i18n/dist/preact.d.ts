import * as preact from 'preact';
import { ComponentChildren } from 'preact';
import { M as MessageTree, I as I18n } from './types-BOiAhndp.js';

interface I18nProviderProps<TSchema extends MessageTree = MessageTree, TLocale extends string = string> {
    i18n: I18n<TSchema, TLocale>;
    children: ComponentChildren;
}
interface UseLocaleResult<TLocale extends string = string> {
    locale: TLocale;
    locales: readonly TLocale[];
    setLocale: (locale: TLocale) => Promise<void>;
}
/** Provide an i18n instance to Preact components. */
declare function I18nProvider<TSchema extends MessageTree, TLocale extends string>({ i18n, children, }: I18nProviderProps<TSchema, TLocale>): preact.JSX.Element;
/** Read the current i18n instance and rerender when its locale changes. */
declare const useI18n: <TSchema extends MessageTree = MessageTree, TLocale extends string = string>() => I18n<TSchema, TLocale>;
/** Convenience hook for locale state and switching. */
declare const useLocale: <TLocale extends string = string>() => UseLocaleResult<TLocale>;

export { I18nProvider, type I18nProviderProps, type UseLocaleResult, useI18n, useLocale };
