import { Component } from 'react-subx'
import { Spin } from 'antd'
import Teams from './teams'
import React from 'react'

export default class User extends Component {
  render () {
    const { store } = this.props
    return (
      <div className='pd2 aligncenter'>
        {
          store.teams
            ? <Teams store={store} />
            : <div><Spin size='large' /> Fetching Glip teams...</div>
        }
      </div>
    )
  }
}
