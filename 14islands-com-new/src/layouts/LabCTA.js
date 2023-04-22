import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'
import TransitionLink from 'gatsby-plugin-transition-link'
import { useViewportScroll } from 'framer-motion'

import useUIContext from 'context/ui'
import shouldNavigate from 'lib/shouldNavigate'

import Portal from 'components/ui/portal'
import { useScrollRig } from '@14islands/r3f-scroll-rig'

import * as s from './LabCTA.module.css'
const cn = classNames.bind(s)

const _window = typeof window !== 'undefined' ? window : {}

const LabCTA = ({ hasTab = true, threshold }) => {
  const { scrollYProgress } = useViewportScroll()
  const { isCanvasAvailable } = useScrollRig()

  const isLab = _window?.location?.pathname.split('/').includes('lab')
  const setHideHeader = useUIContext(s => s.setHideHeader)
  const isLabCTAVisible = useUIContext(state => state.isLabCTAVisible)
  const setShowLabCTA = useUIContext(state => state.setShowLabCTA)
  const isLabCTAPaused = useUIContext(state => state.isLabCTAPaused)
  const setShowLabHover = useUIContext(state => state.setShowLabHover)
  const isLabHoverVisible = useUIContext(state => state.isLabHoverVisible)
  const isLabTransitionRunning = useUIContext(state => state.isLabTransitionRunning)
  const isPageTransitionActive = useUIContext(state => state.isPageTransitionActive)
  const setisLabTransitionRunning = useUIContext(state => state.setisLabTransitionRunning)

  const [isScrolledToBottom, setScrolledToBottom] = useState(false)
  const [isShowingHint, setShowHint] = useState(false)

  const el = useRef()

  // hide hint on mount
  useEffect(() => {
    setShowHint(false)
    return () => setShowHint(false)
  }, [])

  const checkVisibility = y => {
    if (isLabCTAPaused) return setShowLabCTA(false)

    // Always how CTA at bottom
    if (y >= 0.99) {
      !isScrolledToBottom && setScrolledToBottom(true)
      !isLabCTAVisible && setShowLabCTA(true)
      return
    }

    // Reset when leaving bottom
    if (isScrolledToBottom) {
      setScrolledToBottom(false)
      setShowLabCTA(hasTab && true)
    }

    // Check threshold for pages that has the CTA Tab
    if (y > threshold) {
      !isLabCTAVisible && setShowLabCTA(hasTab && true)
    } else {
      isLabCTAVisible && setShowLabCTA(false)
    }
  }

  useEffect(() => {
    return scrollYProgress.onChange(checkVisibility)
  }, [isLabCTAVisible, isScrolledToBottom, hasTab, isLabCTAPaused])

  // Always hide CTA on mount (top of page)
  useEffect(() => {
    setShowLabCTA(false)
  }, [])

  // update local state to update CSS
  useEffect(() => {
    setShowHint(isScrolledToBottom || isLabHoverVisible)
  }, [isScrolledToBottom, isLabHoverVisible])

  // disable hint when transitions run
  useEffect(() => {
    setShowLabHover()
  }, [isPageTransitionActive, isLabTransitionRunning])

  return (
    <Portal root="3">
      <aside
        ref={el}
        onMouseEnter={() => setShowLabHover(true)}
        onMouseLeave={() => setShowLabHover(false)}
        data-visible={isLabCTAVisible}
        className={cn('LabCTA', { isShowingHint, isLabTransitionRunning })}
      >
        <span className={cn('hidden')}>{isLab ? 'View' : 'Dive into'}&nbsp;</span>
        <TransitionLink
          onClick={e => {
            if (!shouldNavigate(e)) return
            setisLabTransitionRunning(true)
          }}
          to={isLab ? '/' : '/lab/'}
          exit={{
            delay: isCanvasAvailable ? 0.8 : 0,
            trigger: () => {
              setHideHeader(true)
            },
          }}
          entry={{
            delay: 0.1, // delay before mounting new page
            trigger: () => {
              window.scrollTo(0, 0)
              setHideHeader(false)
              setisLabTransitionRunning(false)
            },
          }}
          className={cn('wrapper')}
          onMouseEnter={() => {
            setHideHeader(true)
          }}
          onMouseLeave={() => {
            setHideHeader(false)
          }}
        >
          <span className={cn('hidden')}>our</span> {isLab ? 'Work' : 'Lab'}
        </TransitionLink>
      </aside>
    </Portal>
  )
}

LabCTA.propTypes = {
  hasTab: PropTypes.bool, // show Tab hint in the corner while scrolling
  threshold: PropTypes.number, // percentage of page height when to show tab hint
}

export default LabCTA
