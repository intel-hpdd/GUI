//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from "@iml/fp";

export function parselyBox() {
  "ngInject";
  return {
    restrict: "E",
    scope: {},
    bindToController: {
      onSubmit: "&",
      completer: "&",
      parserFormatter: "=",
      query: "=?"
    },
    controllerAs: "ctrl",
    controller: fp.noop,
    template: `<form name="form" class="p-box" ng-submit="ctrl.onSubmit({ qs: ctrl.query })">
  <completionist completer="ctrl.completer({ value: value, cursorPosition: cursorPosition })">
    <div class="input-group">
      <div class="status-indicator">
        <i ng-if="form.$valid" class="fa fa-check-circle"></i>
        <i ng-if="form.$invalid" class="fa fa-times-circle"></i>
      </div>
      <input
        name="query"
        autocomplete="off"
        type="search"
        class="form-control"
        parse-query
        parser-formatter="::ctrl.parserFormatter"
        completionist-model-hook
        ng-model="ctrl.query"
      />
      <iml-tooltip class="error-tooltip" toggle="form.$invalid" direction="top">
        {{ ctrl.parserFormatter.parser(form.query.$viewValue).message }}
      </iml-tooltip>
      <span class="input-group-btn">
        <button type="submit" class="btn btn-primary" ng-disabled="form.$invalid">
          <i class="fa fa-search"></i>Search
        </button>
      </span>
    </div>
    <completionist-dropdown></completionist-dropdown>
  </completionist>
</form>`
  };
}

export function parseQuery() {
  "ngInject";
  return {
    require: "ngModel",
    scope: {
      parserFormatter: "="
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
