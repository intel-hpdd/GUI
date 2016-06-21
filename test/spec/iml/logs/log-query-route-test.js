import logQueryRoute from '../../../../source/iml/logs/log-query-route.js';

describe('log query route', () => {
  var $routeSegmentProvider;

  beforeEach(() => {
    $routeSegmentProvider = {
      $get () {},
      segment: jasmine.createSpy('$routeSegmentProvider.segment')
    };

    $routeSegmentProvider.when = jasmine
      .createSpy('when')
      .and
      .returnValue($routeSegmentProvider);

    $routeSegmentProvider.within = jasmine
      .createSpy('within')
      .and
      .returnValue($routeSegmentProvider);

    logQueryRoute($routeSegmentProvider);
  });

  it('should wire up the correct route handler', () => {
    expect($routeSegmentProvider.when)
      .toHaveBeenCalledOnceWith('/log', 'app.logQuery.logRecords');
  });

  it('should be within app', () => {
    expect($routeSegmentProvider.within)
      .toHaveBeenCalledOnceWith('app');
  });

  it('should wire up the status query segment', () => {
    expect($routeSegmentProvider.segment)
      .toHaveBeenCalledOnceWith('logQuery', {
        controllerAs: '$ctrl',
        middleware: ['allowAnonymousReadMiddleware', 'eulaStateMiddleware'],
        template: jasmine.any(String)
      });
  });
});
