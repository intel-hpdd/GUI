import angular from 'angular';
const {module, inject} = angular.mock;

import {noop} from 'intel-fp/fp';

describe('status query route', function () {
  var $routeSegmentProvider;

  beforeEach(module(function () {
    $routeSegmentProvider = {
      $get: function get () {},
      segment: jasmine.createSpy('$routeSegmentProvider.segment')
    };

    $routeSegmentProvider.when = jasmine.createSpy('when')
      .andReturn($routeSegmentProvider);

    $routeSegmentProvider.within = jasmine.createSpy('within')
      .andReturn($routeSegmentProvider);

    angular.module('route-segment', []).provider({
      $routeSegment: $routeSegmentProvider
    });
  }, 'route-segment', 'statusQueryRouteModule'));

  beforeEach(inject(noop));

  it('should wire up the correct route handler', function () {
    expect($routeSegmentProvider.when)
      .toHaveBeenCalledOnceWith('/status', 'app.statusQuery.statusRecords');
  });

  it('should be within app', function () {
    expect($routeSegmentProvider.within)
      .toHaveBeenCalledOnceWith('app');
  });

  it('should wire up the status query segment', function () {
    expect($routeSegmentProvider.segment)
      .toHaveBeenCalledOnceWith('statusQuery', {
        controller: 'StatusQueryController',
        controllerAs: 'ctrl',
        templateUrl: 'iml/status/assets/html/status-container.html',
        middleware: ['allowAnonymousReadMiddleware', 'eulaStateMiddleware']
      });
  });
});
