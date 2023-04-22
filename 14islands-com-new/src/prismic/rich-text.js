import React from 'react'
import { RichText as PrismicRichText } from 'prismic-reactjs'
import { linkResolver } from './link-resolver'
import { htmlSerializer } from './html-serializer'

export const RichText = {
  render: data => {
    if (!data) return null
    else if (typeof data === 'string') return data
    return <PrismicRichText render={data} linkResolver={linkResolver} htmlSerializer={htmlSerializer} />
  },
  asText: data => (data ? (typeof data === 'string' ? data : PrismicRichText.asText(data)) : ''),
}
