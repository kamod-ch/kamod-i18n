type FormatterFactory<TOptions, TFormatter> = (locale: string, options?: TOptions) => TFormatter;
export declare const createFormatterCache: <TOptions extends object, TFormatter>(factory: FormatterFactory<TOptions, TFormatter>) => (locale: string, options?: TOptions) => TFormatter;
export {};
