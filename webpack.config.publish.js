/* global __dirname, require, module*/

const webpack = require('webpack');
var fs = require("fs")
// const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const MinifyPlugin = require("babel-minify-webpack-plugin");
const path = require('path');
const env = require('yargs').argv.env; // use --env with webpack 2
const libname = process.env.libname // use --env with webpack 2
const hasVersion = process.env.hasVersion // use --env with webpack 2
const uploadOss = process.env.uploadOss // use --env with webpack 2
const type = process.env.type // use --env with webpack 2
const pkg = require('./package.json');
var semver = require("semver")
var env_name = process.env.ENV_NAME||'.env.hardcore'
var result = require('dotenv').config({ path: path.resolve(process.cwd(),"..", env_name) })
var publicPath = process.env.publicPath

let libraryName = pkg.name;
// let pkgVersion = ""
if(hasVersion){
  // let pkgVersion = pkg.version
  // publicPath = publicPath+"/v"+pkg.version
  // process.env.publicPath = publicPath
  // console.log("publicPath:"+publicPath)
  // pkg.version = semver.inc(pkg.version, "patch")
  libraryName = pkg.name+pkg.version;
  // fs.writeFileSync(path.join(__dirname, 'package.json'), JSON.stringify(pkg, null, 4));
}

var defineEnvs = {
  'process.env': env,
  IS_PROD:JSON.stringify(true),
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
  if(uploadOss){
    const AliyunOSSPlugin = require("aliyun-oss-webpack-plugin")
    // console.log(`${process.env.AccessKeyId}`)
    plugins.push(new AliyunOSSPlugin({
      accessKeyId: process.env.AccessKeyId,
      accessKeySecret: process.env.AccessKeySecret ,
      region: process.env.Region ,
      bucket: process.env.Bucket,
      headers: {
        'Cache-Control': 'max-age=900'
      }
    }))
  }

  outputFile = libraryName + '.min.js';
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
    publicPath: publicPath,
    path: __dirname + '/release',
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
