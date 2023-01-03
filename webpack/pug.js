const PugPlugin = require('pug-plugin');

module.exports = function () {
  return {
    module: {
      rules: [
        {
          test: /\.pug$/,
          loader: PugPlugin.loader,
        },
      ],
    },
  };
};
