//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from "@iml/fp";
import highland from "highland";
import socketStream from "../socket/socket-stream.js";
import deepmerge from "deepmerge";
import { CACHE_INITIAL_DATA } from "../environment.js";
import waitForCommandCompletion from "../command/wait-for-command-completion-service.js";

export function getHostProfiles(hosts) {
  const stream = socketStream("/host_profile", {
    qs: {
      id__in: hosts.map(({ id }) => id),
      server_profile__user_selectable: true,
      limit: 0
    }
  });

  return stream
    .map(({ objects }) => objects)
    .tap(x => {
      if (x.error) throw new Error(x.error);
    })
    .map(fp.map(({ host_profiles: hostProfiles }) => hostProfiles))
    .filter(fp.every(x => x.profiles_valid))
    .map(hosts => {
      // Pull out the profiles and flatten them.
      const profiles = hosts.map(({ profiles }) => profiles);
      const merged = deepmerge.all(profiles);

      return Object.keys(merged).reduce((arr, profileName) => {
        const item = {
          name: profileName,
          uiName: CACHE_INITIAL_DATA.server_profile.find(({ name }) => name === profileName).ui_name,
          invalid: merged[profileName].some(didProfileFail)
        };

        item.hosts = hosts.map(host => {
          const profiles = host.profiles[profileName].filter(didProfileFail);

          return {
            address: host.address,
            invalid: profiles.some(didProfileFail),
            problems: profiles,
            uiName: item.uiName
          };
        });

        arr.push(item);

        return arr;
      }, []);
    });

  function didProfileFail(profile) {
    return !profile.pass;
  }
}

export const createHostProfiles = (profile, showCommands) => {
  return socketStream(
    "/host",
    {
      jsonMask: "objects(id,address,server_profile)",
      qs: { limit: 0 }
    },
    true
  )
    .map(({ objects }) => objects)
    .map(
      fp.flow(
        fp.filter(x => x.server_profile && x.server_profile.initial_state === "unconfigured"),
        fp.filter(({ address }) => profile.hosts.find(host => host.address === address)),
        fp.map(x => ({
          host: x.id,
          profile: profile.name
        })),
        objects => ({
          method: "post",
          json: {
            objects
          }
        })
      )
    )
    .flatMap(x => socketStream("/host_profile", x, true))
    .map(({ objects }) => objects)
    .map(fp.map(x => x.commands[0]))
    .flatMap(x => (x.length ? waitForCommandCompletion(showCommands)(x) : highland([])));
};
