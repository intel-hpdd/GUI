// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { getData, fsCollStream } from "./hsm-fs-resolves.js";

import { copytoolStream, copytoolOperationStream, agentVsCopytoolChart } from "./hsm-resolves.js";

import { GROUPS } from "../auth/authorization.js";

export const hsmFsState = {
  name: "app.hsmFs",
  controller: "HsmFsCtrl",
  controllerAs: "hsmFs",
  template: `<div class="container container-full hsm">
  <div class="row">
    <div config-toggle class="col-xs-12">
      <button class="btn btn-block btn-sm btn-primary configure-hsm"
              ng-if="configToggle.inactive()"
              ng-click="configToggle.setActive()">
        Configure HSM<i class="fa fa-cog"></i>
      </button>
      <div class="well well-lg configure-hsm-well" ng-if="configToggle.active()">
        <form class="form">
          <div class="form-group">
            <label>File System</label>
            <select class="form-control"
                    ng-model="hsmFs.selectedFs"
                    ng-options="f.label for f in hsmFs.fileSystems track by f.id">
              <option value="">All File Systems</option>
            </select>
          </div>
          <button type="submit"
                  ng-click="configToggle.setInactive(hsmFs.onUpdate())"
                  class="btn btn-success btn-block">
            Update
          </button>
          <button ng-click="configToggle.setInactive()" class="btn btn-cancel btn-block">Cancel</button>
        </form>
      </div>
    </div>
  </div>
  <hsm-cdt-status ng-if="hsmFs.fs" file-system="hsmFs.fs"></hsm-cdt-status>
  <ui-loader-view class="section-top-margin"></ui-loader-view>
</div>`,
  data: {
    helpPage: "Graphical_User_Interface_9_0.html#9.3.4",
    access: GROUPS.FS_ADMINS,
    anonymousReadProtected: true
  },
  resolve: {
    fsStream: fsCollStream
  }
};

export const hsmState = {
  url: "/configure/hsm/:fsId",
  name: "app.hsmFs.hsm",
  params: {
    fsId: {
      value: null,
      dynamic: false,
      squash: true
    },
    resetState: {
      dynamic: true
    }
  },
  data: {
    kind: "HSM",
    icon: "fa-files-o"
  },
  controller: "HsmCtrl",
  controllerAs: "hsm",
  template: `<div class="no-copytools well text-center" ng-if="hsm.copytools.length === 0">
  <h3>No Copytools are configured</h3>
  <button ng-click="hsm.openAddModal()" ng-disabled="hsm.modalOpen" class="btn btn-primary btn-lg">
    <i class="fa fa-plus-circle"></i>Add Copytool
  </button>
</div>

<div ng-if="hsm.copytools.length > 0">
  <h4 class="section-header">Outstanding Agent Requests vs. Idle Copytool Workers</h4>
  <div chart-compiler chart="hsm.chart"></div>

  <h4 class="section-header">Active Copytool Operations</h4>
  <div ng-if="hsm.copytoolOperations.length > 0">
    <table class="table active-operations">
      <thead>
        <tr>
          <th>Copytool</th>
          <th>File</th>
          <th>Operation</th>
          <th>Status</th>
          <th class="hidden-xs">Progress</th>
          <th class="hidden-xs">Throughput</th>
        </tr>
      </thead>
      <tbody>
        <tr ng-repeat="copytoolOperation in hsm.copytoolOperations track by copytoolOperation.id">
          <td>{{ ::copytoolOperation.copytool.host.label }}</td>
          <td class="current-file">
            <a class="tooltip-container tooltip-hover">
              <i class="fa fa-question-circle">
                <iml-tooltip direction="top" size="'large'">
                  {{::copytoolOperation.description}}
                </iml-tooltip>
              </i>
            </a>
            {{ ::copytoolOperation.path | pathMaxLength:60 }}
          </td>
          <td class="operation" ng-switch="copytoolOperation.type">
            <span ng-switch-when="ARCHIVE">
              <i class="fa fa-hdd-o"></i><i class="fa fa-arrow-left"></i>
              <span class="status-text">Archiving</span>
            </span>
            <span ng-switch-when="REMOVE">
              <i class="fa fa-trash-o"></i>
              <span class="status-text">Removing</span>
            </span>
            <span ng-switch-when="RESTORE">
              <i class="fa fa-hdd-o"></i><i class="fa fa-arrow-right"></i>
              <span class="status-text">Restoring</span>
            </span>
          </td>
          <td class="state" ng-switch="copytoolOperation.state">
            <span ng-switch-when="CANCELED">
              <i class="fa fa-ban"></i>
              <span class="status-text">Canceled</span>
            </span>
            <span ng-switch-when="ERRORED">
              <i class="fa fa-exclamation-circle"></i>
              <span class="status-text">Error</span>
            </span>
            <span ng-switch-when="IDLE">
              <i class="fa fa-pause"></i>
              <span class="status-text">Idle</span>
            </span>
            <span ng-switch-when="RUNNING">
              <i class="fa fa-refresh fa-spin"></i>
              <span class="status-text">Running</span>
            </span>
            <span ng-switch-when="STARTED">
              <i class="fa fa-check-circle"></i>
              <span class="status-text">Started</span>
            </span>
            <span ng-switch-when="STOPPED">
              <i class="fa fa-exclamation-triangle"></i>
              <span class="status-text">Stopped</span>
            </span>
            <span ng-switch-when="UNCONFIGURED">
              <i class="fa fa-exclamation-circle"></i>
              <span class="status-text">Unconfigured</span>
            </span>
            <span ng-switch-when="working">
              <i class="fa fa-tasks"></i>
              <span class="status-text">Working ({{ copytool.active_operations_count }} tasks)</span>
            </span>
          </td>
          <td class="hidden-xs">
            <progress-circle radius="15" complete="{{ copytoolOperation.progress }}"></progress-circle>
            <span class="size"
                  ng-if="copytoolOperation.processed_bytes != null && copytoolOperation.total_bytes != null">
              {{ copytoolOperation.processed_bytes | fmtBytes }} / {{ copytoolOperation.total_bytes | fmtBytes }}
            </span>
          </td>
          <td class="hidden-xs">{{ copytoolOperation.throughput | throughput }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <h4 class="section-header">Copytools</h4>
  <table class="table copytools">
    <thead>
      <tr>
        <th>ID</th>
        <th>Archive</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr ng-repeat="copytool in hsm.copytools track by copytool.id">
        <td>{{ ::copytool.host.label }}</td>
        <td>{{ copytool.archive }}</td>
        <td ng-switch="copytool.status" class="status">
          <span ng-switch-when="canceled">
            <i class="fa fa-ban"></i>
            <span class="status-text">Canceled</span>
          </span>
          <span ng-switch-when="errored">
            <i class="fa fa-exclamation-circle"></i>
            <span class="status-text">Error</span>
          </span>
          <span ng-switch-when="idle">
            <i class="fa fa-pause"></i>
            <span class="status-text">Idle</span>
          </span>
          <span ng-switch-when="running">
            <i class="fa fa-refresh fa-spin"></i>
            <span class="status-text">Running</span>
          </span>
          <span ng-switch-when="started">
            <i class="fa fa-check-circle"></i>
            <span class="status-text">Started</span>
          </span>
          <span ng-switch-when="stopped">
            <i class="fa fa-exclamation-triangle"></i>
            <span class="status-text">Stopped</span>
          </span>
          <span ng-switch-when="unconfigured">
            <i class="fa fa-exclamation-circle"></i>
            <span class="status-text">Unconfigured</span>
          </span>
          <span ng-switch-when="working">
            <i class="fa fa-tasks"></i>
            <span class="status-text">Working ({{ copytool.active_operations_count }} tasks)</span>
          </span>
        </td>
        <td class="actions-cell">
          <action-dropdown records="copytool"></action-dropdown>
        </td>
      </tr>
    </tbody>
  </table>

  <button ng-click="hsm.openAddModal()" ng-disabled="hsm.modalOpen" class="btn btn-default btn-sm">
    <i class="fa fa-plus-circle text-success"></i>Add More Copytools
  </button>
</div>`,
  resolve: {
    getData,
    copytoolOperationStream,
    copytoolStream,
    agentVsCopytoolChart
  }
};
