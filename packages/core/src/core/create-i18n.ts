import { createFormatterCache } from "../intl/cache";
import { getMessage, interpolate, localeChain, normalizeMessages } from "./messages";
import type {
  I18n,
  InterpolationValues,
  Listener,
  LocaleSource,
  MessageKey,
  MessageTree,
  MissingKeyInfo,
  PluralMessage,
  Unsubscribe,
} from "./types";

const isLocaleLoader = <TMessages>(value: TMessages | (() => unknown)): value is () => unknown =>
  typeof value === "function";

const makeUnknownLocaleError = (locale: string, available: readonly string[]) =>
  new Error(`Unknown locale "${locale}". Available locales: ${available.join(", ")}.`);

const makeLazyRequiredLocaleError = (role: "Initial" | "Fallback", locale: string) =>
  new TypeError(
    `${role} locale "${locale}" must use an eager messages object; locale loaders are only supported for switch targets.`,
  );

type LocaleKey<TSources> = Extract<keyof TSources, string>;
type SourceSchema<TSource> = TSource extends MessageTree ? TSource : never;

/**
 * Create an isolated i18n runtime. Instances are independent and safe to use per SSR request.
 */
export const createI18n = <
  const TSources extends Record<string, LocaleSource<MessageTree>>,
  const TInitialLocale extends LocaleKey<TSources>,
  const TFallbackLocale extends LocaleKey<TSources>,
>(options: {
  locale: TInitialLocale;
  fallbackLocale: TFallbackLocale;
  messages: TSources & Record<TInitialLocale | TFallbackLocale, MessageTree>;
  onMissingKey?: (info: MissingKeyInfo) => void;
}): I18n<SourceSchema<TSources[TFallbackLocale]>, LocaleKey<TSources>> => {
  const sources = options.messages;
  const locales = Object.keys(sources) as LocaleKey<TSources>[];
  const loaded = new Map<string, MessageTree>();
  const pending = new Map<string, Promise<MessageTree>>();
  const listeners = new Set<Listener>();
  let activeLocale: LocaleKey<TSources> = options.locale;
  let localeRequest = 0;

  const numberFormatter = createFormatterCache<Intl.NumberFormatOptions, Intl.NumberFormat>(
    (locale, formatOptions) => new Intl.NumberFormat(locale, formatOptions),
  );
  const dateFormatter = createFormatterCache<Intl.DateTimeFormatOptions, Intl.DateTimeFormat>(
    (locale, formatOptions) => new Intl.DateTimeFormat(locale, formatOptions),
  );
  const relativeTimeFormatter = createFormatterCache<
    Intl.RelativeTimeFormatOptions,
    Intl.RelativeTimeFormat
  >((locale, formatOptions) => new Intl.RelativeTimeFormat(locale, formatOptions));
  const listFormatter = createFormatterCache<Intl.ListFormatOptions, Intl.ListFormat>(
    (locale, formatOptions) => new Intl.ListFormat(locale, formatOptions),
  );
  const pluralRules = createFormatterCache<Intl.PluralRulesOptions, Intl.PluralRules>(
    (locale, pluralOptions) => new Intl.PluralRules(locale, pluralOptions),
  );

  const hasLocale = (locale: string): locale is LocaleKey<TSources> =>
    Object.prototype.hasOwnProperty.call(sources, locale);

  const loadLocale = async (locale: LocaleKey<TSources>): Promise<MessageTree> => {
    const cached = loaded.get(locale);
    if (cached) return cached;

    const existing = pending.get(locale);
    if (existing) return existing;

    const source = sources[locale] as LocaleSource<MessageTree>;
    const promise = Promise.resolve()
      .then(() => (isLocaleLoader(source) ? source() : source))
      .then((value) => {
        const messages = normalizeMessages(value);
        loaded.set(locale, messages);
        return messages;
      })
      .finally(() => pending.delete(locale));

    pending.set(locale, promise);
    return promise;
  };

  if (!hasLocale(options.locale)) throw makeUnknownLocaleError(options.locale, locales);
  if (!hasLocale(options.fallbackLocale))
    throw makeUnknownLocaleError(options.fallbackLocale, locales);
  if (isLocaleLoader(sources[options.locale]))
    throw makeLazyRequiredLocaleError("Initial", options.locale);
  if (isLocaleLoader(sources[options.fallbackLocale]))
    throw makeLazyRequiredLocaleError("Fallback", options.fallbackLocale);

  for (const locale of locales) {
    const source = sources[locale] as LocaleSource<MessageTree>;
    if (!isLocaleLoader(source)) loaded.set(locale, normalizeMessages(source));
  }

  const notify = () => {
    for (const listener of listeners) listener();
  };

  const resolveMessage = (key: string): { message?: string | PluralMessage; locale: string } => {
    for (const locale of localeChain(activeLocale, options.fallbackLocale)) {
      const message = getMessage(loaded.get(locale), key);
      if (message !== undefined) return { message, locale };
    }
    return { locale: activeLocale };
  };

  const t = (
    key: MessageKey<SourceSchema<TSources[TFallbackLocale]>>,
    values: InterpolationValues = {},
  ): string => {
    const stringKey = String(key);
    const { message, locale } = resolveMessage(stringKey);

    if (message === undefined) {
      options.onMissingKey?.({ locale, key: stringKey });
      return stringKey;
    }

    if (typeof message === "string") return interpolate(message, values);

    const count = values.count;
    const category =
      typeof count === "number" || typeof count === "bigint"
        ? pluralRules(activeLocale).select(Number(count))
        : "other";
    return interpolate(message[category] ?? message.other, values);
  };

  return {
    get locale() {
      return activeLocale;
    },
    get fallbackLocale() {
      return options.fallbackLocale;
    },
    get locales() {
      return locales;
    },
    t,
    async setLocale(locale) {
      if (!hasLocale(locale)) throw makeUnknownLocaleError(locale, locales);

      const request = ++localeRequest;
      await loadLocale(locale);

      // A slower, older request must not overwrite a more recently requested locale.
      if (request !== localeRequest || locale === activeLocale) return;
      activeLocale = locale;
      notify();
    },
    subscribe(listener): Unsubscribe {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    number(value, formatOptions) {
      return numberFormatter(activeLocale, formatOptions).format(value);
    },
    date(value, formatOptions) {
      return dateFormatter(activeLocale, formatOptions).format(new Date(value));
    },
    relativeTime(value, unit, formatOptions) {
      return relativeTimeFormatter(activeLocale, formatOptions).format(value, unit);
    },
    list(values, formatOptions) {
      return listFormatter(activeLocale, formatOptions).format([...values]);
    },
  };
};
