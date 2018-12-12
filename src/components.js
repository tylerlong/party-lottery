import React from 'react'
import { Component } from 'react-subx'

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
      <button onClick={e => rc.revoke()}>Log out</button>
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
      <select onChange={e => {
        const value = e.target.value
        if (value === '-1') {
          delete store.team
          return
        }
        const [id, name] = value.split(':')
        store.team = { id, name }
        console.log(`You selected team ${name}, #id ${id}`)
      }}>
        <option key='-1' value='-1'>Please select a team</option>
        {store.teams.map(team => <option value={team.id + ':' + team.name} key={team.id}>{team.name}</option>)}
      </select>
      { store.team ? <Team store={store} /> : '' }
    </div>
  }
}

class Team extends Component {
  render () {
    const store = this.props.store
    return <h1>{store.team.name}</h1>
  }
}
