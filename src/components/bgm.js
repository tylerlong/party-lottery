/**
 * bgm player
 */
import React, { Component } from 'react'

export default class Bgm extends Component {
  componentDidMount () {
    document.getElementById('bgm').click()
  }

  render () {
    return (
      <div className='bgm-box'>
        <audio
          src={require('../bgm/bgm.mp3')}
          controls
          loop
          autoPlay
          id='bgm'
        />
      </div>
    )
  }
}
