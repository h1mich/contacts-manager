const webpack = require('webpack');
const path = require('path');

// User a method instead of json object in order to access the 'argv' variable.
// Also it allows to write more advanced configuration in the future.
module.exports = (env, argv) => {
  return {
    entry: './entry-point',
    mode: argv.mode,
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
    stats: {
      hash: false,
      version: false,
      warnings: false
    },
    module: {
      rules: [
        {
          test: /\.jsx$/,
          loader: 'babel-loader',
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx']
    }
  }
};
