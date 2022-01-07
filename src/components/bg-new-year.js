/**
 * bg component: new year
 * from https://codepen.io/whqet/pen/Auzch
 */

import React from 'react'
import { Component } from 'react-subx'
import loop from './fireworks'

export default class App extends Component {
  componentDidMount () {
    loop()
  }

  render () {
    const { bgUrl } = this.props.store
    const style = {}
    if (bgUrl) {
      style.backgroundImage = `url("${bgUrl}")`
    }
    console.log('bgUrl', bgUrl)
    return (
      <div
        id='nbg'
        style={style}
      >
        <canvas id='nbg-inner' />
        <img className='cracker hide' src={require('../images/crack.png').default} />
        <img className='cracker mirror hide' src={require('../images/crack.png').default} />
      </div>
    )
  }
}
