import React, { useRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useViewportScroll } from 'framer-motion'
import { useWindowHeight } from '@react-hook/window-size'
import IdleTimer from 'react-idle-timer'
import classNames from 'classnames/bind'

import useUIContext from 'context/ui'

import { play, pause } from 'lib/videoControls'
import requestIdleCallback from 'lib/requestIdleCallback'

import { useThemeMode } from 'components/ui/layout/ThemeMode'
import Video from './Video'
import VideoControls from 'components/ui/video-controls'
import Cursor from 'components/ui/cursor'

import useScrollElementIntoView from './useScrollElementIntoView'

import * as s from './InlineHTML5Showreel.module.css'
const cn = classNames.bind(s)

const CloseIcon = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M24.2958 25.5739L12.3614 37.5083L14.4925 39.6394L26.4269 27.705L38.3612 39.6393L40.4923 37.5082L28.558 25.5739L40.0657 14.0662L37.9346 11.9351L26.4269 23.4428L14.9191 11.9349L12.788 14.066L24.2958 25.5739Z"
      fill="#fff"
    />
  </svg>
)

const PlayIcon = () => (
  <svg width="28" height="32" viewBox="0 0 28 32" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M27.1396 15.9999L0.367497 31.4568L0.367498 0.542968L27.1396 15.9999ZM3.3675 5.73912L3.3675 26.2606L21.1396 15.9999L3.3675 5.73912Z"
      fill="#fff"
    />
  </svg>
)

const InlineHTML5Showreel = ({ showreelLoop, showreelLoopMobile, showreelFull, showreelFullMobile }) => {
  const el = useRef()
  const loopRef = useRef()
  const fullRef = useRef()
  const [isIdle, setIsIdle] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isPlayingShowreel, playShowreel] = useState(false)
  const { scrollY } = useViewportScroll()
  const toggleNativeCursor = useUIContext(state => state.toggleNativeCursor)
  const windowHeight = useWindowHeight()

  useThemeMode(isPlayingShowreel ? 'dark' : '')

  const onIdle = () => setIsIdle(true)
  const onActive = () => setIsIdle(false)

  const onMouseEnter = () => {
    setIsHovering(true)
    requestIdleCallback(() => toggleNativeCursor(el))
  }
  const onMouseLeave = () => {
    setIsHovering(false)
    requestIdleCallback(() => toggleNativeCursor(false))
  }

  const cursorIcon = isPlayingShowreel ? <CloseIcon /> : <PlayIcon />

  // disable showreel on scroll
  const checkVisibility = y => {
    if (isPlayingShowreel) {
      if (y >= windowHeight * 0.5) {
        playShowreel(false)
        fullRef.current.pause()
      }
    } else {
      if (y >= windowHeight * 0.5) {
        !loopRef.current.paused && pause(loopRef)
      } else {
        loopRef.current.paused && play(loopRef)
      }
    }
  }
  useEffect(() => {
    return scrollY.onChange(checkVisibility)
  }, [isPlayingShowreel, windowHeight])

  useScrollElementIntoView({ el, scroll: isPlayingShowreel })

  const onFullVideoEnded = () => playShowreel(false)

  useEffect(() => {
    if (!fullRef.current) return
    fullRef.current.addEventListener('ended', onFullVideoEnded)
    fullRef.current.addEventListener('webkitendfullscreen', onFullVideoEnded)
    return () => {
      fullRef.current.removeEventListener('ended', onFullVideoEnded)
      fullRef.current.removeEventListener('webkitendfullscreen', onFullVideoEnded)
    }
  }, [fullRef.current])

  return (
    <div
      className={cn('heroDesktop')}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={() => {
        playShowreel(!isPlayingShowreel)
        // need to play/pause full video here since it's not muted
        if (!isPlayingShowreel) {
          play(fullRef)
          pause(loopRef)
        } else {
          pause(fullRef)
          play(loopRef)
        }
      }}
    >
      <IdleTimer element={el.current} onActive={onActive} onIdle={onIdle} debounce={250} timeout={1000 * 2} />
      <div className={cn('heroVideo')} ref={el}>
        <Video
          className={cn('video')}
          ref={fullRef}
          webm={showreelFull?.webm.url}
          mp4={showreelFull?.mp4?.url}
          webmMobile={showreelFullMobile?.webm.url}
          mp4Mobile={showreelFullMobile?.mp4?.url}
          autoplay={false}
          preload="metadata"
          muted={false}
          loop={false}
          playsinline={false}
        />
        <Video
          className={cn('video')}
          ref={loopRef}
          webm={showreelLoop?.webm?.url}
          mp4={showreelLoop?.mp4?.url}
          webmMobile={showreelLoopMobile?.webm?.url}
          mp4Mobile={showreelLoopMobile?.mp4?.url}
          invisible={isPlayingShowreel}
        />
      </div>
      <VideoControls videoRef={fullRef} isVisible={isPlayingShowreel && !isIdle && isHovering} id="html5-showreel" />
      <Cursor
        isDark
        parentRef={el}
        isEnabled={!isPlayingShowreel || !isIdle}
        icon={cursorIcon}
        backgroundColor={isPlayingShowreel ? '' : '#000'}
      />
    </div>
  )
}

InlineHTML5Showreel.propTypes = {
  showreelLoop: PropTypes.shape({ mp4: PropTypes.object, webm: PropTypes.object }),
  showreelLoopMobile: PropTypes.shape({ mp4: PropTypes.object, webm: PropTypes.object }),
  showreelFull: PropTypes.shape({ mp4: PropTypes.object, webm: PropTypes.object }),
  showreelFullMobile: PropTypes.shape({ mp4: PropTypes.object, webm: PropTypes.object }),
}

export default InlineHTML5Showreel
