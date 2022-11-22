const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/mainProcess/index.js',
  target: 'electron22.2-main',
  plugins: [
    new CopyPlugin({
      patterns: [{ from: './src/images', to: 'images' }],
    }),
  ],
};
