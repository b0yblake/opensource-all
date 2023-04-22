import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'

import * as s from './Container.module.css'
const cn = classNames.bind(s)

const Container = ({ className, ...props }) => <div className={cn('container', className)} {...props} />

Container.propTypes = {
  className: PropTypes.string,
}

Container.defaultProps = {
  children: null,
}

export default Container
