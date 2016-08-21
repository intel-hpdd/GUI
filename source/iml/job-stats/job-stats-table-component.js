// @flow

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

import store from '../store/get-store.js';

import {
  setDuration,
  setSort
} from './job-stats-actions.js';

import type {
  HighlandStreamT
} from 'highland';

import type {
  $scopeT
} from 'angular';

import type {
  StateServiceT
} from 'angular-ui-router';

import type {
  localApplyT
} from '../extend-scope-module.js';

type jobStatsConfigT = {
  duration:number,
  orderBy:string,
  desc:boolean
};

export default {
  bindings: {
    stats$: '<'
  },
  controller: function ($state:StateServiceT, $stateParams:{id?:number}, $scope:$scopeT, localApply:localApplyT) {
    'ngInject';

    type T = (jobStatsConfigT & {
      noId:boolean,
      setDuration:(d:number) => void,
      shouldShow:(n:string, isDesc:boolean) => boolean,
      getClass:(n:string) => string,
      sortProp:(n:string) => void,
      $onDestroy:() => void,
      stats$:HighlandStreamT<any>
    });

    const that:T = this;

    Object.assign(that, {
      noId: $stateParams.id == null,
      setDuration (duration:number) {
        store
          .dispatch(
            setDuration(duration)
          );

        $state.reload('app.jobstats');
      },
      shouldShow (name:string, isDesc:boolean) {
        return that.orderBy === name && that.desc === isDesc;
      },
      getClass (name:string):string {
        if (name !== that.orderBy)
          return '';
        else if (that.desc)
          return 'fa-sort-desc';
        else
          return 'fa-sort-asc';
      },
      sortProp (name:string) {
        if (name === that.orderBy)
          store
            .dispatch(
              setSort(name, !that.desc)
            );
        else
          store
            .dispatch(
              setSort(name, true)
            );
      },
      $onDestroy () {
        that.stats$.destroy();
        config$.destroy();
      }
    });

    const config$:HighlandStreamT<jobStatsConfigT> = store
      .select('jobStatsConfig');

    config$
      .each(c => {
        Object.assign(that, c);
        localApply($scope);
      });
  },
  template: `
    <div as-value stream="::$ctrl.stats$">
      <div ng-if="curr.val.length === 0" class="well text-center">
        <h4>
          Jobstats not found.
          <br />
          Please ensure you have enabled jobstats.
          Refer to this <a href="/static/webhelp/?view_job_statistics.htm" target="_blank">help page</a>
          for more information.
        </h4>
      </div>
      <div ng-if="curr.val.length > 0">
        <h4 class="section-header">Top Jobs</h4>

        <form>
          <div class="form-group well" ng-if="$ctrl.noId">
            <label>Select Duration</label>
            <div class="btn-group btn-group-justified">
              <label ng-click="$ctrl.setDuration(1)" class="btn btn-primary" ng-model="$ctrl.duration" uib-btn-radio="1">1 minute</label>
              <label ng-click="$ctrl.setDuration(5)" class="btn btn-primary" ng-model="$ctrl.duration" uib-btn-radio="5">5 minutes</label>
              <label ng-click="$ctrl.setDuration(10)" class="btn btn-primary" ng-model="$ctrl.duration" uib-btn-radio="10">10 minutes</label>
            </div>
          </div>
        </form>

        <table class="table">
          <thead>
            <tr>
              <th>
                <a ng-click="$ctrl.sortProp('id')">
                  Job <i class="fa" ng-class="$ctrl.getClass('id')"></i>
                </a>
              </th>
              <th>
                <a ng-click="$ctrl.sortProp('read_bytes')">
                  read MB <i class="fa" ng-class="$ctrl.getClass('read_bytes')"></i>
                </a>
              </th>
              <th>
                <a ng-click="$ctrl.sortProp('write_bytes')">
                  write MB <i class="fa" ng-class="$ctrl.getClass('write_bytes')"></i>
                </a>
              </th>
              <th>
                <a ng-click="$ctrl.sortProp('read_iops')">
                  Read IOPS <i class="fa" ng-class="$ctrl.getClass('read_iops')"></i>
                </a>
              </th>
              <th>
                <a ng-click="$ctrl.sortProp('write_iops')">
                Write IOPS <i class="fa" ng-class="$ctrl.getClass('write_iops')"></i>
                </a>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr ng-repeat="x in curr.val | orderBy:$ctrl.orderBy:$ctrl.desc | limitTo: 10 track by x.id">
              <td>
                {{x.id}}
              </td>
              <td>
                {{ x.read_bytes | throughput }}
              </td>
              <td>
                {{ x.write_bytes | throughput }}
              </td>
              <td>
                {{ x.read_iops | round:3 }}
              </td>
              <td>
                {{ x.write_iops | round:3 }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
};
