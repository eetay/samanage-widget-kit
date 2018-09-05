var webpack = require('webpack')
var path = require('path')
const { commonConfig, parentDir } = require('./webpack.common.js')

mergedConfig = Object.assign(
  {}, 
  commonConfig, {
    mode:'development',
    devServer: {
      contentBase: parentDir,
      historyApiFallback: true
    }
  }
)

module.exports = mergedConfig