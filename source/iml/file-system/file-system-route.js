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

// @flow

import store from '../store/get-store.js';
import broadcaster from '../broadcaster.js';

// $FlowIgnore: HTML templates that flow does not recognize.
import loadingTemplate from '../loading/assets/html/loading';

export default function mgtRoute ($routeSegmentProvider:Object, GROUPS:Object):void {
  'ngInject';


  $routeSegmentProvider
    .when('/configure/filesystem', 'app.fileSystem')
    .within('app')
    .segment('fileSystem', {
      controller: function controller () {
        'ngInject';

        this.fileSystem$ = store.select('fileSystems');

        this.jobIndicator$ = broadcaster(
          store
            .select('jobIndicators')
        );

        this.alertIndicator$ = broadcaster(
          store
          .select('alertIndicators')
        );
      },
      controllerAs: '$ctrl',
      access: GROUPS.FS_ADMINS,
      untilResolved: {
        templateUrl: loadingTemplate
      },
      middleware: [
        'allowAnonymousReadMiddleware',
        'eulaStateMiddleware',
        'authenticationMiddleware'
      ],
      template: `
<h3 class="page-header">
  <i class="fa fa-files-o" aria-hidden="true"></i> File Systems
</h3>
<div class="container container-full">
  <file-system file-system-$="$ctrl.fileSystem$" alert-indicator-$="$ctrl.alertIndicator$"
       job-indicator-$="$ctrl.jobIndicator$"></file-system>
</div>
`
    });
}
