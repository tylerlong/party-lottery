import React from 'react'
import { Component } from 'react-subx'
import { Button, Select, Spin, Icon } from 'antd'

export class App extends Component {
  componentDidMount () {
    this.initBg()
    document.getElementById('content-loading').remove()
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
    const { store } = this.props
    if (!store.token) {
      return (
        <div className='main aligncenter login-page'>
          <div className='logo'>
            <img src={require('./rc128.png')} alt='RingCentral' />
          </div>
          <a href={store.authorizeUri}>
            <Button type='primary' size='large'>Login to Party Lottery System</Button>
          </a>
        </div>
      )
    }
    return (
      <div className='main-logined'>
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

      </div>
    )
  }
}

class User extends Component {
  render () {
    const { store } = this.props
    return (
      <div className='pd2 aligncenter'>
        {
          store.teams
            ? <Teams store={store} />
            : <div><Spin size='large' /> Fetching Glip teams...</div>
        }
      </div>
    )
  }
}

class Teams extends Component {
  render () {
    const { store } = this.props
    return (
      <div className='relative'>
        <div className={store.team ? 'team-selected' : ''}>
          <Select
            defaultValue='-1'
            onChange={value => store.selectTeam(value)}
          >
            <Select.Option key='-1' value='-1'>Please select a team</Select.Option>
            {
              store.teams.map(
                team => <Select.Option value={team.id} key={team.id}>{team.name}</Select.Option>
              )
            }
          </Select>
        </div>
        {
          store.team ? <Team store={store} /> : ''
        }
      </div>
    )
  }
}

class Team extends Component {
  render () {
    const { store } = this.props
    return (
      <div className='team aligncenter pd1b'>
        {
          store.members
            ? (
              <Button
                type={store.choosing ? 'danger' : 'primary'}
                size='large'
                onClick={e => store.chooseLuckyOne()}
              >
                {store.choosing ? 'Stop' : 'Choose a lucky one'}
              </Button>
            )
            : <div><Spin size='large' /> Fetching team members...</div>
        }
        {
          store.choosing
            ? <h1 className='pd2'><Spin size='large' /> { store.tempOne.email }</h1>
            : null
        }
        {
          store.luckyOne
            ? <LuckyOne store={store} />
            : null
        }
      </div>
    )
  }
}

class LuckyOne extends Component {
  render () {
    const { store } = this.props
    const { luckyOne, avatarSize } = store
    return (
      <div className='pd2 lucky-result'>
        <h1>
          <div className='email animated tada'>
            🎁 { luckyOne.email } 🎁
          </div>
          <img
            className='iblock mg2y animated jackInTheBox luck-avatar'
            height={avatarSize}
            width={avatarSize}
            src={
              luckyOne.avatar === null
                ? 'https://pngimage.net/wp-content/uploads/2018/06/noavatar-png-2.png'
                : luckyOne.avatar
            }
          />
        </h1>
      </div>
    )
  }
}
