"use strict";

// eslint-disable-next-line no-undef
module.exports = {
  ignore: ["node_modules/angular/angular.js", "node_modules/nvd3/build/nv.d3.js", "node_modules/d3"],
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          browsers: ["last 1 chrome version", "last 1 firefox version"]
        }
      }
    ]
  ],
  plugins: [
    [
      "@babel/plugin-transform-spread",
      {
        useBuiltIns: true
      }
    ],
    "@babel/proposal-object-rest-spread",
    "@babel/transform-async-to-generator",
    "object-values-to-object-keys",
    "@babel/plugin-transform-flow-strip-types",
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-syntax-jsx",
    "inferno"
  ]
};
