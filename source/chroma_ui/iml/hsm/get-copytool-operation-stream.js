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


angular.module('hsm')
  .factory('getCopytoolOperationStream', function getCopytoolOperationStreamFactory (socketStream) {
    return function getCopytoolOperationStream (params) {
      params = _.merge({}, {
        jsonMask: 'objects(id,copytool/host/label,processed_bytes,total_bytes,\
updated_at,started_at,throughput,type,state,path,description)',
        qs: {
          active: true,
          limit: 0
        }
      }, params || {});

      var buildProgress = fp.map(function buildProgress (item) {
        var progress = (item.processed_bytes / item.total_bytes) * 100;

        item.progress = (!isFinite(progress) ? 0 : progress);

        return item;
      });

      var buildThroughput = fp.map(function buildThroughput (item) {
        var elapsed = (Date.parse(item.updated_at) - Date.parse(item.started_at)) / 1000;

        if (elapsed < 1 || !isFinite(elapsed)) {
          item.throughput = 0;
        } else {
          // bytes/sec
          var throughput = item.processed_bytes / elapsed;
          item.throughput = isFinite(throughput) ? throughput : 0;
        }

        return item;
      });

      var s = socketStream('/copytool_operation', params);
      var s2 = fp.map(fp.flow(fp.lensProp('objects'), buildProgress, buildThroughput), s);

      s2.destroy = s.destroy.bind(s);

      return s2;
    };
  });
