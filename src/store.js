import SubX from 'subx'
import Cookies from 'js-cookie'

import rc from './ringcentral'

const token = Cookies.getJSON('RINGCENTRAL_TOKEN')

const store = SubX.create({
  step: 1,
  token
})

rc.token(token)
rc.on('tokenChanged', async token => {
  store.token = token
  Cookies.set('RINGCENTRAL_TOKEN', token, { expires: 7 })
})

export default store
