const fs = require('fs');
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require('webpack');
const yaml = require('js-yaml');

const bc = yaml.safeLoad(fs.readFileSync(path.join('_config.yml'), 'utf8'));
const THEME_DIR = path.join(__dirname,'themes',bc.meta.blog_theme)

// plugin inits

// to extract css out of javascript
const extractCss = new ExtractTextPlugin({
    filename: "[name].css"
});

// to ignore the unicode table(2mb) for unicode slug
const ignorePlugin = new webpack.IgnorePlugin(/unicode\/category\/So/);

// end plugin inits


module.exports = {
  devtool: 'cheap-module-source-map',

  // this will throw error if you're don't have prism.js alongside your main.js
  entry: {
        vendors: [path.join(THEME_DIR,'static','js','prism.js')],
        main: path.join(THEME_DIR,'static','js','main.js')
  },

  output: {
    path: path.join(__dirname,'dev','assets'),
    filename: '[name].js',
    sourceMapFilename: '[name].map'
  },

  module: {
    rules: [
      {
              test: /\.(js|jsx)$/,
              use: [
                {loader:'babel-loader'}
              ],
              exclude: /node_modules/
      },
      {
            test: /\.(scss|sass)$/,
            use: extractCss.extract({
                use: [{
                    loader: "css-loader"
                },
                {
                    loader: "postcss-loader"
                },
                {
                    loader: "sass-loader"
                }],
                fallback: "style-loader"
            })
       },
       {
              test: /\.css$/,
               use: extractCss.extract({
                use:
                  [
                   {loader:'css-loader'}
                  ],
                  fallback: "style-loader"
               })
       },
       {
              test: /\.(png|jpg|gif|svg)$/,
              use: [
                     {
                       loader:'file-loader',
                       query: {
                         name: "[name].[ext]",
                         useRelativePath: false,
                         publicPath: '',
                         outputPath: 'img/'
                       }
                     }
              ]
       },
       {
              test: /\.(woff|woff2|eot|ttf|otf)$/,
              use: [
                {
                  loader:'file-loader',
                  query: {
                    name: "[name].[ext]",
                    useRelativePath: false,
                    publicPath: '',
                    outputPath: 'fonts/'
                  }
                }
              ]
       }
    ]
  },
  plugins: [
        ignorePlugin,
        extractCss
  ]

}
