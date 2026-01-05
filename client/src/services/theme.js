const THEME_KEY = 'bot_analyzer_theme'

export const getTheme = () => {
  return localStorage.getItem(THEME_KEY) || 'dark'
}

export const setTheme = (theme) => {
  localStorage.setItem(THEME_KEY, theme)
  document.documentElement.setAttribute('data-theme', theme)
}

export const toggleTheme = () => {
  const current = getTheme()
  const newTheme = current === 'dark' ? 'light' : 'dark'
  setTheme(newTheme)
  return newTheme
}

export const initTheme = () => {
  const theme = getTheme()
  document.documentElement.setAttribute('data-theme', theme)
}