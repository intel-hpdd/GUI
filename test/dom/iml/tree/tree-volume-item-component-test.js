// @flow

import {
  mock,
  resetAll
} from '../../../system-mock.js';

import type {
  $scopeT,
  $compileT
} from 'angular';

describe('tree server item component', () => {
  let mod;

  beforeEachAsync(async function () {
    mod = await mock('source/iml/tree/tree-volume-item-component.js', {});
  });

  beforeEach(module($compileProvider => {
    $compileProvider.component('treeVolumeItem', mod.default);
  }));


  let el, $scope;

  beforeEach(inject(($compile:$compileT, $rootScope:$scopeT) => {
    $scope = Object.create($rootScope.$new());

    $scope.record = {
      id: 1,
      label: 'disk1'
    };

    $scope.parent = {
      treeId: 1,
      opens: {}
    };

    const template = '<tree-volume-item parent="parent" record="record"></tree-volume-item>';

    el = $compile(template)($scope)[0];
    $scope.$digest();
  }));

  afterEach(resetAll);

  it('should render the label', () => {
    expect(el.textContent.trim())
      .toBe('disk1');
  });
});
