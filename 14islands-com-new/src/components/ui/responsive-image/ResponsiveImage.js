import React, { forwardRef, useRef, memo } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'
import useUIContext from 'context/ui'
import md5 from 'md5'
import Helmet from 'react-helmet'

import ViewportEnterEffect from 'components/motion/viewport-enter-effect'

import envVars from 'styles/config/env-vars.json'

import * as s from './ResponsiveImage.module.css'
const cn = classNames.bind(s)

/**
 *  More like "ArtDirectedPrismicImage"
 *  - parameter assumes Prismic image object shape
 *  - use this only if you need to switch image due to art direction. AND if you want to make sure it always switches.
 *    (srcset will keep a large image if it loaded first, even if resizing to a smaller window later)
 *
 *
 *  Prismic image object needs this shape (in order of size):
 *
 *  {
 *     // "mobile" size
 *    small {
 *      url,
 *      dimensions,
 *    }
 *
 *    // "tablet" size
 *    medium {
 *      url,
 *      dimensions,
 *    }
 *
 *    // "desktop" size
 *    url,
 *    dimensions,
 *
 *    // "large" size
 *    small {
 *      url,
 *      dimensions,
 *    }
 *  }
 *
 */

const ResponsiveImage = forwardRef(({ image }, ref) => {
  const largeMedia = `(min-width: ${envVars['environment-variables']['--large-breakpoint']})`
  const mediumMedia = `(max-width: ${envVars['environment-variables']['--desktop-breakpoint']})`
  const smallMedia = `(max-width: ${envVars['environment-variables']['--tablet-breakpoint']})`

  const isScrollRigEnabled = useUIContext(s => s.isScrollRigEnabled)

  const { small, medium, large } = { ...image?.thumbnails }
  const hash = useRef(md5(small?.url || '', medium?.url || '', image?.url)).current

  return (
    <ViewportEnterEffect threshold={0.4} disabled={isScrollRigEnabled} effect="zoomOutImgMobile">
      <div className={cn('ResponsiveImage', 'tag' + hash)}>
        <Helmet>
          <style type="text/css">
            {`
            [class~="${s.ResponsiveImage}"].tag${hash}{
              --aspect: ${(image.dimensions?.height / image.dimensions?.width) * 100}%;
            }
            ${
              medium
                ? `
              @media ${mediumMedia} {
                [class~="${s.ResponsiveImage}"].tag${hash}{
                  --aspect: ${(medium?.dimensions?.height / medium?.dimensions?.width) * 100}%;
                }
              }
            `
                : ''
            }
            ${
              small
                ? `
              @media ${smallMedia} {
                [class~="${s.ResponsiveImage}"].tag${hash}{
                  --aspect: ${(small?.dimensions?.height / small?.dimensions?.width) * 100}%;
                }
              }
            `
                : ''
            }
            ${
              large
                ? `
              @media ${largeMedia} {
                [class~="${s.ResponsiveImage}"].tag${hash}{
                  --aspect: ${(large?.dimensions?.height / large?.dimensions?.width) * 100}%;
                }
              }
              `
                : ''
            }`}
          </style>
        </Helmet>
        <picture>
          {small && <source media={smallMedia} srcSet={small.url} />}
          {medium && <source media={mediumMedia} srcSet={medium.url} />}
          {large && <source media={largeMedia} srcSet={large.url} />}
          {/* default desktop image  */}
          <img src={image.url} alt={image.alt || 'placeholder'} ref={ref} style={{ height: '100%', width: '100%' }} />
        </picture>
      </div>
    </ViewportEnterEffect>
  )
})

ResponsiveImage.displayName = 'ResponsiveImage'

ResponsiveImage.propTypes = {
  image: PropTypes.object.isRequired,
}

export default memo(ResponsiveImage)
