import angular from 'angular';
const {module, inject} = angular.mock;

describe('The target metric model', () => {
  var TargetMetricModel, deferred;

  beforeEach(module('jobStats', ($provide) => {
    var baseModel = Object.create({
      query: jasmine.createSpy('baseModel.query')
    });

    $provide.value('modelFactory', fp.always(baseModel));
    $provide.decorator('modelFactory', ($delegate, $q) => {
      'ngInject';

      deferred = $q.defer();

      $delegate().query.andReturn({
        $promise: deferred.promise
      });

      return $delegate;
    });
  }));

  beforeEach(inject((_TargetMetricModel_) => {
    TargetMetricModel = _TargetMetricModel_;
  }));

  it('should average the data', () => {
    var input = [
      {data: {'cp.0': 1, 'dd.0': 6}, ts: '2014-01-30T19:40:50+00:00'},
      {data: {'cp.0': 3, 'dd.0': 2}, ts: '2014-01-30T19:41:00+00:00'}
    ];

    deferred.resolve(input);

    TargetMetricModel.getJobAverage({}).then((output) => {
      expect(output).toEqual([
        {name: 'cp.0', average: 2},
        {name: 'dd.0', average: 4}
      ]);
    });
  });

  it('should return [] when no data', () => {
    deferred.resolve([]);

    TargetMetricModel.getJobAverage({}).then((output) => {
      expect(output).toEqual([]);
    });
  });
});
