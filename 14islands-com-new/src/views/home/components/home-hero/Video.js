import React, { forwardRef, useRef } from 'react'
import PropTypes from 'prop-types'

import replaceQuote from 'lib/replaceQuote'
import AspectRatio from 'components/ui/aspect-ratio'

const normalStyle = `style="display: block; width: 100%;"`
const invisibleStyle = `style="display: block; position: absolute; opacity: 0; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; pointer-events: none;"`

const ConditionalAspectRatio = ({ ratio, children }) => {
  if (!isFinite(ratio)) return children
  return <AspectRatio ratio={ratio}>{children}</AspectRatio>
}

ConditionalAspectRatio.propTypes = {
  ratio: PropTypes.number,
}

/**
 * Renders a <video> tag using dangerouslySetInnerHTML to make sure `muted` attribute is respected.
 * Optional parameter to make element hidden using styles that don't affect playback on iOS (tested on iOS13)
 */
const Video = forwardRef(
  (
    {
      webm,
      mp4,
      webmMobile,
      mp4Mobile,
      invisible,
      poster,
      playsinline = true,
      muted = true,
      autoplay = true,
      loop = true,
      preload = 'auto',
      controls = false,
      ratio,
      title,
      ...props
    },
    outerRef,
  ) => {
    const innerRef = useRef()
    const ref = outerRef || innerRef
    return (
      <ConditionalAspectRatio ratio={ratio}>
        <div
          ref={r => r && (ref.current = r.children[0])}
          {...props}
          dangerouslySetInnerHTML={{
            __html: `
          <video
            ${loop ? 'loop' : ''}
            ${muted ? 'muted' : ''}
            ${autoplay ? 'autoplay' : ''}
            ${controls ? 'controls' : ''}
            ${playsinline ? 'playsinline' : ''}
            crossOrigin="anonymous"
            ${preload ? `preload="${preload}"` : ''}
            ${invisible ? invisibleStyle : normalStyle}
            ${poster ? `poster=${poster}` : ''}
            ${title ? `title="${replaceQuote(title)}"` : ''}
          >
            ${
              webmMobile
                ? `<source src="${webmMobile}#t=0.0" type='video/webm;codecs="vp8, vorbis"' media="all and (max-width: 850px)" />`
                : ''
            }
            ${
              mp4Mobile ? `<source src="${mp4Mobile}#t=0.0" type="video/mp4" media="all and (max-width: 850px)" />` : ''
            }
            ${webm ? `<source src="${webm}#t=0.0" type="video/webm; codecs=vp9,vorbis" />` : ''}
            ${mp4 ? `<source src="${mp4}#t=0.0" type="video/mp4" />` : ''}
          </video>
        `,
          }}
        />
      </ConditionalAspectRatio>
    )
  },
)

Video.displayName = 'Video'

Video.propTypes = {
  webm: PropTypes.string,
  mp4: PropTypes.string,
  webmMobile: PropTypes.string,
  mp4Mobile: PropTypes.string,
  invisible: PropTypes.bool,
  playsinline: PropTypes.bool,
  muted: PropTypes.bool,
  autoplay: PropTypes.bool,
  loop: PropTypes.bool,
  preload: PropTypes.string,
  poster: PropTypes.string,
  ratio: PropTypes.number,
  controls: PropTypes.bool,
  title: PropTypes.string,
}
export default Video
