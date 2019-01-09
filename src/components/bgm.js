/**
 * bgm player
 */
import React from 'react'

export default () => {
  return (
    <div className='bgm-box'>
      <audio
        src={require('../bgm/bgm.mp3')}
        autoPlay
        controls
        loop
      />
    </div>
  )
}
