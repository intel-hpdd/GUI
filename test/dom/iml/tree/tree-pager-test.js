// @flow

import angular from '../../../angular-mock-setup.js';

import uiBootstrapModule from 'angular-ui-bootstrap';

import type { $scopeT, $compileT } from 'angular';

describe('tree pager', () => {
  let mod, mockUpdateCollOffset;

  beforeEach(() => {
    if (!window.angular) require('angular');
  });

  beforeEach(function() {
    mockUpdateCollOffset = jest.fn();

    jest.mock('../../../../source/iml/tree/tree-utils.js', () => ({
      updateCollOffset: mockUpdateCollOffset
    }));

    mod = require('../../../../source/iml/tree/tree-pager.js');
  });

  beforeEach(
    angular.mock.module(uiBootstrapModule, $compileProvider => {
      $compileProvider.component('treePager', mod.default);
    })
  );

  let el, $scope;

  beforeEach(
    inject(($compile: $compileT, $rootScope: $scopeT) => {
      $scope = Object.create($rootScope.$new());

      $scope.meta = {
        total_count: 100,
        limit: 20,
        current_page: 1
      };

      $scope.treeId = 1;

      const template = '<tree-pager meta="meta" tree-id="treeId"></tree-pager>';

      el = $compile(template)($scope)[0];
      $scope.$digest();
    })
  );

  it('should disable prev on first page', () => {
    expect(el.querySelector('li')).toHaveClass('disabled');
  });

  it('should not disable next on first page', () => {
    expect(el.querySelectorAll('li')[1]).not.toHaveClass('disabled');
  });

  it('should disable next on last page', () => {
    $scope.meta.current_page = 5;
    $scope.$digest();

    expect(el.querySelectorAll('li')[1]).toHaveClass('disabled');
  });

  it('should not disable prev on last page', () => {
    $scope.meta.current_page = 5;
    $scope.$digest();

    expect(el.querySelector('li')).not.toHaveClass('disabled');
  });

  it('should hide the pager when not needed', () => {
    $scope.meta.limit = 100;
    $scope.$digest();

    expect(el.querySelector('ul')).toBeNull();
  });

  it('should dispatch on page change', () => {
    el.querySelectorAll('li a')[1].click();

    expect(mockUpdateCollOffset).toHaveBeenCalledOnceWith(1, 20);
  });
});
