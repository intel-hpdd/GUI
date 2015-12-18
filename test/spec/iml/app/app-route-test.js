describe('app route', function () {
  var $routeSegmentProvider;

  beforeEach(window.module(function () {
    $routeSegmentProvider = {
      $get: function get () {},
      segment: jasmine.createSpy('$routeSegmentProvider.segment')
    };

    angular.module('route-segment', []).provider({
      $routeSegment: $routeSegmentProvider
    });
  }, 'route-segment', 'appRouteModule'));

  beforeEach(inject(fp.noop));

  it('should setup the app segment', function () {
    expect($routeSegmentProvider.segment).toHaveBeenCalledOnceWith('app', {
      controller: 'AppCtrl',
      controllerAs: 'app',
      templateUrl: 'iml/app/assets/html/app.html',
      resolve: {
        alertStream: ['appAlertStream', jasmine.any(Function)],
        notificationStream: ['appNotificationStream', jasmine.any(Function)],
        session: ['appSession', fp.identity]
      },
      untilResolved: {
        templateUrl: 'common/loading/assets/html/loading.html'
      }
    });
  });
});
