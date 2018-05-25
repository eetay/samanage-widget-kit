var SamanageAPI = require('samanage-api')
SamanageAPI.debug=true
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

var connection = SamanageAPI.connection(config.token, config.origin)
//var update_widget = SamanageAPI.update('platform_widget')
//var update_widget_request = update_widget(config.id, config.info),
var create_widget = SamanageAPI.create('platform_widget', 'admin')
var create_widget_request = create_widget(
  Object.assign({},config.info, {code: 'http://localhost:' + webpack_config.devServer.port})
)
SamanageAPI.callSamanageAPI(
  connection, create_widget_request, 
  function (data) {
    console.log('Success', data)
  },
  function(error) {
    console.log('Error ', error)
  }
)
