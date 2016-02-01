import angular from 'angular';
import {noop} from 'intel-fp';

import loginRouteModule
  from '../../../../source/iml/login/login-route-module';

describe('login route', () => {
  var $routeSegmentProvider;

  beforeEach(module(() => {
    $routeSegmentProvider = {
      $get: function get () {},
      segment: jasmine.createSpy('$routeSegmentProvider.segment')
        .and.callFake(routeSegmentProvider),
      when: jasmine.createSpy('$routeSegmentProvider.when')
        .and.callFake(routeSegmentProvider)
    };

    function routeSegmentProvider () {
      return $routeSegmentProvider;
    }

    angular.module('route-segment', []).provider({
      $routeSegment: $routeSegmentProvider
    });
  }, 'route-segment', loginRouteModule));

  beforeEach(inject(noop));

  it('should register the login route', () => {
    expect($routeSegmentProvider.when)
      .toHaveBeenCalledOnceWith('/login', 'login');
  });

  it('should register the segment', () => {
    expect($routeSegmentProvider.segment)
      .toHaveBeenCalledOnceWith('login', {
        controller: 'LoginCtrl',
        controllerAs: 'login',
        templateUrl: '/static/chroma_ui/source/iml/login/assets/html/login.js'
      });
  });
});
