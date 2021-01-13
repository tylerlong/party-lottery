
import { Component } from 'react-subx'
import React from 'react'

export default class LuckyOne extends Component {
  render () {
    const { store } = this.props
    const { winners, prizeLevel, prizeCount } = store
    let cls = ''
    if (prizeCount > 50) {
      cls = 'more-than-50'
    } else if (prizeCount > 2) {
      cls = 'more-than-2'
    } else {
      cls = 'less-than-2'
    }
    const luckyOneArray = Object.values(winners)
    function renderOne (luckyOne) {
      return (
        <div className='email animated tada fix'>
          <img
            className='iblock mg2y animated jackInTheBox luck-avatar'
            src={
              luckyOne.avatar === null
                ? 'https://pngimage.net/wp-content/uploads/2018/06/noavatar-png-2.png'
                : luckyOne.avatar
            }
            alt={`${luckyOne.firstName || ''} ${luckyOne.lastName || ''}`}
          />
          <div className='lucky-name'>
            {luckyOne.firstName} {luckyOne.lastName}
          </div>
          <div className='lucky-email'>
            ({luckyOne.email})
          </div>
        </div>
      )
    }
    return (
      <div className={'pd2 lucky-result ' + cls}>
        <div className='pd2b'>
          <span className='name-bg iblock'>🎁 {prizeLevel} 🎁</span>
        </div>
        {
          luckyOneArray.map(renderOne)
        }
      </div>
    )
  }
}
