/**
 * UI to show luck ones
 */

import { Component } from 'react-subx'
import React from 'react'
import { Button } from 'antd'
import download from './download'
import time from './time'

function renderLuckOne (luckyOne, i) {
  return (
    <div className='person' key={luckyOne.email + '__' + i}>
      <div className='person-name'>
        { luckyOne.name }({ luckyOne.email }) 🎁{ luckyOne.prizeLevel }🎁
      </div>
      <img
        className='iblock mg2y animated jackInTheBox luck-avatar'
        height={40}
        width={40}
        src={
          luckyOne.avatar === null
            ? 'https://pngimage.net/wp-content/uploads/2018/06/noavatar-png-2.png'
            : luckyOne.avatar
        }
      />
    </div>
  )
}

function buildCsv (ones) {
  return ones.reduce((prev, curr, i) => {
    let { email, name, prizeLevel } = curr
    return prev +
    `"${i + 1}","${name}","${email}","${prizeLevel}"\n`
  }, '')
}

function downloadCsv (ones) {
  let name = `${time()}.csv`
  download(name, buildCsv(ones))
}

export default class LuckyOnes extends Component {
  render () {
    const { store } = this.props
    const { luckyOnes } = store
    let values = Object.values(luckyOnes)
    if (!values.length) {
      return null
    }
    return (
      <div className='luckyones'>
        <div className='btn-wrap'>
          <Button
            type='ghost'
            onClick={() => downloadCsv(values)}
          >
            Download csv
          </Button>
        </div>
        <div className='persons'>
          {
            values.map(renderLuckOne)
          }
        </div>
      </div>
    )
  }
}
