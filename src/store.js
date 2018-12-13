import SubX from 'subx'
import Cookies from 'js-cookie'

import rc from './ringcentral'
import config from './config'

const setCookie = Cookies.set.bind(Cookies)
Cookies.set = (key, value, options) => {
  if (value === undefined) {
    Cookies.remove(key)
  } else {
    setCookie(key, value, options)
  }
}

const token = Cookies.getJSON('RINGCENTRAL_TOKEN')

const store = SubX.create({
  token,
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
    this.members = await rc.getGlipUsers(this.team.members)
  },
  async selectTeam (id) {
    if (id === '-1') {
      delete this.team
      return
    }
    this.team = this.teams.find(team => team.id === id)
    await this.fetchMembers()
  },
  async chooseLuckyOne () {
    const luckyOneId = this.team.members[Math.floor(Math.random() * this.team.members.length)]
    this.luckyOne = this.members[luckyOneId]
    this.postMessage(this.team.id, { text: `:tada: :tada: Congratulations ![:Person](${luckyOneId}) ! :tada: :tada:` })
  }
})

rc.token(token)
if (token) {
  store.fetchUser()
  store.fetchTeams()
}
rc.on('tokenChanged', async token => {
  const oldToken = store.token
  store.token = token
  Cookies.set('RINGCENTRAL_TOKEN', token, { expires: 7 })
  if (!oldToken && token) {
    window.location.replace(config.APP_HOME_URI)
  }
})

const urlParams = new URLSearchParams(window.location.search)
const code = urlParams.get('code')
if (code) {
  (async () => {
    await rc.authorize({ code, redirectUri: config.APP_HOME_URI })
  })()
}

export default store
