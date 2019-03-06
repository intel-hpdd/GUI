//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from "@iml/fp";
import _ from "@iml/lodash-mixins";
import highland from "highland";
import socketStream from "../socket/socket-stream.js";
import waitForCommandCompletion from "../command/wait-for-command-completion-service.js";

const viewLens = fp.flow(
  fp.lensProp,
  fp.view
);
const objectsLens = viewLens("objects");

export function getHostProfilesFactory(CACHE_INITIAL_DATA) {
  "ngInject";
  return function getHostProfiles(spring, hosts) {
    const stream = spring("hostProfile", "/host_profile", {
      qs: {
        id__in: _.pluck(hosts, "id"),
        server_profile__user_selectable: true,
        limit: 0
      }
    });

    return stream
      .map(objectsLens)
      .tap(function throwIfError(x) {
        if (x.error) throw new Error(x.error);
      })
      .map(fp.map(viewLens("host_profiles")))
      .filter(fp.every(viewLens("profiles_valid")))
      .map(function(hosts) {
        // Pull out the profiles and flatten them.
        const profiles = [{}].concat(_.pluck(hosts, "profiles")).concat(function concatArrays(a, b) {
          return _.isArray(a) ? a.concat(b) : undefined;
        });
        const merged = _.merge.apply(_, profiles);

        return Object.keys(merged).reduce(function buildStructure(arr, profileName) {
          const item = {
            name: profileName,
            uiName: _.find(CACHE_INITIAL_DATA.server_profile, {
              name: profileName
            }).ui_name,
            invalid: merged[profileName].some(didProfileFail)
          };

          item.hosts = hosts.map(function setHosts(host) {
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
  };
}

export function createHostProfilesFactory() {
  "ngInject";
  return function createHostProfiles(profile, showCommands) {
    const findInProfiles = _.findInCollection(["address"], profile.hosts);

    return socketStream(
      "/host",
      {
        jsonMask: "objects(id,address,server_profile)",
        qs: { limit: 0 }
      },
      true
    )
      .map(objectsLens)
      .map(
        fp.flow(
          fp.filter(x => x.server_profile && x.server_profile.initial_state === "unconfigured"),
          fp.filter(findInProfiles),
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
      .map(objectsLens)
      .map(fp.map(x => x.commands[0]))
      .flatMap(x => (x.length ? waitForCommandCompletion(showCommands)(x) : highland([])));
  };
}
