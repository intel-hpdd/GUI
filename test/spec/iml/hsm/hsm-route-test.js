import angular from 'angular';
import hsmRouteModule from '../../../../source/iml/hsm/hsm-route-module';

import {noop} from 'intel-fp';

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
  }, 'route-segment', hsmRouteModule));

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
        templateUrl: '/static/chroma_ui/source/iml/hsm/assets/html/hsm.js',
        resolve: {
          copytoolOperationStream: ['copytoolOperationStream', jasmine.any(Function)],
          copytoolStream: ['copytoolStream', jasmine.any(Function)],
          agentVsCopytoolChart: ['agentVsCopytoolChartResolve', jasmine.any(Function)]
        },
        untilResolved: {
          templateUrl: '/static/chroma_ui/source/iml/loading/assets/html/loading.js'
        },
        dependencies: ['fsId']
      });
    });
  });
});
