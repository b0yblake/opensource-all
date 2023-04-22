import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'

import { play, pause } from 'lib/videoControls'

import Video from './Video'
import Portal from 'components/ui/portal'

import * as s from './MobileShowreelLauncher.module.css'
const cn = classNames.bind(s)

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

/**
 * Play button which launches <video> showreel in a fixed overlay. Tried to launch overlay into fullscreen mode by default (if supported).
 */
const MobileShowreelLauncher = ({ showreelFullMobile }) => {
  const fullRef = useRef()
  const [isPlaying, setIsPlaying] = useState(false)

  // close overlay/fullscreen played to end
  const onFullVideoEnded = () => {
    setIsPlaying(false)
  }

  const onFullscreenEnded = ev => {
    // check if fullscreen was cancelled while playing
    if (isPlaying && !document.fullscreenElement) {
      setIsPlaying(false)
      pause(fullRef)
    }
  }

  // bind events
  useEffect(() => {
    if (!fullRef.current) return
    fullRef.current.addEventListener('ended', onFullVideoEnded)
    fullRef.current.addEventListener('webkitendfullscreen', onFullVideoEnded)
    document.addEventListener('fullscreenchange', onFullscreenEnded)
    return () => {
      fullRef.current.removeEventListener('ended', onFullVideoEnded)
      fullRef.current.removeEventListener('webkitendfullscreen', onFullVideoEnded)
      document.removeEventListener('fullscreenchange', onFullscreenEnded)
    }
  }, [fullRef.current, isPlaying])

  // try to launcn Fullscreen if supported
  useEffect(() => {
    if (isPlaying && !document.fullscreenElement) {
      fullRef.current.requestFullscreen && fullRef.current.requestFullscreen()
    } else if (!isPlaying && document.fullscreenElement) {
      document.exitFullscreen && document.exitFullscreen()
    }
  }, [isPlaying])

  return (
    <div
      className={cn(s.playButton, { isPlaying })}
      onClick={() => {
        if (!isPlaying) {
          fullRef.current && play(fullRef)
          setIsPlaying(true)
        }
      }}
    >
      <PlayIcon />
      <Portal>
        <div
          className={cn(s.videoOverlay, { isPlaying })}
          onClick={e => {
            e.stopPropagation()
            // click outside video el - pause and close
            fullRef.current && fullRef.current.pause()
            setIsPlaying(false)
          }}
        >
          <Video
            className={cn('video')}
            ref={fullRef}
            webm={showreelFullMobile?.webm.url}
            mp4={showreelFullMobile?.mp4?.url}
            autoplay={false}
            controls={true}
            preload="none"
            muted={false}
            loop={false}
            playsinline={false}
            invisible={false}
            onClick={e => {
              // click on video el - video controls gets events only
              e.stopPropagation()
            }}
          />
        </div>
      </Portal>
    </div>
  )
}

MobileShowreelLauncher.propTypes = {
  showreelFullMobile: PropTypes.shape({ mp4: PropTypes.object, webm: PropTypes.object }),
}

export default MobileShowreelLauncher
