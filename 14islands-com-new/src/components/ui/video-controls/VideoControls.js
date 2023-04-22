import React, { forwardRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'

import { play, pause } from 'lib/videoControls'

import * as s from './VideoControls.module.css'

const cn = classNames.bind(s)

const getSecondsLoaded = (player, duration) => {
  if (!player) return null
  const { buffered } = player
  if (buffered.length === 0) {
    return 0
  }
  const end = buffered.end(buffered.length - 1)
  if (end > duration) {
    return duration
  }
  return end
}

const PlayIcon = () => (
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
    <path fill="currentColor" d="M5 3l15.5 9.5-15.5 9V3z" />
  </svg>
)

const PauseIcon = () => (
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
    <g fill="currentColor" stroke="currentColor" strokeWidth="2">
      <rect x="5" y="5" width="3.33333" height="14" />
      <rect x="15.666" y="5" width="3.33333" height="14" />
    </g>
  </svg>
)

const MuteIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <g fill="currentColor" fillRule="evenodd">
      <path d="M17.747 20.497v-17l-8.5 4.25v8.5l8.5 4.25zm-1-1.618V5.115l-6.5 3.25v7.264l6.5 3.25z" />
      <path d="M9.31 8.747H5.997v6.5H9.31v-6.5zm-4.313-1v8.5h5.313v-8.5H4.997z" />
    </g>
  </svg>
)

const UnmuteIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <g fill="currentColor" fillRule="evenodd">
      <path d="M17.747 20.497v-17l-8.5 4.25v8.5l8.5 4.25zm-1-1.618V5.115l-6.5 3.25v7.264l6.5 3.25z" />
      <path d="M9.31 8.747H5.997v6.5H9.31v-6.5zm-4.313-1v8.5h5.313v-8.5H4.997z" />
      <path d="M20.997 3.497l-16 16-.707-.707 16-16 .707.707z" />
    </g>
  </svg>
)

const padLeft = (x = 0, y = 2, z = '0') =>
  parseInt(x)
    .toString()
    .padStart(y, z)

const toMinutes = time => {
  if (!isFinite(time)) return ''
  return `${padLeft(time / 60, 1)}:${padLeft(time % 60)}`
}

const VideoControls = forwardRef(({ videoRef, muted, isVisible, id, ...props }, ref) => {
  const [time, setTime] = useState()
  const [duration, setDuration] = useState()
  const [loaded, setLoaded] = useState()
  const [seeking, setSeeking] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [isMuted, setMuted] = useState(!!muted)

  const onTimeUpdate = e => {
    setTime(e.target.currentTime)
    setLoaded(getSecondsLoaded(e.target, duration))
  }

  const onDurationChange = e => {
    setDuration(e.target.duration)
    if (typeof props.onDurationChange === 'function') props.onDurationChange(e)
  }

  const onPlay = e => {
    setPlaying(true)
    if (typeof props.onPlay === 'function') props.onPlay(e)
  }
  const onPause = e => {
    setPlaying(false)
    if (typeof props.onPause === 'function') props.onPause(e)
  }

  const seekTo = v => {
    videoRef.current.currentTime = v
  }

  const togglePlay = () => {
    if (playing) return pause(videoRef)
    play(videoRef)
  }

  const toggleMute = () => setMuted(!isMuted)

  useEffect(() => {
    if (seeking) pause()
  }, [seeking])

  useEffect(() => {
    videoRef.current.muted = isMuted
  }, [isMuted])

  useEffect(() => {
    if (!videoRef?.current) return null
    videoRef.current.addEventListener('timeupdate', onTimeUpdate)
    videoRef.current.addEventListener('durationchange', onDurationChange)
    videoRef.current.addEventListener('loadedmetadata', onDurationChange)
    videoRef.current.addEventListener('play', onPlay)
    videoRef.current.addEventListener('pause', onPause)
    return () => {
      videoRef.current.removeEventListener('timeupdate', onTimeUpdate)
      videoRef.current.removeEventListener('durationchange', onDurationChange)
      videoRef.current.removeEventListener('loadedmetadata', onDurationChange)
      videoRef.current.removeEventListener('play', onPlay)
      videoRef.current.removeEventListener('pause', onPause)
    }
  }, [videoRef])

  return (
    <div className={cn('wrapper', { isVisible })} ref={ref}>
      <div className={cn('controls')} onClick={e => e.stopPropagation()}>
        <div className={cn('controlsContainer')}>
          <label className={cn('controlButton')}>
            <input type="checkbox" value={playing} onChange={togglePlay} />
            {playing ? <PauseIcon /> : <PlayIcon />}
          </label>
          <time className={cn('time')}>{toMinutes(time)}</time>
          <div className={cn('seekProgress', { isVisible: isFinite(duration) })}>
            <progress
              className={cn('progress', 'loaded')}
              min={0}
              max={Math.max(duration, time) || 1}
              step={0.25}
              value={loaded ?? 0}
            />
            <progress
              className={cn('progress')}
              min={0}
              max={Math.max(duration, time) || 1}
              step={0.25}
              value={time ?? 0}
            />
            <input
              id={id}
              className={cn('seek')}
              type="range"
              min={0}
              max={Math.max(duration, time) || 1}
              step={0.125}
              value={time ?? 0}
              onChange={({ target }) => seekTo(parseFloat(target.value))}
              onMouseDown={() => setSeeking(true)}
              onMouseUp={() => {
                setSeeking(false)
                play()
              }}
            />
            <label htmlFor={id}>Video range</label>
          </div>
          <label className={cn('controlButton')}>
            <input type="checkbox" value={isMuted} onChange={toggleMute} />
            {isMuted ? <UnmuteIcon /> : <MuteIcon />}
          </label>
        </div>
      </div>
    </div>
  )
})

VideoControls.displayName = 'VideoControls'

VideoControls.propTypes = {
  videoRef: PropTypes.object,
  webm: PropTypes.string,
  mp4: PropTypes.string,
  isVisible: PropTypes.bool,
  invisible: PropTypes.bool,
  playsinline: PropTypes.bool,
  muted: PropTypes.bool,
  autoplay: PropTypes.bool,
  loop: PropTypes.bool,
  preload: PropTypes.string,
  poster: PropTypes.string,
  controls: PropTypes.func,
  onDurationChange: PropTypes.func,
  onPlay: PropTypes.func,
  onPause: PropTypes.func,
  id: PropTypes.string,
}

export default VideoControls
