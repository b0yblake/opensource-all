import { useLayoutEffect } from 'react'
import PropTypes from 'prop-types'

import useUIContext from 'context/ui'

const ATTRIBUTE = 'data-theme'

export const useThemeMode = mode => {
  const setPageTheme = useUIContext(s => s.setPageTheme)

  useLayoutEffect(() => {
    const original = document.documentElement.getAttribute(ATTRIBUTE)
    if (!mode) document.documentElement.removeAttribute(ATTRIBUTE)
    if (mode && original !== mode) document.documentElement.setAttribute(ATTRIBUTE, mode)
    setPageTheme(mode)
    return () => {
      if (!mode) return // fix for home->lab transition on 14islands.com (race-condition)
      if (!original) document.documentElement.removeAttribute(ATTRIBUTE)
      if (original) document.documentElement.setAttribute(ATTRIBUTE, original)
      setPageTheme(original)
    }
  }, [mode])
}

const ThemeMode = ({ mode }) => {
  useThemeMode(mode)
  return null
}

ThemeMode.propTypes = {
  mode: PropTypes.string,
}

export default ThemeMode
