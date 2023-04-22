import React, { useMemo, useRef, useEffect, useState } from 'react'
import { Color, Vector2, Scene } from 'three'
import { useFrame, useThree, createPortal } from '@react-three/fiber'
import { useSpring } from 'framer-motion'
import lerp from '@14islands/lerp'

import useUIContext from 'context/ui'

import { useScrollRig } from '@14islands/r3f-scroll-rig'
import useWindowFocus from 'hooks/useWindowFocus'
import { cursorApi } from 'components/ui/cursor-tracker'

import vertexShader from './shader.vert'
import fragmentShader from './shader.frag'

const SPEED = 1
const cursorSize = 10.0

// cached vectors to avoid garbage collection
const clampedCurrent = new Vector2()
const distance = new Vector2()
const min = new Vector2()
const max = new Vector2()

const normalize = val => Math.min(Math.max(0, val), 1)

const CursorBlobInner = () => {
  const isWindowInFocus = useWindowFocus()
  const { invalidate, size } = useThree()
  const { renderScissor } = useScrollRig()
  const pixelRatio = useThree(s => s.viewport.dpr)
  const [scene] = useState(() => new Scene())

  const isDrawing = useUIContext(s => s.isOverDrawingArea)
  const link = useUIContext(s => s.hoveredLink)
  const setLink = useUIContext(s => s.setHoveredLink)
  const headerTheme = useUIContext(s => s.headerTheme)
  const theme = useUIContext(s => s.theme())
  const isLinkHovered = useRef(false)
  const isCursorSwitched = useRef(false)

  const isNativeCursorHidden = useUIContext(state => state.isNativeCursorHidden)
  const setCursorStyle = useUIContext(state => state.setCursorStyle)
  const isPageTransitionActive = useUIContext(state => state.isPageTransitionActive)

  // const scene = useRef()
  const material = useRef()
  const mouse = useRef({ x: 0, y: 0, clientY: 0, clientX: 0, lerpX: 0, lerpY: 0 }).current
  const scale = useRef(0)
  const opacity = useRef(0)
  const fill = useRef(1)
  const resetCursor = useRef(false)
  const isMoved = useRef(false)
  let trailLerp = useRef(0.5).current

  const blobColor = useSpring('#ffffff', { stiffness: 600, damping: 200, restDelta: 0.001, restSpeed: 0.001 })

  const calcPosition = (x, y) => {
    mouse.y = -(y / size.height) * 2 + 1
    mouse.x = (x / size.width) * 2 - 1
    mouse.clientY = y
    mouse.clientX = x
  }

  const fixCursorPosition = (pos, switched) => {
    if (!link) return false
    isCursorSwitched.current = switched
    const r = link.getBoundingClientRect()
    const adj = parseInt(window.getComputedStyle(link, ':before').top) || 0

    calcPosition(r[pos], r.top + adj)
  }

  const changeScale = (scaleUp, speed, delta) => {
    scale.current = lerp(scale.current, scaleUp ? 1 : 0, speed, delta)
    opacity.current = normalize(scaleUp ? opacity.current + 0.1 : scale.current < 0.02 ? opacity.current - 0.01 : 1)
    fill.current = normalize(scaleUp ? 1 : scale.current < 0.05 ? fill.current - 0.1 : 1)

    scale.current < 0.001 && !isCursorSwitched.current && isLinkHovered.current && fixCursorPosition('right', true)
  }

  const onMouseMove = ({ pixelCursor }) => {
    if (!isMoved.current) isMoved.current = true
    !isLinkHovered.current && calcPosition(pixelCursor.x, pixelCursor.y)
    !isPageTransitionActive && invalidate()
    if (!isPageTransitionActive && resetCursor.current) {
      resetCursor.current = false
    }
  }

  // listen to mouse move from CursorTracker
  useEffect(() => cursorApi.subscribe(onMouseMove), [size, isPageTransitionActive, isPageTransitionActive, resetCursor])

  // dimensions
  useEffect(() => {
    material.current.uniforms.u_res.value.x = size.width
    material.current.uniforms.u_res.value.y = size.height
  }, [size])

  useEffect(() => {
    material.current.uniforms.u_pixelRatio.value = pixelRatio.toFixed(1)
  }, [pixelRatio])

  // reset cursor after mouse move on page transition
  useEffect(() => {
    if (isPageTransitionActive) {
      setLink(null)
      resetCursor.current = true
    }
  }, [isPageTransitionActive])

  // update cursor style
  useEffect(() => {
    const color = headerTheme === 'dark' ? '#fff' : '#000'
    blobColor.set(color)
    setCursorStyle(color)
  }, [theme, headerTheme])

  useEffect(() => {
    invalidate()
  }, [isWindowInFocus])

  useEffect(() => {
    trailLerp = isDrawing ? 1 : 0.5
  }, [isDrawing])

  useEffect(() => {
    if (link) {
      isLinkHovered.current = true
      fixCursorPosition('left', false)
    } else {
      isLinkHovered.current = false
    }
  }, [link])

  const lerpClamp = (current, target, lerp) => {
    // distance vector
    distance.subVectors(current, target)

    // clamp distance
    distance.clampLength(0, 0.02).negate()

    // create new target with clamped distance
    min.subVectors(target, distance)
    max.addVectors(target, distance)
    clampedCurrent.copy(current).clamp(min, max)

    // lerp towards clamped target
    return clampedCurrent.lerp(target, lerp)
  }

  useFrame(({ gl, camera }, delta) => {
    if (!material.current) return
    const uniforms = material.current.uniforms

    uniforms.u_time.value += delta * SPEED
    uniforms.u_color.value.setStyle(blobColor.get())

    const speed = 0.2

    // first dot
    uniforms.u_mouse.value.x = lerp(uniforms.u_mouse.value.x, mouse.x, speed, delta)
    uniforms.u_mouse.value.y = lerp(uniforms.u_mouse.value.y, mouse.y, speed, delta)

    // chain
    uniforms.u_mouse2.value.copy(lerpClamp(uniforms.u_mouse2.value, uniforms.u_mouse.value, trailLerp))
    uniforms.u_mouse3.value.copy(lerpClamp(uniforms.u_mouse3.value, uniforms.u_mouse2.value, trailLerp))
    uniforms.u_mouse4.value.copy(lerpClamp(uniforms.u_mouse4.value, uniforms.u_mouse3.value, trailLerp))
    uniforms.u_mouse5.value.copy(lerpClamp(uniforms.u_mouse5.value, uniforms.u_mouse4.value, trailLerp))

    // set coefficients to use inside the shader
    uniforms.u_scale.value = scale.current
    uniforms.u_alpha.value = opacity.current
    uniforms.u_fill.value = fill.current
    uniforms.u_cursorSize.value = cursorSize

    const dxy =
      Math.abs(uniforms.u_mouse5.value.y - uniforms.u_mouse4.value.y) +
      Math.abs(uniforms.u_mouse5.value.x - uniforms.u_mouse4.value.x)

    // render with a scissor to improve perf
    const scissorSize = 250 // size of square in px around mouse point to draw
    mouse.lerpY = lerp(mouse.lerpY, mouse.clientY, speed, delta)
    mouse.lerpX = lerp(mouse.lerpX, mouse.clientX, speed, delta)
    const positiveYUpBottom = size.height - (mouse.lerpY + scissorSize * 0.5) // inverse Y

    // Scissor is an extra render pass but still faster since its such a small area
    renderScissor({
      gl,
      scene,
      camera,
      top: positiveYUpBottom,
      left: mouse.lerpX - scissorSize * 0.5,
      width: scissorSize,
      height: scissorSize,
    })

    // scale to 0 or to 1
    if (isMoved.current) {
      if (isLinkHovered.current || isDrawing) {
        scale.current > 0 && changeScale(false, isDrawing ? 0.9 : 0.4, delta)
      } else {
        if (!resetCursor.current) {
          !isNativeCursorHidden && scale.current < 1 && changeScale(true, 0.05, delta)
          isNativeCursorHidden && scale.current > 0 && scale.current > 0 && changeScale(false, 1, delta)
        }
      }
    }

    // request new frame if mouse moved
    if ((dxy > 0.001 || (scale.current > 0.0001 && scale.current < 0.9999)) && !isPageTransitionActive) {
      invalidate()
    }
  }, 1001)

  const uniforms = useMemo(() => {
    return {
      u_pixelRatio: { value: pixelRatio.toFixed(1) },
      u_color: { value: new Color(0x000000) },
      u_time: { value: 0 },
      u_res: { value: new Vector2(1, 1) },
      u_mouse: { value: new Vector2(1, 1) },
      u_mouse2: { value: new Vector2(1, 1) },
      u_mouse3: { value: new Vector2(1, 1) },
      u_mouse4: { value: new Vector2(1, 1) },
      u_mouse5: { value: new Vector2(1, 1) },
      u_scale: { value: scale.current },
      u_alpha: { value: opacity.current },
      u_fill: { value: opacity.fill },
      u_cursorSize: { value: cursorSize },
    }
  }, [])

  return createPortal(
    <>
      <mesh>
        <planeBufferGeometry attach="geometry" args={[size.width, size.height, 1, 1]} />
        <shaderMaterial
          ref={material}
          attach="material"
          args={[
            {
              vertexShader,
              fragmentShader,
            },
          ]}
          uniforms={uniforms}
          transparent={true}
        />
      </mesh>
      {/* // Debug scissor */}
      {/* <mesh>
        <planeBufferGeometry attach="geometry" args={[size.width, size.height, 128, 128]} />
        <meshBasicMaterial attach="material" color="pink" />
      </mesh> */}
    </>,
    scene,
  )
}

const CursorBlob = () => {
  const isPointerPrimaryInput = useUIContext(s => s.isPointerPrimaryInput)
  const getBrowserType = useUIContext(s => s.getBrowserType)
  return isPointerPrimaryInput && getBrowserType() !== 'MS Edge' ? <CursorBlobInner /> : null
}

export default CursorBlob
