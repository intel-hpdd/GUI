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

angular.module('imlRouterModule', ['ngRoute', 'route-segment', 'view-segment', 'route-to', 'auth'])
  .config(['$routeSegmentProvider', function ($routeSegmentProvider) {
    $routeSegmentProvider.options.autoLoadTemplates = true;
    $routeSegmentProvider.options.strictMode = true;

    $routeSegmentProvider.segmentAuthenticated = segmentAuthenticated;

    /**
     * Extends the params.resolve property with the hasAccess function so that it will be executed
     * upon being resolved.
     * @param {String} name
     * @param {Object} params
     * @returns {Object}
     */
    function segmentAuthenticated (name, params) {
      params.resolve = params.resolve || {};

      params.resolve.hasAccess = ['hasAccess', function checkIfHasAccess (hasAccess) {
        hasAccess(params);
      }];

      /* jshint validthis:true */
      return this.segment(name, params);
    }

    var within = $routeSegmentProvider.within;

    $routeSegmentProvider.within = newWithin;

    /**
     * Overrides the within method in the routeSegmentProvider such that it appends a segmentAuthenticated
     * property onto the result.
     * @param {String} childName
     * @returns {Object}
     */
    function newWithin (childName) {
      var result = within(childName);
      result.segmentAuthenticated = segmentAuthenticated;

      return result;
    }
  }]);
