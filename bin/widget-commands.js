var SamanageAPI = require('samanage-api')
var webpack_config = require('../webpack/webpack.dev.config.js');

CONFIG='./widget-server-config.json'
try {
  var all_config = require(CONFIG)
} catch (e) {
  console.log('Not a valid JSON in: ', CONFIG)
  process.exit(1)
}
var config = all_config.dev
config.token = config.token || process.env.TOKEN

if (!config.token) {
  console.error('API token not set. Use "export TOKEN=<my-API-token>"')
  process.exit(1)
} else if (webpack_config.devServer.https && !config.origin.match('https')) {
  console.error('Webpack server is configured for https, but widget origin is http')
  process.exit(1)
} else if  (!webpack_config.devServer.https && config.origin.match('https')) {
  console.error('Webpack server is configured for http, but widget origin is https')
  process.exit(1)
}

SamanageAPI.debug = true
var samanage = new SamanageAPI.Connection(config.token, config.origin)
var create_widget = SamanageAPI.create('platform_widget', 'admin')
var create_widget_request = create_widget(
  Object.assign({},config.info, {code: (webpack_config.devServer.https?'https':'http') + '://localhost:' + webpack_config.devServer.port})
)
samanage.callSamanageAPI(create_widget_request).
  then(function({data}) {
    console.log('Success', data)
  }).
  catch(function(error) {
    console.log('Error ', error)
  })

