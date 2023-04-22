import { memo, useLayoutEffect } from 'react'
import { useWindowSize } from '@react-hook/window-size'
import create from 'zustand'

// This is the source of truth - a non-reactive object
const cursor = {
  pixels: { x: 0, y: 0, viewX: 0, viewY: 0 },
  unit: { x: 0, y: 0, viewX: 0, viewY: 0 },
}

function calcViewCoordinate(x, view) {
  return ((x / view) * 2 - 1) * view * 0.5
}

// Create a store for the cursor position
// This is a copy of the non-reactive object to provide mousemove events for api listeners
const cursorApi = create(set => ({
  pixels: cursor.pixels,
  unit: cursor.unit,
}))

// return a non-reactive object with pixel cursor positions
function usePixelCursorRef() {
  return cursor.pixels
}

// return a non-reactive object with unit cursor positions
function useUnitCursorRef() {
  return cursor.unit
}

const CursorTracker = () => {
  const [width, height] = useWindowSize()

  const onMouseMove = e => {
    // 0 to width
    cursor.pixels.x = e.clientX
    cursor.pixels.y = e.clientY

    // -width*0.5 to width*0.5
    cursor.pixels.viewX = calcViewCoordinate(cursor.pixels.x, width)
    cursor.pixels.viewY = -calcViewCoordinate(cursor.pixels.y, height)

    // 0 to 1
    cursor.unit.x = cursor.pixels.x / width
    cursor.unit.y = cursor.pixels.y / height

    // -1 to 1 (flipped for shader by default)
    cursor.unit.viewX = cursor.unit.x * 2 - 1
    cursor.unit.viewY = -cursor.unit.y * 2 + 1

    // update state to notify listeners
    cursorApi.setState({ pixelCursor: cursor.pixels, unitCursor: cursor.unit })
  }

  useLayoutEffect(() => {
    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [width, height])

  return null
}

export { cursorApi, useUnitCursorRef, usePixelCursorRef, calcViewCoordinate }
export default memo(CursorTracker)
