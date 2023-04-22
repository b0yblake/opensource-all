import { useState, useEffect, useCallback } from 'react'

const useWindowFocus = () => {
  const [hasFocus, setFocus] = useState(true)

  // make sure we have reference equality so we can unbind properly
  const handleVisibility = useCallback(() => setFocus(!document.hidden), [])
  const gotFocus = useCallback(() => setFocus(true), [])
  const lostFocus = useCallback(() => setFocus(false), [])

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibility)
    document.addEventListener('blur', lostFocus)
    window.addEventListener('blur', lostFocus)
    window.addEventListener('focus', gotFocus)
    document.addEventListener('focus', gotFocus)
    window.addEventListener('mouseenter', gotFocus)
    document.addEventListener('mouseenter', gotFocus)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      document.removeEventListener('blur', lostFocus)
      window.removeEventListener('blur', lostFocus)
      window.removeEventListener('focus', gotFocus)
      document.removeEventListener('focus', gotFocus)
      window.removeEventListener('mouseenter', gotFocus)
      document.removeEventListener('mouseenter', gotFocus)
    }
  }, [])

  return hasFocus
}

export default useWindowFocus
