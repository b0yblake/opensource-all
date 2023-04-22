const React = require('react')
const { Link } = require('prismic-reactjs')
const { Elements } = require('prismic-richtext')
const Clickable = require('../components/ui/clickable').default
const { linkResolver } = require('./link-resolver')

const htmlSerializer = (type, element, content, children, index) => {
  // Generate links to Prismic Documents as <Clickable> components
  if (type === Elements.hyperlink) {
    const url = Link.url(element.data, linkResolver)
    const { link_type, target } = element.data
    const targetProps = target ? { target, rel: 'noopener' } : {}

    if (link_type === 'Document' || link_type === 'Web')
      return (
        <Clickable to={url} key={index}>
          {content}
        </Clickable>
      )
    return (
      <a href={url} {...targetProps} key={index}>
        {content}
      </a>
    )
  }

  // Return null to stick with the default behavior for everything else
  return null
}

module.exports = { htmlSerializer }
