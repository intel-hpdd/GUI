//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { resolveStream } from '../promise-transforms.js';
import socketStream from '../socket/socket-stream.js';
import { CACHE_INITIAL_DATA } from '../environment.js';

export function alertStream() {
  return resolveStream(
    socketStream('/alert/', {
      jsonMask: 'objects(message)',
      qs: {
        severity__in: ['WARNING', 'ERROR'],
        limit: 0,
        active: true
      }
    })
  );
}

export function appNotificationStream() {
  return resolveStream(socketStream('/health'));
}

export function appSessionFactory() {
  'ngInject';

  return CACHE_INITIAL_DATA.session;
}
