import SubX from 'subx'
import Cookies from 'js-cookie'
import RingCentral from 'ringcentral-js-concise'
import delay from 'timeout-as-promise'
import { fromEvent } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

import config from './config'

const rc = new RingCentral(config.RINGCENTRAL_CLIENT_ID, config.RINGCENTRAL_CLIENT_SECRET, config.RINGCENTRAL_SERVER_URI)
const pagePadding = 242
const maxAvatarSize = 512
const setCookie = Cookies.set.bind(Cookies)
Cookies.set = (key, value, options) => {
  if (value === undefined) {
    Cookies.remove(key)
  } else {
    setCookie(key, value, options)
  }
}

function resize () {
  let size = window.innerHeight - pagePadding
  return size > maxAvatarSize
    ? maxAvatarSize
    : size
}

const store = SubX.create({
  luckyOnes: {},
  avatarSize: resize(),
  get authorizeUri () {
    return rc.authorizeUri(config.APP_HOME_URI, { responseType: 'code' })
  },
  async fetchUser () {
    const r = await rc.get('/restapi/v1.0/account/~/extension/~')
    this.user = r.data
  },
  async fetchTeams () {
    const r = await rc.get('/restapi/v1.0/glip/groups', { params: { type: 'Team', recordCount: 250 } })
    this.teams = r.data.records
  },
  async logout () {
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
    // preload avatar images
    Object.keys(this.members).forEach(key => {
      const img = new global.Image()
      if (this.members[key].avatar !== null) {
        img.src = this.members[key].avatar
      }
    })
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
    if (this.choosing) {
      this.choosing = false
      const items = this.team.members
      let luckOneId = items[Math.floor(Math.random() * items.length)]
      while (luckOneId in this.luckyOnes) {
        luckOneId = items[Math.floor(Math.random() * items.length)]
        if (Object.keys(this.luckyOnes).length === this.team.members.length) {
          window.alert('Every one has received gifts! Continue will cause some one to receive gifts twice.')
          this.luckyOnes = {}
        }
      }
      this.luckyOnes[luckOneId] = true
      this.luckyOne = this.members[luckOneId]
      await this.postMessage(this.team.id, { text: `:tada: :tada: Congratulations ![:Person](${this.luckyOne.id}) ! :tada: :tada:` })
    } else {
      delete this.luckyOne
      this.choosing = true
      this.startIterate()
    }
  },
  async startIterate () {
    while (this.choosing) {
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
