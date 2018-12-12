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
    return <button onClick={e => rc.token(undefined)}>Log out</button>
  }
}
