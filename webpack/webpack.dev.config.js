var webpack = require('webpack')
var path = require('path')
var parentDir=path.join(__dirname,'..')

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
    https: true,
    contentBase: parentDir,
    historyApiFallback: true,
    host: '127.0.0.1',
    port: 8080,
    disableHostCheck: true
  }
}