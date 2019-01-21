/**
 * UI to show luck ones
 */

import { Component } from 'react-subx'
import React from 'react'
import { Button, Tooltip } from 'antd'
import download from './download'
import time from './time'

function renderLuckOne (luckyOne, i) {
  let { firstName, lastName, email } = luckyOne
  let name = `${firstName || ''} ${lastName || ''}`
  return (
    <Tooltip
      title={`${name}(${email})`}
      placement="top"
      key={email + i}
    >
      <div className='person' key={email + '__' + i}>
        <img
          className='iblock mg2y animated jackInTheBox luck-avatar'
          height={40}
          width={40}
          src={
            luckyOne.avatar === null
              ? 'https://pngimage.net/wp-content/uploads/2018/06/noavatar-png-2.png'
              : luckyOne.avatar
          }
          alt={name}
        />
      </div>
    </Tooltip>
  )
}

function buildCsv (ones) {
  return ones.reduce((prev, curr, i) => {
    let { email, firstName, lastName, prizeLevel } = curr
    return prev +
    `"${i + 1}","${firstName} ${lastName}","${email}","${prizeLevel}"\n`
  }, 'index,name,email,prizeLevel\n')
}

function downloadCsv (ones) {
  let name = `${time()}.csv`
  download(name, buildCsv(ones))
}

export default class LuckyOnes extends Component {
  render () {
    const { store } = this.props
    const { winners, luckyOnes } = store
    let values = Object.values(winners)
    let values1 = Object.values(luckyOnes)
    if (!values1.length) {
      return null
    }
    return (
      <div className='luckyones'>
        <div className='btn-wrap'>
          <Button
            type='default'
            onClick={() => downloadCsv(values1)}
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
