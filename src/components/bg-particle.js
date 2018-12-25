import React, { Component } from 'react'

export default class App extends Component {
  componentDidMount () {
    this.initBg()
  }

  initBg () {
    window.particleBg('#pbg', {
      color: '#999'
    })
  }

  render () {
    return <div id='pbg' />
  }
}
