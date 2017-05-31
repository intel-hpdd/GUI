//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import {every, True, cond, or, and, view, compose,
  eqFn, identity, lensProp} from 'intel-fp';

const viewLens = compose(view, lensProp);

export default function serverActionsFactory () {
  'ngInject';

  function convertNonMultiJob (hosts) {
    /*jshint validthis: true */
    return [{
      class_name: this.jobClass,
      args: {
        hosts: hosts.map(viewLens('resource_uri'))
      }
    }];
  }

  const noUpdates = eqFn(identity, viewLens('needs_update'), false);
  const memberOfFs = eqFn(identity, viewLens('member_of_active_filesystem'), true);
  const mutableState = eqFn(identity, viewLens('immutable_state'), false);
  const memberOfFsAndMutable = and([memberOfFs, mutableState]);
  const memberOfFsOrNoUpdates = or([noUpdates, memberOfFsAndMutable]);

  const updateButtonTooltipMessage = cond(
    [every(noUpdates), () => 'No updates available.'],
    [every(memberOfFsAndMutable), () => `All servers are part of an active file system.
 Stop associated active file system(s) to install updates.`],
    [every(memberOfFsOrNoUpdates), () => 'All servers are part of an active file system or do not have updates.'],
    [True, () => 'Install updated software on the selected servers.']
  );

  const updateToggleTooltipMessage = cond(
    [noUpdates, (h) => `No updates for ${h.label}.`],
    [memberOfFsAndMutable, (h) => `${h.label} is a member of an active filesystem.`]
  );

  const isNotManagedServer = eqFn(
    identity,
    view(compose(lensProp('server_profile'), lensProp('managed'))),
    false
  );

  const rewriteButtonMessage = cond(
    [every(isNotManagedServer), () => `No managed servers found.
Re-write target configuration may only be performed on managed servers.`],
    [True, () => 'Update each target with the current NID for the server with which it is associated.']
  );

  return [
    {
      value: 'Detect File Systems',
      message: 'Detecting File Systems',
      helpTopic: 'detect_file_systems-dialog',
      buttonTooltip: () => 'Detect an existing file system to be monitored at the manager GUI.',
      jobClass: 'DetectTargetsJob',
      convertToJob: convertNonMultiJob
    },
    {
      value: 'Re-write Target Configuration',
      message: 'Updating file system NIDs',
      helpTopic: 'rewrite_target_configuration-dialog',
      buttonTooltip: rewriteButtonMessage,
      buttonDisabled: every(isNotManagedServer),
      toggleDisabledReason: (h) => `Re-write target cannot be performed on non-managed server ${h.label}.`,
      toggleDisabled: isNotManagedServer,
      jobClass: 'UpdateNidsJob',
      convertToJob: convertNonMultiJob
    },
    {
      value: 'Install Updates',
      message: 'Install updates',
      helpTopic: 'install_updates_dialog',
      buttonTooltip: updateButtonTooltipMessage,
      buttonDisabled: every(memberOfFsOrNoUpdates),
      toggleDisabledReason: updateToggleTooltipMessage,
      toggleDisabled: memberOfFsOrNoUpdates,
      jobClass: 'UpdateJob',
      convertToJob (hosts) {
        return hosts.map((host) => {
          return {
            class_name: this.jobClass,
            args: {
              host_id: host.id
            }
          };
        }, this);
      }
    }
  ];
}
