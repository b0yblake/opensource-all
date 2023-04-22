import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'

import * as s from './Section.module.css'
const cn = classNames.bind(s)

const Section = ({ className, children }) => <section className={cn('section', className)}>{children}</section>

Section.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
}

Section.defaultProps = {
  children: undefined,
}

export default Section
