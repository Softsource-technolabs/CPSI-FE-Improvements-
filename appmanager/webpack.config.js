const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  mode: 'development',
  // mode: 'production',
  output: {
    publicPath: 'http://localhost:3008/',
    // path: path.resolve(__dirname, 'dist'),
    // filename: '[name].[contenthash].js',
    // publicPath: '/auth-app/'
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      "@": path.resolve(__dirname, "src/"), // Map @ to src directory
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"], // Load CSS files
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new ModuleFederationPlugin({
      name: 'appManager',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App.tsx',
      },
      shared: {
        react: { 
          singleton: true, 
          requiredVersion: '^18.2.0',
          eager: true 
        },
        'react-dom': { 
          singleton: true, 
          requiredVersion: '^18.2.0',
          eager: true 
        },
        'react/jsx-runtime': {
          singleton: true,
          requiredVersion: '^18.2.0',
          eager: true
        }
      },
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public/robots.txt', to: 'robots.txt' },
        { from: 'public/manifest.json', to: 'manifest.json' },
        { from: 'utils/appSettings.json', to: 'appSettings.json' },
        { from: 'public/web.config', to: 'web.config' },
        { from: 'public/logo192.png', to: 'logo192.png' },
        { from: 'public/logo512.png', to: 'logo512.png' }
      ],
    }),
  ],
  devServer: {
    port: 3008,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
};