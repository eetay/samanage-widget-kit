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

SamanageAPI.debug = true
var samanage = new SamanageAPI.Connection(config.token, config.origin)
var create_widget = SamanageAPI.create('platform_widget', 'admin')
var create_widget_request = create_widget(
  Object.assign({},config.info, {code: 'http://localhost:' + webpack_config.devServer.port})
)
samanage.callSamanageAPI(create_widget_request).
  then(function({data}) {
    console.log('Success', data)
  }).
  catch(function(error) {
    console.log('Error ', error)
  })

