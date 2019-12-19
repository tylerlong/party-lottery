import React, { Component } from 'react'

export default class App extends Component {
  componentDidMount () {
    this.initBg()
  }

  initBg () {
    // instantiate a loader
    const loader = new window.THREE.TextureLoader()
    const Universe = window.Universe.default
    // load a resource
    loader.load(
      // resource URL
      '/images/star_v0.3.png',
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
          map: texture,
          background: '#1f2d5d'
        })
      }
    )
  }

  render () {
    return <div id='ubg' />
  }
}
