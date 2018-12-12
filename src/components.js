import React from 'react'
import { Component } from 'react-subx'
import { Button } from 'antd'

import rc from './ringcentral'
import config from './config'

export class App extends Component {
  render () {
    const store = this.props.store
    if (!store.token) {
      const authorizeUri = rc.authorizeUri(config.APP_HOME_URI, { responseType: 'code' })
      return <a href={authorizeUri}>Log in</a>
    }
    return <div>
      <Button onClick={e => rc.revoke()}>Log out</Button>
      {store.user ? <User store={store} /> : ''}
    </div>
  }
}

class User extends Component {
  render () {
    const store = this.props.store
    return <>
      <span>You logged in as {store.user.contact.email}</span>
      { store.teams ? <Teams store={store} /> : '' }
  </>
  }
}

class Teams extends Component {
  render () {
    const store = this.props.store
    return <div>
      <hr />
      <select onChange={async e => {
        const value = e.target.value
        if (value === '-1') {
          delete store.team
          return
        }
        store.team = store.teams.find(team => team.id === value)
        store.members = await rc.getGlipUsers(store.team.members)
      }}>
        <option key='-1' value='-1'>Please select a team</option>
        {store.teams.map(team => <option value={team.id} key={team.id}>{team.name}</option>)}
      </select>
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
        rc.post(`/restapi/v1.0/glip/groups/${team.id}/posts`, { text: `:tada: :tada: Congratulations ![:Person](${luckyOneId}) ! :tada: :tada:` })
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
