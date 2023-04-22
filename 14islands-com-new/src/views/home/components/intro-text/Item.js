import React, { memo, forwardRef } from 'react'
import PropTypes from 'prop-types'

import SplitText from './SplitText'

import classNames from 'classnames/bind'
import * as s from './IntroText.module.css'

const cn = classNames.bind(s)

// Single Item
const Item = forwardRef(({ pre, post, size, isActive, isMobile, vw }, ref) => {
  const n = [...pre, ...post].length
  const delta = 1
  const stagger = (1 - delta / n) / n + 0.005

  return (
    <h2 className={cn('item', { active: isActive })} aria-label={`${pre} ${post}`}>
      <SplitText
        text={`${pre} ${post}`}
        lastPre={pre.split(' ').length - 1}
        ref={ref}
        size={size}
        isMobile={isMobile}
        stagger={stagger}
        vw={vw}
      />
    </h2>
  )
})

Item.displayName = 'Item'

Item.propTypes = {
  pre: PropTypes.string,
  post: PropTypes.string,
  setRefEl: PropTypes.func,
  size: PropTypes.object,
  isMobile: PropTypes.bool,
  isActive: PropTypes.bool,
  vw: PropTypes.number,
}

export default memo(Item)
