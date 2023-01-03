module.exports = function () {
  return {
    devServer: {
      static: './dist',
      port: 8081,
      open: '/start-page.html',
      // enable live reload for files defined in paths
      watchFiles: {
        paths: ['src/**/*.*'],
        options: {
          usePolling: true,
        },
      },
    },
  };
};
