/* global __dirname, require, module*/

const webpack = require('webpack');
// const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const MinifyPlugin = require("babel-minify-webpack-plugin");
const path = require('path');
const env = require('yargs').argv.env; // use --env with webpack 2
const libname = process.env.libname // use --env with webpack 2
const type = process.env.type // use --env with webpack 2
const pkg = require('./package.json');



let libraryName = pkg.name;
if(libname){
  libraryName = libname;
}

var defineEnvs = {
  'process.env': env,
  IS_PROD:JSON.stringify(false),
  "TRTD_VERSION": JSON.stringify(pkg.version),
  webpack_typeList:JSON.stringify(["dipan","tianpan"])
}


let plugins = [
  new webpack.DefinePlugin(defineEnvs),
], outputFile;


var outpubFolder = "/lib"
if (env === 'build') {
  // plugins.push(new UglifyJsPlugin({ minimize: true,mangle:true }));
  plugins.push(new MinifyPlugin({
    removeConsole: true
  }, {}))
  outputFile = libraryName + '.min.js';
  outpubFolder = "/release"
} else {
  outputFile = libraryName + '.js';
}

var sourceName = 'index';
if(libname){
  sourceName = libname;
}
const config = {
  entry: __dirname + `/src/main.js`,
  devtool: 'source-map',
  output: {
    path: __dirname + outpubFolder,
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      { 
        test: /\.css$/, 
        loader: "style-loader!css-loader",
        include: [path.join(__dirname, 'node_modules')]
      },
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/
      },
      // {
      //   test: /(\.jsx|\.js)$/,
      //   loader: 'eslint-loader',
      //   exclude: /node_modules/
      // }
    ]
  },
  resolve: {
    modules: [path.resolve('./node_modules'), path.resolve('./src')],
    extensions: ['css', '.json', '.js']
  },
  plugins: plugins
};

module.exports = config;
