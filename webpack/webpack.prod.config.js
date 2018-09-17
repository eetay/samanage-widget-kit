//const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const path = require('path')
const { commonConfig, parentDir } = require('./webpack.common.js')

function newHtmlPlugin(folder) {
  return new HtmlWebPackPlugin({
    chunks: [folder],
    template: `./src/${folder}/index.html`,
    filename: `./${folder}.html`
  })
}

mergedConfig = Object.assign(
  {}, 
  commonConfig, {
    mode:'development',
    devServer: {
      contentBase: parentDir,
      historyApiFallback: true
    },
    plugins : [
      //new UglifyJsPlugin(),
      ...['example1', 'example2'].map(newHtmlPlugin),
    ]
  }
)

module.exports = mergedConfig