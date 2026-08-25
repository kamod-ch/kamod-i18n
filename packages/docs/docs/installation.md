# Installation

Install the core package:

```bash
pnpm add @kamod/i18n
```

For Preact integration, install Preact as well:

```bash
pnpm add preact
```

## Requirements

- ESM-compatible tooling
- TypeScript 5 or newer is recommended
- A runtime with the required `Intl` APIs

The core entry point has no runtime dependencies:

```ts
import { createI18n } from '@kamod/i18n'
```

Preact helpers use a separate entry point:

```ts
import { I18nProvider, useI18n } from '@kamod/i18n/preact'
```
