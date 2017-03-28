//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from 'intel-fp';

import parselyBoxTemplate from './assets/html/parsely-box.html!text';

export function parselyBox() {
  'ngInject';
  return {
    restrict: 'E',
    scope: {},
    bindToController: {
      onSubmit: '&',
      completer: '&',
      parserFormatter: '=',
      query: '=?'
    },
    controllerAs: 'ctrl',
    controller: fp.noop,
    template: parselyBoxTemplate
  };
}

export function parseQuery() {
  'ngInject';
  return {
    require: 'ngModel',
    scope: {
      parserFormatter: '='
    },
    link(scope, element, attrs, ctrl) {
      ctrl.$formatters.push(function parseToInput(x) {
        const result = scope.parserFormatter.formatter(x);

        if (result instanceof Error) throw result;

        return result;
      });

      ctrl.$parsers.push(function parseToQs(x) {
        const result = scope.parserFormatter.parser(x);

        if (result instanceof Error) return undefined;

        return result;
      });
    }
  };
}
