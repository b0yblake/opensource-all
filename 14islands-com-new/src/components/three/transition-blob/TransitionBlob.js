import React, { useRef, useEffect, useLayoutEffect, useState, useCallback, memo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useSpring, animated } from '@react-spring/three'

import useUIContext from 'context/ui'

import { useScrollRig } from '@14islands/r3f-scroll-rig'

import { useUnitCursorRef } from 'components/ui/cursor-tracker'
import config from 'config'

import './TransitionBlobMaterial'

const SPEED = 1.0

const TRANSITION = {
  hidden: 'hidden',
  visible: 'visible',
}

// const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

const TransitionBlob = () => {
  const mesh = useRef()
  const material = useRef()

  const [transitionState, setTransitionState] = useState(TRANSITION.hidden)
  const { invalidate, size } = useThree()
  const { requestRender } = useScrollRig()
  const unitCursor = useUnitCursorRef()

  const isPageTransitionActive = useUIContext(state => state.isPageTransitionActive)

  useLayoutEffect(() => {
    mesh.current.visible = false
  }, [])

  useEffect(() => {
    if (!isPageTransitionActive) {
      mesh.current.visible = false
      invalidate()
      requestRender()
      setTransitionState(TRANSITION.hidden)
      return
    }
    material.current.color = isPageTransitionActive.color
    material.current.color2 = isPageTransitionActive.color2 || isPageTransitionActive.color
    material.current.startPosition.x = unitCursor.viewX
    material.current.startPosition.y = unitCursor.viewY
    mesh.current.visible = true
    setTransitionState(TRANSITION.visible)
  }, [isPageTransitionActive])

  // dimensions
  useEffect(() => {
    material.current.resolution = { width: size.width, height: size.height }
  }, [size])

  const anim = transitionState === TRANSITION.visible && !!isPageTransitionActive

  const from = { 'material-progress': 0.0 }

  // trigger animation frame when transition changes
  useEffect(() => {
    invalidate()
  }, [transitionState])

  // timeline
  const to = useCallback(
    async (next, cancel) => {
      if (!anim) {
        return next(from)
      }
      await next({ 'material-progress': 1.0 })
    },
    [transitionState],
  )

  const slowEasing = () => ({
    // nice slow without stop
    precision: 0.1,
    tension: 250,
    friction: 100,
    velocity: -0.05,
    clamp: true,
  })

  // chain to animations with different easing.
  const springExpand = useSpring({
    to,
    from,
    immediate: !anim,
    config: () => slowEasing(),
    onChange: props => {
      if (!mesh.current) return
      mesh.current.material.addTime = 0.01 * SPEED // + Math.abs(springExpand['material-progress'].lastVelocity || 0) * 0.9
      invalidate()
    },
  })

  useFrame(() => {
    if (anim) {
      requestRender()
    }
  })

  return (
    <group renderOrder={config.ORDER_TRANSITION}>
      <animated.mesh
        ref={mesh}
        position={[0, 0, 0]}
        // material-progress={interpolate([springMiddle.size, springExpand.size], (size1, size2) => {
        //   return size1 + size2
        // })}
        {...springExpand}
        scale={[size.width, size.height, 1]}
      >
        <planeBufferGeometry attach="geometry" args={[1, 1, 128, 128]} />
        <transitionBlobMaterial ref={material} attach="material" />
      </animated.mesh>
    </group>
  )
}

export default memo(TransitionBlob)
