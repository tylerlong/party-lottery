import RingCentral from 'ringcentral-js-concise'
import multipartMixedParser from 'multipart-mixed-parser'

import config from './config'

const rc = new RingCentral(config.RINGCENTRAL_CLIENT_ID, config.RINGCENTRAL_CLIENT_SECRET, config.RINGCENTRAL_SERVER_URI)

rc.getGlipUsers = async ids => {
  const result = {}
  for (let i = 0; i < ids.length; i += 30) {
    let someIds = ids.slice(i, i + 30)
    if (someIds.length <= 1) {
      someIds = [...someIds, ids[0]]
    }
    const r = await rc.get(`/restapi/v1.0/glip/persons/${someIds.join(',')}`)
    for (const member of multipartMixedParser.parse(r.data).slice(1).filter(p => 'id' in p)) {
      result[member.id] = member
    }
  }
  console.log(result)
  return result
}

export default rc
