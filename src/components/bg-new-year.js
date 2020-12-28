/**
 * bg component: new year
 * from https://codepen.io/whqet/pen/Auzch
 */

import React, { Component } from 'react'
import loop from './fireworks'

export default class App extends Component {
  componentDidMount () {
    loop()
  }

  render () {
    return (
      <div id='nbg'>
        <canvas id='nbg-inner' />
        <img className='cracker hide' src={require('../images/crack.png')} />
        <img className='cracker mirror hide' src={require('../images/crack.png')} />
      </div>
    )
  }
}
