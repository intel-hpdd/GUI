// @flow

import { querySelector } from '../../../../source/iml/dom-utils.js';

import angular from '../../../angular-mock-setup.js';
import type { $scopeT, $compileT } from 'angular';

describe('tree target item component', () => {
  let mod, mockToggleItem;

  beforeEach(() => {
    mockToggleItem = jest.fn();

    jest.mock('../../../../source/iml/tree/tree-utils', () => ({
      toggleItem: mockToggleItem
    }));

    mod = require('../../../../source/iml/tree/tree-target-item-component.js');
  });

  beforeEach(
    angular.mock.module($compileProvider => {
      $compileProvider.component('treeTargetItem', mod.default);
    })
  );

  let el, $scope;

  beforeEach(
    angular.mock.inject(($compile: $compileT, $rootScope: $scopeT) => {
      $scope = Object.create($rootScope.$new());

      $scope.record = {
        id: 1,
        label: 'target1'
      };

      const template =
        '<tree-target-item fs-id="\'1\'" kind="\'ost\'" record="record"></tree-target-item>';

      el = $compile(template)($scope)[0];
      $scope.$digest();
    })
  );

  it('should link to the target detail page', () => {
    const route = querySelector(el, 'a').getAttribute('ui-sref');

    expect(route).toBe(
      'app.oldTarget({ id: $ctrl.record.id, resetState: true })'
    );
  });

  it('should link to the target dashboard page', () => {
    const route = querySelector(el, 'a.dashboard-link').getAttribute('ui-sref');

    expect(route).toBe(
      'app.dashboard.ost({ id: $ctrl.record.id, resetState: true })'
    );
  });

  it('should render the label', () => {
    expect(querySelector(el, 'a').textContent.trim()).toBe('target1');
  });
});
