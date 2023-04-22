import React, { useMemo, useRef, useEffect, useState } from 'react'
import { useFrame, useThree, createPortal } from '@react-three/fiber'
import { Color, Vector2, MathUtils, Scene } from 'three'
import { useSpring, transform, useViewportScroll } from 'framer-motion'
import lerp from '@14islands/lerp'

import useUIContext from 'context/ui'

import { useScrollRig } from '@14islands/r3f-scroll-rig'
import config from 'config'

import vertexShader from './shader.vert'
import fragmentShader from './shader.frag'

const SPEED = 0.5
const CORNER_SPEED = 0.5
const TAB_SPEED = 0.5
const MAX_TAB_SPEED = 2.5

const CORNER_MIN = 0.42

const LabTransitionMeshInner = ({ location }) => {
  const mesh = useRef()
  const material = useRef()
  const [scene] = useState(() => new Scene())

  // transient values
  const local = useRef({
    lastY: 0,
    scrollVelocity: 0,
    speed: 0,
    tab: 0,
    corner: CORNER_MIN,
    frame: 0,
    footer: 0,
    noiseSpeed: 0,
  }).current

  const { invalidate, size } = useThree()
  const { renderScissor } = useScrollRig()
  const pixelRatio = useThree(s => s.viewport.dpr)

  const { scrollYProgress } = useViewportScroll()

  const assets = useUIContext(state => state.assets)
  const isLabCTAVisible = useUIContext(state => state.isLabCTAVisible)
  const isLabTransitionRunning = useUIContext(state => state.isLabTransitionRunning)
  const isLabHoverVisible = useUIContext(state => state.isLabHoverVisible)
  const showBackgroundBubbles = useUIContext(state => state.showBackgroundBubbles)

  const progress = useSpring(0, { stiffness: 15, damping: 5, restDelta: 0.001, restSpeed: 0.001 })

  const threshold = useMemo(() => {
    const fullHeight = window.document.body.offsetHeight
    return (fullHeight - size.width * 0.25) / fullHeight
  }, [size])

  const mouse = useRef({ x: 0, y: 0, clientY: 0, clientX: 0 }).current
  const onMouseMove = e => {
    if (!isLabCTAVisible || isLabTransitionRunning) return
    // mouse pos as 0-1
    mouse.y = e.clientY / size.height
    mouse.x = e.clientX / size.width

    const proximity = (mouse.x + mouse.y) * 0.5

    const minVal = scrollYProgress.get() > threshold ? 0.2 : CORNER_MIN
    local.corner = transform(proximity, [0.85, 0.92], [minVal, 1.0])
  }

  const checkVisibility = scrollYProgress => {
    if (isLabTransitionRunning) return
    local.footer = MathUtils.clamp(MathUtils.mapLinear(scrollYProgress, threshold, 1.0, 0, 1), 0, 1)
    invalidate()
  }

  useEffect(() => scrollYProgress.onChange(checkVisibility), [isLabCTAVisible, isLabTransitionRunning])

  useEffect(() => {
    material.current.uniforms.u_color.value.setStyle(showBackgroundBubbles ? 'white' : 'black')
  }, [showBackgroundBubbles])

  useEffect(() => {
    if (isLabTransitionRunning) return
    local.frame = isLabHoverVisible ? 0.5 : 0
  }, [isLabHoverVisible])

  useEffect(() => {
    if (isLabTransitionRunning) {
      local.frame = 1
    } else {
      local.frame = 0
      local.tab = 0
      local.corner = CORNER_MIN
      local.footer = 0
      uniforms.u_tab.value = 0
      uniforms.u_corner.value = 0
      uniforms.u_frame.value = 0
      uniforms.u_footer.value = 0
      material.current.uniforms.u_time.value = 0
      material.current.uniforms.u_progress.value = 0
      invalidate()
    }
  }, [isLabTransitionRunning])

  useEffect(() => {
    if (isLabTransitionRunning) return
    local.tab = isLabCTAVisible ? 1 : 0
  }, [isLabCTAVisible])

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [isLabCTAVisible, isLabTransitionRunning, size])

  // invalidate render loop on spring update
  useEffect(() => progress.onChange(invalidate), [])

  useEffect(() => {
    material.current.uniforms.u_texture.value = assets.labCornerTexture
  }, [assets.labCornerTexture])

  // dimensions
  useEffect(() => {
    material.current.uniforms.u_res.value.x = size.width
    material.current.uniforms.u_res.value.y = size.height
    material.current.uniforms.u_pixelRatio.value = pixelRatio
  }, [size, pixelRatio])

  useFrame(({ gl, camera }, delta) => {
    if (!material.current) return

    const uniforms = material.current.uniforms

    const tabDelta = Math.abs(uniforms.u_tab.value - local.tab)
    const cornerDelta = Math.abs(uniforms.u_corner.value - local.corner)
    const frameDelta = Math.abs(uniforms.u_frame.value - local.frame)
    const dxdy = tabDelta + cornerDelta + frameDelta

    // only render if we have dxdy or if footer||tab is active
    if (dxdy < 0.014 && uniforms.u_footer.value < 0.014 && uniforms.u_tab.value < 0.014) return

    const y = scrollYProgress.get()

    // emulate same value range as scrollY.getVelocity() since it sometimes stops working
    local.scrollVelocity = Math.abs(y - local.lastY) * 100 * 0.6 // scrollY.getVelocity()
    local.lastY = y

    // animate in fullscreen
    material.current.uniforms.u_time.value += delta * local.speed * SPEED
    material.current.uniforms.u_progress.value = progress.get()

    uniforms.u_tab.value = lerp(uniforms.u_tab.value, local.tab, 0.1, delta)
    uniforms.u_footer.value = lerp(uniforms.u_footer.value, local.footer, 0.1, delta)

    const cornerLerp = local.corner > 0.5 ? 0.1 : 0.02
    uniforms.u_corner.value = lerp(uniforms.u_corner.value, local.corner, cornerLerp, delta)

    const frameLerp = local.frame > 0.5 ? 0.08 : 0.05
    uniforms.u_frame.value = lerp(uniforms.u_frame.value, local.frame, frameLerp, delta)

    // increse speed if something if corner or frame is active
    if (local.scrollVelocity || local.corner || local.frame || local.footer) {
      local.speed = lerp(local.speed, 1.0, 0.1, delta)
    } else {
      local.speed = lerp(local.speed, 0, 0.05, delta)
    }

    // Tab / corner noise speed
    // const speed = local.corner ? CORNER_SPEED : velocity * 2 * TAB_SPEED
    // const speed = local.corner || local.footer ? CORNER_SPEED : local.scrollVelocity * 4 * TAB_SPEED
    let speed
    if (local.corner > 0.5 || local.footer) {
      speed = CORNER_SPEED
    } else {
      speed = Math.min(Math.max(TAB_SPEED, local.scrollVelocity * 10), MAX_TAB_SPEED)
    }
    uniforms.u_tabNoiseSpeed.value = lerp(uniforms.u_tabNoiseSpeed.value, local.speed * speed, 0.05, delta)
    uniforms.u_tabTime.value += delta * local.speed * speed

    // Render fullscreen if needed
    if (uniforms.u_frame.value > 0.014 || uniforms.u_corner.value > 0.5 || uniforms.u_footer.value > 0.014) {
      // cover full screen
      renderScissor({
        gl,
        scene,
        camera,
        left: 0,
        top: 0,
        width: size.width,
        height: size.height,
      })
      invalidate()
      return
    }

    // keep rendering if needed
    const neeedUpdate = dxdy > 0.014 || local.speed > 0.014
    if (neeedUpdate) {
      invalidate()
    }

    // render corner as small scissor by for better perf
    renderScissor({
      gl,
      scene,
      camera,
      left: size.width * 0.7,
      top: 0,
      width: size.width * 0.31,
      height: size.height * 0.3,
    })
  }, 1001)

  const uniforms = useMemo(() => {
    return {
      u_color: { value: new Color('black') },
      u_time: { value: 0 },
      u_tabTime: { value: 0 },
      u_pixelRatio: { value: pixelRatio },
      u_progress: { value: 0 },
      u_insideLab: { value: 0 },
      u_res: { value: new Vector2(size.width, size.height) },
      u_mouse: { value: new Vector2(0, 0) },
      u_texture: { value: null },
      u_tab: { value: local.tab },
      u_corner: { value: local.corner },
      u_frame: { value: local.frame },
      u_footer: { value: local.footer },
      u_tabNoiseSpeed: { value: local.noiseSpeed },
    }
  }, [])

  return createPortal(
    <group renderOrder={config.ORDER_LAB_CTA}>
      <mesh ref={mesh} scale={[size.width, size.height, 1]}>
        <planeBufferGeometry attach="geometry" args={[1, 1, 128, 128]} />
        <shaderMaterial
          ref={material}
          attach="material"
          args={[
            {
              vertexShader,
              fragmentShader,
            },
          ]}
          transparent
          uniforms={uniforms}
        />
      </mesh>
    </group>,
    scene,
  )
}

const LabTransitionMesh = () => {
  const isScrollRigEnabled = useUIContext(s => s.isScrollRigEnabled)
  return isScrollRigEnabled ? <LabTransitionMeshInner /> : null
}

export default LabTransitionMesh
