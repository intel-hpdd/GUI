import {always} from 'intel-fp';

import jobStatsModule
  from '../../../../source/iml/job-stats/job-stats-module';

describe('The target metric model', () => {
  var TargetMetricModel, deferred;

  beforeEach(module(jobStatsModule, $provide => {
    var baseModel = Object.create({
      query: jasmine.createSpy('baseModel.query')
    });

    $provide.value('modelFactory', always(baseModel));
    $provide.decorator('modelFactory', ($delegate, $q) => {
      'ngInject';

      deferred = $q.defer();

      $delegate().query.and.returnValue({
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
