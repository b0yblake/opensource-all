import React from 'react'
import PropTypes from 'prop-types'

import classNames from 'classnames/bind'
import * as s from './IntroText.module.css'

const cn = classNames.bind(s)

const Placeholder = ({ pre, post }) => {
  return <div className={cn('placeholder')}>{`${pre} ${post}`}</div>
}

Placeholder.propTypes = {
  pre: PropTypes.string,
  post: PropTypes.string,
}
export default Placeholder
