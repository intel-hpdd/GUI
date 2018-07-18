//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import _ from '@iml/lodash-mixins';
import { ADD_SERVER_AUTH_CHOICES } from './add-server-step.js';

export default function serversToApiObjects(servers) {
  const toPick = ['auth_type'];

  if (servers.auth_type === ADD_SERVER_AUTH_CHOICES.ROOT_PASSWORD) toPick.push('root_password');
  else if (servers.auth_type === ADD_SERVER_AUTH_CHOICES.ANOTHER_KEY)
    toPick.push('private_key', 'private_key_passphrase');

  const picked = _.pick(servers, toPick);
  return servers.addresses.map(function(address) {
    return _.extend({ address: address }, picked);
  });
}
