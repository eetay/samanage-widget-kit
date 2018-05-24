var request = require('request');
var webpack_config = require('../webpack/webpack.dev.config.js');
console.log(webpack_config)

CONFIG='./widget-server-config.json'
try {
  var all_config = require(CONFIG)
} catch (e) {
  console.log('Not a valid JSON:', CONFIG)
  process.exit(1)
}
var config = all_config.dev

config.token = config.token || process.env.TOKEN

Object.prototype.filter = function(predicate) {
    var result = {};
    for (key in this) {
        if (this.hasOwnProperty(key) && !predicate(key)) {
            result[key] = this[key]
        }
    }
    return result
}

var idKey = (x)=>(x=='id')

var all_actions_options = {
  create_widget: {
    url: config.origin + '/admin/platform_widgets.json',
    body: JSON.stringify({platform_widget: Object.assign({},config.info, {code: 'http://localhost:' + webpack_config.devServer.port})}),
    send: request.post
  },
  update_widget: {
    url: config.origin + '/admin/platform_widgets/' + config.id + '.json',
    body: JSON.stringify({platform_widget: config.info}),
    send: request.put
  }
}

action_options = all_actions_options.create_widget

var options = {
  url: action_options.url,
  body: action_options.body,
  headers: {
    'X-Samanage-Authorization': 'Bearer ' + config.token,
    'Content-Type': 'application/json',
    'Accept': 'application/vnd.samanage.v2.1+json'
  }
}

action_options.send(options, function (error, response, body) {
  console.log('Sending request', options.url)
  if (!error && response.statusCode == 200) {
    try {
      var info = JSON.parse(body)
      console.log('Success', info)
    } catch(e) {
      console.log('Not a valid JSON:', body)
    }
  }
  else {
    console.log('Error ', response && response.statusCode, error || body)
  }
})

