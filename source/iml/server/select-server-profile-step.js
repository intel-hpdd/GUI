//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import highland from 'highland';
import _ from '@mfl/lodash-mixins';
import * as fp from '@mfl/fp';

import { getCommandAndHost } from './server-transforms.js';

import { rememberValue } from '../api-transforms.js';

import { resolveStream } from '../promise-transforms.js';

export function SelectServerProfileStepCtrl(
  $scope,
  $stepInstance,
  $exceptionHandler,
  OVERRIDE_BUTTON_TYPES,
  data,
  hostProfileStream,
  createHostProfiles,
  localApply
) {
  'ngInject';
  Object.assign(this, {
    pdsh: data.pdsh,
    transition: function transition(action) {
      if (action === OVERRIDE_BUTTON_TYPES.OVERRIDE) return;

      this.disabled = true;

      hostProfileStream.destroy();

      if (action === 'previous')
        return $stepInstance.transition(action, { data: data });

      createHostProfiles(
        this.profile,
        action === OVERRIDE_BUTTON_TYPES.PROCEED
      ).pull(function pullToken(err) {
        if (err) throw err;

        $stepInstance.end();
      });
    },
    onSelected: function onSelected(profile) {
      this.overridden = false;
      this.profile = profile;
    },
    getHostPath: function getHostPath(item) {
      return item.address;
    },
    pdshUpdate: function pdshUpdate(pdsh, hostnames, hostnamesHash) {
      this.hostnamesHash = hostnamesHash;
    },
    close: function close() {
      $scope.$emit('addServerModal::closeModal');
    }
  });

  const selectServerProfileStep = this;

  hostProfileStream
    .tap(function(profiles) {
      profiles.sort(function sortProfiles(a, b) {
        if (a.invalid === true) return 1;
        else if (b.invalid === true) return -1;
        else return 0;
      });

      selectServerProfileStep.profiles = profiles;

      // Avoid a stale reference here by
      // pulling off the new value if we already have a profile.
      const profile = selectServerProfileStep.profile;
      selectServerProfileStep.profile = profile
        ? _.find(profiles, { name: profile.name })
        : profiles[0];
    })
    .stopOnError(fp.unary($exceptionHandler))
    .each(localApply.bind(null, $scope));
}

export function selectServerProfileStep() {
  'ngInject';
  return {
    template: `<div class="modal-header">
  <button type="button" class="close" ng-click="selectServerProfile.close()" ng-disabled="selectServerProfile.disabled">
    <i class="fa fa-times"></i>
  </button>
  <h4 class="modal-title">Add Server - Add Server Profiles</h4>
  <span class="tooltip-container tooltip-hover">
    <i class="fa fa-question-circle">
      <iml-tooltip size="'large'" direction="bottom">
        <span>Select the server profile to be applied to all servers. Green squares represent servers that are compatible with the selected profile. Red squares represent servers that are incompatible with the selected server profile.</span>
      </iml-tooltip>
    </i>
  </span>
</div>
<div class="modal-body select-server-profile-step clearfix">
  <div ng-if="selectServerProfile.overridden" class="alert alert-danger" role="alert">
    You are about to configure one or more servers with an incompatible server profile.
    Configuring servers with incompatible server profiles is unsupported.
    Click <strong>proceed</strong> to continue.
  </div>
  <div>
    <label>Select Server Profile</label>
    <span class="tooltip-container tooltip-hover">
      <i class="fa fa-question-circle">
        <iml-tooltip size="'large'" direction="right">
          <span>Select a server profile to set on unconfigured servers.</span>
        </iml-tooltip>
      </i>
    </span>
  </div>
  <div class="btn-group fancy-select-box" uib-dropdown on-toggle="open = !open">
    <button type="button" class="form-control dropdown-toggle" ng-disabled="disabled" uib-dropdown-toggle>
      <span ng-if="selectServerProfile.profile.invalid" class="label label-danger">Incompatible</span>
      <span>{{ selectServerProfile.profile.uiName }}</span>
      <i class="fa" ng-class="{'fa-caret-down': open, 'fa-caret-up': !open}"></i>
    </button>
    <ul role="menu" uib-dropdown-menu>
      <li ng-repeat="profile in selectServerProfile.profiles track by profile.name" ng-click="selectServerProfile.onSelected(profile)">
        <a class="fancy-select-option">
          <span ng-if="profile.invalid" class="label label-danger">Incompatible</span>
          <span class="fancy-select-text">{{ profile.uiName }}</span>
        </a>
      </li>
    </ul>
  </div>

  <form class="filterServerForm" name="filterServerForm" novalidate>
    <div class="form-group pdsh-input" ng-class="{'has-error': filterServerForm.pdsh.$invalid, 'has-success': filterServerForm.pdsh.$valid}">
      <div>
        <label>Filter by Hostname / Hostlist Expression</label>
        <span class="tooltip-container tooltip-hover">
          <i class="fa fa-question-circle">
            <iml-tooltip size="'large'" direction="right">
              <span>Enter a hostname / hostlist expression to filter servers.</span>
            </iml-tooltip>
          </i>
        </span>
      </div>
      <pdsh pdsh-initial="selectServerProfile.pdsh" pdsh-change="selectServerProfile.pdshUpdate(pdsh, hostnames, hostnamesHash)"></pdsh>
    </div>
  </form>
  <div class="status-cell-container" ng-repeat="host in selectServerProfile.profile.hosts | pdsh:selectServerProfile.hostnamesHash:selectServerProfile.getHostPath track by host.address">
    <div ng-class="{invalid: host.invalid, valid: !host.invalid }"
    class="status-cell activate-popover tooltip-container tooltip-hover">
      <iml-tooltip size="'large'" direction="right">
        <span>Address: {{host.address}}</span>
      </iml-tooltip>
    </div>
    <iml-popover title="Status for {{ host.address }}" placement="bottom">
      <div ng-if="!host.invalid">
        <i class="fa fa-check-circle"></i> {{ host.uiName }} profile is compatible.
      </div>
      <div ng-if="host.invalid">
        <div class="callout callout-danger">
          <span>{{ host.address }}</span> incompatible with <span>{{ host.uiName }}</span> profile.
        </div>
        <h4>Reasons: </h4>
        <ul>
          <li ng-repeat="problem in host.problems track by problem.test">
            <i class="fa fa-times-circle"></i>
            <span ng-if="problem.error">There was an error: {{ problem.error }}.</span>
            <span ng-if="!problem.error">{{ problem.description }}.</span>
          </li>
        </ul>
      </div>
    </iml-popover>
  </div>
</div>
<div class="modal-footer">
  <button ng-disabled="selectServerProfile.disabled" ng-click="selectServerProfile.transition('previous')" class="btn btn-default"><i class="fa fa-long-arrow-left"></i> Previous</button>
  <override-button overridden="selectServerProfile.overridden" is-valid="!selectServerProfile.profile.invalid" on-change="selectServerProfile.transition(message)" is-disabled="selectServerProfile.disabled"></override-button>
</div>`,
    controller: 'SelectServerProfileStepCtrl as selectServerProfile',
    onEnter: function onEnter(
      data,
      createOrUpdateHostsStream,
      getHostProfiles,
      waitForCommandCompletion,
      showCommand
    ) {
      'ngInject';
      const getProfiles = _.partial(getHostProfiles, data.spring);

      const waitForCommand = fp.flow(
        fp.map(x => x.command),
        fp.filter(Boolean),
        x =>
          x.length ? waitForCommandCompletion(showCommand, x) : highland([])
      );

      const hostProfileStream = createOrUpdateHostsStream(data.servers)
        .through(getCommandAndHost)
        .through(rememberValue(waitForCommand))
        .map(fp.map(x => x.host))
        .flatMap(getProfiles);

      return {
        data,
        hostProfileStream: resolveStream(hostProfileStream)
      };
    },
    transition: function transition(steps) {
      return steps.serverStatusStep;
    }
  };
}
