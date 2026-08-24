declare const pluralCategories: readonly ["zero", "one", "two", "few", "many", "other"];
type PluralCategory = (typeof pluralCategories)[number];
type Primitive = string | number | boolean | bigint | Date | null | undefined;
type InterpolationValues = Record<string, Primitive>;
type PluralMessage = Readonly<Partial<Record<PluralCategory, string>> & {
    other: string;
}>;
type MessageTree = {
    readonly [key: string]: unknown;
};
type Messages<Schema> = {
    readonly [Key in keyof Schema]: Schema[Key] extends string ? string : Schema[Key] extends PluralMessage ? {
        readonly [PluralKey in keyof Schema[Key]]: string;
    } : Schema[Key] extends object ? Messages<Schema[Key]> : never;
};
type IsPlural<T> = T extends object ? 'other' extends keyof T ? Exclude<keyof T, PluralCategory> extends never ? true : false : false : false;
type MessageKey<T> = T extends string ? never : T extends object ? {
    [K in Extract<keyof T, string>]: T[K] extends string ? K : IsPlural<T[K]> extends true ? K : T[K] extends object ? `${K}.${MessageKey<T[K]>}` : never;
}[Extract<keyof T, string>] : never;
interface MissingKeyInfo {
    locale: string;
    key: string;
}
type LocaleLoader = () => Promise<unknown> | unknown;
type LocaleSource<TMessages> = TMessages | LocaleLoader;
type LocaleMessages<TLocales extends string, TMessages> = Record<TLocales, LocaleSource<TMessages>>;
interface CreateI18nOptions<TMessages extends MessageTree, TLocale extends string = string> {
    locale: TLocale;
    fallbackLocale: TLocale;
    messages: LocaleMessages<TLocale, TMessages>;
    onMissingKey?: (info: MissingKeyInfo) => void;
}
type Listener = () => void;
type Unsubscribe = () => void;
interface I18n<TSchema, TLocale extends string = string> {
    readonly locale: TLocale;
    readonly fallbackLocale: TLocale;
    readonly locales: readonly TLocale[];
    t: (key: MessageKey<TSchema>, values?: InterpolationValues) => string;
    setLocale: (locale: TLocale) => Promise<void>;
    subscribe: (listener: Listener) => Unsubscribe;
    number: (value: number | bigint, options?: Intl.NumberFormatOptions) => string;
    date: (value: Date | number | string, options?: Intl.DateTimeFormatOptions) => string;
    relativeTime: (value: number, unit: Intl.RelativeTimeFormatUnit, options?: Intl.RelativeTimeFormatOptions) => string;
    list: (values: Iterable<string>, options?: Intl.ListFormatOptions) => string;
}

export type { CreateI18nOptions as C, I18n as I, LocaleSource as L, MessageTree as M, PluralCategory as P, Unsubscribe as U, MissingKeyInfo as a, InterpolationValues as b, Listener as c, MessageKey as d, Messages as e, PluralMessage as f };
