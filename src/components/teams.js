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
            showSearch
            className='team-search'
            placeholder='Please select a team'
            onSelect={value => store.selectTeam(value)}
            optionFilterProp='children'
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
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
