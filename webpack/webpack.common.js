var path = require('path')
var parentDir=path.join(__dirname,'..')

const commonConfig = {
	entry: {
		example1: path.join(__dirname, '../src/example1/index.js'),
		example2: path.join(__dirname, '../src/example2/index.js')
	},
	module: {
		rules: [{
			test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			},{
				test: /\.(scss|css)$/,
				loaders: ["style-loader", "css-loader", "less-loader"]
			}
		]
	},
  resolve: {
    alias: {
      shared: path.join(__dirname, '../src')
    }
  },
  output: {
    path: parentDir + '/dist',
    filename: '[name].bundle.js'
  }
}

module.exports = {
  commonConfig,
  parentDir
}