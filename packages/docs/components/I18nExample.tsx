import { useMemo, useState } from 'preact/hooks'
import { createI18n, type Messages } from '@kamod-ch/i18n'
import { I18nProvider, useI18n, useLocale } from '@kamod-ch/i18n/preact'

const en = {
  title: 'A small internationalized app',
  greeting: 'Welcome, {name}!',
  users: { one: '{count} active user', other: '{count} active users' },
  add: 'Add user',
  price: 'Annual plan',
  languages: { en: 'English', de: 'German', fr: 'French' },
} as const

const de = {
  title: 'Eine kleine internationalisierte App',
  greeting: 'Willkommen, {name}!',
  users: { one: '{count} aktiver Benutzer', other: '{count} aktive Benutzer' },
  add: 'Benutzer hinzufügen',
  price: 'Jahresabo',
  languages: { en: 'Englisch', de: 'Deutsch', fr: 'Französisch' },
} satisfies Messages<typeof en>

const fr = {
  title: 'Une petite application internationalisée',
  greeting: 'Bienvenue, {name} !',
  users: { one: '{count} utilisateur actif', other: '{count} utilisateurs actifs' },
  add: 'Ajouter un utilisateur',
  price: 'Abonnement annuel',
  languages: { en: 'Anglais', de: 'Allemand', fr: 'Français' },
} satisfies Messages<typeof en>

type Locale = 'en' | 'de' | 'fr'

function ExampleCard() {
  const { t, number, date } = useI18n<typeof en, Locale>()
  const { locale, locales, setLocale } = useLocale<Locale>()
  const [count, setCount] = useState(2)
  const [loading, setLoading] = useState(false)

  async function selectLocale(nextLocale: Locale) {
    setLoading(true)
    try {
      await setLocale(nextLocale)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section class="i18n-example" aria-label="Interactive Kamod i18n example">
      <div class="i18n-example__toolbar">
        <span class="i18n-example__status">{loading ? 'Loading locale…' : `locale: ${locale}`}</span>
        <div class="i18n-example__locales" role="group" aria-label="Language">
          {locales.map((item) => (
            <button
              type="button"
              class={item === locale ? 'is-active' : ''}
              disabled={loading || item === locale}
              onClick={() => void selectLocale(item)}
            >
              {t(`languages.${item}`)}
            </button>
          ))}
        </div>
      </div>

      <h2>{t('title')}</h2>
      <p class="i18n-example__lead">{t('greeting', { name: 'Ada' })}</p>

      <div class="i18n-example__facts">
        <div><span>{t('users', { count })}</span><button type="button" onClick={() => setCount((value) => value + 1)}>{t('add')}</button></div>
        <div><span>{t('price')}</span><strong>{number(128.4, { style: 'currency', currency: 'CHF' })}</strong></div>
        <div><span>Release date</span><strong>{date(new Date('2026-08-24T12:00:00Z'), { dateStyle: 'long', timeZone: 'UTC' })}</strong></div>
      </div>
    </section>
  )
}

export default function I18nExample() {
  const i18n = useMemo(
    () => createI18n({
      locale: 'en',
      fallbackLocale: 'en',
      messages: {
        en,
        de,
        // A loader can also use import('./locales/fr').
        fr: async () => ({ default: fr }),
      },
    }),
    [],
  )

  return (
    <I18nProvider i18n={i18n}>
      <ExampleCard />
    </I18nProvider>
  )
}
