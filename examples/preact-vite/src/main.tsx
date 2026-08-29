import { render } from 'preact'
import { useState } from 'preact/hooks'
import { createI18n } from '@kamod-ch/i18n'
import { I18nProvider, useI18n } from '@kamod-ch/i18n/preact'
import { de, en } from './locales'

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    de,
    fr: () => import('./fr'),
  },
})

function Demo() {
  const api = useI18n<typeof en, 'en' | 'de' | 'fr'>()
  const [count, setCount] = useState(2)

  return (
    <main style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h1>{api.t('title')}</h1>
      <p>{api.t('welcome', { name: 'Klaus' })}</p>
      <p>{api.t('users', { count })}</p>
      <button onClick={() => setCount((value) => value + 1)}>+ user</button>
      <p>{api.number(12840, { style: 'currency', currency: 'CHF' })}</p>
      <p>{api.date(new Date(), { dateStyle: 'medium' })}</p>
      <p>{api.relativeTime(-2, 'day')}</p>
      <p>{api.list(['Preact', 'Otok', 'Kamod'])}</p>
      {api.locales.map((locale) => (
        <button key={locale} disabled={locale === api.locale} onClick={() => void api.setLocale(locale)}>
          {locale === 'en' ? 'English' : locale === 'de' ? 'German' : 'French'}
        </button>
      ))}
    </main>
  )
}

render(
  <I18nProvider i18n={i18n}>
    <Demo />
  </I18nProvider>,
  document.getElementById('app')!,
)
