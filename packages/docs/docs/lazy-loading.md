# Lazy Loading

Kamod i18n keeps internationalization small and native.

## Example

```ts
import { createI18n } from '@kamod/i18n'

const i18n = createI18n({ locale: 'en', fallbackLocale: 'en', messages })
i18n.t('common.save')
```

See the repository README for the complete API and the Preact Vite example for runnable usage.
