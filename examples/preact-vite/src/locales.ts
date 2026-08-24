export const en = {
  title: 'Kamod i18n example',
  welcome: 'Welcome {name}',
  users: { zero: 'No users', one: '{count} user', other: '{count} users' },
} as const

export const de = {
  title: 'Kamod i18n Beispiel',
  welcome: 'Willkommen {name}',
  users: { zero: 'Keine Benutzer', one: '{count} Benutzer', other: '{count} Benutzer' },
} satisfies import('@kamod/i18n').Messages<typeof en>
