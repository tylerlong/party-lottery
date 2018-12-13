import React from 'react'
import { Component } from 'react-subx'
import { Button, Select, Row, Col, Spin } from 'antd'

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
      <Select style={{ width: 256 }} defaultValue='-1' onChange={value => store.selectTeam(value)}>
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
      { store.members ? <Button disabled={store.choosing === true} onClick={e => store.chooseLuckyOne()}>Choose a lucky one</Button> : '' }
      <br /><br />
      { store.choosing ? <h1><Spin size='large' /> { store.tempOne.email }</h1> : '' }
      { store.luckyOne ? <LuckyOne store={store} /> : '' }
    </>
  }
}

class LuckyOne extends Component {
  render () {
    const store = this.props.store
    const luckyOne = store.luckyOne
    return <h1>Congratulations! <br /> { luckyOne.email } <br /> <img width='256' src={luckyOne.avatar} /></h1>
  }
}
