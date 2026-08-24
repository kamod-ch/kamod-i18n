import { L as LocaleSource, M as MessageTree, a as MissingKeyInfo, I as I18n } from './types-dywHm-5t.js';
export { C as CreateI18nOptions, b as InterpolationValues, c as Listener, d as MessageKey, e as Messages, P as PluralCategory, f as PluralMessage, U as Unsubscribe } from './types-dywHm-5t.js';

type LocaleKey<TSources> = Extract<keyof TSources, string>;
type SourceSchema<TSource> = TSource extends () => unknown ? never : TSource extends MessageTree ? TSource : never;
/**
 * Create an isolated i18n runtime. Instances are independent and safe to use per SSR request.
 */
declare const createI18n: <const TSources extends Record<string, LocaleSource<MessageTree>>>(options: {
    locale: LocaleKey<TSources>;
    fallbackLocale: LocaleKey<TSources>;
    messages: TSources;
    onMissingKey?: (info: MissingKeyInfo) => void;
}) => I18n<SourceSchema<TSources[keyof TSources]>, LocaleKey<TSources>>;

export { I18n, MessageTree, MissingKeyInfo, createI18n };
