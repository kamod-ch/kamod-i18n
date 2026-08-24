import { describe, expect, expectTypeOf, it, vi } from 'vitest'
import { createI18n, type Messages } from '../src'

const en = {
  common: { save: 'Save', cancel: 'Cancel' },
  dashboard: {
    welcome: 'Welcome {name}',
    missingInDe: 'Fallback text',
    users: { zero: 'No users', one: '{count} user', other: '{count} users' },
  },
} as const

const de = {
  common: { save: 'Speichern', cancel: 'Abbrechen' },
  dashboard: {
    welcome: 'Willkommen {name}',
    missingInDe: 'Fallback-Text',
    users: { zero: 'Keine Benutzer', one: '{count} Benutzer', other: '{count} Benutzer' },
  },
} satisfies Messages<typeof en>

const deMissing = {
  common: de.common,
  dashboard: {
    welcome: de.dashboard.welcome,
    users: de.dashboard.users,
  },
} as unknown as Messages<typeof en>

describe('core', () => {
  it('translates simple and nested messages', () => {
    const i18n = createI18n({ locale: 'en', fallbackLocale: 'en', messages: { en, de } })
    expect(i18n.t('common.save')).toBe('Save')
    expect(i18n.t('dashboard.welcome', { name: 'Klaus' })).toBe('Welcome Klaus')
  })

  it('falls back and reports missing keys', () => {
    const onMissingKey = vi.fn()
    const i18n = createI18n({ locale: 'de', fallbackLocale: 'en', messages: { en, de: deMissing }, onMissingKey })
    expect(i18n.t('dashboard.missingInDe')).toBe('Fallback text')
    // @ts-expect-error testing runtime fallback for bad caller input
    expect(i18n.t('dashboard.nope')).toBe('dashboard.nope')
    expect(onMissingKey).toHaveBeenCalledWith({ locale: 'de', key: 'dashboard.nope' })
  })

  it('switches locales and notifies subscribers', async () => {
    const i18n = createI18n({ locale: 'en', fallbackLocale: 'en', messages: { en, de } })
    const listener = vi.fn()
    const unsubscribe = i18n.subscribe(listener)
    await i18n.setLocale('de')
    expect(i18n.locale).toBe('de')
    expect(i18n.t('common.save')).toBe('Speichern')
    expect(listener).toHaveBeenCalledTimes(1)
    unsubscribe()
    await i18n.setLocale('en')
    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('rejects invalid locales', async () => {
    const i18n = createI18n({ locale: 'en', fallbackLocale: 'en', messages: { en, de } })
    // @ts-expect-error testing runtime validation
    await expect(i18n.setLocale('it')).rejects.toThrow('Unknown locale "it"')
  })

  it('lazy loads and caches locales', async () => {
    const loadDe = vi.fn(async () => ({ default: de }))
    const i18n = createI18n({ locale: 'en', fallbackLocale: 'en', messages: { en, de: loadDe } })
    await i18n.setLocale('de')
    expect(i18n.t('common.save')).toBe('Speichern')
    await i18n.setLocale('en')
    await i18n.setLocale('de')
    expect(loadDe).toHaveBeenCalledTimes(1)
  })

  it('keeps independent instances isolated for SSR', async () => {
    const first = createI18n({ locale: 'en', fallbackLocale: 'en', messages: { en, de } })
    const second = createI18n({ locale: 'de', fallbackLocale: 'en', messages: { en, de } })
    await first.setLocale('en')
    expect(first.t('common.save')).toBe('Save')
    expect(second.t('common.save')).toBe('Speichern')
  })
})

describe('types', () => {
  it('infers valid message keys', () => {
    const i18n = createI18n({ locale: 'en', fallbackLocale: 'en', messages: { en, de } })
    expectTypeOf(i18n.t).parameter(0).toEqualTypeOf<'common.save' | 'common.cancel' | 'dashboard.welcome' | 'dashboard.missingInDe' | 'dashboard.users'>()
    i18n.t('common.save')
    // @ts-expect-error unknown key
    i18n.t('does.not.exist')
  })
})
