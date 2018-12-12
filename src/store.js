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
  step: 1,
  token
})

rc.token(token)
if (token) {
  (async () => {
    const r = await rc.get('/restapi/v1.0/account/~/extension/~')
    store.user = r.data
  })()
  ;(async () => {
    const r = await rc.get('/restapi/v1.0/glip/groups', { params: { type: 'Team', recordCount: 250 } })
    store.teams = r.data.records
  })()
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
