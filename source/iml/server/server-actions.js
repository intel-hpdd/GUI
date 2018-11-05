// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from "@iml/fp";
import serverProfile from "../server-profile.js";

import type { hostT } from "../api-types.js";

export default function serverActionsFactory() {
  "ngInject";
  function convertNonMultiJob(hosts: hostT[]) {
    return [
      {
        class_name: this.jobClass,
        args: {
          hosts: hosts.map(x => x.resource_uri)
        }
      }
    ];
  }

  const noUpdates = fp.eqFn(fp.identity)(x => x.needs_update)(false);
  const memberOfFs = fp.eqFn(fp.identity)(x => x.member_of_active_filesystem)(true);
  const mutableState = fp.eqFn(fp.identity)(x => x.immutable_state)(false);
  const memberOfFsAndMutable = fp.and([memberOfFs, mutableState]);
  const memberOfFsOrNoUpdates = fp.or([noUpdates, memberOfFsAndMutable]);

  const updateButtonTooltipMessage = fp.cond(
    [fp.every(noUpdates), () => "No updates available."],
    [
      fp.every(memberOfFsAndMutable),
      () =>
        `All servers are part of an active file system.
 Stop associated active file system(s) to install updates.`
    ],
    [fp.every(memberOfFsOrNoUpdates), () => "All servers are part of an active file system or do not have updates."],
    [fp.True, () => "Install updated software on the selected servers."]
  );

  const updateToggleTooltipMessage = fp.cond(
    [noUpdates, h => `No updates for ${h.label}.`],
    [memberOfFsAndMutable, h => `${h.label} is a member of an active filesystem.`]
  );

  const isNotManagedServer = fp.eqFn(fp.identity)(x => {
    const profile = serverProfile(x.server_profile);
    if (profile != null) return profile.managed;
  })(false);

  const rewriteButtonMessage = fp.cond(
    [
      fp.every(isNotManagedServer),
      () =>
        `No managed servers found.
Re-write target configuration may only be performed on managed servers.`
    ],
    [fp.True, () => "Update each target with the current NID for the server with which it is associated."]
  );

  return [
    {
      value: "Detect File Systems",
      message: "Detecting File Systems",
      helpTopic: "detect_file_systems-dialog",
      buttonTooltip: () => "Detect an existing file system to be monitored at the manager GUI.",
      jobClass: "DetectTargetsJob",
      convertToJob: convertNonMultiJob
    },
    {
      value: "Re-write Target Configuration",
      message: "Updating file system NIDs",
      helpTopic: "rewrite_target_configuration-dialog",
      buttonTooltip: rewriteButtonMessage,
      buttonDisabled: fp.every(isNotManagedServer),
      toggleDisabledReason: (h: hostT) => `Re-write target cannot be performed on non-managed server ${h.label}.`,
      toggleDisabled: isNotManagedServer,
      jobClass: "UpdateNidsJob",
      convertToJob: convertNonMultiJob
    },
    {
      value: "Install Updates",
      message: "Install updates",
      helpTopic: "install_updates_dialog",
      buttonTooltip: updateButtonTooltipMessage,
      buttonDisabled: fp.every(memberOfFsOrNoUpdates),
      toggleDisabledReason: updateToggleTooltipMessage,
      toggleDisabled: memberOfFsOrNoUpdates,
      jobClass: "UpdateJob",
      convertToJob(hosts: hostT[]) {
        return (hosts.map((host: hostT) => {
          return {
            class_name: this.jobClass,
            args: {
              host_id: host.id
            }
          };
        }, this): jobT[]);
      }
    }
  ];
}
