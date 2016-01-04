import angular from 'angular';
const {module, inject} = angular.mock;

import {noop} from 'intel-fp/fp';

describe('hsm route', () => {
  var $routeSegmentProvider;

  beforeEach(module(() => {
    $routeSegmentProvider = {
      $get: function get () {
      },
      within: jasmine.createSpy('$routeSegmentProvider.within'),
      segment: jasmine.createSpy('$routeSegmentProvider.segment')
    };

    $routeSegmentProvider.within.and.returnValue($routeSegmentProvider);

    angular.module('route-segment', []).provider({
      $routeSegment: $routeSegmentProvider
    });
  }, 'route-segment', 'hsmRoute'));

  beforeEach(inject(noop));

  describe('within', () => {
    it('should specify "app"', () => {
      expect($routeSegmentProvider.within).toHaveBeenCalledOnceWith('app');
    });

    it('should specify "hsmFs"', () => {
      expect($routeSegmentProvider.within).toHaveBeenCalledOnceWith('hsmFs');
    });
  });

  describe('segment', () => {
    it('should setup the hsm segment', () => {
      expect($routeSegmentProvider.segment).toHaveBeenCalledOnceWith('hsm', {
        controller: 'HsmCtrl',
        controllerAs: 'hsm',
        templateUrl: 'iml/hsm/assets/html/hsm.html',
        resolve: {
          copytoolOperationStream: ['copytoolOperationStream', jasmine.any(Function)],
          copytoolStream: ['copytoolStream', jasmine.any(Function)],
          agentVsCopytoolChart: ['agentVsCopytoolChartResolve', jasmine.any(Function)]
        },
        untilResolved: {
          templateUrl: 'common/loading/assets/html/loading.html'
        },
        dependencies: ['fsId']
      });
    });
  });
});
