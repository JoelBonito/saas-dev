import { useEffect, useState } from 'react'

export function useThemeDetector() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') {
      return 'light'
    }
    return document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light'
  })

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class'
        ) {
          const isDark = (mutation.target as HTMLElement).classList.contains(
            'dark',
          )
          setTheme(isDark ? 'dark' : 'light')
        }
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
    })

    return () => observer.disconnect()
  }, [])

  return theme
}
