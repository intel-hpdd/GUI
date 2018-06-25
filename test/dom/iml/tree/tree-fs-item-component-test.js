// @flow

import { querySelector } from '../../../../source/iml/dom-utils.js';
import angular from '../../../angular-mock-setup.js';
import type { $scopeT, $compileT } from 'angular';

describe('tree fs item component', () => {
  let mockToggleItem, treeFsComponent;

  beforeEach(() => {
    mockToggleItem = jest.fn();

    jest.mock('../../../../source/iml/tree/tree-utils', () => ({
      toggleItem: mockToggleItem
    }));

    treeFsComponent = require('../../../../source/iml/tree/tree-fs-item-component.js').default;
  });

  beforeEach(
    angular.mock.module($compileProvider => {
      $compileProvider.component('treeFsItem', treeFsComponent);
    })
  );

  let el, $scope;

  beforeEach(
    angular.mock.inject(($compile: $compileT, $rootScope: $scopeT) => {
      $scope = Object.create($rootScope.$new());

      $scope.record = {
        id: 1,
        label: 'fs1'
      };

      $scope.parent = {
        treeId: 1,
        opens: {}
      };

      const template = '<tree-fs-item parent="parent" record="record"></tree-fs-item>';

      el = $compile(template)($scope)[0];
      $scope.$digest();
    })
  );

  it('should link to the fs detail page', () => {
    const route = querySelector(el, 'a').getAttribute('ui-sref');

    expect(route).toBe('app.oldFilesystemDetail({ id: $ctrl.record.id, resetState: true })');
  });

  it('should link to the fs dashboard page', () => {
    const route = querySelector(el, 'a.dashboard-link').getAttribute('ui-sref');

    expect(route).toBe('app.dashboard.fs({ id: $ctrl.record.id, resetState: true })');
  });

  it('should render the label', () => {
    expect(querySelector(el, 'a').textContent.trim()).toBe('fs1');
  });

  it('should not render any children', () => {
    expect(el.querySelector('.children')).toBeNull();
  });

  it('should start with arrow pointed right', () => {
    expect(querySelector(el, 'i.fa-chevron-right')).not.toHaveClass('fa-rotate-90');
  });

  describe('on click', () => {
    beforeEach(() => {
      const chevron = querySelector(el, 'i.fa-chevron-right');
      chevron.click();
      $scope.parent.opens[1] = true;
      $scope.$digest();
    });

    it('should call the store', () => {
      expect(mockToggleItem).toHaveBeenCalledOnceWith(1, 1, true);
    });

    it('should show the children', () => {
      expect(querySelector(el, '.children')).not.toBeNull();
    });
  });
});
