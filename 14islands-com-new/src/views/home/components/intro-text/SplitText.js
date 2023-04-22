import React, { useMemo, memo, forwardRef } from 'react'
import PropTypes from 'prop-types'

import classNames from 'classnames/bind'
import * as s from './IntroText.module.css'

const cn = classNames.bind(s)

// SplitText - wrap words and chars in span
const SplitText = forwardRef(({ text, lastPre, size, isMobile, stagger, vw }, ref) => {
  let c = 0
  const delayOffset = 0.3

  // cache text split value
  const words = useMemo(() => text.split(' '), [text])

  return words.map((word, i) => (
    <span
      className={cn('word', { reference: lastPre === i })}
      key={word + i}
      ref={lastPre === i ? ref : null}
      style={lastPre === i && !isMobile ? { marginRight: `${(size.w / vw) * 100 + 1.5}vw` } : {}}
    >
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
  ))
})

SplitText.displayName = 'SplitText'

SplitText.propTypes = {
  text: PropTypes.string,
  lastPre: PropTypes.number,
  size: PropTypes.object,
  isMobile: PropTypes.bool,
  activeIndex: PropTypes.number,
  stagger: PropTypes.number,
  vw: PropTypes.number,
}

export default memo(SplitText)
