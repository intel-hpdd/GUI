// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from '@iml/fp';
import highland from 'highland';

import type { $scopeT } from 'angular';

import type { HighlandStreamT } from 'highland';

import type { Command } from './command-types.js';

import { setState, trimLogs } from './command-transforms.js';

import type { PropagateChange } from '../extend-scope-module.js';

export function CommandModalCtrl(
  commandsStream: HighlandStreamT<Command[]>,
  $scope: $scopeT,
  propagateChange: PropagateChange
) {
  'ngInject';
  this.accordion0 = true;

  const xForm = highland.map(
    fp.map(
      fp.flow(
        trimLogs,
        setState
      )
    )
  );

  propagateChange($scope, this, 'commands', xForm(commandsStream));
}

export function openCommandModalFactory($uibModal: Object) {
  'ngInject';
  return (stream: HighlandStreamT<Command[]>) =>
    $uibModal.open({
      template: `<div class="modal-header">
  <h3 class="modal-title">Commands</h3>
</div>
<div class="modal-body command-modal-body">
  <uib-accordion close-others="false">
    <uib-accordion-group is-open="commandModal['accordion' + $index]" ng-repeat="command in commandModal.commands track by command.id">
      <uib-accordion-heading>
        <i class="fa" ng-class="{'fa-chevron-down': commandModal['accordion' + $index], 'fa-chevron-right': !commandModal['accordion' + $index]}"></i>
        <i class="fa header-status" ng-class="{'fa-times': command.state === 'cancelled', 'fa-exclamation': command.state === 'failed', 'fa-check': command.state === 'succeeded', 'fa-refresh fa-spin': command.state === 'pending'}"></i>
        <span>
          {{ ::command.message }} - {{ ::command.created_at | date:'MMM dd yyyy HH:mm:ss' }}
        </span>
      </uib-accordion-heading>
      <h4>Details:</h4>
      <table class="table">
        <tr>
          <td>Created At</td>
          <td>{{ ::command.created_at | date:'MMM dd yyyy HH:mm:ss' }}</td>
        </tr>
        <tr>
          <td>Status</td>
          <td>{{command.state | capitalize}}</td>
        </tr>
      </table>

      <div ng-if="command.jobs.length > 0" ng-controller="JobTreeCtrl as jobTree">
        <h4>Jobs</h4>
        <div class="well jobs">
          <div ng-if="jobTree.jobs.length === 0">
            Loading Jobs... <i class="fa fa-spinner fa-spin"></i>
          </div>

          <div ng-repeat="job in jobTree.jobs track by job.id"
               ng-include="'/gui/job.html'"></div>
        </div>
      </div>

      <div ng-if="command.logs">
        <h4>Logs</h4>
        <pre class="logs">{{ command.logs }}</pre>
      </div>
    </uib-accordion-group>
  </uib-accordion>
</div>
<div class="modal-footer">
  <button class="btn btn-danger" ng-click="$close('close')">Close <i class="fa fa-times-circle-o"></i></button>
</div>`,
      controller: 'CommandModalCtrl',
      controllerAs: 'commandModal',
      windowClass: 'command-modal',
      backdrop: 'static',
      backdropClass: 'command-modal-backdrop',
      resolve: {
        commandsStream: fp.always(stream)
      }
    });
}
