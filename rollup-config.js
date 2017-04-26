import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import replace from 'rollup-plugin-re';
import string from 'rollup-plugin-string';
import bundleSize from 'rollup-plugin-bundle-size';
import less from 'rollup-plugin-less';
import inject from 'rollup-plugin-inject';

export default {
  entry: 'source/iml/iml-module.js',
  useStrict: false,
  sourceMap: false,
  exports: 'none',
  format: 'iife',
  indent: false,
  plugins: [
    json(),
    less({
      output: 'dist/bundle.css',
      option: {
        relativeUrls: false,
        rootpath: '',
        paths: ['./source/', './']
      }
    }),
    string({
      include: '**/*.html'
    }),
    inject({
      include: 'node_modules/twix/**',
      moment: 'moment'
    }),
    replace({
      patterns: [
        {
          test: "from 'highland';",
          replace: "from 'highland/dist/highland.js';"
        }
      ]
    }),
    babel({
      exclude: ['node_modules/angular/*', 'node_modules/nvd3/build/nv.d3.js'],
      presets: [
        [
          'env',
          {
            targets: {
              browsers: ['last 1 chrome version', 'last 1 firefox version']
            },
            modules: false
          }
        ]
      ],
      plugins: [
        ['transform-object-rest-spread', { useBuiltIns: true }],
        'transform-flow-strip-types',
        'transform-class-properties',
        'syntax-jsx',
        'inferno',
        [
          'angularjs-annotate',
          {
            explicitOnly: true
          }
        ],
        'external-helpers'
      ],
      babelrc: false
    }),
    nodeResolve({
      jsnext: true,
      main: true,
      browser: true
    }),
    commonjs({
      ignore: ['bufferutil', 'utf-8-validate']
    }),
    globals(),
    builtins(),
    bundleSize()
  ]
};
