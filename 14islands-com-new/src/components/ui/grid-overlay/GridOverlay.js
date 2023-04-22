import React from 'react'
import classNames from 'classnames/bind'
import { useLocation } from '@reach/router'
import { parse } from 'query-string'

import Portal from 'components/ui/portal'
import { Container, Grid } from 'components/ui/layout'

import * as s from './GridOverlay.module.css'

const cn = classNames.bind(s)

const range = n => [...Array(n).keys()]

const GridOverlay = () => {
  const { search } = useLocation()
  const { grid } = parse(search)
  if (typeof grid === 'undefined') return null
  return (
    <Portal>
      <div className={cn('wrapper')}>
        <Container>
          <Grid>
            {range(12).map(x => (
              <div key={x} className={cn('cell')}>
                <div className={cn('inner')} />
              </div>
            ))}
          </Grid>
        </Container>
      </div>
    </Portal>
  )
}

export default GridOverlay
