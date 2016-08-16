import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('job stats states', () => {
  let jobStatsState,
    appJobstatsTarget,
    appJobstatsMetrics,
    getData;

  beforeEachAsync(async function () {
    appJobstatsTarget = 'appJobstatsTarget';
    appJobstatsMetrics = 'appJobstatsMetrics';
    getData = 'getData';

    const mod = await mock('source/iml/job-stats/job-stats-states.js', {
      'source/iml/job-stats/assets/html/job-stats.html!text': {
        default: 'jobStatsTemplate'
      },
      'source/iml/job-stats/job-stats-resolves.js': {
        appJobstatsTarget,
        appJobstatsMetrics,
        getData
      }
    });

    jobStatsState = mod.jobStatsState;
  });

  afterEach(resetAll);

  it('should create the state', () => {
    expect(jobStatsState)
      .toEqual({
        name: 'app.jobstats',
        url: '/dashboard/jobstats/:id/:startDate/:endDate',
        controller: 'JobStatsCtrl',
        controllerAs: 'jobStats',
        template: 'jobStatsTemplate',
        data: {
          kind: 'Job Stats',
          icon: 'fa-tachometer'
        },
        resolve: {
          metrics: 'appJobstatsMetrics',
          getData: 'getData'
        }
      });
  });
});
