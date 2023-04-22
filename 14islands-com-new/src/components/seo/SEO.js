import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { graphql, useStaticQuery } from 'gatsby'
import { useMergePrismicPreviewData } from 'gatsby-plugin-prismic-previews'

const query = graphql`
  query SEO {
    prismicSiteSettings {
      _previewable
      data {
        site_meta_title
        site_meta_description
        site_meta_thumbnail {
          url
          dimensions {
            height
            width
          }
          alt
        }
      }
    }
  }
`
const SEO = ({ title, description, thumbnail, lang }) => {
  const staticData = useStaticQuery(query)
  const { data } = useMergePrismicPreviewData(staticData)
  const settings = data?.prismicSiteSettings?.data
  const metaTitle = `14islands | ${title || settings.site_meta_title}`
  const metaDescription = description || settings.site_meta_description
  const metaThumbnail = thumbnail || settings.site_meta_thumbnail

  const metaThumbnailUrl = metaThumbnail.gatsbyImageData
    ? metaThumbnail?.gatsbyImageData?.images?.fallback?.src
    : (metaThumbnail && metaThumbnail.url) || ''

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={metaTitle}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: metaTitle,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          property: `og:image`,
          content: metaThumbnailUrl,
        },
        {
          name: `twitter:card`,
          content: `summary_large_image`,
        },
        {
          name: `twitter:title`,
          content: metaTitle,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
        {
          name: `twitter:image`,
          content: metaThumbnailUrl,
        },
      ]}
      encodeSpecialCharacters={true}
    />
  )
}

SEO.defaultProps = {
  lang: 'en',
}

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  thumbnail: PropTypes.object,
  lang: PropTypes.string,
}

export default SEO
