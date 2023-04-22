import React, { useRef, useEffect, memo } from 'react'
import { MathUtils } from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { useSpring, useViewportScroll } from 'framer-motion'
import PropTypes from 'prop-types'
import lerp from '@14islands/lerp'

import useUIContext from 'context/ui'

import { useImgTagAsTexture, useScrollRig, ScrollScene } from '@14islands/r3f-scroll-rig'
import { usePixelCursorRef, useUnitCursorRef, calcViewCoordinate, cursorApi } from 'components/ui/cursor-tracker'

import './ImageBlobMaterial'

const SPEED = 1.0 // idle blob speed

const ImageBlobMesh = ({
  scene,
  image,
  color,
  el,
  scale,
  state: { bounds },
  index = 0,
  offset = 0,
  hasBlob = true,
  hasHoverEffects = true,
  // setShowCursor = () => {},
}) => {
  const mesh = useRef()
  const material = useRef()

  const { scrollY } = useViewportScroll()
  const { size, camera, invalidate } = useThree()
  const { preloadScene } = useScrollRig()
  const pixelRatio = useThree(s => s.viewport.dpr)

  const isNativeCursorHidden = useUIContext(state => state.isNativeCursorHidden)
  const isPageTransitionActive = useUIContext(state => state.isPageTransitionActive)

  const local = useRef({ blobEffect: 0 }).current

  const blobVisible = useSpring(hasBlob ? 1 : 0, { stiffness: 10, damping: 100, restDelta: 0.01, restSpeed: 0.01 })
  const edgeEffect = useSpring(0, { stiffness: 250, damping: 15, restDelta: 0.001, restSpeed: 0.001 })
  const imgZoom = useSpring(0, { stiffness: 10, damping: 20, restDelta: 0.001, restSpeed: 0.001 })
  const imgFadeInOnLoad = useSpring(0, { stiffness: 25, damping: 20, restDelta: 0.001, restSpeed: 0.001 })

  const mouseLocal = useRef({ x: 0, y: 0, isHovering: false, distance: 1, showBlob: false, hoverX: 0, hoverY: 0 })
    .current

  const [texture, disposeBitmap] = useImgTagAsTexture(image)

  const cursor = usePixelCursorRef()
  const unitCursor = useUnitCursorRef()

  const setMouseHover = e => {
    mouseLocal.hoverX = e ? calcViewCoordinate(e.clientX, size.width) : cursor.viewX
    mouseLocal.hoverY = e ? -calcViewCoordinate(e.clientY, size.height) : cursor.viewY
  }

  const mouseMove = () => {
    if (!bounds.inViewport || isPageTransitionActive) return

    // Mouse relative position over element ([-1, 1])
    mouseLocal.y = -((cursor.y - bounds.top + scrollY.get()) / bounds.height) * 2 + 1
    mouseLocal.x = ((cursor.x - bounds.left) / bounds.width) * 2 - 1

    // Distance from center of element
    const d = Math.pow(Math.sqrt(mouseLocal.x * mouseLocal.x + mouseLocal.y * mouseLocal.y), 2)
    mouseLocal.distance = MathUtils.clamp(d, 0.3, 1.0)
    mouseLocal.isHovering = mouseLocal.x > -1 && mouseLocal.x < 1 && mouseLocal.y > -1 && mouseLocal.y < 1

    if (mouseLocal.isHovering) {
      local.blobEffect = mouseLocal.distance
    }

    invalidate()
  }

  useEffect(() => {
    if (!hasBlob || !hasHoverEffects) return
    return cursorApi.subscribe(() => mouseMove())
  }, [hasBlob, hasHoverEffects, isPageTransitionActive])

  // invalidate render loop on spring changes
  useEffect(() => edgeEffect.onChange(invalidate), [])
  useEffect(() => blobVisible.onChange(invalidate), [])
  useEffect(() => imgFadeInOnLoad.onChange(invalidate), [])

  // Set loaded image as texture ap
  useEffect(() => {
    if (!texture || !material.current) return

    material.current.map = texture

    // Upload texture to GPU so it's resized ahead of time
    const timer = setTimeout(() => {
      preloadScene(scene, camera, null, () => {
        disposeBitmap()
        imgFadeInOnLoad.set(1)
      })
    }, index)

    return () => clearTimeout(timer)
  }, [texture])

  // Element hover color
  useEffect(() => {
    if (el && el.current) {
      material.current.colorHex = color
    }
    material.current.time = index * Math.PI * 0.3
  }, [el.current])

  // dimensions
  useEffect(() => {
    material.current.planeSize = { width: bounds.width, height: bounds.height }
    material.current.resolution = { width: size.width, height: size.height }
  }, [size, bounds.width, bounds.height])

  // HOVER effect
  useEffect(() => {
    if (isPageTransitionActive) return

    if (isNativeCursorHidden?.el === el) {
      local.blobEffect = mouseLocal.distance

      mouseLocal.showBlob = true
      hasHoverEffects && imgZoom.set(1)
      if (hasHoverEffects && Math.abs(edgeEffect.get()) < 0.9) {
        // store pos where hover happened
        setMouseHover(isNativeCursorHidden.event)

        edgeEffect.set(1, false)
        edgeEffect.set(0)
      }
    } else {
      if (mouseLocal.showBlob) {
        mouseLocal.showBlob = false
        hasHoverEffects && imgZoom.set(0)
        if (hasHoverEffects && Math.abs(edgeEffect.get()) < 0.2) {
          // store pos where hover happened
          setMouseHover()

          edgeEffect.set(0.5, false)
          edgeEffect.set(0)
        }
      }
      local.blobEffect = 0
    }

    invalidate()
  }, [isNativeCursorHidden])

  // TRANSITION effect
  useEffect(() => {
    if (!hasBlob) return

    if (isPageTransitionActive) {
      // hide blob (will be replace by TransitionBlob)
      blobVisible.set(0)
    } else {
      blobVisible.set(1)
    }
  }, [isPageTransitionActive])

  // Render loop
  useFrame((_, delta) => {
    if (!material.current) return
    material.current.inViewport = bounds.progress

    if (!bounds.inViewport) return
    material.current.time += delta * SPEED

    // transition in when image is visible in 20% of the viewport
    if (bounds.viewport > 0.14 && imgFadeInOnLoad.get() > 0) {
      material.current.transitionTime += delta * SPEED
    }

    material.current.edgeEffect = edgeEffect.get()
    material.current.blobEffect =
      lerp(material.current.blobEffect, local.blobEffect, local.blobEffect > 0 ? 0.09 : 0.2, delta) * blobVisible.get()

    material.current.imgZoom = imgZoom.get()
    material.current.imgOpacity = imgFadeInOnLoad.get()

    const mouseDelta =
      Math.abs(material.current.mouse.x - unitCursor.viewX) + Math.abs(material.current.mouse.y - unitCursor.viewY)

    material.current.mouse.x = lerp(material.current.mouse.x, unitCursor.viewX, 0.2, delta)
    material.current.mouse.y = lerp(material.current.mouse.y, unitCursor.viewY, 0.2, delta)

    // USE IF FULLSCREEN
    material.current.vmouse.x = mouseLocal.hoverX
    material.current.vmouse.y = mouseLocal.hoverY

    // const isTransitioningIn = material.current.transitionTime < Math.PI * 1.5
    const isTransitioningIn = material.current.transitionTime < 1
    if ((isNativeCursorHidden?.el || mouseDelta > 0.14 || isTransitioningIn) && !isPageTransitionActive) {
      invalidate()
    }
  })

  return (
    <mesh ref={mesh}>
      <planeBufferGeometry attach="geometry" args={[scale.width, scale.height, 128, 128]} />
      <imageBlobMaterial
        ref={material}
        attach="material"
        transparent
        pixelRatio={pixelRatio}
        transitionTime={offset * -14}
      />
    </mesh>
  )
}

ImageBlobMesh.propTypes = {
  ...ScrollScene.childPropTypes,
  image: PropTypes.any,
  index: PropTypes.number,
  setShowCursor: PropTypes.func,
}

export default memo(ImageBlobMesh)
