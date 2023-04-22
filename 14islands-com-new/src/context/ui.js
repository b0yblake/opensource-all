/* eslint-disable react/no-unused-state */
import { useLayoutEffect } from 'react'
import { useWindowWidth } from '@react-hook/window-size'
import shallow from 'zustand/shallow'
import create from 'zustand'

import envVars from 'styles/config/env-vars.json'

import { useScrollRig } from '@14islands/r3f-scroll-rig'

const desktopGridBreakpoint = envVars['environment-variables']['--desktop-breakpoint']

const useUIContext = create(set => ({
  isMobile: true,
  setIsMobile: isMobile => set(state => ({ isMobile })),

  isScrollRigEnabled: false,
  setScrollRigEnabled: isScrollRigEnabled => set(state => ({ isScrollRigEnabled })),

  isPointerPrimaryInput: false,
  setIsPointerPrimaryInput: isPointerPrimaryInput => set(state => ({ isPointerPrimaryInput })),

  hideHeader: false,
  setHideHeader: hideHeader => set(state => ({ hideHeader })),

  isMobileMenuOpen: false,
  setMobileMenuOpen: isMobileMenuOpen => set(state => ({ isMobileMenuOpen })),

  headerTheme: null,
  setHeaderTheme: headerTheme => set(state => ({ headerTheme })),

  checkIsMobile: () => {
    if (typeof window === 'undefined') return true
    return !window.matchMedia(`(min-width: ${desktopGridBreakpoint})`).matches
  },

  checkIsPointerPrimaryInput: () => {
    if (typeof window === 'undefined') return true
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches
  },

  getBrowserType: () => {
    const browser = (function(agent) {
      switch (true) {
        case agent.indexOf('edge') > -1:
          return 'MS Edge'
        case agent.indexOf('edg') > -1:
          return 'MS Edge Chromium'
        case agent.indexOf('opr') > -1 && !!window.opr:
          return 'opera'
        case agent.indexOf('chrome') > -1 && !!window.chrome:
          return 'chrome'
        case agent.indexOf('trident') > -1:
          return 'Internet Explorer'
        case agent.indexOf('firefox') > -1:
          return 'firefox'
        case agent.indexOf('safari') > -1:
          return 'safari'
        default:
          return 'other'
      }
    })(window.navigator.userAgent.toLowerCase())
    return browser
  },

  theme: () => {
    if (typeof document === 'undefined') return null
    return document.documentElement.getAttribute('data-theme')
  },
  pageTheme: '',
  setPageTheme: pageTheme => set(state => ({ pageTheme })),

  hoveredLink: null,
  setHoveredLink: hoveredLink => set(state => ({ hoveredLink })),

  isOverDrawingArea: false,
  setIsOverDrawingArea: isOverDrawingArea => set(state => ({ isOverDrawingArea })),

  isNativeCursorHidden: false,
  toggleNativeCursor: isNativeCursorHidden => set(state => ({ isNativeCursorHidden })),

  cursorStyle: false,
  setCursorStyle: cursorStyle => set(state => ({ cursorStyle })),

  openLabProject: null,
  setOpenLabProject: openLabProject => {
    set(state => ({ openLabProject }))
  },

  isPageTransitionActive: false,
  startPageTransition: isPageTransitionActive =>
    set(state => {
      if (!state.isPageTransitionDisabled) return { isPageTransitionActive }
    }),
  isPageTransitionDisabled: false,
  disablePageTransitions: isPageTransitionDisabled => set(state => ({ isPageTransitionDisabled })),

  // shared assets
  assets: {},
  setAsset: (id, value) =>
    set(({ assets }) => {
      return {
        assets: {
          ...assets,
          [id]: value,
        },
      }
    }),

  showBubbles: 0,
  setShowBubbles: showBubbles => set(state => ({ showBubbles })),
  showBackgroundBubbles: false,
  setShowBackgroundBubbles: showBackgroundBubbles => set(state => ({ showBackgroundBubbles })),

  isLabCTAVisible: false,
  setShowLabCTA: isLabCTAVisible => set(state => ({ isLabCTAVisible })),
  isLabCTAPaused: false,
  setLabCTAPaused: isLabCTAPaused => set(state => ({ isLabCTAPaused })),
  isLabTransitionRunning: false,
  setisLabTransitionRunning: isLabTransitionRunning => set(state => ({ isLabTransitionRunning })),
  isLabHoverVisible: false,
  setShowLabHover: isLabHoverVisible => set(state => ({ isLabHoverVisible })),
}))

export default useUIContext

export const UISideEffects = () => {
  const [setIsMobile, checkIsMobile] = useUIContext(s => [s.setIsMobile, s.checkIsMobile], shallow)
  const setScrollRigEnabled = useUIContext(s => s.setScrollRigEnabled)
  const setIsPointerPrimaryInput = useUIContext(s => s.setIsPointerPrimaryInput)
  const checkIsPointerPrimaryInput = useUIContext(s => s.checkIsPointerPrimaryInput)
  const isPointerPrimaryInput = useUIContext(state => state.isPointerPrimaryInput)
  const isMobile = useUIContext(state => state.isMobile)

  const { isCanvasAvailable } = useScrollRig()

  const viewportWidth = useWindowWidth()

  useLayoutEffect(() => {
    setIsMobile(checkIsMobile())
    setIsPointerPrimaryInput(checkIsPointerPrimaryInput())
    setScrollRigEnabled(!isMobile && isPointerPrimaryInput && isCanvasAvailable)
  }, [viewportWidth, isMobile, isCanvasAvailable, isPointerPrimaryInput])
  return null
}
