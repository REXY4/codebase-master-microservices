require('dotenv').config();

const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const config = require('./config');

const webpackOpts = {
  mode: config.env,
  context: path.resolve(__dirname, 'src', 'pages'),
  entry: {
    docs: './controllers/docs',
    chat: './controllers/chat',
  },
  plugins: [
    new Dotenv(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'libs/*',
          noErrorOnMissing: true,
          filter: async (file) => {
            const exludes = ['.gitkeep'];
            if (exludes.indexOf(file.replace(/^.*[\\/]/, '')) === -1) return true

            return false;
          },
          to: path.resolve(__dirname, 'dist')
        },
        {
          from: 'css/*',
          noErrorOnMissing: true,
          to: path.resolve(__dirname, 'dist')
        },
        {
          from: path.resolve(__dirname, 'node_modules/swagger-ui-themes/themes'),
          to: path.resolve(__dirname, 'dist/libs/swagger')
        }
      ],
    }),
  ],
}

if (config.env === 'development') {
  webpackOpts.devtool = 'cheap-module-source-map'
}

module.exports = webpackOpts;
