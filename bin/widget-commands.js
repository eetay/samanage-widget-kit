const SamanageAPI = require('samanage-api')
const webpack_config = require('../webpack/webpack.dev.config.js')

CONFIG = './widget-server-config.json'
try {
  var all_config = require(CONFIG)
} catch (e) {
  console.log('Not a valid JSON in: ', CONFIG)
  process.exit(1)
}
const config = all_config.dev
config.token = config.token || process.env.TOKEN

if (!config.token) {
  console.error('API token not set. Use "export TOKEN=<my-API-token>"')
  process.exit(1)
} else if (webpack_config.devServer.https && !config.origin.match('https')) {
  console.error('Webpack server is configured for https, but widget origin is http')
  process.exit(1)
} else if (!webpack_config.devServer.https && config.origin.match('https')) {
  console.error('Webpack server is configured for http, but widget origin is https')
  process.exit(1)
}

SamanageAPI.debug = true
const samanage = new SamanageAPI.Connection(config.token, config.origin)
const create_widget = SamanageAPI.create('platform_widget', 'admin')
const create_widget_request = create_widget(
  Object.assign({}, config.info, { code: `${webpack_config.devServer.https ? 'https' : 'http'}://localhost:${webpack_config.devServer.port}` })
)
samanage.callSamanageAPI(create_widget_request)
  .then(({ data }) => {
    console.log('Success', data)
  })
  .catch((error) => {
    console.log('Error ', error)
  })
