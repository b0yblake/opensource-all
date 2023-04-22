import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useWindowSize } from '@react-hook/window-size'

import classNames from 'classnames/bind'
import * as s from './IntroText.module.css'

const cn = classNames.bind(s)

/*
 * @param {number} activeIndex - active index of the slideshow
 * @param {boolean} isInitialized - if component has come into view for the first time
 * @param {array} refElsCoords - array of objects with ref elements coordinates
 * @param {array} deviceProperties - array of objects with device properties
 * @param {number} vw - base vw value
 * @param {boolean} isMobile - render based on screen size
 */
const Devices = ({ activeIndex, isInitialized, refElsCoords, deviceProperties, vw, isMobile }) => {
  const [viewportWidth] = useWindowSize()
  const { w, c } = deviceProperties[activeIndex]
  const x = refElsCoords[activeIndex] ? (isInitialized ? refElsCoords[activeIndex].x : viewportWidth * 0.1) : 0
  const y = refElsCoords[activeIndex] ? refElsCoords[activeIndex].y : 0

  if (isMobile) return null
  return (
    <div
      className={cn('devices', deviceProperties[activeIndex].deviceClass)}
      style={{
        height: `${(w / c / vw) * 100}vw`,
        width: `${(w / vw) * 100}vw`,
        transform: `translate3d(${x}px, ${y}px, 0) translateX(.5vw)`,
      }}
    >
      <div>
        <div className={cn('frame')}></div>
        <div className={cn('phone')}>
          <svg
            className={cn('phoneLine')}
            xmlns="http://www.w3.org/2000/svg"
            width="56"
            height="87"
            viewBox="0 0 56 87"
            fill="none"
          >
            <path className={cn('')} d="M34.1176 76H21.8824" stroke="#171719" strokeWidth="2" />
          </svg>
        </div>
        <div className={cn('tablet')}>
          <svg
            className={cn('tabletLine')}
            xmlns="http://www.w3.org/2000/svg"
            width="108"
            height="81"
            viewBox="0 0 108 81"
            fill="none"
          >
            <path className={cn('')} d="M95.5 32.5V48.5" stroke="#171719" strokeWidth="2" />
          </svg>
        </div>
        <div className={cn('desktop')}>
          <svg
            className={cn('desktopLine', 'line1')}
            xmlns="http://www.w3.org/2000/svg"
            width="104"
            height="81"
            viewBox="0 0 104 81"
            fill="none"
          >
            <path className={cn()} d="M51.5 67V78" stroke="#171719" strokeWidth="4" strokeLinecap="square" />
          </svg>
          <svg
            className={cn('desktopLine', 'line2')}
            xmlns="http://www.w3.org/2000/svg"
            width="104"
            height="81"
            viewBox="0 0 104 81"
            fill="none"
          >
            <path className={cn()} d="M38 79H66" stroke="#171719" strokeWidth="4" strokeLinecap="square" />
          </svg>
        </div>
      </div>
    </div>
  )
}

Devices.propTypes = {
  activeIndex: PropTypes.number,
  isInitialized: PropTypes.bool,
  refElsCoords: PropTypes.array,
  deviceProperties: PropTypes.array,
  vw: PropTypes.number,
  isMobile: PropTypes.bool,
}

export default memo(Devices)
