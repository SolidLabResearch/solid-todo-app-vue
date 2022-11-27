const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { DefinePlugin } = require('webpack')
const { resolve } = require('path')

/** @type {import('webpack').Configuration} */
module.exports = {
  entry: {
    main: resolve(__dirname, 'src', 'main.ts')
  },
  stats: 'minimal',
  output: {
    clean: true,
    filename: '[name].[contenthash:8].js',
    path: resolve(__dirname, 'dist'),
    chunkFilename: '[name].[contenthash:8].js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        loader: 'vue-loader'
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/]
        }
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new DefinePlugin({
      __VUE_OPTIONS_API__: false,
      __VUE_PROD_DEVTOOLS__: false
    }),
    new HtmlWebpackPlugin({
      template: resolve(__dirname, 'public', 'index.html'),
      favicon: resolve(__dirname, 'public', 'icon.svg'),
      publicPath: process.env.TODO_APP_ROOT ?? '/',
      hash: true
    })
  ],
  resolve: {
    extensions: ['.js', '.ts', '.vue', '.json']
  },
  experiments: {
    topLevelAwait: true
  },
  optimization: {
    moduleIds: 'deterministic',
    runtimeChunk: 'single',
    concatenateModules: true,
    minimize: true,
    usedExports: 'global'
  },
  devServer: {
    historyApiFallback: true,
    liveReload: true,
    port: 3000,
    hot: true
  }
}
