import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'

import useUIContext from 'context/ui'

import InlineWebGLShowreel from './InlineWebGLShowreel'
import InlineHTML5Showreel from './InlineHTML5Showreel'

import * as s from './HomeHero.module.css'
const cn = classNames.bind(s)

const HomeHero = ({ showreelLoop, showreelLoopMobile, showreelFull, showreelFullMobile }) => {
  const isScrollRigEnabled = useUIContext(s => s.isScrollRigEnabled)
  const isMobile = useUIContext(s => s.isMobile)

  const hasInlineVideoPlayer = !isMobile

  const renderInlineVideoPlayer = () => {
    return (
      <>
        {isScrollRigEnabled && <InlineWebGLShowreel showreelLoop={showreelLoop} showreelFull={showreelFull} />}
        {!isScrollRigEnabled && (
          <InlineHTML5Showreel
            showreelLoop={showreelLoop}
            showreelFull={showreelFull}
            showreelLoopMobile={showreelLoopMobile}
            showreelFullMobile={showreelFullMobile}
          />
        )}
      </>
    )
  }

  // wrapper must be rendered from the start to preserve aspect ratio - hidden with CSS if mobile
  return (
    <div className={cn(s.hero, { hasInlineVideoPlayer })} style={{ '--aspect-ratio': 16 / 9 }}>
      {hasInlineVideoPlayer && renderInlineVideoPlayer()}
      <noscript>
        <InlineHTML5Showreel
          showreelLoop={showreelLoop}
          showreelFull={showreelFull}
          showreelLoopMobile={showreelLoopMobile}
          showreelFullMobile={showreelFullMobile}
        />
      </noscript>
    </div>
  )
}

HomeHero.propTypes = {
  showreelLoop: PropTypes.shape({ mp4: PropTypes.object, webm: PropTypes.object }),
  showreelLoopMobile: PropTypes.shape({ mp4: PropTypes.object, webm: PropTypes.object }),
  showreelFull: PropTypes.shape({ mp4: PropTypes.object, webm: PropTypes.object }),
  showreelFullMobile: PropTypes.shape({ mp4: PropTypes.object, webm: PropTypes.object }),
}

export default HomeHero
