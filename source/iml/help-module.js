// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import environment from './environment-module';

export default angular.module('help', [
  environment
])
.factory('help', ($sce, HELP_TEXT) => {
  'ngInject';

  const trusted = {};

  function addToTrusted (key) {
    trusted[key] = $sce.trustAsHtml(HELP_TEXT[key]);

    return trusted[key];
  }

  return {
    get: function get (key) {
      if (!HELP_TEXT[key]) throw new Error(`Key ${key} is not in help text!`);

      return trusted[key] || addToTrusted(key);
    }
  };
})
.name;
