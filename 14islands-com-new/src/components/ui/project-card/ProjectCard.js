import React, { useRef, forwardRef } from 'react'
import PropTypes from 'prop-types'
import TransitionLink, { TransitionState } from 'gatsby-plugin-transition-link'
import classNames from 'classnames/bind'

import shouldNavigate from 'lib/shouldNavigate'
import { useScrollRig } from '@14islands/r3f-scroll-rig'

import requestIdleCallback from 'lib/requestIdleCallback'
import useUIContext from 'context/ui'
import ImageBlob from 'components/ui/image-blob'
import { Grid } from 'components/ui/layout'
import ViewportEnterEffect from 'components/motion/viewport-enter-effect'

import * as s from './ProjectCard.module.css'

const cn = classNames.bind(s)

export const ProjectsContainer = ({ className, ...props }) => (
  <Grid className={cn('ProjectsContainer', className)} {...props} />
)

const nodeShape = PropTypes.shape({
  uid: PropTypes.string,
  title: PropTypes.object, // title.text
  description: PropTypes.object, // description.text
  blob_color: PropTypes.string,
  blob_dark_mode: PropTypes.bool,
  background_color: PropTypes.string,
  image: PropTypes.shape({
    url: PropTypes.string,
    dimensions: PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number,
    }),
  }),
  tags: PropTypes.array,
  document: PropTypes.any,
})

const ProjectLink = ({ children, color, ...props }) => {
  const setHideHeader = useUIContext(s => s.setHideHeader)
  const { isCanvasAvailable } = useScrollRig()

  return (
    <TransitionLink
      exit={{
        delay: isCanvasAvailable ? 1 : 0, // out animation length before unmount
        length: 0,
      }}
      entry={{
        delay: 0.1, // allow canvas components to unmount first
        trigger: () => {
          requestIdleCallback(() => {
            setHideHeader(false)
          })
        },
      }}
      state={{ color }}
      {...props}
    >
      {children}
    </TransitionLink>
  )
}

ProjectLink.propTypes = {
  color: PropTypes.string,
}

const TextContent = forwardRef(({ node, to, className, size, ...props }, ref) => {
  const underlinedRef = useRef()
  const setHoveredLink = useUIContext(s => s.setHoveredLink)
  const startPageTransition = useUIContext(state => state.startPageTransition)
  const setHideHeader = useUIContext(s => s.setHideHeader)
  const isScrollRigEnabled = useUIContext(s => s.isScrollRigEnabled)

  return (
    <TransitionState>
      {({ transitionStatus }) => (
        <div className={cn('TextContent', className, { [size]: true, [transitionStatus]: true })} ref={ref} {...props}>
          <div className={cn('tags')}>{node?.tags?.map(({ tag }) => tag).join(', ')}</div>
          <ViewportEnterEffect threshold={0} disabled={isScrollRigEnabled} effect="drawLineMobile">
            <h4 className={cn('title', { [size]: true })}>
              <ProjectLink
                to={to}
                color={node.blob_color}
                onMouseEnter={() => setHoveredLink(underlinedRef.current)}
                onMouseLeave={() => setHoveredLink(null)}
                onClick={e => {
                  if (!shouldNavigate(e)) return
                  startPageTransition({ color: node.blob_color, slow: true })
                  setHideHeader(true)
                }}
                className={cn('projectLink')}
              >
                <span className={cn('underline')} ref={underlinedRef}>
                  {node.title.text}
                </span>
              </ProjectLink>
              <span> — </span>
              <span>{node.description.text}</span>
            </h4>
          </ViewportEnterEffect>
        </div>
      )}
    </TransitionState>
  )
})

TextContent.displayName = 'TextContent'
TextContent.propTypes = {
  node: nodeShape,
  to: PropTypes.string,
  size: PropTypes.oneOf(['full', 'half']),
}

const ProjectCard = ({ node, to, offset, size = 'half', cursorText, hasText = true, className, index }) => {
  const startPageTransition = useUIContext(state => state.startPageTransition)
  const setHideHeader = useUIContext(s => s.setHideHeader)

  const data = node?.document?.data
  if (!data) return null

  const imageCrop = size === 'full' ? 'large_image' : 'image'
  let prismicImage = data[imageCrop] || data.thumbnail

  // always pick small thumbnail from "half" image (Aline wanted to be able to use a different image for this crop)
  if (data['image']?.small) {
    prismicImage = { ...prismicImage, small: data['image']?.small }
  }

  if (!prismicImage) return null

  return (
    <div className={cn('ProjectCard', className, { [size]: true })}>
      <ProjectLink
        to={to}
        color={data.blob_color}
        onClick={e => {
          if (!shouldNavigate(e)) return
          startPageTransition({ color: data.blob_color, slow: true })
          setHideHeader(true)
        }}
      >
        <ImageBlob
          prismicImage={prismicImage}
          color={data.blob_color}
          darkMode={data.hero_dark_mode}
          cursorText={cursorText}
          offset={offset}
          index={index}
          debugTitle={data.title.text}
          className={cn('ImageBlob', { [size]: true })}
        />
      </ProjectLink>

      {hasText && <TextContent node={data} to={to} size={size} />}
    </div>
  )
}

ProjectCard.propTypes = {
  size: PropTypes.oneOf(['full', 'half']),
  offset: PropTypes.number,
  imageCrop: PropTypes.string,
  cursorText: PropTypes.string,
  hasText: PropTypes.bool,
  node: nodeShape,
  to: PropTypes.string,
  index: PropTypes.number,
}

export default ProjectCard
