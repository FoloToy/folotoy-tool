const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = {
  mode: 'production',
  entry: {
    index: './src/index.ts',
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html', 
      template: '/public/index.html',
    }),
    new CleanWebpackPlugin(),
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