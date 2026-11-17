import type { I18n, LocaleSource, MessageTree, MissingKeyInfo } from "./types.js";
type LocaleKey<TSources> = Extract<keyof TSources, string>;
type SourceSchema<TSource> = TSource extends MessageTree ? TSource : never;
/**
 * Create an isolated i18n runtime. Instances are independent and safe to use per SSR request.
 */
export declare const createI18n: <const TSources extends Record<string, LocaleSource<MessageTree>>, const TInitialLocale extends LocaleKey<TSources>, const TFallbackLocale extends LocaleKey<TSources>>(options: {
    locale: TInitialLocale;
    fallbackLocale: TFallbackLocale;
    messages: TSources & Record<TInitialLocale | TFallbackLocale, MessageTree>;
    onMissingKey?: (info: MissingKeyInfo) => void;
}) => I18n<SourceSchema<TSources[TFallbackLocale]>, LocaleKey<TSources>>;
export {};
