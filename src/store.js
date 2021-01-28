import SubX from 'subx'
import Cookies from 'js-cookie'
import RingCentral from 'ringcentral-js-concise'
import delay from 'timeout-as-promise'
import { fromEvent } from 'rxjs'
import { debounceTime } from 'rxjs/operators'
import copy from 'json-deep-copy'

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
    level: 'Lucky1小米摄像头',
    count: 15
  },
  {
    level: 'Lucky2小米便携睡袋',
    count: 15
  },
  {
    level: 'Lucky3米家冲牙器',
    count: 15
  },
  {
    level: 'Lucky4小熊早餐机',
    count: 18
  },
  {
    level: 'Lucky5德尔玛挂烫机',
    count: 15
  },
  {
    level: 'Third1:北鼎即热饮水机',
    count: 15
  },
  {
    level: 'Third2:Homepod Mini音箱',
    count: 15
  },
  {
    level: 'Third3:大宇电烧烤炉',
    count: 20
  },
  {
    level: 'Second1小米扫拖机器人',
    count: 7
  },
  {
    level: 'Second2九阳免洗豆浆机',
    count: 7
  },
  {
    level: 'Second3飞利浦加湿器',
    count: 7
  },
  {
    level: 'First1添可智能拖地机',
    count: 10
  },
  {
    level: 'First2戴森两用无叶风扇',
    count: 10
  },
  {
    level: 'Top prize1:富士微单',
    count: 3
  },
  {
    level: 'Top prize2:iPad pro',
    count: 3
  },
  {
    level: 'Top prize3:极光家用投影',
    count: 3
  },
  {
    level: 'Super Top:iPhone12',
    count: 2
  },
  {
    level: 'Surprise-1惊喜盲盒',
    count: 134
  },
  {
    level: 'Surprise-2米家充电台灯',
    count: 110
  },
  {
    level: 'Surprise-3便携U型枕',
    count: 100
  },
  {
    level: 'Surprise-4小米屏幕灯',
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

function getExcludeIds () {
  const st = window.localStorage.getItem('excludeIds')
  return st ? JSON.parse(st) : []
}

const store = SubX.create({
  luckyOnes: {},
  winners: {},
  allDone: false,
  showPrizeEdit: false,
  prizeLevels: getPrizeLevels(),
  prizeLevel: getPrizeLevels()[0].level,
  prizeCount: getPrizeLevels()[0].count,
  avatarSize: resize(),
  bg: 'newyear',
  bgs: ['newyear', 'particle', 'universe'],
  getExcludeIds: getExcludeIds(),
  looping: false,
  handleOkPrizeEdit (prizes) {
    store.prizeLevels = copy(prizes)
    window.localStorage.setItem(
      'prizeLevels', JSON.stringify(prizes)
    )
    store.showPrizeEdit = false
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
  async chooseLuckyOne () {
    const items = this.team.members.filter(id => {
      return !this.luckyOnes[id]
    })
    const luckOneId = items[Math.floor(Math.random() * items.length)]
    const luckyOne = copy(this.members[luckOneId])
    this.luckyOnes[luckOneId] = {
      ...luckyOne,
      prizeLevel: this.prizeLevel
    }
    this.winners[luckOneId] = {
      ...luckyOne,
      prizeLevel: this.prizeLevel
    }
    window.localStorage.setItem(
      window.rcLsKey,
      JSON.stringify(
        Object.values(store.luckyOnes)
      )
    )
  },

  async notifyPrize () {
    const { prizeLevel } = this
    const persons = Object.values(this.winners)
    const str = persons.map(p => `![:Person](${p.id})`).join(' ')
    try {
      await this.postMessage(
        this.team.id,
        {
          text: `:tada: :tada: Congratulations ${str} wins Prize ${prizeLevel} ! :tada: :tada:`
        }
      )
    } catch (e) {
      console.log('send msg fails')
      console.log(e)
    }
  },

  async chooseLuckyOnes () {
    if (this.looping) {
      delete this.tempOne
      this.looping = false
      this.choosing = true
      const { prizeCount } = this
      this.winners = {}
      for (let i = 0; i < prizeCount; i++) {
        if (Object.keys(this.luckyOnes).length === this.team.members.length - this.excludeIds.length) {
          this.allDone = true
          window.alert('Every one has received gifts!')
          break
        }
        await this.chooseLuckyOne()
        await delay(100)
      }
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
