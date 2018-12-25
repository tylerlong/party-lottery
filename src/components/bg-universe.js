import React, { Component } from 'react'

export default class App extends Component {
  componentDidMount () {
    this.initBg()
  }

  initBg () {
    // instantiate a loader
    let loader = new window.THREE.TextureLoader()
    let Universe = window.Universe.default
    // load a resource
    loader.load(
      // resource URL
      '//unpkg.com/universe-bg/dist/star.png',
      // Function when resource is loaded
      function (texture) {
        return new Universe({
          size: 9, // star size
          id: null, // id
          starNumber: 10000,
          color: 0xffffff,
          width: null,
          height: null,
          container: document.getElementById('ubg'),
          map: texture
        })
      }
    )
  }

  render () {
    return <div id='ubg' />
  }
}
