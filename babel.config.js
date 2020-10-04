// babel.config.js
module.exports = {
  plugins: [
    ["transform-class-properties", { "spec": true }]
  ],
  presets: [
    ['@babel/preset-env', {targets: {node: 'current'}}],
    '@babel/preset-typescript',
    '@babel/preset-react'
  ],
};