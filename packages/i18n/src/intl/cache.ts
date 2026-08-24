type FormatterFactory<TOptions, TFormatter> = (locale: string, options?: TOptions) => TFormatter

const stableOptionsKey = (options: object | undefined): string => {
  if (!options) return ''
  const entries = Object.entries(options).sort(([a], [b]) => a.localeCompare(b))
  return JSON.stringify(entries)
}

export const createFormatterCache = <TOptions extends object, TFormatter>(
  factory: FormatterFactory<TOptions, TFormatter>,
) => {
  const cache = new Map<string, TFormatter>()

  return (locale: string, options?: TOptions): TFormatter => {
    const key = `${locale}:${stableOptionsKey(options)}`
    const cached = cache.get(key)
    if (cached) return cached

    const formatter = factory(locale, options)
    cache.set(key, formatter)
    return formatter
  }
}
