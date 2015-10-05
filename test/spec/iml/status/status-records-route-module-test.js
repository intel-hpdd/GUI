describe('status records route', function () {
  var $routeSegmentProvider;

  beforeEach(module(function () {
    $routeSegmentProvider = {
      $get: function get () {},
      segment: jasmine.createSpy('$routeSegmentProvider.segment')
    };

    $routeSegmentProvider.within = jasmine.createSpy('within')
      .andReturn($routeSegmentProvider);

    angular.module('route-segment', []).provider({
      $routeSegment: $routeSegmentProvider
    });
  }, 'route-segment', 'statusRecordsRouteModule'));

  beforeEach(inject(fp.noop));

  it('should be within app', function () {
    expect($routeSegmentProvider.within)
      .toHaveBeenCalledOnceWith('app');
  });

  it('should be within statusQuery', function () {
    expect($routeSegmentProvider.within)
      .toHaveBeenCalledOnceWith('statusQuery');
  });

  it('should wire up the status record segment', function () {
    expect($routeSegmentProvider.segment)
      .toHaveBeenCalledOnceWith('statusRecords', {
        controller: 'StatusController',
        controllerAs: 'ctrl',
        templateUrl: 'iml/status/assets/html/status.html',
        watcher: jasmine.any(Function),
        resolve: {
          notificationStream: jasmine.any(Function),
        },
        untilResolved: {
          templateUrl: 'common/loading/assets/html/loading.html'
        }
      });
  });

  describe('segment', function () {
    var routeSegment;

    beforeEach(function () {
      routeSegment = $routeSegmentProvider.segment.calls[0].args[1];
    });

    describe('watcher', function () {
      var qsFromLocation, segment, $location;

      beforeEach(function () {
        qsFromLocation = jasmine.createSpy('qsFromLocation');

        segment = {};

        $location = {
          path: jasmine.createSpy('path')
        };
      });

      it('should return the new qs', function () {
        $location.path.andReturn('/status');
        qsFromLocation.andReturn('foo=bar');

        expect(routeSegment.watcher($location, segment, qsFromLocation))
          .toBe('foo=bar');
      });

      describe('on a new route', function () {
        beforeEach(function () {
          $location.path.andReturn('/dashboard');
        });

        it('should clear the watcher if the watcher exists', function () {
          segment.clearWatcher = jasmine.createSpy('clearWatcher');
          routeSegment.watcher($location, segment, qsFromLocation);

          expect(segment.clearWatcher).toHaveBeenCalledOnce();
        });

        it('should use the last qs', function () {
          expect(routeSegment.watcher($location, segment, qsFromLocation))
            .toBeUndefined();
        });
      });
    });

    describe('resolve', function () {
      var resolveStream, socketStream,
        qsFromLocation, notificationStream;

      beforeEach(function () {
        resolveStream = jasmine.createSpy('resolveStream')
          .andReturn('promise');

        socketStream = jasmine.createSpy('socketStream')
          .andReturn('socket');

        qsFromLocation = jasmine.createSpy('qsFromLocation');

        notificationStream = routeSegment.resolve.notificationStream;
      });

      it('should call /alert with a qs', function () {
        qsFromLocation.andReturn('bar=baz');

        notificationStream(resolveStream, socketStream, qsFromLocation);

        expect(socketStream).toHaveBeenCalledOnceWith('/alert/?bar=baz');
      });

      it('should call /alert without a qs', function () {
        qsFromLocation.andReturn('');

        notificationStream(resolveStream, socketStream, qsFromLocation);

        expect(socketStream).toHaveBeenCalledOnceWith('/alert/');
      });

      it('should call resolveStream with socket', function () {
        qsFromLocation.andReturn('');

        notificationStream(resolveStream, socketStream, qsFromLocation);

        expect(resolveStream).toHaveBeenCalledOnceWith('socket');
      });

      it('should resolve the stream', function () {
        qsFromLocation.andReturn('');

        var res = notificationStream(resolveStream, socketStream, qsFromLocation);

        expect(res).toBe('promise');
      });
    });
  });


});
