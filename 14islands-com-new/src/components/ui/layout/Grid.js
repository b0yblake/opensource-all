import React from 'react'
import classNames from 'classnames/bind'

import * as s from './Grid.module.css'

const cn = classNames.bind(s)

const Grid = ({ className = '', ...props }) => <div className={cn('grid', className)} {...props} />

export default Grid
