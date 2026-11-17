import { type InterpolationValues, type MessageTree, type PluralMessage } from "./types.js";
export declare const isPlainObject: (value: unknown) => value is Record<string, unknown>;
export declare const isPluralMessage: (value: unknown) => value is PluralMessage;
export declare const getMessage: (messages: MessageTree | undefined, key: string) => string | PluralMessage | undefined;
export declare const interpolate: (template: string, values?: InterpolationValues) => string;
export declare const normalizeMessages: (moduleValue: unknown) => MessageTree;
export declare const localeChain: (locale: string, fallbackLocale: string) => string[];
