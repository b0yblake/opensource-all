import React, { useRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useFrame, useThree } from '@react-three/fiber'
import { LinearFilter, Texture, sRGBEncoding } from 'three'
import { useSpring, animated, config as springs } from '@react-spring/three'
import { useSpring as useFramerSpring } from 'framer-motion'
import { interpolate } from '@popmotion/popcorn'
import lerp from '@14islands/lerp'

import useUIContext from 'context/ui'

import { play, pause } from 'lib/videoControls'
import requestIdleCallback from 'lib/requestIdleCallback'
import useDelayedEffect from 'lib/useDelayedEffect'

import { ScrollScene } from '@14islands/r3f-scroll-rig'

import { usePixelCursorRef, useUnitCursorRef, calcViewCoordinate } from 'components/ui/cursor-tracker'

import './VideoPlayerBlobMaterial'

const SPEED = 1
const FPS = 25

const noop = () => ({})

const VideoPlayerBlobMesh = ({
  el,
  scale,
  video,
  fullVideo,
  isPlayingShowreel,
  onPlayTransitionDone,
  onLoadTransitionDone = noop,
  state: { bounds },
}) => {
  const { invalidate, size, gl } = useThree()
  const pixelRatio = useThree(s => s.viewport.dpr)

  const isPageTransitionActive = useUIContext(state => state.isPageTransitionActive)
  const isNativeCursorHidden = useUIContext(state => state.isNativeCursorHidden)

  const material = useRef()
  const mouse = useRef({ showBlob: false, hoverX: 0, hoverY: 0 }).current
  const local = useRef({ lastVideoFrame: -1 }).current
  const cursor = usePixelCursorRef()
  const unitCursor = useUnitCursorRef()

  const [transition, setTransition] = useState(0)
  const [calledDoneTransition, setCalledDoneTransition] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  const edgeEffect = useFramerSpring(0, { stiffness: 250, damping: 15, restDelta: 0.001, restSpeed: 0.001 })
  const cursorVisible = useFramerSpring(0, { stiffness: 150, damping: 20, restDelta: 0.01, restSpeed: 0.01 })

  useEffect(() => edgeEffect.onChange(invalidate), [])
  useEffect(() => cursorVisible.onChange(invalidate), [])

  const setMouseHover = e => {
    mouse.hoverX = e ? calcViewCoordinate(e.clientX, size.width) : cursor.viewX
    mouse.hoverY = e ? -calcViewCoordinate(e.clientY, size.height) : cursor.viewY
  }

  // wait before animating after mount to increase chances of smoothness
  useDelayedEffect(
    () => {
      if (!isLoaded) {
        setTransition(0.6)
      } else {
        setTransition(1.0)
      }
      invalidate()
    },
    [isLoaded],
    isPageTransitionActive ? 0 : 0, // delay if first page load?
  )

  const checkBlobVisibility = () => {
    if (!mouse.showBlob && isNativeCursorHidden?.el === el && cursor.x) {
      mouse.showBlob = true
      cursorVisible.set(1.0)
      if (Math.abs(edgeEffect.get()) < 0.9) {
        // store pos where hover happened
        setMouseHover(isNativeCursorHidden.event)

        edgeEffect.set(1, false)
        edgeEffect.set(0)
      }
    } else if (mouse.showBlob && isNativeCursorHidden?.el !== el) {
      mouse.showBlob = false
      cursorVisible.set(0)
      if (Math.abs(edgeEffect.get()) < 0.2) {
        // store pos where hover happened
        setMouseHover()

        edgeEffect.set(0.5, false)
        edgeEffect.set(0)
      }
    }
  }

  // HOVER effect
  useEffect(() => {
    if (isPageTransitionActive) return
    checkBlobVisibility()
    invalidate()
  }, [isNativeCursorHidden])

  // dimensions
  useEffect(() => {
    material.current.planeSize = { width: bounds.width, height: bounds.height }
    material.current.resolution = { width: size.width, height: size.height }
  }, [size, bounds.width, bounds.height])

  const createVideoTexture = el => {
    var texture = new Texture(el)
    texture.anisotropy = gl.capabilities.getMaxAnisotropy()
    texture.generateMipmaps = false
    texture.magFilter = LinearFilter
    texture.minFilter = LinearFilter
    texture.encoding = sRGBEncoding
    return texture
  }

  const onVideoLoadedEnough = () => {
    if (!video.current) return
    video.current.removeEventListener('canplaythrough', onVideoLoadedEnough)
    material.current.video = createVideoTexture(video.current)
    // retry if video has no size yet
    if (!material.current.video.image.videoWidth) {
      setTimeout(onVideoLoadedEnough, 250)
    }
    // set loaded
    requestIdleCallback(
      () => {
        if (!material.current?.video) return
        material.current.video.needsUpdate = true
        setIsLoaded(true)
      },
      { timeout: 1000 },
    )
  }

  useEffect(() => {
    if (!video.current || !fullVideo.current || !isLoaded) return
    if (isPlayingShowreel) {
      pause(video)
      material.current.video = createVideoTexture(fullVideo.current)
    } else {
      material.current.video = createVideoTexture(video.current)
      play(video)
    }
    material.current.video.needsUpdate = true
  }, [isPlayingShowreel])

  useEffect(() => {
    if (!video.current || !fullVideo.current) return

    video.current.addEventListener('canplaythrough', onVideoLoadedEnough)

    // check if video was cached and ready to play
    if (video.current.readyState > 3) {
      onVideoLoadedEnough()
    }

    return () => {
      if (video.current) {
        video.current.removeEventListener('canplaythrough', onVideoLoadedEnough)
      }
    }
  }, [])

  const onLoadingSpringFrame = values => {
    if (calledDoneTransition || values['material-transition'] < 0.9) return

    onLoadTransitionDone(isPlayingShowreel)
    setCalledDoneTransition(true)
  }

  // loading spring
  const spring = useSpring({
    'material-transition': transition,
    config: !isLoaded ? { tension: 170, friction: 200, precision: 0.001 } : { ...springs.molasses, precision: 0.001 },
    onChange: onLoadingSpringFrame,
  })

  // cursor blob spring
  const cursorSpring = useSpring({
    'material-blobSize': isPlayingShowreel ? 0 : 1,
    config: {
      tension: isPlayingShowreel ? 250 : 20,
      friction: 14,
      clamp: isPlayingShowreel,
      precision: 0.01,
      velocity: 0.05,
    },
    onRest: () => {
      onPlayTransitionDone && onPlayTransitionDone(isPlayingShowreel)
    },
  })

  useFrame(({ clock }, delta) => {
    if (!bounds.inViewport || isPageTransitionActive) return
    if (!material.current) return

    if ((!video.current?.paused || !fullVideo.current?.paused) && material.current.video) {
      const time = clock.getElapsedTime()
      if (!local.lastVideoFrame || time - local.lastVideoFrame > 1 / FPS) {
        material.current.video.needsUpdate = true
        local.lastVideoFrame = time
      }
    }

    // increase speed while transitioning to cinema mode
    const edgeSpeed = interpolate([0.0, 0.14, 1.0], [0.0, 1.0, 0.0])(material.current.cinemaTransition)

    material.current.time += delta * SPEED + edgeSpeed * 0.12

    material.current.edgeEffect = edgeEffect.get()
    material.current.cursorVisible = cursorVisible.get()

    material.current.vmouse.x = mouse.hoverX
    material.current.vmouse.y = mouse.hoverY

    if (!mouse.showBlob) {
      material.current.mouse.x = unitCursor.viewX
      material.current.mouse.y = unitCursor.viewY
    }

    material.current.mouse.x = lerp(material.current.mouse.x, unitCursor.viewX, 0.25, delta)
    material.current.mouse.y = lerp(material.current.mouse.y, unitCursor.viewY, 0.25, delta)

    material.current.isPlayingShowreel = lerp(
      material.current.isPlayingShowreel,
      isPlayingShowreel ? 1 : 0,
      0.02,
      delta,
    )

    // only slow transition from 0 to 1
    material.current.cinemaTransition = lerp(
      material.current.cinemaTransition,
      isPlayingShowreel,
      isPlayingShowreel ? 0.02 : 1,
      delta,
    )

    checkBlobVisibility()
    invalidate()
  })

  return (
    <group>
      <animated.mesh {...spring} {...cursorSpring}>
        <planeBufferGeometry attach="geometry" args={[scale.width, scale.height, 128, 128]} />
        <homeHeroMaterial attach="material" ref={material} transparent pixelRatio={pixelRatio} />
      </animated.mesh>
    </group>
  )
}

VideoPlayerBlobMesh.propTypes = {
  posterImage: PropTypes.any,
  video: PropTypes.any,
  onLoadTransitionDone: PropTypes.func,
  onPlayTransitionDone: PropTypes.func,
  ...ScrollScene.childPropTypes,
}

export default VideoPlayerBlobMesh
