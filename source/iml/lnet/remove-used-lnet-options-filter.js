// @flow

//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from '@iml/fp';

export default (): Function => (options: Array<Object>, networkInterfaces: Array<Object>, networkInterface: Object) => {
  const nids = fp.flow(
    fp.filter(x => x !== networkInterface),
    fp.pluck('nid')
  )(networkInterfaces);

  return options.filter(option => {
    // Not Lustre Network is a special case.
    // It should always be included.
    if (option.value === -1) return true;

    return nids.every(nid => nid.lnd_network !== option.value);
  });
};
