import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Observer from '@researchgate/react-intersection-observer'

if (typeof window !== 'undefined' && typeof window.IntersectionObserver === 'undefined') {
  require('intersection-observer') // polyfill
}

export default class ViewportEnter extends Component {
  active = false

  static propTypes = {
    children: PropTypes.element.isRequired,
    onEnter: PropTypes.func,
    onExit: PropTypes.func,
    threshold: PropTypes.number, // top offset
    once: PropTypes.bool, // only trigger once
  }

  static defaultProps = {
    onEnter: () => null,
    onExit: () => null,
    threshold: 0.25,
    once: true,
    children: <div />,
  }

  onChange = (event, unobserve) => {
    const { onEnter, onExit, once } = this.props
    if (!this.active) {
      if (event.isIntersecting) {
        this.active = true
        onEnter(event)
      }
    } else {
      this.active = false
      onExit(event)

      if (once) {
        unobserve()
      }
    }
  }

  render() {
    const { children, threshold } = this.props

    return (
      <Observer threshold={threshold} onChange={this.onChange}>
        {children}
      </Observer>
    )
  }
}
