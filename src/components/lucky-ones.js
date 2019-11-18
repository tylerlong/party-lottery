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
      placement='top'
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

function downloadCsv () {
  let ones = JSON.parse(
    window.localStorage.getItem('luckOnes')
  )
  let name = `${time()}.csv`
  download(name, buildCsv(ones))
}

export default class LuckyOnes extends Component {
  render () {
    const { store } = this.props
    const { winners, luckyOnes } = store
    let values = Object.values(winners)
    let values1 = Object.values(luckyOnes)
    let ones = JSON.parse(
      window.localStorage.getItem('luckOnes')
    ) || []
    return (
      <div className='luckyones'>
        {
          ones.length
            ? (
              <div className='btn-wrap'>
                <Button
                  type='default'
                  onClick={downloadCsv}
                >
                  Download csv
                </Button>
              </div>
            )
            : null
        }
        {
          values1.length
            ? (
              <div className='persons'>
                {
                  values.map(renderLuckOne)
                }
              </div>
            )
            : null
        }
      </div>
    )
  }
}
