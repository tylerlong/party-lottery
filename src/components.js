import React from 'react'
import { Component } from 'react-subx'
import { Button, Select, Row, Col } from 'antd'

export class App extends Component {
  render () {
    const store = this.props.store
    if (!store.token) {
      return <a href={store.authorizeUri}>Log in</a>
    }
    return <div>
      <Button style={{ float: 'right' }} onClick={e => store.logout()}>Log out</Button>
      {store.user ? <User store={store} /> : ''}
    </div>
  }
}

class User extends Component {
  render () {
    const store = this.props.store
    return <>
      <span>{store.user.contact.email}</span>
      <Row style={{ marginTop: '64px' }}><Col span={12} offset={6}>{ store.teams ? <Teams store={store} /> : '' }</Col></Row>
  </>
  }
}

class Teams extends Component {
  render () {
    const store = this.props.store
    return <div>
      <Select style={{ width: 256 }} defaultValue='-1' onChange={value => {
        if (value === '-1') {
          delete store.team
          return
        }
        store.selectTeam(value)
      }}>
        <Select.Option key='-1' value='-1'>Please select a team</Select.Option>
        {store.teams.map(team => <Select.Option value={team.id} key={team.id}>{team.name}</Select.Option>)}
      </Select>
      { store.team ? <Team store={store} /> : '' }
    </div>
  }
}

class Team extends Component {
  render () {
    const store = this.props.store
    return <>
      <h1>{store.team.name}</h1>
      <Button onClick={e => {
        const team = store.teams.find(team => team.id === store.team.id)
        const luckyOneId = team.members[Math.floor(Math.random() * team.members.length)]
        store.luckyOne = luckyOneId
        store.postMessage(team.id, { text: `:tada: :tada: Congratulations ![:Person](${luckyOneId}) ! :tada: :tada:` })
      }}>Choose a lucky one</Button>
      { store.luckyOne ? <LuckyOne store={store} /> : '' }
    </>
  }
}

class LuckyOne extends Component {
  render () {
    const store = this.props.store
    const member = store.members[store.luckyOne]
    return <h1>Congratulations { member
      ? <span>{ member.email } <img width='128' src={member.avatar} /></span>
      : store.luckyOne }</h1>
  }
}
