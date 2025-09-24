const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  mode: 'development',
  output: {
    publicPath: 'http://localhost:3009/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
          "@": path.resolve(__dirname, "src/"), // Map @ to src directory
        },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.json$/,
        type: 'json',
      },
    ],
  },
  plugins: [
     new HtmlWebpackPlugin({
          template: './public/index.html',
        }),
    new ModuleFederationPlugin({
      name: 'rolesmanagement',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App.tsx', 
      },
      shared: {
        react: { singleton: true, eager: true },
        'react-dom': { singleton: true, eager: true },
        // 'react-router-dom': { singleton: true, eager: true, requiredVersion: '^6.0.0' },
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
    port: 3009,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
};
