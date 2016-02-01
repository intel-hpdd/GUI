import angular from 'angular';
import {noop} from 'intel-fp';

import statusQueryRouteModule
  from '../../../../source/iml/status/status-query-route-module';

describe('status query route', () => {
  var $routeSegmentProvider;

  beforeEach(module(function () {
    $routeSegmentProvider = {
      $get: function get () {},
      segment: jasmine.createSpy('$routeSegmentProvider.segment')
    };

    $routeSegmentProvider.when = jasmine.createSpy('when')
      .and.returnValue($routeSegmentProvider);

    $routeSegmentProvider.within = jasmine.createSpy('within')
      .and.returnValue($routeSegmentProvider);

    angular.module('route-segment', []).provider({
      $routeSegment: $routeSegmentProvider
    });
  }, 'route-segment', statusQueryRouteModule));

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
        templateUrl: '/static/chroma_ui/source/iml/status/assets/html/status-container.js',
        middleware: ['allowAnonymousReadMiddleware', 'eulaStateMiddleware']
      });
  });
});
