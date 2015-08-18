describe('about route', function () {
  'use strict';

  var $routeSegmentProvider;

  beforeEach(module(function () {
    $routeSegmentProvider = {
      $get: function get () {},
      segment: jasmine.createSpy('$routeSegmentProvider.segment')
        .andCallFake(routeSegementProvider),
      when: jasmine.createSpy('$routeSegmentProvider.when')
        .andCallFake(routeSegementProvider),
      within: jasmine.createSpy('$routeSegmentProvider.within')
        .andCallFake(routeSegementProvider)
    };

    function routeSegementProvider () {
      return $routeSegmentProvider;
    }

    angular.module('route-segment', []).provider({
      $routeSegment: $routeSegmentProvider
    });
  }, 'route-segment', 'about'));

  beforeEach(inject(fp.noop));

  it('should register the about route', function () {
    expect($routeSegmentProvider.when)
      .toHaveBeenCalledOnceWith('/about', 'app.about');
  });

  it('should go within app', function () {
    expect($routeSegmentProvider.within)
      .toHaveBeenCalledOnceWith('app');
  });

  it('should register the segment', function () {
    expect($routeSegmentProvider.segment)
      .toHaveBeenCalledOnceWith('about', {
        controller: 'AboutCtrl',
        controllerAs: 'about',
        templateUrl: 'iml/about/assets/html/about.html'
      });
  });
});
