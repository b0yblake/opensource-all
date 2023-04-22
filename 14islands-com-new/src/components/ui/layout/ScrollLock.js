import React, { useLayoutEffect } from 'react'
import Style from 'components/ui/style'

export const useScrollLock = (condition = false) => {
  useLayoutEffect(() => {
    if (condition) {
      // const original = window.getComputedStyle(document.documentElement).overflow
      document.documentElement.style.overflow = 'hidden'
      return () => (document.documentElement.style.overflow = '')
    }
  }, [condition])
}

const css = 'html { overflow: hidden !important }'

export const ScrollLock = () => <Style css={css} />

export default ScrollLock
