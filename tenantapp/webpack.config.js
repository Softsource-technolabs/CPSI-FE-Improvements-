const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: 'http://localhost:3005/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.scss'],
    alias: {
      '@': path.resolve(__dirname, 'src/'),
      '@styles': path.resolve(__dirname, 'src/styles/'),
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
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 2,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              postcssOptions: {
                plugins: ['autoprefixer'],
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              implementation: require('sass'),
              sassOptions: {
                includePaths: [path.resolve(__dirname, 'src/styles')],
              },
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new ModuleFederationPlugin({
      name: 'tenantapp',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App.tsx',
      },
      remotes: {
        root_app: 'root_app@http://localhost:3002/remoteEntry.js',
      },
      shared: {
        react: { singleton: true, eager: true },
        'react-dom': { singleton: true, eager: true },
      },
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public/robots.txt', to: 'robots.txt' },
        { from: 'public/manifest.json', to: 'manifest.json' },
        { from: 'utils/appSettings.json', to: 'appSettings.json' },
        { from: 'public/web.config', to: 'web.config' },
        { from: 'public/logo192.png', to: 'logo192.png' },
        { from: 'public/logo512.png', to: 'logo512.png' },
      ],
    }),
  ],
  devServer: {
    port: 3005,
    historyApiFallback: true,
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
};
