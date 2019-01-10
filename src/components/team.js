import { Component } from 'react-subx'
import { Button, Spin, Icon, Select, InputNumber } from 'antd'
import LuckyOne from './lucky-one'
import React from 'react'

const { Option } = Select

export default class Team extends Component {
  render () {
    const { store } = this.props
    const {
      prizeLevels,
      prizeLevel,
      prizeCount,
      looping,
      choosing
    } = store
    function renderSelects () {
      return (
        <div className='pd1y'>
          <Button
            type='primary'
            size='large'
            className='christmas mg1r'
            disabled={choosing}
            onClick={e => store.chooseLuckyOnes()}
          >
            {
              looping
                ? <span><Icon type='stop' theme='filled' /> Stop</span>
                : <span><Icon type='heart' /> Choose lucky ones</span>
            }
          </Button>
          <Select
            onChange={store.onChangeLevel}
            className='mg1r'
            value={prizeLevel + ''}
            size='large'
          >
            {
              prizeLevels.map(({ level }) => {
                return (
                  <Option value={level} key={level}>
                    {level}
                  </Option>
                )
              })
            }
          </Select>
          <InputNumber
            value={prizeCount}
            size='large'
            onChange={store.onChangeCount}
          />
        </div>
      )
    }
    return (
      <div className='team aligncenter pd1b'>
        {
          store.members
            ? renderSelects()
            : <div><Spin size='large' /> Fetching team members...</div>
        }
        {
          looping
            ? <h1 className='pd2'><Spin size='large' /> { store.tempOne.email }</h1>
            : null
        }
        {
          store.luckyOne
            ? <LuckyOne store={store} />
            : null
        }
      </div>
    )
  }
}
