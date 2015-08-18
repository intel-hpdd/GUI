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


angular.module('target')
  .value('filterTargetByFs', function filterTargetByFs (id) {
    var idLens = fp.lensProp('id');
    var fsLens = fp.lensProp('filesystems');
    var fsIdLens = fp.lensProp('filesystem_id');
    var findById = fp.find(fp.eqFn(Number.parseInt, idLens, id));

    function wrap (x) {
      return [x];
    }

    var getData = fp.cond(
      [fp.flow(fsLens, Array.isArray), fsLens],
      [fp.always(true), fp.flow(fsIdLens, idLens.set(fp.__, {}), wrap)]
    );

    var filter = fp.filter(fp.flow(getData, findById));

    return fp.map(filter);
});
