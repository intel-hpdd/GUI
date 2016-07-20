import jobStatsModule from '../../../../source/iml/job-stats/job-stats-module';

import JobStatsCtrl from
  '../../../../source/iml/job-stats/job-stats-controller';

describe('The job stats controller', () => {
  let jobStatsCtrl;

  beforeEach(module(jobStatsModule));

  beforeEach(inject(($controller) => {
    jobStatsCtrl = $controller('JobStatsCtrl', {
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
      read_bytes: [],
      write_bytes: [],
      read_iops: [],
      write_iops: []
    });

    expect(jobStatsCtrl).toEqual(instance);
  });
});
