const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    index: './src/index.ts',
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html', 
      template: '/public/index.html',
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
        filename: "css/[name].css",
      })
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
        },
        {
            test: /\.less$/,
            use: [
              MiniCssExtractPlugin.loader,
              'css-loader',
              'less-loader',
            ]
          }
    ]
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, './dist'),
    clean: true,
    publicPath: '/',
  },
 optimization: {
   runtimeChunk: 'single',
 },
};