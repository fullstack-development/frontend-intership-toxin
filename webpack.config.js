const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const CopyPlugin = require('copy-webpack-plugin');
const PugPlugin = require('pug-plugin');
const devServer = require('./webpack/devServer');
const styles = require('./webpack/styles');
const postcss = require('./webpack/postcss');
const images = require('./webpack/images');
const fonts = require('./webpack/fonts');
const javaScript = require('./webpack/javaScript');
const sourceMap = require('./webpack/sourceMap');

const PAGES_DIR = path.resolve(__dirname, 'src/pages');
const PATHS = {
  src: path.join(__dirname, './src'),
  dist: path.join(__dirname, './dist'),
};

const devMode = process.env.NODE_ENV === 'development';
const productionMode = !devMode;
const filename = (ext) => (devMode ? `${ext}/[name].${ext}` : `${ext}/[name].[contenthash].${ext}`);

const common = merge([
  {
    mode: 'development',

    output: {
      path: PATHS.dist,
      clean: true,
    },

    resolve: {
      alias: {
        '@favicons': path.resolve(__dirname, `${PATHS.src}/favicon`),
        '@variables': path.resolve(__dirname, `${PATHS.src}/styles/variables.scss`),
        '@mixins': path.resolve(__dirname, `${PATHS.src}/styles/mixins.scss`),
        src: path.resolve(__dirname, `${PATHS.src}`),
        components: path.resolve(__dirname, `${PATHS.src}/components`),
      },
    },

    plugins: [
      new PugPlugin({
        // define pages manually
        // entry: {
        //   'start-page': './src/pages/start-page/start-page.pug', // output => dist/start-page.html
        //   'error-page': './src/pages/error-page/error-page.pug', // output => dist/error-page.html
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
        // OR define the pages directory for automatically processing templates
        entry: PAGES_DIR,
        // modify the HTML output filename using the page dirname as the output filename
        filename: ({ chunk }) => {
          const [name] = chunk.name.split('/');
          return `${name}.html`;
        },
        // JS output filename
        js: {
          filename: filename('js'),
        },
        // CSS output filename
        css: {
          filename: filename('css'),
        },
        loaderOptions: {
          // resolve or ignore source files in specifically tag attributes
          sources: [
            {
              tag: 'link',
              // ignore resolving a source fiile in the tag `link` with attribute `rel="manifest"`
              filter: ({ attributes }) => !(attributes.rel === 'manifest'),
            },
          ],
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
        // copy only *.webmanifest file,
        // source image files are processed and placed into output dir via pug-plugin
        patterns: [{ from: `${PATHS.src}/favicon/*.webmanifest`, to: 'assets/favicon/[name][ext]' }],
      }),
    ],
  },
  images(),
  fonts(),
  javaScript(),
]);

module.exports = function () {
  if (productionMode) {
    return merge([
      common,
      postcss(),
    ]);
  }
  if (devMode) {
    return merge([
      common,
      styles(),
      devServer(),
      sourceMap(),
    ]);
  }
};
