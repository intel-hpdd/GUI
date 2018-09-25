//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export default function jobStatesDirective() {
  "ngInject";
  return {
    scope: {
      job: "="
    },
    restrict: "E",
    replace: true,
    template: `<span class="job-state">
  <i ng-if="job.state === 'pending'" class="fa fa-ellipsis-h"></i>
  <i ng-if="job.state === 'complete'" class="fa" ng-class="{'fa-times': job.cancelled, 'fa-exclamation': job.errored, 'fa-check': !job.errored && !job.cancelled}"></i>
  <i ng-if="job.state !== 'pending' && job.state !== 'complete'" class="fa fa-refresh fa-spin"></i>
</span>`
  };
}
