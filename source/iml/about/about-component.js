//@flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import Inferno from 'inferno';
import { IS_RELEASE, VERSION, BUILD, HELP_TEXT } from '../environment.js';

function AboutComponent() {
  return (
    <div class="container container-full about-ctrl">
      <div>
        <div>
          <div class="about-logo" />
          {IS_RELEASE
            ? <text>
                Intel® Manager for Lustre* software {VERSION} (build {BUILD})
              </text>
            : <text>
                Intel® Manager for Lustre* software build: {BUILD}
              </text>}
        </div>
      </div>
      <div>
        <div>
          <p>
            Copyright © {HELP_TEXT.copyright_year}{' '}
            <a href="http://www.intel.com/">Intel Corporation</a>
            . All rights reserved.
          </p>
        </div>
      </div>
      <div>
        <div>
          <p>
            Intel is a trademark of Intel Corporation in the U.S. and other
            countries.
            <br />
            * Other names and brands may be claimed as the property of others.
          </p>
        </div>
      </div>
      <div>
        <div>
          <h4>Licensing notices</h4>
          <h5>GPL components</h5>

          <p>
            The software includes some third party software licensed under the
            GNU GPL. Please contact Intel if you require the source code to GPL
            components.
          </p>
        </div>
      </div>
    </div>
  );
}

export default {
  bindings: {},
  controller: function($element: HTMLElement[]) {
    'ngInject';
    Inferno.render(<AboutComponent />, $element[0]);
  }
};
