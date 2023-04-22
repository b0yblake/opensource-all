import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'

import * as s from './ContainerNarrow.module.css'
const cn = classNames.bind(s)

const ContainerNarrow = ({ className, ...props }) => <div className={cn('container', className)} {...props} />

ContainerNarrow.propTypes = {
  className: PropTypes.string,
}

ContainerNarrow.defaultProps = {
  children: null,
}

export default ContainerNarrow
