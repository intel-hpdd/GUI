//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2015 Intel Corporation All Rights Reserved.
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

angular
  .module('statusModule')
  .controller('StatusParserController', function StatusParserController (inputToQsParser) {
    var ctrl = this;

    this.submit = function submit () {
      ctrl.onSubmit({qs: inputToQsParser(ctrl.query)});
    };

    this.parse = inputToQsParser;
  })
  .directive('statusParser', function statusParser () {
    return {
      restrict: 'E',
      require: 'ngModel',
      bindToController: true,
      controllerAs: 'ctrl',
      scope: {
        onSubmit: '&'
      },
      templateUrl: 'iml/status/assets/html/status-parser.html',
      controller: 'StatusParserController'
    };
  })
  .directive('validateStatusQuery', function validateStatusQuery (inputToQsParser) {
    return {
      require: 'ngModel',
      link: function link (scope, element, attrs, ctrl) {
        ctrl.$validators.query = function query (modelValue, viewValue) {
          var result = inputToQsParser(viewValue);

          return !(result instanceof Error);
        };
      }
    };
  });
