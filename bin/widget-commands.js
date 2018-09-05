const SamanageAPI = require('samanage-api')
const webpack_config = require('../webpack/webpack.dev.config.js')
const weblog = require('webpack-log');
const log = weblog({ name: 'widget-commands', level: 'info' }) // webpack-dev-server
const configFile = './widget-server-config.json'
SamanageAPI.debug = true
SamanageAPI.log = log.debug
 
const parsedArgs = {
  command: process.argv[2],
  widget: process.argv[3]
}

log.info(`==== widget-commands ${parsedArgs.command} ${parsedArgs.widget} ====`)

try {
  var all_config = require(configFile)
} catch (e) {
  log.error('Not a valid JSON in: ', configFile)
  process.exit(1)
}

const config = all_config.dev

if (!parsedArgs.widget) {
  log.error(`Widget parameter is missing`)
  process.exit(1)
} else if (!config.widgets[parsedArgs.widget]) {
  log.error(`Widget '${parsedArgs.widget}' is not configured in ${configFile}`)
  process.exit(1)
} else if (!(config.token = config.token || process.env.TOKEN)) {
  log.error('API token not set. Use "export TOKEN=<my-API-token>"')
  process.exit(1)
} else if (webpack_config.devServer.https && !config.origin.match('https')) {
  log.error('Webpack server is configured for https, but widget origin is http')
  process.exit(1)
} else if (!webpack_config.devServer.https && config.origin.match('https')) {
  log.error('Webpack server is configured for http, but widget origin is https')
  process.exit(1)
}

const samanage = new SamanageAPI.Connection(config.token, config.origin)

function create_widget(widget) {
  const create_widget = SamanageAPI.create('platform_widget', 'admin')
  const create_widget_request = create_widget(
    Object.assign({}, config.widgets[parsedArgs.widget], { code: `${webpack_config.devServer.https ? 'https' : 'http'}://localhost:${webpack_config.devServer.port}` })
  )
  samanage.callSamanageAPI(create_widget_request).then(
    ({ data }) => {
      log.info('Success', data)
    }
  ).catch(
    (error) => {
      log.error('Error ', error)
    }
  )
}

if (parsedArgs.command == 'create-widget') {
  create_widget(parsedArgs.widget)
}
