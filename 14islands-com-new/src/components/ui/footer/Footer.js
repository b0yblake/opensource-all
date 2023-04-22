import React from 'react'
import PropTypes from 'prop-types'
import { graphql, useStaticQuery } from 'gatsby'
import { useMergePrismicPreviewData } from 'gatsby-plugin-prismic-previews'
import classNames from 'classnames/bind'
import { RichText } from 'prismic'

import useUIContext from 'context/ui'
import Container from 'components/ui/layout/Container'
import ViewportEnterEffect from 'components/motion/viewport-enter-effect'
import DrawingCTA from 'components/ui/drawing-cta/'

import * as s from './Footer.module.css'
const cn = classNames.bind(s)

const PAINT_MODE_PROP = {
  paintMode: PropTypes.oneOf(['none', 'pencil', 'spray']),
}

const query = graphql`
  query FooterQuery {
    prismicSiteSettings(uid: { eq: "site-settings" }, lang: { eq: "en-us" }) {
      _previewable
      data {
        sections: footer_sections {
          title: footer_section_title
          content: footer_section_content {
            richText
          }
        }
        drawing_mode
        drawing_title {
          richText
          text
        }
        drawing_description {
          richText
        }
      }
    }
  }
`

const ConditionalDrawing = ({ paintMode, children, renderDrawingWrapper, ...props }) => {
  if (!renderDrawingWrapper) return children
  return (
    <DrawingCTA paintMode={paintMode} {...props}>
      {children}
    </DrawingCTA>
  )
}

ConditionalDrawing.propTypes = {
  renderDrawingWrapper: PropTypes.bool,
  ...PAINT_MODE_PROP,
}

const DefaultSeparator = <div className={cn('separator')} />

const FooterContent = ({ paintMode, separator = DefaultSeparator, renderDrawingWrapper, ...props }) => {
  const staticData = useStaticQuery(query)
  const { data: prismicData } = useMergePrismicPreviewData(staticData)
  const data = prismicData?.prismicSiteSettings?.data || {}
  const isScrollRigEnabled = useUIContext(s => s.isScrollRigEnabled)

  return (
    <>
      <Container>{separator}</Container>
      <ConditionalDrawing
        paintMode={isScrollRigEnabled ? paintMode : 'none'}
        data={data}
        renderDrawingWrapper={renderDrawingWrapper}
      >
        <Container>
          <div className={cn('main')}>
            {data.sections?.map(x => (
              <ViewportEnterEffect threshold={0.4} disabled={isScrollRigEnabled} effect="drawLineMobile" key={x.title}>
                <div className={cn('section')} key={x.title}>
                  <div className={cn('title')}>{x.title}</div>
                  <div className={cn('content')}>{RichText.render(x.content?.richText)}</div>
                </div>
              </ViewportEnterEffect>
            ))}
          </div>
        </Container>
      </ConditionalDrawing>
    </>
  )
}

FooterContent.propTypes = {
  separator: PropTypes.node,
  renderDrawingWrapper: PropTypes.bool,
  ...PAINT_MODE_PROP,
}

// - VirtualScrollbar gets confused when FooterContent unmounts/re-mounts to show preview data
const Footer = ({ className, ...props }) => (
  <footer className={cn('footer', className)}>
    <FooterContent {...props} />
  </footer>
)

Footer.propTypes = {
  ...PAINT_MODE_PROP,
  renderDrawingWrapper: PropTypes.bool,
}

Footer.defaultProps = {
  paintMode: 'pencil',
  renderDrawingWrapper: true,
}

export default Footer
