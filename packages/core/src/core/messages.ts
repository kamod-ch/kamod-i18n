import {
  pluralCategories,
  type InterpolationValues,
  type MessageTree,
  type PluralMessage,
} from "./types";

export const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const isPluralMessage = (value: unknown): value is PluralMessage => {
  if (!isPlainObject(value) || typeof value.other !== "string") return false;
  return Object.keys(value).every((key) => (pluralCategories as readonly string[]).includes(key));
};

export const getMessage = (
  messages: MessageTree | undefined,
  key: string,
): string | PluralMessage | undefined => {
  if (!messages) return undefined;
  let current: unknown = messages;
  for (const part of key.split(".")) {
    if (!isPlainObject(current) || !Object.prototype.hasOwnProperty.call(current, part))
      return undefined;
    current = current[part];
  }
  return typeof current === "string" || isPluralMessage(current) ? current : undefined;
};

export const interpolate = (template: string, values: InterpolationValues = {}): string =>
  template.replace(/\{([A-Za-z_$][\w$]*)\}/g, (match, name: string) => {
    const value = values[name];
    return value === undefined || value === null ? match : String(value);
  });

export const normalizeMessages = (moduleValue: unknown): MessageTree => {
  const candidate =
    isPlainObject(moduleValue) && "default" in moduleValue ? moduleValue.default : moduleValue;
  if (!isPlainObject(candidate)) {
    throw new TypeError(
      "Locale loader must resolve to a messages object or a module with a default export.",
    );
  }
  return candidate as MessageTree;
};

export const localeChain = (locale: string, fallbackLocale: string): string[] => {
  const chain: string[] = [];
  const add = (item: string) => {
    if (!chain.includes(item)) chain.push(item);
  };

  add(locale);
  const base = locale.split("-")[0];
  if (base && base !== locale) add(base);
  add(fallbackLocale);
  return chain;
};
