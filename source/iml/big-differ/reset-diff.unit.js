import angular from '../../../test/angular-mock-setup.js';

import bigDifferModule from './big-differ-module';

describe('reset diff', () => {
  beforeEach(() => {
    if (!window.angular) require('angular');
  });

  beforeEach(angular.mock.module(bigDifferModule));

  let $scope, resetDiffComponent, diffCtrl;

  beforeEach(
    angular.mock.inject(function($rootScope, $componentController) {
      $scope = $rootScope.$new();

      diffCtrl = {
        subscribe: jest.fn(),
        reset: jest.fn()
      };

      resetDiffComponent = $componentController(
        'resetDiff',
        { $scope },
        { diffCtrl }
      );
      resetDiffComponent.$onInit();
    })
  );

  it('should subscribe to changes', () => {
    expect(diffCtrl.subscribe).toHaveBeenCalledOnceWith(expect.any(Function));
  });

  it('should proxy the reset method', () => {
    expect(resetDiffComponent.reset).toBe(diffCtrl.reset);
  });
});
