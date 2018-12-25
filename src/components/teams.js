import React from 'react'
import { Component } from 'react-subx'
import { Select } from 'antd'
import Team from './team'

export default class Teams extends Component {
  render () {
    const { store } = this.props
    return (
      <div className='relative'>
        <div className={store.team ? 'team-selected' : ''}>
          <Select
            defaultValue='-1'
            onChange={value => store.selectTeam(value)}
          >
            <Select.Option key='-1' value='-1'>Please select a team</Select.Option>
            {
              store.teams.map(
                team => <Select.Option value={team.id} key={team.id}>{team.name}</Select.Option>
              )
            }
          </Select>
        </div>
        {
          store.team ? <Team store={store} /> : ''
        }
      </div>
    )
  }
}
