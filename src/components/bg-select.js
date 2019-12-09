import React from 'react'
import { Component } from 'react-subx'
import './bg-select.styl'

export default class BgSelect extends Component {
  render () {
    const { store } = this.props
    const { bgs, bg } = store
    return (
      <div className='bg-selects'>
        {
          bgs.map(b => {
            const cls = `bg-select bg-${b}${b === bg ? ' active' : ''}`
            return (
              <div
                className={cls}
                key={b}
                title={`background: ${b}`}
                onClick={() => { store.bg = b }}
              />
            )
          })
        }
      </div>
    )
  }
}
