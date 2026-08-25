# Pluralization

A message object containing only plural categories is treated as a plural message. `other` is required.

```ts
const en = {
  users: {
    zero: 'No users',
    one: '{count} user',
    other: '{count} users',
  },
} as const

i18n.t('users', { count: 5 })
```

Supported categories are `zero`, `one`, `two`, `few`, `many`, and `other`. Selection uses `Intl.PluralRules` for the active locale. If the selected category is absent, `other` is used.

Pass `count` as a number or bigint. Without a numeric count, Kamod i18n selects `other`. Explicit `zero` is only selected when the locale's `Intl.PluralRules` returns that category; it is not a universal special case for the number `0`.
