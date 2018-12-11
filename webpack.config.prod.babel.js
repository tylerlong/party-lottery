import HtmlWebpackPlugin from 'html-webpack-plugin'
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
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
  },
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
}

export default [config]
