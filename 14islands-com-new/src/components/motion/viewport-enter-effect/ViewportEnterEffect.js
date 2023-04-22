import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'

import ViewportEnter from 'components/motion/viewport-enter'

import * as s from './ViewportEnterEffect.module.css'
const cn = classNames.bind(s)

export default class ViewportEnterEffect extends PureComponent {
  state = {
    visible: false,
  }

  static propTypes = {
    children: PropTypes.element.isRequired,
    effect: PropTypes.oneOf([
      'slideUp',
      'fade',
      'scaleDown',
      'text',
      'slideRight',
      'zoomOutImgMobile',
      'drawLineMobile',
      'drawLineHorizontal',
    ]),
    threshold: PropTypes.number, // top offset
    once: PropTypes.bool, // only trigger once
    delay: PropTypes.number,
    mask: PropTypes.bool,
    fit: PropTypes.bool,
    disabled: PropTypes.bool,
    fillHeight: PropTypes.bool,
    className: PropTypes.string,
  }

  static defaultProps = {
    threshold: 0.33,
    once: true,
    effect: 'slideUp',
    delay: 0,
    mask: false,
    fit: false,
    disabled: false,
    className: '',
    fillHeight: false,
  }

  render() {
    const { visible } = this.state
    const { children, effect, delay, fit, mask, disabled, fillHeight, className, ...props } = this.props
    const inlineStyles = { transitionDelay: `${delay}ms` }

    if (disabled) {
      return children
    }

    return (
      <ViewportEnter {...props} onEnter={() => this.setState({ visible: true })}>
        <div className={cn(s.effectWrapper, className, { fit, mask, fillHeight })}>
          <div
            style={inlineStyles}
            className={
              'effect ' +
              cn(s[effect], s.effect, {
                visible,
              })
            }
          >
            {children}
          </div>
        </div>
      </ViewportEnter>
    )
  }
}
