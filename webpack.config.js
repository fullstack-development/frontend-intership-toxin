const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const CopyPlugin = require('copy-webpack-plugin');
const PugPlugin = require('pug-plugin');
const devServer = require('./webpack/devServer');
const styles = require('./webpack/styles');
const postcss = require('./webpack/postcss');
const pug = require('./webpack/pug');
const images = require('./webpack/images');
const fonts = require('./webpack/fonts');
const javaScript = require('./webpack/javaScript');

const PAGES_DIR = path.resolve(__dirname, 'src/pages');
const PAGES = fs.readdirSync(PAGES_DIR).map((item) => item.replace(/\.[^/.]+$/, ''));
const PATHS = {
  src: path.join(__dirname, './src'),
  dist: path.join(__dirname, './dist'),
};

const devMode = process.env.NODE_ENV === 'development';
const productionMode = !devMode;
const filename = (ext) => (devMode ? `${ext}/[name].${ext}` : `${ext}/[name].[contenthash].${ext}`);

// when using pug-plugin, the entry point is the Pug file containing the source scripts and styles
const entryPages = PAGES.reduce((pages, page) => {
  pages[page] = `${PAGES_DIR}/${page}/${page}.pug`;
  return pages;
}, {});

// display generated entries
console.log('>> pages: ', entryPages);

const common = merge([
  {
    mode: devMode ? 'development' : 'production',
    devtool: devMode ? 'source-map' : false,

    // define your Pug files in entry
    // JS and CSS files will be extracted from their sources loaded in Pug
    entry: entryPages,
    // the generated 'entryPages' contains following Pug intry-points
    // entry: {
    //   index: './src/pages/start-page/start-page.pug', // output => dist/index.html
    //   'start-page': './src/pages/start-page/start-page.pug', // output => dist/start-page.html
    //   'error-page': './src/pages/start-page/error-page.pug', // output => dist/error-page.html
    //   'landing-page': './src/pages/landing-page/landing-page.pug',
    //   'registration-page': './src/pages/registration-page/registration-page.pug',
    //   'room-details-page': './src/pages/room-details-page/room-details-page.pug',
    //   'search-room-page': './src/pages/search-room-page/search-room-page.pug',
    //   'sign-in-page': './src/pages/sign-in-page/sign-in-page.pug',
    //   'ui-kit-colors-type': './src/pages/ui-kit-colors-type/ui-kit-colors-type.pug',
    //   'ui-kit-headers-footers': './src/pages/ui-kit-headers-footers/ui-kit-headers-footers.pug',
    //   'ui-kit-form-elements': './src/pages/ui-kit-form-elements/ui-kit-form-elements.pug',
    //   'ui-kit-cards': './src/pages/ui-kit-cards/ui-kit-cards.pug',
    // },

    output: {
      filename: filename('js'),
      path: PATHS.dist,
      clean: true,
    },

    resolve: {
      alias: {
        '@variables': path.resolve(__dirname, `${PATHS.src}/styles/variables.scss`),
        '@mixins': path.resolve(__dirname, `${PATHS.src}/styles/mixins.scss`),
        src: path.resolve(__dirname, PATHS.src),
        layouts: path.resolve(__dirname, `${PATHS.src}/layouts`),
        pages: path.resolve(__dirname, `${PATHS.src}/pages`),
        components: path.resolve(__dirname, `${PATHS.src}/components`),
        styles: path.join(PATHS.src, 'styles'),
        scripts: path.join(PATHS.src, 'scripts'),
      },
    },

    plugins: [
      // enable processing of Pug files in Webpack entry
      new PugPlugin({
        pretty: devMode, // Note: the pretty option in pug-loader is DEPRECATED, use it here
        // extracts JS file from source script defined in Pug
        js: {
          filename: filename('js'),
        },
        // extracts CSS file from source style defined in Pug
        css: {
          filename: filename('css'),
        },
      }),
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        jquery: 'jquery',
        'window.jQuery': 'jquery',
        'window.$': 'jquery',
      }),
      new CopyPlugin({
        patterns: [{ from: `${PATHS.src}/favicon`, to: 'assets/favicon/' }],
      }),
    ],

    performance: {
      maxAssetSize: 512000,
      maxEntrypointSize: 512000,
    },
  },
  pug(),
  images(),
  fonts(),
  javaScript(),
]);

module.exports = function () {
  if (productionMode) {
    return merge([common, postcss()]);
  }
  if (devMode) {
    return merge([common, styles(), devServer()]);
  }
};
