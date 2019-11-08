
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

const path = require('path');

module.exports = function(options) {
  return {
    ...options,
    entry: ['webpack/hot/poll?100', './src/main.ts'],
    watch: true,
    externals: [
      nodeExternals({
        whitelist: ['webpack/hot/poll?100'],
      }),
    ],
    optimization: {
      nodeEnv: false
    },
    plugins: [...options.plugins, new webpack.HotModuleReplacementPlugin()],
  };
}
