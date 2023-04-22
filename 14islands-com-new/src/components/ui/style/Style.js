import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

const Style = ({ css }) => {
  if (typeof css !== 'string') return null
  const innerHTML = useMemo(() => ({ __html: css }), [css])
  return <style dangerouslySetInnerHTML={innerHTML} />
}

Style.propTypes = {
  css: PropTypes.string,
}

export default Style
