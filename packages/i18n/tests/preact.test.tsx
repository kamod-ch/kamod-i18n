import { fireEvent, render, screen, waitFor } from '@testing-library/preact'
import { describe, expect, it } from 'vitest'
import { createI18n } from '../src'
import { I18nProvider, useI18n, useLocale } from '../src/preact'

const en = { title: 'Hello {name}' } as const
const de = { title: 'Hallo {name}' } as const

function Title() {
  const { t } = useI18n<typeof en, 'en' | 'de'>()
  const { locale, setLocale } = useLocale<'en' | 'de'>()
  return (
    <div>
      <p>{t('title', { name: locale })}</p>
      <button onClick={() => void setLocale(locale === 'en' ? 'de' : 'en')}>switch</button>
    </div>
  )
}

describe('Preact integration', () => {
  it('renders translations and rerenders on locale switch', async () => {
    const i18n = createI18n({ locale: 'en', fallbackLocale: 'en', messages: { en, de } })
    render(
      <I18nProvider i18n={i18n}>
        <Title />
      </I18nProvider>,
    )

    expect(screen.getByText('Hello en')).toBeTruthy()
    fireEvent.click(screen.getByText('switch'))
    await waitFor(() => expect(screen.getByText('Hallo de')).toBeTruthy())
  })

  it('supports nested providers', async () => {
    const outer = createI18n({ locale: 'en', fallbackLocale: 'en', messages: { en, de } })
    const inner = createI18n({ locale: 'de', fallbackLocale: 'en', messages: { en, de } })
    render(
      <I18nProvider i18n={outer}>
        <I18nProvider i18n={inner}>
          <Title />
        </I18nProvider>
      </I18nProvider>,
    )

    expect(screen.getByText('Hallo de')).toBeTruthy()
  })
})
