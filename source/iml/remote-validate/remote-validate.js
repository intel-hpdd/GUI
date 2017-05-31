//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import _ from 'intel-lodash-mixins';

export const remoteValidateForm = {
  restrict: 'A',
  scope: true,
  controller: function ($scope, $element) {
    'ngInject';

    var formController = $element.controller('form');

    if (formController === undefined)
      throw new Error('formController not found, needed by remote-validate-form');

    this.components = {
      '__all__': formController
    };

    // We don't need element anymore. Kill the reference.
    $element = null;

    this.registerComponent = function (name, ngModel) {
      this.components[name] = ngModel;
    }.bind(this);

    this.getComponent = function (name) {
      return this.components[name];
    }.bind(this);

    this.resetComponentsValidity = function () {
      _(this.components).forEach(function (component, name) {
        component.$setValidity('server', true);
        delete $scope.serverValidationError[name];
      });
    }.bind(this);

    $scope.$on('$destroy', function () {
      this.components = null;
    }.bind(this));
  },
  link: function link (scope, el, attrs, formController) {
    scope.serverValidationError = {};

    function callbackBuilder (func) {
      return function callback (resp) {
        formController.resetComponentsValidity();

        (func || angular.noop)(resp);

        return resp;
      };
    }

    var success = callbackBuilder();

    var errback = callbackBuilder(function errbackCallback (resp) {
      _(resp.data).forEach(function (errorList, field) {
        var component = formController.getComponent(field);

        if (component) {
          if (_.isString(errorList))
            errorList = [errorList];

          component.$setValidity('server', false);
          scope.serverValidationError[field] = errorList;
        }
      });
    });

    var deregisterWatch = scope.$watch(attrs.validate, function validateWatcher (newValidate, oldValidate) {
      if (newValidate === oldValidate) return;

      newValidate.then(success, errback);
    });

    scope.$on('$destroy', function () {
      scope.serverValidationError = null;
      deregisterWatch();
    });
  }
};

export const remoteValidateComponent = {
  require: ['^remoteValidateForm', 'ngModel'],
  restrict: 'A',
  link: function (scope, el, attrs, ctrls) {
    var formController = ctrls[0];
    var ngModel = ctrls[1];
    formController.registerComponent(attrs.name, ngModel);
  }
};
