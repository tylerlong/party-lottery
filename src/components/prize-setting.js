/**
 * prize setting
 */

import React from 'react'
import { Component } from 'react-subx'
import copy from 'json-deep-copy'
import { EditOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { Modal, Input, Button, InputNumber, message } from 'antd'
import './prize-setting.styl'

const InputGroup = Input.Group

export default class PrizeSetting extends Component {
  constructor (props) {
    super(props)
    this.state = {
      prizes: copy(props.store.prizeLevels)
    }
  }

  handleOkPrizeEdit = () => {
    this.props.store.handleOkPrizeEdit(this.state.prizes)
  }

  handleCancelPrizeEdit = () => {
    this.props.store.handleCancelPrizeEdit()
  }

  handleEdit = () => {
    this.props.store.handleEdit()
  }

  changeLevel = (i) => {
    return (e) => {
      const v = e.target.value
      this.setState((old) => {
        const prizes = copy(old.prizes)
        prizes[i].level = v
        return {
          prizes
        }
      })
    }
  }

  changeCount = i => {
    return (n) => {
      this.setState((old) => {
        const prizes = copy(old.prizes)
        prizes[i].count = n
        return {
          prizes
        }
      })
    }
  }

  handleAdd = () => {
    this.setState(old => {
      const prizes = copy(old.prizes)
      const len = prizes.length
      prizes.push({
        level: `prize ${len}`,
        count: 1
      })
      return {
        prizes
      }
    })
  }

  changeDesc = e => {
    const v = e.target.value
    if (!v) {
      return message.error('win prize description required')
    }
    this.props.store.saveDesc(v)
  }

  renderDescEdit () {
    return (
      <Input
        value={this.props.store.desc}
        style={{ width: '60%' }}
        addonBefore='Win prize description'
        placeholder='win prize description'
        onChange={this.changeDesc}
      />
    )
  }

  renderItem = (item, i) => {
    return (
      <div className='pd1y' key={i + 'prize-edit'}>
        <InputGroup compact>
          <Input
            value={item.level}
            style={{ width: '60%' }}
            placeholder='prizeName'
            onChange={this.changeLevel(i)}
          />
          <InputNumber
            value={item.count}
            style={{ width: '30%' }}
            placeholder='count'
            step={1}
            min={1}
            onChange={this.changeCount(i)}
          />
        </InputGroup>
      </div>
    )
  }

  render () {
    const { showPrizeEdit } = this.props.store
    return (
      <div>
        <EditOutlined className='prize-setting pointer' onClick={this.handleEdit} />
        <Modal
          title='Edit prizes'
          wdith='90%'
          visible={showPrizeEdit}
          onCancel={this.handleCancelPrizeEdit}
          onOk={this.handleOkPrizeEdit}
        >
          {
            this.renderDescEdit()
          }
          {
            this.state.prizes.map(this.renderItem)
          }
          <div className='pd1y'>
            <Button onClick={this.handleAdd}>
              <PlusCircleOutlined />
            </Button>
          </div>
        </Modal>
      </div>
    )
  }
}
