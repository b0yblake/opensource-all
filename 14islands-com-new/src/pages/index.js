import { graphql } from 'gatsby'
import { withPrismicPreview } from 'gatsby-plugin-prismic-previews'
import { linkResolver } from 'prismic'
import { prismicRepo } from '../../prismic-configuration'

import HomePage from 'views/home/HomePage'

export const query = graphql`
  query HomePageQuery {
    prismicHome(uid: { eq: "home" }, lang: { eq: "en-us" }) {
      _previewable
      uid
      data {
        page_meta_title
        page_meta_description
        page_meta_thumbnail {
          url
          dimensions {
            height
            width
          }
          alt
        }
        showreel_loop_mobile_mp4 {
          url
        }
        showreel_loop_mobile_webm {
          url
        }
        showreel_loop_mp4 {
          url
        }
        showreel_loop_webm {
          url
        }
        showreel_mobile_mp4 {
          url
        }
        showreel_mobile_webm {
          url
        }
        showreel_mp4 {
          url
        }
        showreel_webm {
          url
        }
        intro_text_title {
          text
        }
        intro_text_items {
          pre_device_text
          post_device_text
        }
        projects: works_list {
          node: work {
            document {
              ...ProjectCardFrag
            }
          }
        }
      }
    }
  }
`

export default withPrismicPreview(HomePage, [
  {
    repositoryName: prismicRepo,
    linkResolver,
  },
])
