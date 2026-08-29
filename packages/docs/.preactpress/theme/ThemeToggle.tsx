import { ThemeToggle as BaseThemeToggle } from '@kamod-ch/preactpress/client'
import { useEffect, useState } from 'preact/hooks'

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <span class="kh-theme-toggle" aria-hidden="true">Theme</span>
  }

  return <BaseThemeToggle className="kh-theme-toggle" ariaLabel="Toggle color theme" />
}
