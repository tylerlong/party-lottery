import HtmlWebpackPlugin from 'html-webpack-plugin'
import { HotModuleReplacementPlugin, LoaderOptionsPlugin } from 'webpack'
const stylusSettingPlugin =  new LoaderOptionsPlugin({
  test: /\.styl$/,
  stylus: {
    preferPathResolver: 'webpack'
  },
  'resolve url': false
})

const config = {
  mode: 'development',
  entry: './src/index.js',
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
        test: /\.(png|jpg|svg|mp3)$/,
        use: ['url-loader?limit=1&name=images/[name].[ext]']
      },
      {
        test: /\.js$/,
        loader: 'babel-loader?cacheDirectory'
      }
    ]
  },
  devtool: 'source-map',
  devServer: {
    contentBase: './build',
    port: 6066,
    overlay: {
      warnings: true,
      errors: true
    },
    hot: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    stylusSettingPlugin,
    new HotModuleReplacementPlugin()
  ]
}

export default [config]
