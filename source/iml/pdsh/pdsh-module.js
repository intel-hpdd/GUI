//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2016 Intel Corporation All Rights Reserved.
//
// The source code contained or described herein and all documents related
// to the source code ("Material") are owned by Intel Corporation or its
// suppliers or licensors. Title to the Material remains with Intel Corporation
// or its suppliers and licensors. The Material contains trade secrets and
// proprietary and confidential information of Intel or its suppliers and
// licensors. The Material is protected by worldwide copyright and trade secret
// laws and treaty provisions. No part of the Material may be used, copied,
// reproduced, modified, published, uploaded, posted, transmitted, distributed,
// or disclosed in any way without Intel's prior express written permission.
//
// No license under any patent, copyright, trade secret or other intellectual
// property right is granted to or conferred upon you by disclosure or delivery
// of the Materials, either expressly, by implication, inducement, estoppel or
// otherwise. Any license under such intellectual property rights must be
// express and approved by Intel in writing.

import angular from 'angular';
import uiBootstrapModule from 'angular-ui-bootstrap';
import tooltipModule from '../tooltip/tooltip-module';
import popoverModule from '../popover/popover-module';
import helpModule from '../help-module';
import pdshParser from 'intel-pdsh-parser';

import _ from 'intel-lodash-mixins';

export default angular.module('pdsh-module', [
  tooltipModule, uiBootstrapModule,
  popoverModule, helpModule
])
.directive('pdsh', ['help', pdsh])
.name;

/**
 * The pdsh directive.
 * @param {Object} help
 * @returns {Object}
 */
function pdsh (help) {

  return {
    scope: {
      pdshChange: '&',
      pdshRequired: '=?',
      pdshInitial: '=?',
      pdshPlaceholder: '@?'
    },
    restrict: 'E',
    template: `
      <div class="input-group">
        <div class="input-group-addon activate-popover"
             uib-tooltip="Click for expanded hostlist expression."
             tooltip-placement="top-left">
          <i class="fa fa-list-ul"></i>
        </div>
        <iml-popover placement="bottom" title="Hosts" ng-if="pdsh.hostnameSections.length > 0">
          <ul class="well">
            <li ng-repeat="hostname in pdsh.hostnameSections"><span>{{::hostname}}</span></li>
          </ul>
        </iml-popover>
        <input class="form-control" type="search" name="pdsh" placeholder="{{pdsh.pdshPlaceholder}}"
               ng-model="pdsh.expression" ng-required="pdshRequired"
               ng-model-options="{updateOn: 'default', debounce: {default: 100}}" />
        <iml-tooltip class="error-tooltip" toggle="pdsh.pdshForm.pdsh.$invalid" direction="bottom">
          <ul>
            <li ng-repeat="message in pdsh.errorMessages">{{message}}</li>
          </ul>
        </iml-tooltip>
      </div>
    `,
    replace: true,
    require: '^form',
    link: function link (scope, elm, attrs, ctrl) {
      var states = {
        NEUTRAL: '',
        SUCCESS: 'has-success',
        ERROR: 'has-error'
      };
      var parsedState = states.NEUTRAL;
      var errorMessages = [];
      var hostnames = [];
      var hostnamesHash = {};
      var hostnameSections = [];
      var parsedExpression;
      var pdshExpression = '';

      if (!scope.pdshInitial)
        scope.pdshInitial = '';
      if (!scope.pdshPlaceholder)
        scope.pdshPlaceholder = help.get('pdsh_placeholder');

      /**
       * Parses the expression to determine if the expression is valid. The value is set on the form.
       * @param {String} value
       */
      function parseExpressionForValidity (value) {
        scope.pdsh.parseExpression(value);

        var validity = (_.isEmpty(value) || parsedState === states.SUCCESS ? true : false);

        ctrl.pdsh.$setValidity('pdsh', validity);
      }

      /**
       * Sets the validity of the directive based on the pdsh expression being passed in.
       * @param {String} value
       * @returns {String|undefined}
       */
      function updateModelAndValidity (value) {
        pdshExpression = value;
        parseExpressionForValidity(pdshExpression);

        return value;
      }

      var fired = false;

      /**
       * Triggers the inital change.
       * @param {String} value
       * @returns {String}
       */
      function triggerInitialChange (value) {
        if (!fired && scope.pdshInitial) {
          fired = true;
          scope.pdsh.sendChange();
        }

        return value;
      }

      scope.pdsh = {
        /**
         * Parses the expression and calls the pdshChange function on the isolate scope. It also sets the view value
         * on the ngModel.
         * @param {String} pdshExpression
         */
        parseExpression: function parseExpression (pdshExpression) {
          if (pdshExpression == null)
            return;

          parsedExpression = pdshParser(pdshExpression.replace(' ', ''));
          errorMessages = [];

          if ('errors' in parsedExpression && pdshExpression.length > 0) {
            parsedState = states.ERROR;
            hostnames = [];
            hostnamesHash = {};
            hostnameSections = [];
            errorMessages = parsedExpression.errors;
          } else if (pdshExpression.length > 0) {
            parsedState = states.SUCCESS;
            hostnames = parsedExpression.expansion;
            hostnamesHash = parsedExpression.expansionHash;
            hostnameSections = parsedExpression.sections;
          } else {
            parsedState = states.NEUTRAL;
            hostnames = [];
            hostnamesHash = {};
            hostnameSections = [];
          }

          scope.pdsh.sendChange();
        },
        sendChange: function sendChange () {
          scope.pdshChange({
            pdsh: pdshExpression,
            hostnames: hostnames,
            hostnamesHash: hostnamesHash
          });
        },
        /**
         * Returns the error messages regarding the validity of the expression.
         * @returns {string}
         */
        get errorMessages () {
          if (scope.pdshRequired && _.isEmpty(scope.pdsh.expression))
            errorMessages.push('Expression required.');

          errorMessages = _.unique(errorMessages);

          return errorMessages;
        },
        /**
         * Returns the host names expanded by the expression.
         * @returns {Array}
         */
        get hostnames () {
          return hostnames;
        },
        /**
         * Returns the section of hostnames
         */
        get hostnameSections () {
          return hostnameSections;
        },
        pdshForm: ctrl,
        pdshPlaceholder: scope.pdshPlaceholder
      };

      // Set the initial value of the expression
      scope.pdsh.expression = scope.pdshInitial;

      // Handle updating the validity of the directive when the model is changed. This is applied when the
      // model is changed, such as taking an initial value.
      ctrl.pdsh.$formatters.unshift(updateModelAndValidity);
      ctrl.pdsh.$formatters.unshift(triggerInitialChange);
      // Handle updating the validity of the directive when the view changes.
      ctrl.pdsh.$parsers.unshift(updateModelAndValidity);
    }
  };
}
