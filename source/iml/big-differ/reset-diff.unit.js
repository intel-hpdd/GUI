import 'angular-mocks';
import bigDifferModule from './big-differ-module';

describe('reset diff', () => {
  beforeEach(module(bigDifferModule));

  let $scope, resetDiffComponent, diffCtrl;

  beforeEach(
    inject(function($rootScope, $componentController) {
      $scope = $rootScope.$new();

      diffCtrl = {
        subscribe: jasmine.createSpy('subscribe'),
        reset: jasmine.createSpy('reset')
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
    expect(diffCtrl.subscribe).toHaveBeenCalledOnceWith(jasmine.any(Function));
  });

  it('should proxy the reset method', () => {
    expect(resetDiffComponent.reset).toBe(diffCtrl.reset);
  });
});
