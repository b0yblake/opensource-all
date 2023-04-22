import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { MathUtils } from 'three'
import { useThree, useFrame } from '@react-three/fiber'
import lerp from '@14islands/lerp'

import useUIContext from 'context/ui'

import { useViewportScroll } from 'framer-motion'
import { useCanvas, useScrollRig } from '@14islands/r3f-scroll-rig'

import config from 'config'

import './RefractionMaterial'

const SPEED = 0.5

export const BackgroundBubblesMesh = ({ hover }) => {
  const assets = useUIContext(state => state.assets)
  const visible = useUIContext(state => state.showBackgroundBubbles)

  const { scrollY } = useViewportScroll()

  const { invalidate, size } = useThree()
  const { requestRender } = useScrollRig()
  const pixelRatio = useThree(s => s.viewport.dpr)

  const localScene = useRef()
  const group = useRef()
  // const hint = useRef()
  const target = useRef({
    lastY: 0,
    scrollVelocity: 0,
    moveVelocity: 0,
    velocity: 0,
    // hint: { x: size.width * 0.5 + 100, y: -200 },
    group: { y: 0, fade: 0 },
  }).current

  useEffect(() => {
    // hint.current.position.x = target.hint.x
    group.current.position.y = 0
  }, [])

  useEffect(() => {
    group.current.visible = visible
    if (visible) {
      group.current.position.y = target.group.y
      // target.hint.y = 200
      target.group.y = 0
      target.group.fade = 0.4 // 0.2 // - Math.random() * 0.1
    } else {
      target.group.y = -200
      target.group.fade = 0
      group.current.position.y = 0
      group.current.children.map(child => {
        child.material.uniforms.u_time.value = 0
        child.material.fade = 0
      })
    }
    invalidate()
  }, [visible])

  // useEffect(() => {
  //   hint.current.visible = hover
  //   if (hover) {
  //     target.hint.x = size.width / 2 + 0
  //   } else {
  //     target.hint.x = size.width / 2 + 200
  //   }
  // }, [hover])

  useFrame((_, delta) => {
    if (!visible) return

    const y = scrollY.get()
    // emulate same value range as scrollY.getVelocity() since it sometimes stops working
    target.scrollVelocity = (y - target.lastY) * 100 * 0.6 // scrollY.getVelocity()
    target.lastY = y

    const vel = MathUtils.clamp(target.scrollVelocity * 0.00001, -0.01, 0.01)
    target.moveVelocity = lerp(target.moveVelocity, vel, 0.01, delta)

    group.current.children.map(child => {
      child.material.time += delta * SPEED
      child.material.fade = lerp(child.material.fade, target.group.fade, 0.1, delta)
      child.material.scroll += target.moveVelocity
    })
    group.current.position.y = lerp(group.current.position.y, target.group.y, 0.01, delta)

    // hint.current.material.fade = lerp(hint.current.material.fade, 1, 0.1, delta)
    // hint.current.material.uniforms.u_time.value += 0.01 * SPEED
    // hint.current.position.x = lerp(hint.current.position.x, target.hint.x, 0.02, delta)
    // hint.current.position.y = lerp(hint.current.position.y, target.hint.y, 0.01, delta)

    requestRender()
    if (visible) invalidate()
  })

  return (
    <group ref={localScene} renderOrder={config.ORDER_LAB_BG_BUBBLES}>
      {/* <instancedMesh
        ref={model}
        layers={1}
        args={[null, null, 2]}
        position={[0, 0, 0]}
        rotation={[Math.PI * 0.5, 0, 0]}
      >
        <sphereBufferGeometry attach="geometry" args={[100, 64, 64, 0, Math.PI * 2, 0, Math.PI * 0.4]} />
        <meshNormalMaterial attach="material" />
        // Instanced refraction material causes VideoTexture to freak out.
        // just adding one more normal mesh to this scene seems to fix it.. weird
        <refractionMaterial
          attach="material"
          resolution={[size.width * pixelRatio, size.height * pixelRatio]}
          index={0}
        />
      </instancedMesh> */}
      <group ref={group}>
        {/* <mesh position={[0, -300, 0]} rotation={[Math.PI * 0.5, 0, 0]} scale={[1, 1, 1]} visible="false">
          <sphereBufferGeometry attach="geometry" args={[100, 128, 128, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <refractionMaterial
            attach="material"
            resolution={[size.width * pixelRatio, size.height * pixelRatio]}
            index={0}
            fade={0}
          />
        </mesh> */}
        <mesh position={[-size.width * 0.2, 0, 0]} rotation={[Math.PI * 0.5, 0, 0]}>
          <sphereBufferGeometry attach="geometry" args={[20, 128, 128, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <refractionMaterial
            attach="material"
            map={assets.smallBubbleTexture}
            resolution={[size.width * pixelRatio, size.height * pixelRatio]}
            index={1}
            startOffset={0.7}
            speed={0.7}
            fade={0}
            frequency={2.4}
            textureOpacity={1.0}
            edgeSize={2}
          />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[Math.PI * 0.5, 0, 0]}>
          <sphereBufferGeometry attach="geometry" args={[15, 128, 128, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <refractionMaterial
            attach="material"
            map={assets.smallBubbleTexture}
            resolution={[size.width * pixelRatio, size.height * pixelRatio]}
            index={1}
            startOffset={0.2}
            speed={0.5}
            fade={0}
            frequency={2.5}
            textureOpacity={1.0}
            edgeSize={2}
          />
        </mesh>
        <mesh position={[size.width * 0.2, 0, 0]} rotation={[Math.PI * 0.5, 0, 0]}>
          <sphereBufferGeometry attach="geometry" args={[25, 128, 128, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <refractionMaterial
            attach="material"
            map={assets.smallBubbleTexture}
            resolution={[size.width * pixelRatio, size.height * pixelRatio]}
            index={1}
            startOffset={0.4}
            speed={0.6}
            fade={0}
            frequency={2.6}
            textureOpacity={1.0}
            edgeSize={2}
          />
        </mesh>
      </group>
      {/* <mesh ref={hint} rotation={[Math.PI * 0.5, 0, 0]}>
        <sphereBufferGeometry attach="geometry" args={[100, 128, 128, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <refractionMaterial
          attach="material"
          resolution={[size.width * pixelRatio, size.height * pixelRatio]}
          index={3}
          fade={0}
        />
      </mesh> */}
    </group>
  )
}

BackgroundBubblesMesh.propTypes = {
  visible: PropTypes.bool,
  hover: PropTypes.bool,
}

const BackgroundBubbles = () => {
  useCanvas(<BackgroundBubblesMesh />)
  return null
}

export default BackgroundBubbles
