import angular from 'angular';
import aboutModule from '../../../../source/iml/about/about-module';

import {noop} from 'intel-fp';

describe('about route', () => {
  var $routeSegmentProvider;

  beforeEach(module(() => {
    $routeSegmentProvider = {
      $get: function get () {},
      segment: jasmine.createSpy('$routeSegmentProvider.segment')
        .and.callFake(routeSegementProvider),
      when: jasmine.createSpy('$routeSegmentProvider.when')
        .and.callFake(routeSegementProvider),
      within: jasmine.createSpy('$routeSegmentProvider.within')
        .and.callFake(routeSegementProvider)
    };

    function routeSegementProvider () {
      return $routeSegmentProvider;
    }

    angular.module('route-segment', []).provider({
      $routeSegment: $routeSegmentProvider
    });
  }, 'route-segment', aboutModule));

  beforeEach(inject(noop));

  it('should register the about route', () => {
    expect($routeSegmentProvider.when)
      .toHaveBeenCalledOnceWith('/about', 'app.about');
  });

  it('should go within app', () => {
    expect($routeSegmentProvider.within)
      .toHaveBeenCalledOnceWith('app');
  });

  it('should register the segment', () => {
    expect($routeSegmentProvider.segment)
      .toHaveBeenCalledOnceWith('about', {
        controller: 'AboutCtrl',
        controllerAs: 'about',
        middleware: ['allowAnonymousReadMiddleware', 'eulaStateMiddleware'],
        templateUrl: '/static/chroma_ui/source/iml/about/assets/html/about.js'
      });
  });
});
