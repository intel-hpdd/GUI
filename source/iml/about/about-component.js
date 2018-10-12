//@flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { render } from "inferno";
import { IS_RELEASE, VERSION, BUILD, HELP_TEXT } from "../environment.js";

function AboutComponent() {
  return (
    <div class="container container-full about-ctrl">
      <div>
        <div>
          <div class="about-logo" />
          {IS_RELEASE ? (
            <text>
              Integrated Manager for Lustre software {VERSION} (build {BUILD})
            </text>
          ) : (
            <text>Integrated Manager for Lustre software build: {BUILD}</text>
          )}
        </div>
      </div>
      <div>
        <div>
          <p>
            Copyright © {HELP_TEXT.copyright_year} <a href="http://www.ddn.com/">DDN</a>
            . All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default {
  bindings: {},
  controller: function($element: HTMLElement[]) {
    "ngInject";
    render(<AboutComponent />, $element[0]);
  }
};
