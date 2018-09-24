//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import _ from "@iml/lodash-mixins";

export default function getTestHostStreamFactory() {
  "ngInject";
  return function getTestHostStream(spring, objects) {
    const stream = spring("testHost", "/test_host", {
      method: "post",
      json: objects
    });

    const setUiName = _.pathForEach("status", function(status) {
      status.uiName = _.apiToHuman(status.name);
    });

    const s2 = stream.tap(_.fmap(setUiName)).map(function checkTotalValidity(resp) {
      return {
        objects: resp,
        valid: _.every(resp, "valid")
      };
    });

    s2.destroy = stream.destroy.bind(stream);

    return s2;
  };
}
