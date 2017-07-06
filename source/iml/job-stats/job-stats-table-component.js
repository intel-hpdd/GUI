// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import store from '../store/get-store.js';

import { setDuration, setSort } from './job-stats-actions.js';

import type { HighlandStreamT } from 'highland';

import type { $scopeT } from 'angular';

import type { StateServiceT } from 'angular-ui-router';

import type { localApplyT } from '../extend-scope-module.js';

type jobStatsConfigT = {
  duration: number,
  orderBy: string,
  desc: boolean
};

export default {
  bindings: {
    stats$: '<'
  },
  controller: function(
    $state: StateServiceT,
    $stateParams: { id?: number },
    $scope: $scopeT,
    localApply: localApplyT<*>
  ) {
    'ngInject';
    type T = jobStatsConfigT & {
      noId: boolean,
      setDuration: (d: number) => void,
      shouldShow: (n: string, isDesc: boolean) => boolean,
      getClass: (n: string) => string,
      sortProp: (n: string) => void,
      $onDestroy: () => void,
      stats$: HighlandStreamT<any>
    };

    const that: T = this;

    Object.assign(that, {
      noId: $stateParams.id == null,
      setDuration(duration: number) {
        store.dispatch(setDuration(duration));

        $state.reload('app.jobstats');
      },
      shouldShow(name: string, isDesc: boolean) {
        return that.orderBy === name && that.desc === isDesc;
      },
      getClass(name: string): string {
        if (name !== that.orderBy) return '';
        else if (that.desc) return 'fa-sort-desc';
        else return 'fa-sort-asc';
      },
      sortProp(name: string) {
        if (name === that.orderBy) store.dispatch(setSort(name, !that.desc));
        else store.dispatch(setSort(name, true));
      },
      $onDestroy() {
        that.stats$.destroy();
        config$.destroy();
      }
    });

    const config$: HighlandStreamT<jobStatsConfigT> = store.select(
      'jobStatsConfig'
    );

    config$.each(c => {
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
                <a ng-click="$ctrl.sortProp('read_bytes_average')">
                  Avg. Read Bandwidth <i class="fa" ng-class="$ctrl.getClass('read_bytes_average')"></i>
                </a>
              </th>
              <th class="visible-lg">
                <a ng-click="$ctrl.sortProp('read_bytes_min')">
                  Min. Read Bandwidth <i class="fa" ng-class="$ctrl.getClass('read_bytes_min')"></i>
                </a>
              </th>
              <th class="visible-lg">
                <a ng-click="$ctrl.sortProp('read_bytes_max')">
                  Max. Read Bandwidth <i class="fa" ng-class="$ctrl.getClass('read_bytes_max')"></i>
                </a>
              </th>
              <th>
                <a ng-click="$ctrl.sortProp('write_bytes_average')">
                  Avg. Write Bandwidth <i class="fa" ng-class="$ctrl.getClass('write_bytes_average')"></i>
                </a>
              </th>
              <th class="visible-lg">
                <a ng-click="$ctrl.sortProp('write_bytes_min')">
                  Min. Write Bandwidth <i class="fa" ng-class="$ctrl.getClass('write_bytes_min')"></i>
                </a>
              </th>
              <th class="visible-lg">
                <a ng-click="$ctrl.sortProp('write_bytes_max')">
                  Max. Write Bandwidth <i class="fa" ng-class="$ctrl.getClass('write_bytes_max')"></i>
                </a>
              </th>
              <th>
                <a ng-click="$ctrl.sortProp('read_iops_average')">
                  Avg. Read IOPS <i class="fa" ng-class="$ctrl.getClass('read_iops_average')"></i>
                </a>
              </th>
              <th class="visible-lg">
                <a ng-click="$ctrl.sortProp('read_iops_min')">
                  Min. Read IOPS <i class="fa" ng-class="$ctrl.getClass('read_iops_min')"></i>
                </a>
              </th>
              <th class="visible-lg">
                <a ng-click="$ctrl.sortProp('read_iops_max')">
                  Max. Read IOPS <i class="fa" ng-class="$ctrl.getClass('read_iops_max')"></i>
                </a>
              </th>
              <th>
                <a ng-click="$ctrl.sortProp('write_iops_average')">
                Avg. Write IOPS <i class="fa" ng-class="$ctrl.getClass('write_iops_average')"></i>
                </a>
              </th>
              <th class="visible-lg">
                <a ng-click="$ctrl.sortProp('write_iops_min')">
                Min. Write IOPS <i class="fa" ng-class="$ctrl.getClass('write_iops_min')"></i>
                </a>
              </th>
              <th class="visible-lg">
                <a ng-click="$ctrl.sortProp('write_iops_max')">
                Max. Write IOPS <i class="fa" ng-class="$ctrl.getClass('write_iops_max')"></i>
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
                {{ x.read_bytes_average | throughput }}
              </td>
              <td class="visible-lg">
                {{ x.read_bytes_min | throughput }}
              </td>
              <td class="visible-lg">
                {{ x.read_bytes_max | throughput }}
              </td>
              <td>
                {{ x.write_bytes_average | throughput }}
              </td>
              <td class="visible-lg">
                {{ x.write_bytes_min | throughput }}
              </td>
              <td class="visible-lg">
                {{ x.write_bytes_max | throughput }}
              </td>
              <td>
                {{ x.read_iops_average | round:3 }}
              </td>
              <td class="visible-lg">
                {{ x.read_iops_min | round:3 }}
              </td>
              <td class="visible-lg">
                {{ x.read_iops_max | round:3 }}
              </td>
              <td>
                {{ x.write_iops_average | round:3 }}
              </td>
              <td class="visible-lg">
                {{ x.write_iops_min | round:3 }}
              </td>
              <td class="visible-lg">
                {{ x.write_iops_max | round:3 }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
};
