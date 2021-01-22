import { Component } from 'react-subx'
import { HeartOutlined, StopFilled } from '@ant-design/icons';
import { Button, Spin, Select, InputNumber } from 'antd';
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
      choosing,
      allDone
    } = store
    function renderSelects () {
      return (
        <div className='pd1y'>
          <Button
            type='primary'
            size='large'
            className='christmas mg1r'
            disabled={choosing || allDone}
            onClick={e => store.chooseLuckyOnes()}
          >
            {
              looping
                ? <span><StopFilled /> Stop</span>
                : <span><HeartOutlined /> Choose lucky ones</span>
            }
          </Button>
          <Select
            onChange={store.handleChangeLevel}
            className='mg1r'
            value={prizeLevel + ''}
            dropdownMatchSelectWidth={false}
            size='large'
          >
            {
              prizeLevels.map(({ level }, i) => {
                return (
                  <Option value={level} key={level + i}>
                    {level}
                  </Option>
                )
              })
            }
          </Select>
          <InputNumber
            value={prizeCount}
            size='large'
            onChange={store.handleChangeCount}
          />
        </div>
      )
    }
    const pts = {
      style: {
        height: (window.innerHeight - 90 - 120) + 'px'
      }
    }
    return (
      <div className='team aligncenter pd1b' {...pts}>
        {
          store.members
            ? renderSelects()
            : <div><Spin size='large' /> Fetching team members...</div>
        }
        {
          looping
            ? <h1 className='pd2'><Spin size='large' /> {store.tempOne.email}</h1>
            : null
        }
        {
          Object.keys(store.winners).length
            ? <LuckyOne store={store} />
            : null
        }
      </div>
    )
  }
}
