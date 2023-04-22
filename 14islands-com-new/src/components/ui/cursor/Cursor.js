import React, { useEffect, useLayoutEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'
// import { motion, useSpring } from 'framer-motion'
import { motion } from 'framer-motion'

import { useSpring, animated } from 'react-spring'

import useUIContext from 'context/ui'

import { cursorApi, usePixelCursorRef } from 'components/ui/cursor-tracker'

import Portal from 'components/ui/portal'

import * as s from './Cursor.module.css'
const cn = classNames.bind(s)

const Cursor = ({ parentRef, text, icon, isDark, offsetY, offsetX, isEnabled, backgroundColor, ...rest }) => {
  const [isMouseOver, setIsMouseOver] = useState(false)
  const isPointerPrimaryInput = useUIContext(s => s.isPointerPrimaryInput)
  const isPageTransitionActive = useUIContext(state => state.isPageTransitionActive)
  const cursor = usePixelCursorRef()
  const didMove = useRef(false)

  function getCursorStyle({ immediate } = {}) {
    // first move event should also be immediate
    immediate = immediate === true || !didMove.current
    return {
      immediate,
      transform: `translate(${cursor.x + offsetX}px, ${cursor.y + offsetY}px`,
      config: {
        tension: 1800,
        friction: 100,
      },
    }
  }

  const [props, api] = useSpring(() => getCursorStyle(true))

  // assume mouse is over if no parentRef is passed (so it can be remotely controlled)
  const isVisible = !isPageTransitionActive && isPointerPrimaryInput && isEnabled && (parentRef ? isMouseOver : true)

  useLayoutEffect(() => {
    if (!parentRef?.current) return
    parentRef.current.addEventListener('mouseenter', onMouseEnter)
    return () => {
      if (!parentRef?.current) return
      parentRef.current.removeEventListener('mouseenter', onMouseEnter)
    }
  }, [])

  useEffect(() => {
    if (parentRef && parentRef.current) {
      parentRef.current.style.cursor = isVisible ? 'none' : ''
    }
  }, [isVisible])

  const onMouseEnter = e => {
    if (isMouseOver || !parentRef?.current) return
    parentRef.current.addEventListener('mouseleave', onMouseLeave)
    setIsMouseOver(true)

    // slight delay to allow mouse coords to be populated
    setTimeout(() => {
      // avoid ghost animation by moving immediate
      api.start(getCursorStyle({ immediate: true }))
    }, 0)
  }

  const onMouseLeave = () => {
    if (!parentRef?.current) return
    setIsMouseOver(false)
    parentRef.current.removeEventListener('mouseleave', onMouseLeave)
  }

  useLayoutEffect(() => {
    if (!isVisible) {
      didMove.current = false
      return
    }
    api.start(getCursorStyle())
    return cursorApi.subscribe(() => {
      api.start(getCursorStyle())
      didMove.current = true
    })
  }, [isVisible])

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.05,
      },
    },
  }
  const svgVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.15,
      },
    },
    visible: {
      opacity: 1,
      scale: 1.01,
      transition: {
        opacity: {
          duration: 0.2,
          delay: 0.2,
        },
        scale: {
          delay: 0.2,
          duration: 0.5,
          ease: 'backOut',
        },
      },
    },
  }

  const letterVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.2,
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 4,
        stiffness: 50,
      },
    },
  }

  return (
    <Portal root="2">
      <animated.div
        className={cn('cursor', { isDark, showBackground: isVisible && backgroundColor })}
        style={{ ...props, '--backgroundColor': backgroundColor }}
        {...rest}
      >
        <motion.div
          className={cn('inner')}
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
        >
          {text &&
            text.split('').map((char, index) => {
              return (
                <motion.span className={cn('char')} variants={letterVariants} aria-hidden="true" key={index}>
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              )
            })}
          <motion.div initial="hidden" variants={svgVariants} animate={isVisible ? 'visible' : 'hidden'}>
            {icon}
          </motion.div>
        </motion.div>
      </animated.div>
    </Portal>
  )
}

Cursor.propTypes = {
  parentRef: PropTypes.object,
  isDark: PropTypes.bool,
  isEnabled: PropTypes.bool,
  text: PropTypes.string,
  icon: PropTypes.element,
  offsetY: PropTypes.number,
  offsetX: PropTypes.number,
  backgroundColor: PropTypes.string,
}

Cursor.defaultProps = {
  offsetY: 0,
  offsetX: 0,
  isDark: false,
  isEnabled: true,
}

export default Cursor
