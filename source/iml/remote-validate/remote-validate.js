//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from "angular";

export const remoteValidateForm = {
  restrict: "A",
  scope: true,
  controller: function($scope, $element) {
    "ngInject";
    const formController = $element.controller("form");

    if (formController === undefined) throw new Error("formController not found, needed by remote-validate-form");

    this.components = {
      __all__: formController
    };

    // We don't need element anymore. Kill the reference.
    $element = null;

    this.registerComponent = function(name, ngModel) {
      this.components[name] = ngModel;
    }.bind(this);

    this.getComponent = function(name) {
      return this.components[name];
    }.bind(this);

    this.resetComponentsValidity = () =>
      Object.entries(this.components).forEach(([name, component]) => {
        component.$setValidity("server", true);
        delete $scope.serverValidationError[name];
      });

    $scope.$on(
      "$destroy",
      function() {
        this.components = null;
      }.bind(this)
    );
  },
  link: function link(scope, el, attrs, formController) {
    scope.serverValidationError = {};

    function callbackBuilder(func) {
      return function callback(resp) {
        formController.resetComponentsValidity();

        (func || angular.noop)(resp);

        if (!scope.$$phase) scope.$digest();
        return resp;
      };
    }

    const success = callbackBuilder();

    const errback = callbackBuilder(function errbackCallback(resp) {
      Object.entries(resp.data).forEach(function([field, errorList]) {
        const component = formController.getComponent(field);

        if (component) {
          if (typeof errorList === "string") errorList = [errorList];

          component.$setValidity("server", false);
          scope.serverValidationError[field] = errorList;
        }
      });
    });

    const deregisterWatch = scope.$watch(attrs.validate, function validateWatcher(newValidate, oldValidate) {
      if (newValidate === oldValidate) return;

      newValidate.then(success, errback);
    });

    scope.$on("$destroy", function() {
      scope.serverValidationError = null;
      deregisterWatch();
    });
  }
};

export const remoteValidateComponent = {
  require: ["^remoteValidateForm", "ngModel"],
  restrict: "A",
  link: function(scope, el, attrs, ctrls) {
    const formController = ctrls[0];
    const ngModel = ctrls[1];
    formController.registerComponent(attrs.name, ngModel);
  }
};
