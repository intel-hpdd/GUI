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


export function appJobstatsTargetFactory ($route, TargetModel) {
  'ngInject';

  return function appJobstatsTarget () {
    return TargetModel.get({
      id: $route.current.params.id
    }).$promise;
  };
}

export function appJobstatsMetricsFactory ($q, $route, TargetMetricModel) {
  'ngInject';

  return function appJobstatsMetrics () {
    var commonParams = {
      begin: $route.current.params.startDate,
      end: $route.current.params.endDate,
      job: 'id',
      id: $route.current.params.id
    };
    var metrics = ['read_bytes', 'write_bytes', 'read_iops', 'write_iops'];

    var promises = metrics.reduce(function reducer (out, metric) {

      var params = angular.merge({}, commonParams, {metrics: metric});

      out[metric] = TargetMetricModel.getJobAverage(params);

      return out;
    }, {});

    return $q.all(promises);
  };
}