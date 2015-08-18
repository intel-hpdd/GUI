describe('login route', function () {
  'use strict';

  var $routeSegmentProvider;

  beforeEach(module(function () {
    $routeSegmentProvider = {
      $get: function get () {},
      segment: jasmine.createSpy('$routeSegmentProvider.segment')
        .andCallFake(routeSegmentProvider),
      when: jasmine.createSpy('$routeSegmentProvider.when')
        .andCallFake(routeSegmentProvider)
    };

    function routeSegmentProvider () {
      return $routeSegmentProvider;
    }

    angular.module('route-segment', []).provider({
      $routeSegment: $routeSegmentProvider
    });
  }, 'route-segment', 'login'));

  beforeEach(inject(fp.noop));

  it('should register the login route', function () {
    expect($routeSegmentProvider.when)
      .toHaveBeenCalledOnceWith('/login', 'login');
  });

  it('should register the segment', function () {
    expect($routeSegmentProvider.segment)
      .toHaveBeenCalledOnceWith('login', {
        controller: 'LoginCtrl',
        controllerAs: 'login',
        templateUrl: 'common/login/assets/html/login.html'
      });
  });
});
