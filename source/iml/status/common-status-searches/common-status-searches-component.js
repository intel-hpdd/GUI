//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export default {
  controllerAs: "vm",
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
