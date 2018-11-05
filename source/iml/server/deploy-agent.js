// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import highland from "highland";
import * as fp from "@iml/fp";
import waitForCommandCompletion from "../command/wait-for-command-completion-service.js";
import createOrUpdateHostsStream from "./create-or-update-hosts-stream.js";
import { getCommandAndHost } from "./server-transforms.js";
import { rememberValue } from "../api-transforms.js";
import { getHostProfiles } from "./create-host-profiles-stream.js";

import { type AuthTypesT } from "./server-authorization-component.js";
import { type ProfileT } from "./server-module.js";

// Deploy agent code
const waitForCommand = fp.flow(
  fp.map(x => x.command),
  fp.filter(Boolean),
  xs => (xs.length ? waitForCommandCompletion(true)(xs) : highland([]))
);

export const sortProfiles = (profiles: ProfileT[]) =>
  profiles
    .sort((a, b) => {
      if (a.invalid === true) return 1;
      else if (b.invalid === true) return -1;
      else return 0;
    })
    .sort((a, b) => {
      if (a.name === "base_monitored") return -1;
      else if (b.name === "base_monitored") return 1;
      else return 0;
    });

const deployAgent = (addresses: string[], authType: AuthTypesT) =>
  createOrUpdateHostsStream({ addresses: [...addresses], auth_type: authType })
    .through(getCommandAndHost)
    .through(rememberValue(waitForCommand))
    .map(fp.map(({ host }) => host))
    .flatMap(getHostProfiles)
    .map(sortProfiles);

export default deployAgent;
