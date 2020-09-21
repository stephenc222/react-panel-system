import commonjs from 'rollup-plugin-commonjs'
import babel from '@rollup/plugin-babel'
import external from 'rollup-plugin-peer-deps-external'
import resolve from 'rollup-plugin-node-resolve'
import css from 'rollup-plugin-merge-and-inject-css'


import pkg from './package.json'

export default {
  external: ['react', 'react-dom'],
  input: 'src/index.js',
  output: [
    {
      file: pkg.browser,
      format: 'cjs',
      exports: 'named',
      sourcemap: true
    },
  ],
  plugins: [
    external({
      packageJsonPath: './package.json',
      includeDependencies: true 
    }),
    css({
      id: 'react-panel-system'
    }),
    resolve(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
    }),
    commonjs({
      include: ['node_modules/**'],
      exclude: 'node_modules/react**',
    })
  ]
}