import React, { useRef, useEffect } from 'react'
import { MathUtils, sRGBEncoding } from 'three'
import { useViewportScroll } from 'framer-motion'
import { useThree, useFrame } from '@react-three/fiber'
import { useScrollRig } from '@14islands/r3f-scroll-rig'
import { useFBO } from '@react-three/drei/core/useFBO'
import lerp from '@14islands/lerp'

import './RefractionMaterial'

import useUIContext from 'context/ui'

import config from 'config'

const SPEED = 0.3

export const BubblesMesh = () => {
  const assets = useUIContext(state => state.assets)
  const showBubbles = useUIContext(state => state.showBubbles)
  const state = useRef({ lastY: 0, scrollVelocity: 0, noiseVelocity: 0, moveVelocity: 0, fade: 0 }).current

  const { scrollY, scrollYProgress } = useViewportScroll()

  const { invalidate, size, gl, scene: globalScene, camera } = useThree()
  const { requestRender } = useScrollRig()
  const pixelRatio = useThree(s => s.viewport.dpr)

  const localScene = useRef()

  const checkVisibility = val => {
    state.fade = MathUtils.clamp(MathUtils.mapLinear(val, 0.7, 1.0, 1.0, 0.5), 0, 1)
  }

  useEffect(() => scrollYProgress.onChange(checkVisibility), [])

  useEffect(() => {
    state.fade = showBubbles
    if (showBubbles) {
      localScene.current.visible = true
      invalidate()
    } else {
      // reset
      localScene.current.visible = false
      localScene.current.position.y = -400
      localScene.current.children.map(child => {
        child.material.uniforms.u_time.value = 0
        child.material.fade = 0
      })
    }
  }, [showBubbles])

  useFrame(() => {
    if (!showBubbles) return
    // render background to texture before global render pass
    gl.autoClear = false
    camera.layers.set(0)
    gl.setRenderTarget(fbo)
    gl.clearColor()
    gl.render(globalScene, camera)
    gl.clearDepth()
    gl.setRenderTarget(null)
  }, 10)

  useFrame((_, delta) => {
    if (!showBubbles) return
    const y = scrollY.get()
    // emulate same value range as scrollY.getVelocity() since it sometimes stops working
    state.scrollVelocity = (y - state.lastY) * 100 * 0.6 // scrollY.getVelocity()
    state.lastY = y
    const noiseVelocity = Math.min(0.05, Math.abs(state.scrollVelocity * 0.0001))
    state.noiseVelocity = lerp(state.noiseVelocity, noiseVelocity, 0.01, delta)

    // // parallax scroll velocity (with direction)
    let moveVelocity = MathUtils.clamp(state.scrollVelocity * 0.00001, -0.01, 0.01)
    moveVelocity = Math.abs(moveVelocity) < 0.0001 ? 0.0001 : moveVelocity
    state.moveVelocity = lerp(state.moveVelocity, moveVelocity, 0.01, delta)

    localScene.current.children.forEach(child => {
      child.material.uniforms.u_time.value += delta * SPEED + state.noiseVelocity
      child.material.fade = lerp(child.material.fade, state.fade, 0.05, delta)
      child.material.scroll += state.moveVelocity
    })

    localScene.current.position.y = lerp(localScene.current.position.y, 0, 0.05, delta)

    // NOTE: CANVAS TEXTURE - slow in SAFARI - try if instancedMesh caused it?
    // NOTE: INSTANCED MESH with refraction - causes video glitch in Chrome :(

    // Request global render to screen
    requestRender([0, 1])

    invalidate()
  })

  const fbo = useFBO({
    multisample: true, // if the renderer supports webGL2, it will return a WebGLMultisampleRenderTarget
    encoding: sRGBEncoding,
  })

  return (
    <group ref={localScene} renderOrder={config.ORDER_LAB_FG_BUBBLES}>
      <mesh layers={1} position={[0, 0, 0]} rotation={[Math.PI * 0.5, 0, 0]} scale={[1, 1, 1]} visible="false">
        <sphereBufferGeometry attach="geometry" args={[90, 128, 128, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <refractionMaterial
          attach="material"
          map={assets.bigBubbleTexture}
          envMap={fbo.texture}
          resolution={[size.width * pixelRatio, size.height * pixelRatio]}
          index={0}
          startOffset={0.44}
          speed={1.5}
          fade={0}
          frequency={1}
        />
      </mesh>
      <mesh layers={1} position={[-size.width * 0.3, 0, 0]} rotation={[Math.PI * 0.5, 0, 0]}>
        <sphereBufferGeometry attach="geometry" args={[60, 128, 128, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <refractionMaterial
          attach="material"
          map={assets.bigBubbleTexture}
          envMap={fbo.texture}
          resolution={[size.width * pixelRatio, size.height * pixelRatio]}
          index={2}
          startOffset={3}
          speed={2}
          fade={0}
          frequency={1}
        />
      </mesh>
      <mesh layers={1} position={[size.width * 0.3, 0, 0]} rotation={[Math.PI * 0.5, 0, 0]}>
        <sphereBufferGeometry attach="geometry" args={[70, 128, 128, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <refractionMaterial
          attach="material"
          map={assets.bigBubbleTexture}
          envMap={fbo.texture}
          resolution={[size.width * pixelRatio, size.height * pixelRatio]}
          index={3}
          startOffset={0}
          speed={1}
          fade={0}
          frequency={1}
        />
      </mesh>
    </group>
  )
}

export default BubblesMesh
