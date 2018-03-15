const path = require("path");
const htmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: ["./src/index.jsx"],
  output: {
    path: path.resolve(__dirname, 'public/'),
    filename: "bundle.js",
    publicPath: '/public/'
  },
  module: {
    rules: [
      {
        test: /\.js|.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query:{
            "presets": ["env", "react"]
          }
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader!sass-loader?sourceMap'
      }
    ],
  },
  
  plugins:[
    new htmlWebpackPlugin({
      template: './index.html',
      inject: 'body',
    })
  ]
};