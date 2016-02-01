import angular from 'angular';
import appRouteModule from '../../../../source/iml/app/app-route-module';


import {noop, identity} from 'intel-fp';

describe('app route', function () {
  var $routeSegmentProvider;

  beforeEach(module(function () {
    $routeSegmentProvider = {
      $get: function get () {},
      segment: jasmine.createSpy('$routeSegmentProvider.segment')
    };

    angular.module('route-segment', []).provider({
      $routeSegment: $routeSegmentProvider
    });
  }, 'route-segment', appRouteModule));

  beforeEach(inject(noop));

  it('should setup the app segment', function () {
    expect($routeSegmentProvider.segment).toHaveBeenCalledOnceWith('app', {
      controller: 'AppCtrl',
      controllerAs: 'app',
      templateUrl: '/static/chroma_ui/source/iml/app/assets/html/app.js',
      resolve: {
        alertStream: ['appAlertStream', jasmine.any(Function)],
        notificationStream: ['appNotificationStream', jasmine.any(Function)],
        session: ['appSession', identity]
      },
      untilResolved: {
        templateUrl: '/static/chroma_ui/source/iml/loading/assets/html/loading.js'
      }
    });
  });
});
