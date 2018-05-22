var request = require('request');
var all_config = require('./widget-server-config.json')
var config = all_config.dev

config.token = config.token || process.env.TOKEN
console.log(config)

var options = {
  url: config.origin + '/platform_widgets/' + config.id + '.json',
  body: JSON.stringify({platform_widget:{description:"install_widget.js"}}),
  headers: {
    'X-Samanage-Authorization': 'Bearer ' + config.token,
    'Content-Type': 'application/json',
    'Accept': 'application/vnd.samanage.v2.1+json'
  }
}
request.put(options,function (error, response, body) {
  if (!error && response.statusCode == 200) {
    try {
      var info = JSON.parse(body)
      console.log('Success', info)
    } catch(e) {
      console.log('Not a valid JSON:', body)
    }
  }
  else {
    console.log('Error', error, response)
  }
})

