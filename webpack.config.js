/* global __dirname, require, module*/

const webpack = require('webpack')
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin
const path = require('path')
const env = require('yargs').argv.env // use --env with webpack 2
const pkg = require('./package.json')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

let libraryName = pkg.name.split('/')[1]

const plugins = [new ExtractTextPlugin({ filename: '[name].css' })]
const outputFile = `${libraryName}.js`

if (env === 'build') {
  plugins.push(new UglifyJsPlugin({ minimize: true }))
}

const config = {
  entry: {
    [libraryName]: __dirname + '/src/index.js'
  },
  devtool: env === 'dev' ? 'source-map' : false,
  output: {
    path: __dirname + '/lib',
    filename: outputFile,
    library: 'SuSelect',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/
      },
      {
        test: /(\.jsx|\.js)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: { importLoaders: 1, sourceMap: false }
            },
            'postcss-loader'
          ]
        })
      }
    ]
  },
  resolve: {
    modules: [path.resolve('./node_modules'), path.resolve('./src')],
    extensions: ['.json', '.js']
  },
  plugins: plugins
}

module.exports = config
