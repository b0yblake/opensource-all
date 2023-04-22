import { useEffect } from 'react'

const useScrollElementIntoView = ({ el, scroll }) => {
  // scroll video into view
  useEffect(() => {
    if (scroll) {
      const rect = el.current.getBoundingClientRect()
      const targetY = window.pageYOffset + rect.top + rect.height * 0.5 - window.innerHeight * 0.5

      // 16:10 is the ideal ratio to fit both logo + video (default laptop aspect)
      const wrongAspect = 16 / 10 < window.innerWidth / window.innerHeight

      // If scrolled past video in the center...
      if (window.pageYOffset > targetY) {
        // scroll back to top
        window.scroll(0, 0)

        // If screen can't fit logo + video - scroll to center video vertically
        if (wrongAspect) {
          // Scrolling back down will hide the headroom header
          // Our VirtualScrollbar will lerp directly to `targetY`
          setTimeout(() => {
            window.scroll(0, targetY)
          }, 0)
        }
      }
    }
  }, [scroll])
}

export default useScrollElementIntoView
