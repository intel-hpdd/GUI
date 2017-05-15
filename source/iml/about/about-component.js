//@flow

//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2016 Intel Corporation All Rights Reserved.
//
// The source code contained or described herein and all documents related
// to the source code ("Material") are owned by Intel Corporation or its
// suppliers or licensors. Title to the Material remains with Intel Corporation
// or its suppliers and licensors. The Material contains trade secrets and
// proprietary and confidential information of Intel or its suppliers and
// licensors. The Material is protected by worldwide copyright and trade secret
// laws and treaty provisions. No part of the Material may be used, copied,
// reproduced, modified, published, uploaded, posted, transmitted, distributed,
// or disclosed in any way without Intel's prior express written permission.
//
// No license under any patent, copyright, trade secret or other intellectual
// property right is granted to or conferred upon you by disclosure or delivery
// of the Materials, either expressly, by implication, inducement, estoppel or
// otherwise. Any license under such intellectual property rights must be
// express and approved by Intel in writing.

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
            : <text>Intel® Manager for Lustre* software build: {BUILD}</text>}
        </div>
      </div>
      <div>
        <div>
          <p>
            Copyright ©
            {' '}
            {HELP_TEXT.copyright_year}
            {' '}
            <a href="http://www.intel.com/">Intel Corporation</a>
            . All rights reserved.
          </p>
        </div>
      </div>
      <div>
        <div>
          <p>
            Intel is a trademark of Intel Corporation in the U.S. and other countries.
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
            The software includes some third party software licensed under the GNU GPL.  Please
            contact Intel if you require the source code to GPL components.
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
