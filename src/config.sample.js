let config = null

switch (process.env.NODE_ENV) {
  case 'production':
    config = {
      RINGCENTRAL_SERVER_URI: 'https://platform.ringcentral.com',
      RINGCENTRAL_CLIENT_ID: '<RINGCENTRAL_CLIENT_ID>',
      RINGCENTRAL_CLIENT_SECRET: '<RINGCENTRAL_CLIENT_SECRET>',
      APP_HOME_URI: 'https://tylerlong.github.io/party-lottery/index.html'
    }
    break
  default: // for development
    config = {
      RINGCENTRAL_SERVER_URI: 'https://platform.ringcentral.com',
      RINGCENTRAL_CLIENT_ID: '<RINGCENTRAL_CLIENT_ID>',
      RINGCENTRAL_CLIENT_SECRET: '<RINGCENTRAL_CLIENT_SECRET>',
      APP_HOME_URI: 'http://localhost:6066/index.html'
    }
    break
}

export default config
