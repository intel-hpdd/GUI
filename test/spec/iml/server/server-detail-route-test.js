import angular from 'angular';
import serverDetailRouteModule from '../../../../source/iml/server/server-detail-route-module';

import {
  noop
} from 'intel-fp';

describe('server detail route', () => {

  var $routeSegmentProvider, GROUPS;

  beforeEach(module(() => {
    $routeSegmentProvider = {
      $get: noop,
      when: jasmine.createSpy('$routeSegmentProvider.when'),
      within: jasmine.createSpy('$routeSegmentProvider.within'),
      segment: jasmine.createSpy('$routeSegmentProvider.segment')
    };

    $routeSegmentProvider.when.and.returnValue($routeSegmentProvider);
    $routeSegmentProvider.within.and.returnValue($routeSegmentProvider);

    angular.module('route-segment', []).provider({
      $routeSegment: $routeSegmentProvider
    });
  }, 'route-segment', serverDetailRouteModule));

  beforeEach(inject((_GROUPS_) => {
    GROUPS = _GROUPS_;
  }));

  it('should call when with /configure/server/:id', () => {
    expect($routeSegmentProvider.when).toHaveBeenCalledOnceWith('/configure/server/:id', 'app.serverDetail');
  });

  it('should call within app', () => {
    expect($routeSegmentProvider.within).toHaveBeenCalledOnceWith('app');
  });

  it('should call segment', () => {
    expect($routeSegmentProvider.segment).toHaveBeenCalledOnceWith('serverDetail', {
      controller: 'ServerDetailController',
      controllerAs: 'serverDetail',
      templateUrl: '/static/chroma_ui/source/iml/server/assets/html/server-detail.js',
      resolve: {
        streams: ['serverDetailResolves', jasmine.any(Function)]
      },
      middleware: ['allowAnonymousReadMiddleware', 'eulaStateMiddleware', 'authenticationMiddleware'],
      untilResolved: {
        templateUrl: '/static/chroma_ui/source/iml/loading/assets/html/loading.js'
      },
      access: GROUPS.FS_ADMINS
    });
  });
});
