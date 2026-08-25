// src/intl/cache.ts
var stableOptionsKey = (options) => {
  if (!options) return "";
  const entries = Object.entries(options).sort(([a], [b]) => a.localeCompare(b));
  return JSON.stringify(entries);
};
var createFormatterCache = (factory) => {
  const cache = /* @__PURE__ */ new Map();
  return (locale, options) => {
    const key = `${locale}:${stableOptionsKey(options)}`;
    const cached = cache.get(key);
    if (cached) return cached;
    const formatter = factory(locale, options);
    cache.set(key, formatter);
    return formatter;
  };
};

// src/core/types.ts
var pluralCategories = ["zero", "one", "two", "few", "many", "other"];

// src/core/messages.ts
var isPlainObject = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
var isPluralMessage = (value) => {
  if (!isPlainObject(value) || typeof value.other !== "string") return false;
  return Object.keys(value).every((key) => pluralCategories.includes(key));
};
var getMessage = (messages, key) => {
  if (!messages) return void 0;
  let current = messages;
  for (const part of key.split(".")) {
    if (!isPlainObject(current) || !Object.prototype.hasOwnProperty.call(current, part)) return void 0;
    current = current[part];
  }
  return typeof current === "string" || isPluralMessage(current) ? current : void 0;
};
var interpolate = (template, values = {}) => template.replace(/\{([A-Za-z_$][\w$]*)\}/g, (match, name) => {
  const value = values[name];
  return value === void 0 || value === null ? match : String(value);
});
var normalizeMessages = (moduleValue) => {
  const candidate = isPlainObject(moduleValue) && "default" in moduleValue ? moduleValue.default : moduleValue;
  if (!isPlainObject(candidate)) {
    throw new TypeError("Locale loader must resolve to a messages object or a module with a default export.");
  }
  return candidate;
};
var localeChain = (locale, fallbackLocale) => {
  const chain = [];
  const add = (item) => {
    if (!chain.includes(item)) chain.push(item);
  };
  add(locale);
  const base = locale.split("-")[0];
  if (base && base !== locale) add(base);
  add(fallbackLocale);
  return chain;
};

// src/core/create-i18n.ts
var isLocaleLoader = (value) => typeof value === "function";
var makeUnknownLocaleError = (locale, available) => new Error(`Unknown locale "${locale}". Available locales: ${available.join(", ")}.`);
var makeLazyRequiredLocaleError = (role, locale) => new TypeError(
  `${role} locale "${locale}" must use an eager messages object; locale loaders are only supported for switch targets.`
);
var createI18n = (options) => {
  const sources = options.messages;
  const locales = Object.keys(sources);
  const loaded = /* @__PURE__ */ new Map();
  const pending = /* @__PURE__ */ new Map();
  const listeners = /* @__PURE__ */ new Set();
  let activeLocale = options.locale;
  let localeRequest = 0;
  const numberFormatter = createFormatterCache(
    (locale, formatOptions) => new Intl.NumberFormat(locale, formatOptions)
  );
  const dateFormatter = createFormatterCache(
    (locale, formatOptions) => new Intl.DateTimeFormat(locale, formatOptions)
  );
  const relativeTimeFormatter = createFormatterCache(
    (locale, formatOptions) => new Intl.RelativeTimeFormat(locale, formatOptions)
  );
  const listFormatter = createFormatterCache(
    (locale, formatOptions) => new Intl.ListFormat(locale, formatOptions)
  );
  const pluralRules = createFormatterCache(
    (locale, pluralOptions) => new Intl.PluralRules(locale, pluralOptions)
  );
  const hasLocale = (locale) => Object.prototype.hasOwnProperty.call(sources, locale);
  const loadLocale = async (locale) => {
    const cached = loaded.get(locale);
    if (cached) return cached;
    const existing = pending.get(locale);
    if (existing) return existing;
    const source = sources[locale];
    const promise = Promise.resolve().then(() => isLocaleLoader(source) ? source() : source).then((value) => {
      const messages = normalizeMessages(value);
      loaded.set(locale, messages);
      return messages;
    }).finally(() => pending.delete(locale));
    pending.set(locale, promise);
    return promise;
  };
  if (!hasLocale(options.locale)) throw makeUnknownLocaleError(options.locale, locales);
  if (!hasLocale(options.fallbackLocale)) throw makeUnknownLocaleError(options.fallbackLocale, locales);
  if (isLocaleLoader(sources[options.locale])) throw makeLazyRequiredLocaleError("Initial", options.locale);
  if (isLocaleLoader(sources[options.fallbackLocale])) throw makeLazyRequiredLocaleError("Fallback", options.fallbackLocale);
  for (const locale of locales) {
    const source = sources[locale];
    if (!isLocaleLoader(source)) loaded.set(locale, normalizeMessages(source));
  }
  const notify = () => {
    for (const listener of listeners) listener();
  };
  const resolveMessage = (key) => {
    for (const locale of localeChain(activeLocale, options.fallbackLocale)) {
      const message = getMessage(loaded.get(locale), key);
      if (message !== void 0) return { message, locale };
    }
    return { locale: activeLocale };
  };
  const t = (key, values = {}) => {
    const stringKey = String(key);
    const { message, locale } = resolveMessage(stringKey);
    if (message === void 0) {
      options.onMissingKey?.({ locale, key: stringKey });
      return stringKey;
    }
    if (typeof message === "string") return interpolate(message, values);
    const count = values.count;
    const category = typeof count === "number" || typeof count === "bigint" ? pluralRules(activeLocale).select(Number(count)) : "other";
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
      if (request !== localeRequest || locale === activeLocale) return;
      activeLocale = locale;
      notify();
    },
    subscribe(listener) {
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
    }
  };
};
export {
  createI18n
};
//# sourceMappingURL=index.js.map