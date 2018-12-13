import SubX from 'subx'
import Cookies from 'js-cookie'
import multipartMixedParser from 'multipart-mixed-parser'
import RingCentral from 'ringcentral-js-concise'
import delay from 'timeout-as-promise'

import config from './config'

const rc = new RingCentral(config.RINGCENTRAL_CLIENT_ID, config.RINGCENTRAL_CLIENT_SECRET, config.RINGCENTRAL_SERVER_URI)

const setCookie = Cookies.set.bind(Cookies)
Cookies.set = (key, value, options) => {
  if (value === undefined) {
    Cookies.remove(key)
  } else {
    setCookie(key, value, options)
  }
}

const store = SubX.create({
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
    const ids = this.team.members
    delete this.members
    const result = {}
    for (let i = 0; i < ids.length; i += 30) {
      let someIds = ids.slice(i, i + 30)
      if (someIds.length <= 1) {
        someIds = [...someIds, ids[0]] // turn single record fetch to batch fetch
      }
      const r = await rc.get(`/restapi/v1.0/glip/persons/${someIds.join(',')}`)
      for (const member of multipartMixedParser.parse(r.data).slice(1).filter(p => 'id' in p)) {
        result[member.id] = member
      }
    }
    this.members = result
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
    delete this.luckyOne
    this.choosing = true
    this.startIterate()
    await delay(Math.floor(Math.random() * (10000 - 5000 + 1) + 5000))
    this.luckyOne = this.tempOne
    delete this.tempOne
    this.choosing = false
    // todo: uncomment line below before final release
    // await this.postMessage(this.team.id, { text: `:tada: :tada: Congratulations ![:Person](${this.luckyOne.id}) ! :tada: :tada:` })
  },
  async startIterate () {
    while (this.choosing) {
      for (const memberId of this.team.members) {
        store.tempOne = this.members[memberId]
        await delay(10)
      }
    }
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

export default store
