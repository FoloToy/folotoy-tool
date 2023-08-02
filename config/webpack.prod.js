const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
module.exports = {
  mode: 'production',
  entry: {
    index: './src/index.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: '/public/index.html',
      scriptLoading: "defer",
    }),
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        { from: path.resolve(__dirname, "../public/js/"), to: path.resolve(__dirname, "../dist", 'js'), globOptions: {dot: true}},
        { from: path.resolve(__dirname, "../public/css/"), to: path.resolve(__dirname, "../dist", 'css'), globOptions: {dot: true}},
    ]})
  ],
  module: {
    rules: [
        {
            test: /.ts$/,
            use: ['babel-loader', 'ts-loader']
        },
        {
          test : /\.css$/,// 针对css后缀的文件，用use中的loader
          use : ['style-loader', 'css-loader']
        }
    ]
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '../dist'),
    clean: true,
    publicPath: '/',
  },
 optimization: {
   runtimeChunk: 'single',
 },
 devtool: 'cheap-module-source-map'
};