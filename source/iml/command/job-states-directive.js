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

export default function jobStatesDirective() {
  'ngInject';
  return {
    scope: {
      job: '='
    },
    restrict: 'E',
    replace: true,
    template: `<span class="job-state">
  <i ng-if="job.state === 'pending'" class="fa fa-ellipsis-h"></i>
  <i ng-if="job.state === 'complete'" class="fa" ng-class="{'fa-times': job.cancelled, 'fa-exclamation': job.errored, 'fa-check': !job.errored && !job.cancelled}"></i>
  <i ng-if="job.state !== 'pending' && job.state !== 'complete'" class="fa fa-refresh fa-spin"></i>
</span>`
  };
}
