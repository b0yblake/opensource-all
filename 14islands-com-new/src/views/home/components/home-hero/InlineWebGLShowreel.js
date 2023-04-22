import React, { useCallback, useRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useViewportScroll } from 'framer-motion'
import { useWindowHeight } from '@react-hook/window-size'
import IdleTimer from 'react-idle-timer'
import classNames from 'classnames/bind'
import Portal from 'components/ui/portal'

import useUIContext from 'context/ui'

import { play, pause } from 'lib/videoControls'
import requestIdleCallback from 'lib/requestIdleCallback'

import { useCanvas, ScrollScene, ScrollDomPortal } from '@14islands/r3f-scroll-rig'
import { useThemeMode } from 'components/ui/layout/ThemeMode'
import Video from './Video'
import VideoControls from 'components/ui/video-controls'
import Cursor from 'components/ui/cursor'

import VideoPlayerBlobMesh from './video-player-blob-mesh'
import useScrollElementIntoView from './useScrollElementIntoView'

import * as s from './InlineWebGLShowreel.module.css'
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

const InlineWebGLShowreel = ({ showreelLoop, showreelFull }) => {
  const el = useRef()
  const loopRef = useRef()
  const fullRef = useRef()
  const [isIdle, setIsIdle] = useState(false)
  const [isLoopLoaded, setLoopLoaded] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isPlayingShowreel, playShowreel] = useState(false)
  const toggleNativeCursor = useUIContext(state => state.toggleNativeCursor)
  const { scrollY } = useViewportScroll()
  const windowHeight = useWindowHeight()

  useThemeMode(isPlayingShowreel ? 'dark' : '')

  const onIdle = useCallback(() => setIsIdle(true), [])
  const onActive = useCallback(() => setIsIdle(false), [])

  const onMouseEnter = event => {
    setIsHovering(true)
    event.persist()
    requestIdleCallback(() => toggleNativeCursor({ el, event }))
  }
  const onMouseLeave = () => {
    setIsHovering(false)
    requestIdleCallback(() => toggleNativeCursor(false))
  }

  const cursorIcon = isPlayingShowreel ? <CloseIcon /> : <PlayIcon />

  // tell GlobalCanvas to render our WebGL scene
  const updateVideoMesh = useCanvas(
    <ScrollScene el={el} margin={50} inViewportMargin={0}>
      {props => (
        <VideoPlayerBlobMesh
          video={loopRef}
          fullVideo={fullRef}
          isPlayingShowreel={isPlayingShowreel}
          onLoadTransitionDone={() => {
            setLoopLoaded(true)
          }}
          {...props}
        />
      )}
    </ScrollScene>,
  )

  // update prop when transition status changes
  useEffect(() => {
    updateVideoMesh({ isPlayingShowreel })
  }, [isPlayingShowreel])

  useScrollElementIntoView({ el, scroll: isPlayingShowreel })

  // disable showreel on scroll
  const checkVisibility = y => {
    if (isPlayingShowreel) {
      if (y >= windowHeight * 0.8) {
        playShowreel(false)
        fullRef.current.pause()
      }
    } else {
      if (y >= windowHeight * 0.8) {
        !loopRef.current.paused && pause(loopRef)
      } else {
        loopRef.current.paused && play(loopRef)
      }
    }
  }
  useEffect(() => {
    return scrollY.onChange(checkVisibility)
  }, [isPlayingShowreel, windowHeight])

  const onFullVideoEnded = useCallback(() => playShowreel(false), [])

  useEffect(() => {
    if (!fullRef.current) return
    fullRef.current.addEventListener('ended', onFullVideoEnded)
    return () => {
      fullRef.current.removeEventListener('ended', onFullVideoEnded)
    }
  }, [fullRef.current])

  return (
    <div
      className={cn('heroDesktop')}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={() => {
        if (!isLoopLoaded) return
        playShowreel(!isPlayingShowreel)
        // need to play/pause full video here since it's not muted
        if (!isPlayingShowreel) play(fullRef)
        if (isPlayingShowreel) pause(fullRef)
      }}
    >
      <IdleTimer element={el.current} onActive={onActive} onIdle={onIdle} debounce={250} timeout={1000 * 2} />
      <div className={cn('heroVideo')} ref={el}>
        <Video ref={loopRef} webm={showreelLoop?.webm?.url} mp4={showreelLoop?.mp4?.url} invisible autoplay={true} />
        <Video
          ref={fullRef}
          webm={showreelFull?.webm.url}
          mp4={showreelFull?.mp4?.url}
          invisible
          autoplay={false}
          preload="metadata"
          muted={false}
          loop={false}
        />
      </div>
      <Portal>
        <ScrollDomPortal el={el} zIndex={1}>
          <VideoControls
            videoRef={fullRef}
            isVisible={isPlayingShowreel && !isIdle && isHovering}
            id="webgl-showreel"
          />
        </ScrollDomPortal>
      </Portal>
      <Cursor isDark parentRef={el} isEnabled={isLoopLoaded && (!isPlayingShowreel || !isIdle)} icon={cursorIcon} />
    </div>
  )
}

InlineWebGLShowreel.propTypes = {
  showreelLoop: PropTypes.shape({ mp4: PropTypes.object, webm: PropTypes.object }),
  showreelFull: PropTypes.shape({ mp4: PropTypes.object, webm: PropTypes.object }),
}

export default InlineWebGLShowreel
