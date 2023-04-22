import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useWindowSize } from '@react-hook/window-size'
import { useInterval } from 'react-use'
import useWindowFocus from 'hooks/useWindowFocus'
import PropTypes from 'prop-types'

import { Section } from 'components/ui/layout'
import ViewportEnter from 'components/motion/viewport-enter'
import Item from './Item'
import Devices from './Devices'
import Placeholder from './Placeholder'

import envVars from 'styles/config/env-vars.json'
import classNames from 'classnames/bind'
import * as s from './IntroText.module.css'

const cn = classNames.bind(s)

// deviceProperties width, aspect ratio and css class
// widths are set at 1024 base width (desktop breakpoint)
const deviceProperties = [
  { w: 31, c: 0.64, deviceClass: 'isPhone' },
  { w: 70, c: 1.33, deviceClass: 'isTablet' },
  { w: 70, c: 1.28, deviceClass: 'isDesktop' },
]

const breakpoint = parseInt(envVars['environment-variables']['--desktop-breakpoint'])
const baseVW = parseInt(envVars['environment-variables']['--typo-1024'])
const interval = 3500

// Intro Text Main Component - Items holder
const IntroText = ({ items, title }) => {
  const [viewportWidth] = useWindowSize()
  const hasFocus = useWindowFocus()
  const [isMobile, checkIfMobile] = useState(true)

  const range = n => [...Array(n).keys()]
  const refEls = range(deviceProperties.length).map(() => useRef())
  const [refElsCoords, setRefElCoords] = useState([])

  const [isVisible, setVisiblity] = useState(false)
  const [isInitialized, initialize] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  // get index of the longest sentence
  const placeholderIndex = useMemo(() => {
    let index = 0
    let longestString = Object.values(items[index]).reduce((t, n) => t + n).length

    items.forEach((item, i) => {
      if (Object.values(item).reduce((t, n) => t + n).length > longestString) {
        longestString = Object.values(item).reduce((t, n) => t + n).length > longestString
        index = i
      }
    })

    return index
  }, [items])

  // get new array of coordinates
  const updateCoordinates = () => {
    const refElsCoords = refEls.map((el, index) => {
      return {
        x: el.current.offsetLeft + el.current.clientWidth,
        y: el.current.offsetTop,
      }
    })

    setRefElCoords(refElsCoords)
  }

  // update loop index
  const updateIndex = () => {
    const i = (activeIndex + 1) % items.length
    setActiveIndex(i)
  }

  // set autoplay interval when windo in focus
  useInterval(updateIndex, hasFocus && isVisible && isInitialized ? interval : null)

  // main mount/resize handler
  useEffect(() => {
    checkIfMobile(viewportWidth < breakpoint)
    setTimeout(() => {
      updateCoordinates()
    })
  }, [viewportWidth, isInitialized])

  return (
    <Section className={cn('wrapper', 'spacing', { initialized: isInitialized })}>
      <div className={cn('title')}>{title}</div>
      <ViewportEnter
        onEnter={() => {
          setVisiblity(true)
          isInitialized && updateIndex()
          !isInitialized && initialize(true)
        }}
        onExit={() => {
          setVisiblity(false)
        }}
        once={false}
      >
        <div className={cn('items')}>
          {items.map((item, index) => (
            <Item
              pre={item.pre_device_text}
              post={item.post_device_text}
              key={item.post_device_text}
              ref={refEls[index]}
              activeIndex={activeIndex}
              isActive={activeIndex === index}
              isMobile={isMobile}
              vw={baseVW}
              size={deviceProperties[index]}
            />
          ))}
          <Devices
            activeIndex={activeIndex}
            isInitialized={isInitialized}
            refElsCoords={refElsCoords}
            deviceProperties={deviceProperties}
            isMobile={isMobile}
            vw={baseVW}
          />
          <Placeholder pre={items[placeholderIndex].pre_device_text} post={items[placeholderIndex].post_device_text} />
        </div>
      </ViewportEnter>
    </Section>
  )
}

IntroText.propTypes = {
  items: PropTypes.array,
  title: PropTypes.string,
}

export default IntroText
