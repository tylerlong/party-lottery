import { Component } from 'react-subx'
import { Button, Spin } from 'antd'
import LuckyOne from './lucky-one'
import React from 'react'

export default class Team extends Component {
  render () {
    const { store } = this.props
    return (
      <div className='team aligncenter pd1b'>
        {
          store.members
            ? (
              <Button
                type={store.choosing ? 'danger' : 'primary'}
                size='large'
                onClick={e => store.chooseLuckyOne()}
              >
                {store.choosing ? 'Stop' : 'Choose a lucky one'}
              </Button>
            )
            : <div><Spin size='large' /> Fetching team members...</div>
        }
        {
          store.choosing
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
