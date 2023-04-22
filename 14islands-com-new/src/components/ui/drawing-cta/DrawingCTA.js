import React, { useRef, useState, useEffect } from 'react'
import classNames from 'classnames/bind'
import PropTypes from 'prop-types'
import { useInterval } from 'react-use'
import { RichText } from 'prismic'

import useUIContext from 'context/ui'

import Container from 'components/ui/layout/Container'
import Cursor from 'components/ui/cursor'
import ViewportEnter from 'components/motion/viewport-enter'
import DrawingCTATitle from './DrawingCTATitle'

import Pencil from 'assets/svg/pencil.inline.svg'
import Spray from 'assets/svg/spray.inline.svg'

import * as s from './DrawingCTA.module.css'

const INITIAL_HUE = Math.random() * 360
const FRAME_STEP_CHANGE = 5
const COLOR_STEP_INCREASE = 2
const DEFAULT_LINE_WIDTH = 18

const midPointBtw = (p1, p2) => ({
  x: p1.x + (p2.x - p1.x) / 2,
  y: p1.y + (p2.y - p1.y) / 2,
})

const cn = classNames.bind(s)

const FADE_DELAY = 10000

const timeFilter = ({ time }) => time > Date.now() - FADE_DELAY
const timeFilterArray = arr => arr.filter(timeFilter)

const clearSelection = () => {
  if (typeof window !== 'object' || typeof document !== 'object') return
  if (window?.getSelection) return window.getSelection().removeAllRanges()
  if (document?.selection) return document.selection.empty()
}

const getIsElementSelected = element => {
  if (typeof window !== 'object' || !window?.getSelection) return false
  if (!window.getSelection().containsNode(element, true)) return false
  return !window.getSelection().isCollapsed
}

const DrawingCTA = ({ data, saturation, luminosity, children, ...props }) => {
  const wrapperRef = useRef()
  const canvasRef = useRef()
  const descriptionRef = useRef()
  const childrenRef = useRef()
  const isMouseDown = useRef(false)
  const ctx = useRef(null)
  const hueStep = useRef(INITIAL_HUE)
  const i = useRef(0)
  const lines = useRef([])
  const currentLine = useRef([])

  const paintMode = props.paintMode || data.drawing_mode

  const [mouseEntered, setMouseEntered] = useState(false)
  const [isSelected, setIsSelected] = useState(false)
  const [hasCustomCursor, setHasCustomCursor] = useState(false)
  const [isHoveringDescription, setIsHoveringDescription] = useState(false)
  const [isHoveringChildren, setIsHoveringChildren] = useState(false)
  const [mouseDownState, setMouseDownState] = useState(false)
  const [isInView, setVisiblity] = useState(false)

  const isScrollRigEnabled = useUIContext(s => s.isScrollRigEnabled)
  const isPageTransitionActive = useUIContext(state => state.isPageTransitionActive)
  const isLabTransitionRunning = useUIContext(state => state.isLabTransitionRunning)
  const setIsOverDrawingArea = useUIContext(s => s.setIsOverDrawingArea)

  useEffect(() => {
    if (wrapperRef.current.offsetHeight && canvasRef.current) {
      const scale = window.devicePixelRatio
      canvasRef.current.width = wrapperRef.current?.offsetWidth * scale
      canvasRef.current.height = wrapperRef.current?.offsetHeight * scale
      if (typeof ctx.current?.scale === 'function') {
        ctx.current.scale(scale, scale)
      }
    }
  }, [wrapperRef.current?.offsetWidth, wrapperRef.current?.offsetHeight])

  useEffect(() => {
    if (!canvasRef.current) return
    ctx.current = canvasRef.current.getContext('2d')
    /* eslint-disable no-unused-expressions */
    canvasRef.current.addEventListener('mousedown', onMouseDown)
    canvasRef.current.addEventListener('mouseup', onMouseUp)
    descriptionRef.current.addEventListener('mouseup', onMouseUp)
    childrenRef.current.addEventListener('mouseup', onMouseUp)
    document.addEventListener('selectionchange', onSelectionChange)
    return () => {
      document?.removeEventListener('selectionchange', onSelectionChange)
      descriptionRef?.current?.removeEventListener('mouseup', onMouseUp)
      descriptionRef?.current?.removeEventListener('mousemove', onMouseMove)
      childrenRef?.current?.removeEventListener('mouseup', onMouseUp)
      childrenRef?.current?.removeEventListener('mousemove', onMouseMove)
      if (!canvasRef?.current) return
      canvasRef.current.removeEventListener('mousedown', onMouseDown)
      canvasRef.current.removeEventListener('mouseup', onMouseUp)
      canvasRef.current.removeEventListener('mousemove', onMouseMove)
    }
    /* eslint-enable no-unused-expressions */
  }, [isScrollRigEnabled])

  const getPosition = ({ clientX, clientY, screenX, screenY }) => {
    const { left, top } = wrapperRef.current.getBoundingClientRect()
    const x = clientX - left
    const y = clientY - top
    const hue = hueStep.current
    const time = Date.now()
    return { x, y, hue, time }
  }

  const onMouseMove = event => {
    // cap the max amount of lines
    // todo: fade out the capped lines
    if (!isMouseDown.current) return
    currentLine.current = [...currentLine.current, getPosition(event)]
    draw(event)
  }

  const onMouseDown = event => {
    // eslint-disable-next-line no-unused-expressions
    event?.preventDefault()
    wrapperRef.current.addEventListener('mousemove', onMouseMove)
    descriptionRef.current.addEventListener('mousemove', onMouseMove)
    childrenRef.current.addEventListener('mousemove', onMouseMove)
    isMouseDown.current = true
    setMouseDownState(true)
    currentLine.current = [getPosition(event)]
    clearSelection()
    draw(event)
  }

  const onMouseUp = event => {
    // eslint-disable-next-line no-unused-expressions
    event?.preventDefault()
    wrapperRef.current.removeEventListener('mousemove', onMouseMove)
    descriptionRef.current.removeEventListener('mousemove', onMouseMove)
    childrenRef.current.removeEventListener('mousemove', onMouseMove)
    isMouseDown.current = false
    setMouseDownState(false)
    lines.current = [...lines.current, currentLine.current]
    currentLine.current = []
  }

  const setColor = () => {
    i.current += 1
    if (i.current % FRAME_STEP_CHANGE === 0) {
      hueStep.current = (hueStep.current + COLOR_STEP_INCREASE) % 360
    }
  }

  const drawLine = () =>
    [...lines.current, currentLine.current].forEach((line, i) => {
      const length = line?.length
      if (!length) return
      line.forEach((point, j) => {
        ctx.current.strokeStyle = `hsl(${point.hue} ,${saturation}%, ${luminosity}%)`
        ctx.current.beginPath()

        if (j === 0) {
          // draw first point with a simple line
          ctx.current.moveTo(point.x, point.y)
          ctx.current.lineTo(point.x, point.y)
        }

        if (j > 0) {
          // other lines are drawn with quadratic curve + line to fill gaps
          const past = line[j - 1]
          const mid = midPointBtw(past, point)
          ctx.current.quadraticCurveTo(past.x, past.y, mid.x, mid.y)
          ctx.current.quadraticCurveTo(mid.x, mid.y, point.x, point.y)
        }

        ctx.current.stroke()
        ctx.current.closePath()
      })
    })

  const draw = () => {
    if (!canvasRef.current || !ctx.current) return // preventing JS errors
    ctx.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    setColor()
    ctx.current.lineCap = 'round'
    ctx.current.lineJoin = 'round'
    ctx.current.lineWidth = DEFAULT_LINE_WIDTH
    drawLine()
  }

  const getHasCustomCursor = () => {
    if (!mouseEntered) return false
    if (mouseDownState && !isSelected) return true
    if (!isHoveringDescription && !isHoveringChildren && !isSelected) return true
    return false
  }

  useEffect(() => {
    setHasCustomCursor(getHasCustomCursor())
  }, [mouseEntered, mouseDownState, isHoveringDescription, isHoveringChildren, isSelected])

  const onDescriptionEnter = () => setIsHoveringDescription(true)
  const onDescriptionLeave = () => setIsHoveringDescription(false)

  const onChildrenEnter = () => setIsHoveringChildren(true)
  const onChildrenLeave = () => setIsHoveringChildren(false)

  const onWrapperEnter = () => {
    setIsOverDrawingArea(true)
    setMouseEntered(true)
  }

  const onWrapperLeave = () => {
    setIsOverDrawingArea(false)
    setMouseEntered(false)
    onMouseUp()
  }

  const onSelectionChange = () => {
    setIsSelected(getIsElementSelected(wrapperRef.current))
  }

  const filterLinesByTime = () => {
    lines.current = lines.current.map(timeFilterArray).filter(x => x.length)
    currentLine.current = timeFilterArray(currentLine.current)
    draw()
  }

  useInterval(() => {
    if (!lines.current?.length || lines.current?.[0]?.[0]?.time > Date.now() - FADE_DELAY) return
    window.requestAnimationFrame(filterLinesByTime)
  }, 24)

  // reset isOverDrawingArea on page transitions - default-triggered, labCTA-triggered
  useEffect(() => {
    if (isPageTransitionActive || isLabTransitionRunning) setIsOverDrawingArea(false)
  }, [isPageTransitionActive, isLabTransitionRunning])

  return (
    <div
      ref={wrapperRef}
      onMouseEnter={onWrapperEnter}
      onMouseLeave={onWrapperLeave}
      className={cn('wrapper', { hasCustomCursor, isScrollRigEnabled })}
    >
      {paintMode !== 'none' && <canvas ref={canvasRef} className={cn('drawing')} />}
      <ViewportEnter
        onEnter={() => {
          setVisiblity(true)
        }}
        once={true}
      >
        <div className={cn('above', { inView: isInView })}>
          <Container>
            <DrawingCTATitle title={data.drawing_title.text} />
            <div
              className={cn('ctaDescription', { isDrawing: mouseDownState })}
              onMouseEnter={onDescriptionEnter}
              onMouseLeave={onDescriptionLeave}
              ref={descriptionRef}
            >
              <div>{RichText.render(data.drawing_description?.richText)}</div>
            </div>
          </Container>
        </div>
      </ViewportEnter>
      <div
        className={cn('children', { isDrawing: mouseDownState })}
        onMouseEnter={onChildrenEnter}
        onMouseLeave={onChildrenLeave}
        ref={childrenRef}
      >
        {children}
      </div>
      {paintMode === 'spray' && <Cursor offsetY={30} offsetX={15} isEnabled={hasCustomCursor} icon={<Spray />} />}
      {paintMode === 'pencil' && <Cursor offsetY={-15} offsetX={15} isEnabled={hasCustomCursor} icon={<Pencil />} />}
    </div>
  )
}

DrawingCTA.propTypes = {
  paintMode: PropTypes.oneOf(['none', 'pencil', 'spray']),
  saturation: PropTypes.number,
  luminosity: PropTypes.number,
}

DrawingCTA.defaultProps = {
  saturation: 75,
  luminosity: 50,
}

export default DrawingCTA
