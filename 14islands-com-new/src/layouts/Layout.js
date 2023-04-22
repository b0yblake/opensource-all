import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import classNames from 'classnames/bind'
import { TransitionState } from 'gatsby-plugin-transition-link'

import useUIContext from 'context/ui'

// Import global styles
import 'wipe.css'
import 'styles/main.css'

import { HijackedScrollbar, useScrollRig } from '@14islands/r3f-scroll-rig'
import Footer from 'components/ui/footer'
import GridOverlay from 'components/ui/grid-overlay'
import LabCTA from './LabCTA'
import * as s from './Layout.module.css'

const cn = classNames.bind(s)

const Layout = ({
  children,
  className,
  fadeIn = true,
  fadeOut = false,
  footer = <Footer />,
  labCTA = true,
  labThreshold = 0.4,
  background = false,
  theme = '',
  isLabPage = false,
  ...props
}) => {
  const { reflow } = useScrollRig()
  const isScrollRigEnabled = useUIContext(s => s.isScrollRigEnabled)
  const startPageTransition = useUIContext(state => state.startPageTransition)
  const toggleNativeCursor = useUIContext(state => state.toggleNativeCursor)
  const setMobileMenuOpen = useUIContext(s => s.setMobileMenuOpen)
  const isPageTransitionActive = useUIContext(state => state.isPageTransitionActive)

  const isMounted = useRef(false)

  const resetHtmlTheme = () => {
    // make sure to clear any styles from current page when unmountings
    document.documentElement.setAttribute('data-theme', '')
  }

  useEffect(() => {
    if (isMounted.current && isPageTransitionActive) {
      resetHtmlTheme()
    }
  }, [isPageTransitionActive])

  useEffect(() => {
    isMounted.current = true
    // apply bg color transition after first render
    background && (document.documentElement.style.backgroundColor = background)
    setTimeout(() => {
      document.documentElement.style.transition = '0.5s background'
    }, 0)
    return () => {
      document.documentElement.style.transition = ''
      document.documentElement.style.backgroundColor = ''
      document.documentElement.classList.remove('isFirstPageLoad')
      resetHtmlTheme()
    }
  }, [])

  useEffect(() => {
    setTimeout(() => {
      startPageTransition(false)
      toggleNativeCursor(false)
      setMobileMenuOpen(false)
    }, 0)

    let fallbackTimer
    if ('fonts' in document) {
      document.fonts.onloadingdone = reflow
    } else {
      fallbackTimer = setTimeout(reflow, 1000)
    }
    return () => {
      if ('fonts' in document) {
        document.fonts.onloadingdone = null
      } else {
        clearTimeout(fallbackTimer)
      }
    }
  }, [])

  return (
    <>
      {/* Make sure we have bg from server too - !important to override default theme */}
      <Helmet>
        <html data-theme={theme} />
        <meta name="theme-color" content={background || '#fff'} />
        <style>{`
          html {
            --project-bg-color: ${background};
            background: ${background};
          }
        `}</style>
      </Helmet>
      <div className={cn('layout')} {...props}>
        <TransitionState>
          {({ transitionStatus }) => (
            <HijackedScrollbar lerp={0.14} disabled={!isScrollRigEnabled && !isLabPage} subpixelScrolling={isLabPage}>
              {bind => (
                <main {...bind} className={cn('content', className, { fadeIn, fadeOut, [transitionStatus]: true })}>
                  {children}
                  {footer}
                </main>
              )}
            </HijackedScrollbar>
          )}
        </TransitionState>
        {isScrollRigEnabled && <LabCTA hasTab={labCTA} threshold={labThreshold} />}
        <GridOverlay />
      </div>
    </>
  )
}

Layout.propTypes = {
  forceSmoothScroll: PropTypes.bool,
  fadeIn: PropTypes.bool,
  fadeOut: PropTypes.bool,
  footer: PropTypes.node,
  background: PropTypes.string,
  labCTA: PropTypes.bool,
  isLabPage: PropTypes.bool,
  labThreshold: PropTypes.number,
  theme: PropTypes.string, // Page theme to apply (SSR support)
}

export default Layout
