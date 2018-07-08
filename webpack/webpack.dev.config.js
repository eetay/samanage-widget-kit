var webpack = require('webpack')
var path = require('path')
var parentDir = path.join(__dirname,'..')
var widgetServerConfig = require('../bin/widget-server-config.json').dev

module.exports = {
  mode:'development',
	entry: [
		path.join(__dirname, '../index.js')
	],
	module: {
		rules: [{
			test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			},{
				test: /\.less$/,
				loaders: ["style-loader", "css-loader", "less-loader"]
			}
		]
	},
  output: {
    path: parentDir + '/dist',
    filename: 'bundle.js'
  },
  devServer: {
    https: !!widgetServerConfig.origin.match('https://'),
    contentBase: parentDir,
    historyApiFallback: true,
    host: '127.0.0.1',
    port: 8080,
    disableHostCheck: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    proxy:{
      '/platform_widgets/helper/**': {
        //target: 'https://api.samanagestage.com/platform_widgets/helper/platformWidgetHelper-1.0.1.js',
        target: widgetServerConfig.origin,
        secure: false,
        changeOrigin: true
      }
    }
  }
}
