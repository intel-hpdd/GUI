//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2015 Intel Corporation All Rights Reserved.
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

export default {
  controllerAs: 'vm',
  template: `<div class="common-status-searches">
  <uib-accordion>
    <uib-accordion-group is-open="vm.isOpen">
      <uib-accordion-heading>
        <i class="fa" ng-class="{'fa-chevron-down': vm.isOpen, 'fa-chevron-right': !vm.isOpen}"></i>
        Common Searches
      </uib-accordion-heading>
      <ul>
        <li>
          <a href="/ui/status/?severity__in=WARNING,ERROR&active=true">Search active alerts</a>
        </li>
        <li>
          <a href="/ui/status/?record_type__endswith=Alert">Search alerts</a>
        </li>
        <li>
          <a href="/ui/status/?record_type__contains=Command">Search commands</a>
        </li>
        <li>
          <a href="/ui/status/?record_type__contains=Event">Search events</a>
        </li>
      </ul>
    </uib-accordion-group>
  </uib-accordion>
</div>`
};
