export const pluralCategories = ["zero", "one", "two", "few", "many", "other"] as const;

export type PluralCategory = (typeof pluralCategories)[number];
export type Primitive = string | number | boolean | bigint | Date | null | undefined;
export type InterpolationValues = Record<string, Primitive>;
export type PluralMessage = Readonly<Partial<Record<PluralCategory, string>> & { other: string }>;
export type MessageTree = { readonly [key: string]: unknown };

export type Messages<Schema> = {
  readonly [Key in keyof Schema]: Schema[Key] extends string
    ? string
    : Schema[Key] extends PluralMessage
      ? { readonly [PluralKey in keyof Schema[Key]]: string }
      : Schema[Key] extends object
        ? Messages<Schema[Key]>
        : never;
};

type IsPlural<T> = T extends object
  ? "other" extends keyof T
    ? Exclude<keyof T, PluralCategory> extends never
      ? true
      : false
    : false
  : false;

export type MessageKey<T> = T extends string
  ? never
  : T extends object
    ? {
        [K in Extract<keyof T, string>]: T[K] extends string
          ? K
          : IsPlural<T[K]> extends true
            ? K
            : T[K] extends object
              ? `${K}.${MessageKey<T[K]>}`
              : never;
      }[Extract<keyof T, string>]
    : never;

export interface MissingKeyInfo {
  locale: string;
  key: string;
}

export type LocaleLoader = () => Promise<unknown> | unknown;
export type LocaleSource<TMessages> = TMessages | LocaleLoader;
export type LocaleMessages<TLocales extends string, TMessages> = Record<
  TLocales,
  LocaleSource<TMessages>
>;

export interface CreateI18nOptions<TMessages extends MessageTree, TLocale extends string = string> {
  locale: TLocale;
  fallbackLocale: TLocale;
  messages: LocaleMessages<TLocale, TMessages>;
  onMissingKey?: (info: MissingKeyInfo) => void;
}

export type Listener = () => void;
export type Unsubscribe = () => void;

export interface I18n<TSchema, TLocale extends string = string> {
  readonly locale: TLocale;
  readonly fallbackLocale: TLocale;
  readonly locales: readonly TLocale[];
  t: (key: MessageKey<TSchema>, values?: InterpolationValues) => string;
  setLocale: (locale: TLocale) => Promise<void>;
  subscribe: (listener: Listener) => Unsubscribe;
  number: (value: number | bigint, options?: Intl.NumberFormatOptions) => string;
  date: (value: Date | number | string, options?: Intl.DateTimeFormatOptions) => string;
  relativeTime: (
    value: number,
    unit: Intl.RelativeTimeFormatUnit,
    options?: Intl.RelativeTimeFormatOptions,
  ) => string;
  list: (values: Iterable<string>, options?: Intl.ListFormatOptions) => string;
}
