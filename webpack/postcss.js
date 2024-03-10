module.exports = () => ({
  module: {
    rules: [
      {
        test: /\.(s[ac]ss|css)$/,
        use: [
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },
});
