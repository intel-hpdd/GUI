import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('log records route', () => {
  var $routeSegmentProvider, mod,
    resolveStream, socketStream, addCurrentPage;

  beforeEachAsync(async function () {
    resolveStream = jasmine.createSpy('resolveStream');
    socketStream = jasmine.createSpy('socketStream');
    addCurrentPage = jasmine.createSpy('addCurrentPage');

    mod = await mock('source/iml/logs/log-records-route.js', {
      'source/iml/resolve-stream.js': { default: resolveStream },
      'source/iml/socket/socket-stream.js': { default: socketStream },
      'source/iml/api-transforms.js': { addCurrentPage }
    });

    $routeSegmentProvider = {
      $get () {},
      segment: jasmine.createSpy('$routeSegmentProvider.segment')
    };

    $routeSegmentProvider.within = jasmine.createSpy('within')
      .and.returnValue($routeSegmentProvider);

    mod.default($routeSegmentProvider);
  });

  afterEach(resetAll);

  it('should be within app', () => {
    expect($routeSegmentProvider.within)
      .toHaveBeenCalledOnceWith('app');
  });

  it('should be within logQuery', () => {
    expect($routeSegmentProvider.within)
      .toHaveBeenCalledOnceWith('logQuery');
  });

  it('should wire up the logRecords segment', () => {
    expect($routeSegmentProvider.segment)
      .toHaveBeenCalledOnceWith('logRecords', {
        controller: jasmine.any(Function),
        controllerAs: '$ctrl',
        template: jasmine.any(String),
        watcher: jasmine.any(Function),
        resolve: {
          log$: jasmine.any(Function)
        },
        untilResolved: {
          templateUrl: '/static/chroma_ui/source/iml/loading/assets/html/loading.js'
        }
      });
  });

  describe('segment', () => {
    var routeSegment;

    beforeEach(() => {
      routeSegment = $routeSegmentProvider.segment.calls.argsFor(0)[1];
    });

    describe('watcher', () => {
      var qsFromLocation, segment, $location, watcher;

      beforeEach(() => {
        qsFromLocation = jasmine.createSpy('qsFromLocation');

        segment = {};

        $location = {
          path: jasmine.createSpy('path')
        };

        watcher = routeSegment.watcher.bind(routeSegment);
      });

      it('should return the new qs', () => {
        $location.path.and.returnValue('/log');
        qsFromLocation.and.returnValue('foo=bar&baz__in=1,2,3,4');

        expect(watcher($location, segment, qsFromLocation))
          .toBe('foo=bar&baz__in=1&baz__in=2&baz__in=3&baz__in=4');
      });

      describe('on a new route', () => {
        beforeEach(() => {
          $location.path.and.returnValue('/dashboard');
        });

        it('should clear the watcher if the watcher exists', () => {
          segment.clearWatcher = jasmine.createSpy('clearWatcher');
          watcher($location, segment, qsFromLocation);

          expect(segment.clearWatcher).toHaveBeenCalledOnce();
        });

        it('should use the last qs', () => {
          expect(watcher($location, segment, qsFromLocation))
            .toBeUndefined();
        });
      });
    });

    describe('resolve', () => {
      var qsFromLocation, log$;

      beforeEach(() => {
        resolveStream
          .and
          .returnValue('promise');

        socketStream
          .and
          .returnValue('socket');

        qsFromLocation = jasmine.createSpy('qsFromLocation');

        log$ = routeSegment.resolve.log$;
      });

      it('should call /alert with a qs', () => {
        qsFromLocation.and.returnValue('foo=bar&baz__in=1,2&bap=3&bim__in=4,5,6');

        log$(qsFromLocation);

        expect(socketStream)
          .toHaveBeenCalledOnceWith('/log/?foo=bar&baz__in=1&baz__in=2&bap=3&bim__in=4&bim__in=5&bim__in=6');
      });

      it('should call /alert without a qs', () => {
        qsFromLocation.and.returnValue('');

        log$(qsFromLocation);

        expect(socketStream)
          .toHaveBeenCalledOnceWith('/log/');
      });

      it('should resolve the stream', () => {
        qsFromLocation.and.returnValue('');

        var res = log$(qsFromLocation);

        expect(res).toBe('promise');
      });
    });
  });
});
