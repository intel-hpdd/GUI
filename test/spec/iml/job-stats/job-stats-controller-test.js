import jobStatsModule from '../../../../source/iml/job-stats/job-stats-module';

import JobStatsCtrl from
  '../../../../source/iml/job-stats/job-stats-controller';

describe('The job stats controller', () => {
  var target, jobStatsCtrl;

  beforeEach(module(jobStatsModule));

  beforeEach(inject(($controller) => {
    target = {
      name: 'foo'
    };


    const $stateParams = {
      startDate: '2014-01-30T22:08:11.423Z',
      endDate: '2014-01-30T22:08:41.220Z'
    };


    jobStatsCtrl = $controller('JobStatsCtrl', {
      target,
      $stateParams,
      metrics: {
        read_bytes: [],
        write_bytes: [],
        read_iops: [],
        write_iops: []
      }
    });
  }));

  it('should contain the expected properties on the controller', () => {
    const instance = window.extendWithConstructor(JobStatsCtrl, {
      name: target.name,
      startDate: '2014-01-30T22:08:11.423Z',
      endDate: '2014-01-30T22:08:41.220Z',
      read_bytes: [],
      write_bytes: [],
      read_iops: [],
      write_iops: []
    });

    expect(jobStatsCtrl).toEqual(instance);
  });
});
