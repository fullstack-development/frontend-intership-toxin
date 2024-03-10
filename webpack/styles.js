module.exports = function () {
  return {
    module: {
      rules: [
        {
          test: /\.(s[ac]ss|css)$/,
          use: [
            {
              loader: 'css-loader',
              options: { sourceMap: true },
            },
            {
              loader: 'postcss-loader',
            },
            {
              loader: 'sass-loader',
              options: { sourceMap: true },
            },
          ],
        },
      ],
    },
  };
};
