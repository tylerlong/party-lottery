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

const prizeLevels = [
  {
    level: 'Lucky(1)睡袋',
    count: 10
  },
  {
    level: 'Lucky(2)水壶',
    count: 10
  },
  {
    level: 'Lucky(3)洗手套机',
    count: 14
  },
  {
    level: 'Lucky(4)吹风机',
    count: 10
  },
  {
    level: 'Lucky(5)化妆镜',
    count: 14
  },
  {
    level: 'Thrid(1)养生壶/kindle',
    count: 14
  },
  {
    level: 'Thrid(2)净水器壶/空气炸锅',
    count: 16
  },
  {
    level: 'Second(1)蒸炖锅',
    count: 6
  },
  {
    level: 'Second(2)扫地机器人',
    count: 6
  },
  {
    level: 'Second(3)除螨仪',
    count: 6
  },
  {
    level: 'First(1)iPad Air',
    count: 5
  },
  {
    level: 'First(2)吸尘器',
    count: 5
  },
  {
    level: 'Top:iPhone11',
    count: 3
  },
  {
    level: 'Super Top:Mac book Air',
    count: 1
  }
]
function resize () {
  const size = window.innerHeight - pagePadding
  return size > maxAvatarSize
    ? maxAvatarSize
    : size
}

const store = SubX.create({
  luckyOnes: {},
  winners: {},
  prizeLevels: copy(prizeLevels),
  prizeLevel: prizeLevels[0].level,
  prizeCount: prizeLevels[0].count,
  avatarSize: resize(),
  bg: 'universe',
  bgs: ['newyear', 'particle', 'universe'],
  looping: false,
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
      'luckOnes',
      JSON.stringify(
        Object.values(store.luckyOnes)
      )
    )
    this.luckyOne = luckyOne
    const { prizeLevel } = this
    try {
      await this.postMessage(
        this.team.id,
        {
          text: `:tada: :tada: Congratulations ![:Person](${this.luckyOne.id}) wins Prize ${prizeLevel} ! :tada: :tada:`
        }
      )
    } catch (e) {
      console.log('send msg fails')
      console.log(e)
    }
  },
  async chooseLuckyOnes () {
    if (this.looping) {
      this.looping = false
      this.choosing = true
      const { prizeCount } = this
      this.winners = {}
      for (let i = 0; i < prizeCount; i++) {
        if (Object.keys(this.luckyOnes).length === this.team.members.length) {
          window.alert('Every one has received gifts!')
          break
        }
        await this.chooseLuckyOne()
        if (i < prizeCount - 1) {
          await delay(3000)
        }
      }
      this.choosing = false
    } else {
      delete this.luckyOne
      this.looping = true
      this.startIterate()
    }
  },
  async startIterate () {
    while (this.looping) {
      for (const memberId of this.team.members) {
        this.tempOne = this.members[memberId]
        await delay(50)
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
