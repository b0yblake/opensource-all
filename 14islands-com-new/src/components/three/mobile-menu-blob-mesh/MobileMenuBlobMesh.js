import React, { useRef, useEffect, useLayoutEffect, memo, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useFrame, useThree } from '@react-three/fiber'
import { useSpring, animated } from '@react-spring/three'
import lerp from '@14islands/lerp'

import useUIContext from 'context/ui'
import { useScrollRig } from '@14islands/r3f-scroll-rig'

import config from 'config'
import './MobileMenuBlobMaterial'

const SPEED = 1.0
const WAVE_SPEED_MAX = 3.0
const WAVE_SPEED_MIN = 0.2

const MobileMenuBlobMesh = ({ transitionState, iconRef }) => {
  const mesh = useRef()
  const material = useRef()
  const local = useRef({ waveSpeed: 0 }).current

  const { invalidate, size } = useThree()
  const { requestRender } = useScrollRig()

  const headerTheme = useUIContext(s => s.headerTheme)
  const pageTheme = useUIContext(s => s.pageTheme)

  const isInverted = useMemo(() => headerTheme === 'dark' || pageTheme === 'dark', [pageTheme, headerTheme])

  const COVER_STATES = {
    RESET: {
      immediate: true,
      progress: 0,
      friction: 0,
      delay: 0,
    },
    OPEN: {
      immediate: false,
      progress: 1,
      friction: 100,
      delay: 0,
    },
    CLOSED: {
      immediate: false,
      progress: 0,
      friction: 40,
      delay: 500,
    },
    TRANSITION_UP: {
      immediate: false,
      progress: 1,
      friction: 40,
      delay: 500,
    },
    TRANSITION_DOWN: {
      immediate: false,
      progress: 1,
      friction: 40,
      delay: 500,
    },
  }

  const WAVE_STATES = {
    RESET: {
      progress: isInverted ? 1 : 0,
      immediate: true,
    },
    OPEN: {
      progress: 0.55,
      tension: 20,
      friction: 5,
      velocity: 0,
      clamp: false,
      delay: 600,
    },
    CLOSED: {
      progress: isInverted ? 1 : 0,
      tension: 40,
      friction: 5,
      // velocity: .005,
      clamp: true,
      delay: 0,
    },
    TRANSITION_UP: {
      progress: 0,
      tension: 15,
      friction: 4,
      // velocity: 0.015,
      clamp: true,
      delay: 0,
    },
    TRANSITION_DOWN: {
      progress: 1,
      tension: 15,
      friction: 4,
      // velocity: -.0015,
      clamp: true,
      delay: 0,
    },
  }

  const waveState = WAVE_STATES[transitionState]
  const coverState = COVER_STATES[transitionState]

  useLayoutEffect(() => {
    mesh.current.visible = false
  }, [])

  useEffect(() => {
    if (transitionState === OPEN) {
      const rect = iconRef?.current.getBoundingClientRect()
      const { left, top, width, height } = rect
      const y = -((top + height * 0.5) / size.height) * 2 + 1
      const x = ((left + width * 0.5) / size.width) * 2 - 1
      material.current.startPosition = { x, y }
      mesh.current.visible = true
      local.waveSpeed = WAVE_SPEED_MAX
    }
    invalidate()
    requestRender()
  }, [transitionState])

  // dimensions
  useEffect(() => {
    material.current.resolution = { width: size.width, height: size.height }
  }, [size])

  // cover spring
  const springCover = useSpring({
    'material-coverProgress': coverState.progress,
    immediate: coverState.immediate,
    config: {
      precision: 0.001,
      tension: 300,
      friction: coverState.friction,
      clamp: true,
    },
    delay: coverState.delay,
    onChange: invalidate,
    onRest: () => {
      if (transitionState === CLOSED || transitionState === RESET) {
        if (mesh.current) {
          mesh.current.visible = false
          requestRender()
          invalidate()
        }
      }
    },
  })

  // wave spring
  const springWave = useSpring({
    'material-waveProgress': waveState.progress,
    immediate: waveState.immediate,
    config: {
      precision: 0.001,
      ...waveState,
    },
    delay: waveState.delay,
    onChange: invalidate,
  })

  useFrame((_, delta) => {
    if (material.current.coverProgress > 0.0) {
      mesh.current.material.time += delta * SPEED

      local.waveSpeed = lerp(local.waveSpeed, WAVE_SPEED_MIN, 0.014, delta)

      mesh.current.material.waveTime += delta * local.waveSpeed

      requestRender()
      invalidate()
    }
  })

  return (
    <group renderOrder={config.ORDER_TRANSITION}>
      <animated.mesh ref={mesh} {...springCover} {...springWave} scale={[size.width, size.height, 1]}>
        <planeBufferGeometry attach="geometry" args={[1, 1, 256, 256]} />
        <mobileMenuBlobMaterial
          ref={material}
          attach="material"
          coverColor={'#000'}
          waveColor={'#fff'}
          waveRest={WAVE_STATES.OPEN.progress}
        />
      </animated.mesh>
    </group>
  )
}

MobileMenuBlobMesh.propTypes = {
  transitionState: PropTypes.string,
  iconRef: PropTypes.object,
}

export const RESET = 'RESET'
export const CLOSED = 'CLOSED'
export const TRANSITION_UP = 'TRANSITION_UP'
export const TRANSITION_DOWN = 'TRANSITION_DOWN'
export const OPEN = 'OPEN'

export default memo(MobileMenuBlobMesh)
