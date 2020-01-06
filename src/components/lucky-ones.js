/**
 * UI to show luck ones
 */

import { Component } from 'react-subx'
import React from 'react'
import { Button, Tooltip } from 'antd'
import download from './download'
import time from './time'

function renderLuckOne (luckyOne, i) {
  const { firstName, lastName, email } = luckyOne
  const name = `${firstName || ''} ${lastName || ''}`
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
    const { email, firstName, lastName, prizeLevel } = curr
    return prev +
    `"${i + 1}","${firstName} ${lastName}","${email}","${prizeLevel}"\n`
  }, 'index,name,email,prizeLevel\n')
}

function downloadCsv (key = window.rcLsKey) {
  const ones = JSON.parse(
    window.localStorage.getItem(key)
  )
  const name = `${time()}.csv`
  download(name, buildCsv(ones))
}

window.downloadCsv = downloadCsv

export default class LuckyOnes extends Component {
  render () {
    const { store } = this.props
    const { winners, luckyOnes } = store
    const values = Object.values(winners)
    const values1 = Object.values(luckyOnes)
    const ones = JSON.parse(
      window.localStorage.getItem(window.rcLsKey)
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
