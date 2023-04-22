import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'

import * as s from './AspectRatio.module.css'

const cn = classNames.bind(s)

const getCSSVariables = ({ ratio, tabletRatio, desktopRatio }) => ({
  '--ratio': ratio,
  '--tablet-ratio': tabletRatio || ratio,
  '--desktop-ratio': desktopRatio || tabletRatio || ratio,
})

const AspectRatio = ({ children, ratio, tabletRatio, desktopRatio, className, ...props }) => (
  <div className={cn('wrapper', className)} style={getCSSVariables({ ratio, tabletRatio, desktopRatio })} {...props}>
    <div className={cn('content')}>{children}</div>
  </div>
)

AspectRatio.propTypes = {
  ratio: PropTypes.number.isRequired,
  tabletRatio: PropTypes.number,
  desktopRatio: PropTypes.number,
}

AspectRatio.defaultProps = {
  ratio: 1,
}

export default AspectRatio
