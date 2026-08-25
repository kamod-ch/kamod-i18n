# Translations

Messages are nested TypeScript objects. Leaves are strings or plural objects.

```ts
export const en = {
  navigation: {
    home: 'Home',
    settings: 'Settings',
  },
  greeting: 'Hello {name}',
  notifications: {
    zero: 'No notifications',
    one: '{count} notification',
    other: '{count} notifications',
  },
} as const
```

Nested strings use dot-separated keys:

```ts
i18n.t('navigation.settings')
```

Use the fallback locale as the canonical schema:

```ts
export const de = {
  // ...
} satisfies Messages<typeof en>
```

`Messages<T>` checks structure while allowing translated string values. Missing or incorrectly shaped entries become TypeScript errors. At runtime, a missing entry is looked up through the fallback chain and finally returns its key.
