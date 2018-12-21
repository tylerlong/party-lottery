import HtmlWebpackPlugin from 'html-webpack-plugin'
import { LoaderOptionsPlugin } from 'webpack'
const stylusSettingPlugin =  new LoaderOptionsPlugin({
  test: /\.styl$/,
  stylus: {
    preferPathResolver: 'webpack'
  },
  'resolve url': false
})
import { join } from 'path'

const config = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: join(__dirname, 'docs')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.styl$/,
        use: [
          'style-loader',
          'css-loader',
          'stylus-loader'
        ]
      },
      {
        test: /\.(png|jpg|svg)$/,
        use: ['url-loader?limit=1&name=images/[name].[ext]']
      },
      {
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
  },
  devtool: 'source-map',
  plugins: [
    stylusSettingPlugin,
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
}

export default [config]
