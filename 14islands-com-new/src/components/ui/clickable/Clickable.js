import React from 'react'
import PropTypes from 'prop-types'
import TransitionLink from 'gatsby-plugin-transition-link'
import { useMatch } from '@reach/router'
import classNames from 'classnames/bind'
import useUIContext from 'context/ui'

import shouldNavigate from 'lib/shouldNavigate'
import { useScrollRig } from '@14islands/r3f-scroll-rig'

import * as s from './Clickable.module.css'

const cn = classNames.bind(s)

const DefaultTransitionLink = props => {
  const startPageTransition = useUIContext(state => state.startPageTransition)
  const { isCanvasAvailable } = useScrollRig()

  return (
    <TransitionLink
      {...props}
      exit={{
        delay: isCanvasAvailable ? 1 : 0, // delay instead of length makes the transition smoother for some reason. (it doesn't run exiting transitions)
        length: 0,
      }}
      onClick={e => {
        if (!shouldNavigate(e)) return

        // TODO figure out in a more robust way maybe? :D
        const currentBg = window.getComputedStyle(document.documentElement).backgroundColor

        const fromGreyPage = currentBg === 'rgb(245, 245, 242)'
        const fromWhitePage = currentBg === 'rgb(255, 255, 255)'

        const href = e.currentTarget.getAttribute('href')

        switch (href) {
          case '/about':
            startPageTransition({ color: fromGreyPage ? '#ffffff' : '#f5f5f2', color2: '#f5f5f2', slow: false })
            break
          case '/':
          case '/contact':
          case '/blog':
          case '/careers':
            startPageTransition({ color: fromWhitePage ? '#f2f2f2' : '#ffffff', color2: '#ffffff', slow: false })
            break
        }
      }}
      entry={{
        delay: 0.1, // allow canvas components to unmount first
      }}
    />
  )
}

const RouterAwareTransitionLink = ({ to, className, ...props }) => {
  const match = useMatch(to)
  const current = match ? ' current' : ''
  return <DefaultTransitionLink to={to} className={className + current} {...props} />
}

RouterAwareTransitionLink.propTypes = {
  to: PropTypes.string,
}

const Clickable = ({ to, children, className, style, target, ...p }) => {
  const setHoveredLink = useUIContext(s => s.setHoveredLink)
  const isText = typeof children === 'string'
  const href = (to || {}).pathname || typeof to === 'string' ? to : null

  const props = {
    className: cn('clickable', className, { underline: isText }),
    style,
    children,
    target,
    onMouseEnter: e => {
      if (!isText) return false
      const { target } = e
      setHoveredLink(target)
    },
    onMouseLeave: () => {
      if (!isText) return false
      setHoveredLink(null)
    },
  }

  if (/^[./]/.test(href)) return <RouterAwareTransitionLink {...p} {...props} to={href} />
  if (/^[.#]/.test(href)) return <a {...p} {...props} href={href} />
  if (/^[.http]/.test(href)) return <a {...p} {...props} href={href} target="_blank" rel="noopener noreferrer" />
  if (p.onClick || p.type) return <button type={p.type || 'button'} {...p} {...props} />
  return <a {...p} {...props} href={href} />
}

Clickable.propTypes = {
  to: PropTypes.string,
  target: PropTypes.string,
  disabled: PropTypes.bool,
  activeClassName: PropTypes.string,
  style: PropTypes.object,
}

export default Clickable
