// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export default {
  require: {
    togglerContainer: "^multiTogglerContainer"
  },
  template: `
    <div class="btn-group btn-group-justified btn-block">
      <a type="button" ng-click="::$ctrl.togglerContainer.toggleChange('all')" ng-model="$ctrl.toggleType" uib-btn-radio="'all'" class="btn btn-info btn">Select All</a>
      <a type="button" ng-click="::$ctrl.togglerContainer.toggleChange('none')" ng-model="$ctrl.toggleType" uib-btn-radio="'none'" class="btn btn-info btn">Select None</a>
      <a type="button" ng-click="::$ctrl.togglerContainer.toggleChange('invert')" ng-model="$ctrl.toggleType"  uib-btn-radio="'invert'" class="btn btn-info btn">Invert Selection</a>
    </div>
  `
};
