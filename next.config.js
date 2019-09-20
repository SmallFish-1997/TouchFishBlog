const path = require('path');
const fs = require('fs');
const lessToJS = require('less-vars-to-js');
const withTypescript = require('@zeit/next-typescript')
const withLess = require('@zeit/next-less');
const withCSS = require('@zeit/next-css');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const TerserPlugin = require('terser-webpack-plugin');

// const _Webpack = require('webpack');
// Where your antd-custom.less file lives
const themeVariables = lessToJS(
  fs.readFileSync(
    path.resolve(__dirname, './assets/antd-custom.less'),
    'utf8',
  ),
);

const isDev = process.env.NODE_ENV !== 'production';

// fix antd bug in dev development
const devAntd = '@import "~antd/dist/antd.less";\n';
const stylesData = fs.readFileSync(
  path.resolve(__dirname, './assets/common.less'),
  'utf-8'
);
fs.writeFileSync(
  path.resolve(__dirname, './assets/common.less'),
  isDev ? `${devAntd}${stylesData}` : stylesData,
  'utf-8'
);
// fix: prevents error when .css files are required by node
if (typeof require !== 'undefined') {
  require.extensions['.less'] = (file) => { }
}


module.exports = withTypescript(
  withLess(
    withCSS({
      lessLoaderOptions: {
        javascriptEnabled: true,
        modifyVars: themeVariables,
        localIdentName: '[local]___[hash:base64:5]',
      },
      cssLoaderOptions: {
        url: false
      },

      webpack: (config, { buildId, dev, isServer, defaultLoaders }) => {
       
        config.resolve.alias = {
          ...config.resolve.alias,
          '@pages': path.join(__dirname, '.', 'pages'),
          '@components': path.join(__dirname, '.', 'components'),
          '@assets': path.join(__dirname, '.', 'assets'),
          '@utils': path.join(__dirname, '.', 'utils'),
          '@public': path.join(__dirname, '.', 'public'),
          '@redux': path.join(__dirname, '.', 'redux'),
        }
        // new _Webpack.IgnorePlugin({
        //   resourceRegExp: /^\.\/server$/,
        //   // contextRegExp: /./
        // });
        if (!dev) {
          config.plugins.push(
            ...[
              new BundleAnalyzerPlugin({
                analyzerMode: 'disabled',
                // For all options see https://github.com/th0r/webpack-bundle-analyzer#as-plugin
                generateStatsFile: true,
                // Will be available at `.next/stats.json`
                statsFilename: 'stats.json'
              }),
              // 代替uglyJsPlugin
              new TerserPlugin({
                terserOptions: {
                  ecma: 6,
                  warnings: false,
                  extractComments: false, // remove comment
                  compress: {
                    drop_console: true // remove console
                  },
                  ie8: false
                }
              }),
            ]);
          config.devtool = 'source-map';
        } else {
          config.module.rules.push({
            test: /\.js$/,
            enforce: 'pre',
            include: [
              path.resolve('components'),
              path.resolve('pages'),
              path.resolve('assets'),
              path.resolve('utils'),
              path.resolve('public'),
            ],
          });
          config.devtool = 'cheap-module-inline-source-map';
        
        }


        return config

      },
      serverRuntimeConfig: { // Will only be available on the server side
        rootDir: path.join(__dirname, './'),
        PORT: isDev ? 8080 : (process.env.PORT || 80)
      },
      publicRuntimeConfig: { // Will be available on both server and client
        staticFolder: '/static',
        isDev: process.env.NODE_ENV !== 'production' // Pass through env variables
      },
      env: {
        SERVER_HOST: '127.0.0.1:9090'
      },
      prot: {
        SERVER_HOST: '127.0.0.1:9090'
      }
    })
  )
)