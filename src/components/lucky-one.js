
import { Component } from 'react-subx'
import React from 'react'

export default class LuckyOne extends Component {
  render () {
    const { store } = this.props
    const { luckyOne, avatarSize } = store
    return (
      <div className='pd2 lucky-result'>
        <h1>
          <div className='email animated tada'>
            <div>
              <span className='name-bg'>🎁 {luckyOne.firstName} {luckyOne.lastName}🎁</span>
            </div>
            <div>
              <span className='name-bg'>({luckyOne.email})</span>
            </div>
          </div>
          <img
            className='iblock mg2y animated jackInTheBox luck-avatar'
            height={avatarSize}
            width={avatarSize}
            src={
              luckyOne.avatar === null
                ? 'https://pngimage.net/wp-content/uploads/2018/06/noavatar-png-2.png'
                : luckyOne.avatar
            }
            alt={`${luckyOne.firstName || ''} ${luckyOne.lastName || ''}`}
          />
        </h1>
      </div>
    )
  }
}
