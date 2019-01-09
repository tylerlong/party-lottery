import React from 'react'
import { Component } from 'react-subx'
import { Button, Spin, Icon } from 'antd'
import User from './user'
import BgSelect from './bg-select'
import ParticleBg from './bg-particle'
import UniverseBg from './bg-universe'
import NewYearBg from './bg-new-year'
import LuckOnes from './lucky-ones'
import bgm from './bgm'

export default class App extends Component {
  componentDidMount () {
    document.getElementById('content-loading').remove()
  }

  renderLogined () {
    const { store } = this.props
    return (
      <div className='main-logined'>
        <BgSelect store={store} />
        <div className='fix pd2 header'>
          {
            store.user
              ? (
                <div className='fleft'>
                  <Icon type='user' /> {store.user.contact.email}
                </div>
              )
              : null
          }
          <div className='fright'>
            <span onClick={store.logout} className='pointer'>
              <Icon type='logout' /> Log out
            </span>
          </div>
        </div>
        <div className='main-logined aligncenter'>
          {
            store.user
              ? <User store={store} />
              : <div><Spin size='large' /> Fetching user data...</div>
          }
        </div>
        <LuckOnes store={store} />
      </div>
    )
  }

  renderBeforeLogin () {
    const { store } = this.props
    return (
      <div className='main aligncenter login-page'>
        <div className='logo'>
          <img src={require('../images/rc128.png')} alt='RingCentral' />
        </div>
        <a href={store.authorizeUri}>
          <Button type='primary' size='large'>Login to Party Lottery System</Button>
        </a>
        <BgSelect store={store} />
      </div>
    )
  }

  renderBg () {
    const { store } = this.props
    const { bg } = store
    if (bg === 'universe') {
      return <UniverseBg />
    } else if (bg === 'particle') {
      return <ParticleBg />
    } else {
      return <NewYearBg store={store} />
    }
  }

  render () {
    const { store } = this.props
    return (
      <div>
        {this.renderBg()}
        {bgm()}
        {
          store.token
            ? this.renderLogined()
            : this.renderBeforeLogin()
        }
      </div>
    )
  }
}
