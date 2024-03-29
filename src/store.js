import SubX from 'subx'
import Cookies from 'js-cookie'
import RingCentral from 'ringcentral-js-concise'
import delay from 'timeout-as-promise'
import { fromEvent } from 'rxjs'
import { debounceTime } from 'rxjs/operators'
import copy from 'json-deep-copy'
import { message } from 'antd'

import config from './config'

const rc = new RingCentral(config.RINGCENTRAL_CLIENT_ID, config.RINGCENTRAL_CLIENT_SECRET, config.RINGCENTRAL_SERVER_URI)
const pagePadding = 322
const maxAvatarSize = 512
const setCookie = Cookies.set.bind(Cookies)
Cookies.set = (key, value, options) => {
  if (value === undefined) {
    Cookies.remove(key)
  } else {
    setCookie(key, value, options)
  }
}

function shuffle (array) {
  let currentIndex = array.length
  let temporaryValue
  let randomIndex

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    // And swap it with the current element.
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}

function now () {
  const t = new Date()
  const y = t.getFullYear()
  const m = t.getMonth() + 1
  const d = t.getDate()
  const h = t.getHours()
  const mi = t.getMinutes()
  const s = t.getSeconds()
  return `${y}-${m}-${d}_${h}:${mi}:${s}`
}

window.rcNow = now()
window.rcLsKey = 'luckOnes' + window.rcNow

const prizeLevels = [

  {
    level: 'Lucky1',
    count: 15
  },
  {
    level: 'Lucky2',
    count: 15
  },
  {
    level: 'Lucky3',
    count: 15
  },
  {
    level: 'Lucky4',
    count: 18
  },
  {
    level: 'Lucky5',
    count: 15
  },
  {
    level: 'Third1',
    count: 15
  },
  {
    level: 'Third2',
    count: 15
  },
  {
    level: 'Third3',
    count: 20
  },
  {
    level: 'Second1',
    count: 7
  },
  {
    level: 'Second2',
    count: 7
  },
  {
    level: 'Second3',
    count: 7
  },
  {
    level: 'First1',
    count: 10
  },
  {
    level: 'First2',
    count: 10
  },
  {
    level: 'Top prize1',
    count: 3
  },
  {
    level: 'Top prize2',
    count: 3
  },
  {
    level: 'Top prize3',
    count: 3
  },
  {
    level: 'Super Top',
    count: 2
  },
  {
    level: 'Surprise-1',
    count: 134
  },
  {
    level: 'Surprise-2',
    count: 110
  },
  {
    level: 'Surprise-3',
    count: 100
  },
  {
    level: 'Surprise-4',
    count: 100
  },
]
function resize () {
  const size = window.innerHeight - pagePadding
  return size > maxAvatarSize
    ? maxAvatarSize
    : size
}

function getPrizeLevels () {
  const st = window.localStorage.getItem('prizeLevels')
  return st ? JSON.parse(st) : copy(prizeLevels)
}

function getDesc () {
  const st = window.localStorage.getItem('prizeDesc')
  return st || 'wins prize'
}

function getShowHeadShot () {
  const st = window.localStorage.getItem('showHeadShot')
  return st === 'false' ? false : true
}

function getBg () {
  const st = window.localStorage.getItem('bgUrl')
  return st || ''
}

function getExcludeIds () {
  const st = window.localStorage.getItem('excludeIds')
  return st ? JSON.parse(st) : []
}

const store = SubX.create({
  luckyOnes: [],
  desc: getDesc(),
  showHeadShot: getShowHeadShot(),
  winners: [],
  allDone: false,
  showPrizeEdit: false,
  prizeLevels: getPrizeLevels(),
  prizeLevel: getPrizeLevels()[0].level,
  prizeCount: getPrizeLevels()[0].count,
  avatarSize: resize(),
  bgUrl: getBg(),
  bg: 'newyear',
  bgs: ['newyear'],
  getExcludeIds: getExcludeIds(),
  looping: false,
  handleOkPrizeEdit (prizes) {
    store.prizeLevels = copy(prizes)
    window.localStorage.setItem(
      'prizeLevels', JSON.stringify(prizes)
    )
    store.showPrizeEdit = false
  },
  saveDesc (desc) {
    store.desc = desc
    window.localStorage.setItem(
      'prizeDesc', desc
    )
  },
  saveShowHeadShot (v) {
    store.showHeadShot = v
    window.localStorage.setItem(
      'showHeadShot', v.toString()
    )
  },
  saveBg (url) {
    store.bgUrl = url
    window.localStorage.setItem(
      'bgUrl', url
    )
  },
  excludeIds: [],
  handleCancelPrizeEdit () {
    store.showPrizeEdit = false
  },
  handleEdit () {
    store.showPrizeEdit = true
  },
  handleChangeLevel (v) {
    store.prizeLevel = v
    const obj = store.prizeLevels.find(
      r => r.level === v
    )
    store.prizeCount = obj.count
    store.winners = []
  },
  handleChangeCount (v) {
    store.prizeCount = parseInt(v, 10)
  },
  get authorizeUri () {
    return rc.authorizeUri(
      config.APP_HOME_URI, { responseType: 'code' }
    )
  },
  async fetchUser () {
    const r = await rc.get('/restapi/v1.0/account/~/extension/~')
    this.user = r.data
  },
  async fetchTeams () {
    const r = await rc.get('/restapi/v1.0/glip/groups', { params: { type: 'Team', recordCount: 250 } })
    this.teams = r.data.records
  },
  async handleLogout () {
    await rc.revoke()
  },
  async postMessage (teamId, messageObj) {
    await rc.post(`/restapi/v1.0/glip/groups/${teamId}/posts`, messageObj)
  },
  async fetchMembers () {
    delete this.members
    const members = await rc.batchGet('/restapi/v1.0/glip/persons', this.team.members, 30)
    this.members = {}
    for (const member of members) {
      this.members[member.id] = member
    }
    const emails = []
    // preload avatar images
    Object.keys(this.members).forEach(key => {
      const img = new global.Image()
      emails.push(this.members[key].email)
      if (this.members[key].avatar !== null) {
        img.src = this.members[key].avatar
      }
    })
    console.log(emails.join(','))
  },
  async selectTeam (id) {
    delete this.luckyOne
    if (id === '-1') {
      delete this.team
      return
    }
    this.team = this.teams.find(team => team.id === id)
    await this.fetchMembers()
  },
  chooseLuckyOne (luckyOnesOngoing = []) {
    let items = this.pool || this.team.members.filter(id => {
      return !this.luckyOnes[id] && !luckyOnesOngoing[id]
    })
    if (!items.length) {
      return null
    }
    const i = Math.floor(Math.random() * items.length)
    const luckOneId = items[i]
    const luckyOne = copy(this.members[luckOneId])
    items.splice(i, 1)
    this.pool = items
    return {
      ...luckyOne,
      prizeLevel: this.prizeLevel
    }
    // this.luckyOnes[luckOneId] = {
    //   ...luckyOne,
    //   prizeLevel: this.prizeLevel
    // }
    // this.winners[luckOneId] = {
    //   ...luckyOne,
    //   prizeLevel: this.prizeLevel
    // }
    // window.localStorage.setItem(
    //   window.rcLsKey,
    //   JSON.stringify(
    //     Object.values(store.luckyOnes)
    //   )
    // )
  },

  async notifyPrize () {
    const { prizeLevel, desc } = this
    const persons = this.winners
    const max = 50
    let i = 0
    const len = persons.length
    for (i = 0; i < len; i = i + max) {
      const str = persons.slice(i, i + max).map(p => `![:Person](${p.id})`).join(' ')
      const text = `:tada: :tada: Congratulations ${str} ${desc} ${prizeLevel} ! :tada: :tada:`
      try {
        await this.postMessage(
          this.team.id,
          {
            text
          }
        )
      } catch (e) {
        console.log('send msg fails')
        console.log(e)
      }
    }

  },

  // checkAllGetPrize (ones) {
  //   return this.luckyOnes.length + ones.length === this.team.members.length - this.excludeIds.length
  // },

  async chooseLuckyOnes () {
    if (this.looping) {
      delete this.tempOne
      this.looping = false
      this.choosing = true
      const { prizeCount } = this
      this.winners = []
      const ones = []
      await delay(200)
      const isLess = prizeCount < 30
      for (let i = 0; i < prizeCount; i++) {
        const one = this.chooseLuckyOne(ones)
        if (!one) {
          this.allDone = true
          message.success('Every one has received gifts!')
          break
        }
        if (isLess) {
          this.winners = [
            ...copy(this.winners),
            one
          ]
          this.luckyOnes = [
            ...copy(this.luckyOnes),
            one
          ]
          await delay(10)
        } else {
          ones.push(one)
        }
      }
      if (!isLess) {
        this.winners = [
          ...copy(this.winners),
          ...ones
        ]
        this.luckyOnes = [
          ...copy(this.luckyOnes),
          ...ones
        ]
      }
      window.localStorage.setItem(
        window.rcLsKey,
        JSON.stringify(
          store.luckyOnes
        )
      )
      this.notifyPrize()
      this.choosing = false
    } else {
      delete this.luckyOne
      this.looping = true
      this.startIterate()
    }
  },
  async startIterate () {
    const items = shuffle(this.team.members.filter(id => {
      return !this.luckyOnes[id]
    }))
    while (this.looping) {
      for (const memberId of items) {
        const tempOne = this.members[memberId]
        if (tempOne) {
          this.tempOne = tempOne
          await delay(50)
        }
      }
    }
    delete this.tempOne
  }
})

// 3-legged oauth
const urlParams = new URLSearchParams(window.location.search)
const code = urlParams.get('code')
if (code) {
  rc.authorize({ code, redirectUri: config.APP_HOME_URI })
}

// save token
rc.on('tokenChanged', token => {
  store.token = token
  Cookies.set('RINGCENTRAL_TOKEN', token, { expires: 7 })
  if (code) { // first time login, remove query parameters
    window.location.replace(config.APP_HOME_URI)
  }
})

// init
rc.token(Cookies.getJSON('RINGCENTRAL_TOKEN'))
if (store.token) {
  store.fetchUser()
  store.fetchTeams()
}

fromEvent(window, 'resize')
  .pipe(debounceTime(1000))
  .subscribe(() => {
    store.avatarSize = resize()
  })
export default store
