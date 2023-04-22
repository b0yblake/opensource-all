import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import classNames from 'classnames/bind'
import * as s from './DrawingCTA.module.css'
const cn = classNames.bind(s)

const CTATitle = ({ title }) => {
  let c = 0
  const delayOffset = 0.3
  const stagger = 0.025
  const words = useMemo(() => title.split(' '), [title])

  return (
    <h2 className={cn('ctaTitle')} aria-label={title}>
      {words.map((word, i) => (
        <span className={cn('word')} key={word + i}>
          {word.split('').map((char, i) => {
            c++
            return (
              <span
                className={cn('char')}
                aria-hidden="true"
                key={char + i}
                style={{
                  animationDelay: stagger * c + delayOffset + 's',
                }}
              >
                {char !== ' ' ? char : '\u00A0'}
              </span>
            )
          })}
          {i !== words.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </h2>
  )
}

CTATitle.propTypes = {
  title: PropTypes.string,
}

export default CTATitle
