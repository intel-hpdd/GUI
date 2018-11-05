// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { AUTHORIZATION_TYPES } from "./server-authorization-component.js";

import { type AuthTypesT } from "./server-authorization-component.js";
import { type ServerToApiT } from "./server-module.js";

export type AuthPropsT = {|
  auth_type: AuthTypesT,
  root_password?: string,
  private_key?: string,
  private_key_passphrase?: string
|};

type AddressAndPickedT =
  | {
      address: string
    }
  | AuthPropsT;

export default function serversToApiObjects(servers: ServerToApiT): AddressAndPickedT[] {
  const toPick = ["auth_type"];

  if (servers.auth_type === AUTHORIZATION_TYPES.ROOT_PASSWORD) toPick.push("root_password");
  else if (servers.auth_type === AUTHORIZATION_TYPES.ANOTHER_KEY) toPick.push("private_key", "private_key_passphrase");

  const picked: AuthPropsT = (Object.assign({}, ...toPick.map((prop: string) => ({ [prop]: servers[prop] }))): any);
  return servers.addresses.map((address: string) => ({ ...{ address }, ...picked }));
}
