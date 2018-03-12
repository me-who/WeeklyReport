const path = require('path');

const config = {
  entry: './public/root.js',
  output: {
    path: path.resolve(__dirname, './public/dist'),
    // publicPath: 'http://127.0.0.1:8080/public/dist/',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['react', 'env', 'stage-2'],
            cacheDirectory: true,
            plugins: [["import", { libraryName: "antd", style: "css" }]]
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
};

module.exports = config;