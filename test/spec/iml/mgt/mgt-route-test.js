import angular from 'angular';
import mgtRouteModule from '../../../../source/iml/mgt/mgt-route-module';

import {noop} from 'intel-fp';

describe('mgt route', () => {
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
  }, 'route-segment', mgtRouteModule));

  beforeEach(inject(noop));

  it('should register the mgt route', () => {
    expect($routeSegmentProvider.when)
      .toHaveBeenCalledOnceWith('/configure/mgt', 'app.mgt');
  });

  it('should go within app', () => {
    expect($routeSegmentProvider.within)
      .toHaveBeenCalledOnceWith('app');
  });

  it('should register the segment', () => {
    expect($routeSegmentProvider.segment)
      .toHaveBeenCalledOnceWith('mgt', {
        template: `
<h3 class="page-header"><i class="fa fa-th"></i> MGT Configuration</h3>
<div class="container container-full">
  <mgt mgt-stream="$ctrl.mgtStream" alert-indicator-stream="$ctrl.mgtAlertIndicatorStream"
       job-indicator-stream="$ctrl.mgtJobIndicatorStream"></mgt>
</div>`,
        controller: jasmine.any(Function),
        controllerAs: '$ctrl',
        access: 'filesystem_administrators',
        resolve: ['mgtAlertIndicatorStream', 'mgtJobIndicatorStream', 'mgtStream'],
        untilResolved: {
          templateUrl: '/static/chroma_ui/source/iml/loading/assets/html/loading.js'
        },
        middleware: [
          'allowAnonymousReadMiddleware',
          'eulaStateMiddleware',
          'authenticationMiddleware'
        ]
      });
  });
});
