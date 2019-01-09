/**
 * bg component: new year
 */

import React, { Component } from 'react'

export default class App extends Component {
  componentDidMount () {
    this.initBg()
  }

  initBg () {

  }

  render () {
    return (
      <div id='nbg'>
        <img className='cracker' src={require('../images/crack.png')} />
        <img className='cracker mirror' src={require('../images/crack.png')} />
      </div>
    )
  }
}
