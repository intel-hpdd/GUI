import angular from 'angular';
const {module, inject} = angular.mock;

describe('hsm route', function () {

  var $routeSegmentProvider;

  beforeEach(module(function () {
    $routeSegmentProvider = {
      $get: function get () {},
      within: jasmine.createSpy('$routeSegmentProvider.within'),
      segment: jasmine.createSpy('$routeSegmentProvider.segment')
    };

    $routeSegmentProvider.within.andReturn($routeSegmentProvider);

    angular.module('route-segment', []).provider({
      $routeSegment: $routeSegmentProvider
    });
  }, 'route-segment', 'hsmRoute'));

  beforeEach(inject(fp.noop));

  describe('within', function () {
    it('should specify "app"', function () {
      expect($routeSegmentProvider.within).toHaveBeenCalledOnceWith('app');
    });

    it('should specify "hsmFs"', function () {
      expect($routeSegmentProvider.within).toHaveBeenCalledOnceWith('hsmFs');
    });
  });

  describe('segment', function () {
    it('should setup the hsm segment', function () {
      expect($routeSegmentProvider.segment).toHaveBeenCalledOnceWith('hsm', {
          controller: 'HsmCtrl',
          controllerAs: 'hsm',
          templateUrl: 'iml/hsm/assets/html/hsm.html',
          resolve: {
            copytoolOperationStream: ['copytoolOperationStream', jasmine.any(Function)],
            copytoolStream: ['copytoolStream', jasmine.any(Function)]
          },
          untilResolved: {
            templateUrl: 'common/loading/assets/html/loading.html'
          },
          dependencies: ['fsId']
      });
    });
  });
});
