import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('job stats states', () => {
  let jobStatsState,
    appJobstatsTarget,
    appJobstatsMetrics;

  beforeEachAsync(async function () {
    appJobstatsTarget = 'appJobstatsTarget';
    appJobstatsMetrics = 'appJobstatsMetrics';

    const mod = await mock('source/iml/job-stats/job-stats-states.js', {
      'source/iml/job-stats/job-stats-resolves.js': {
        appJobstatsTarget,
        appJobstatsMetrics
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
        templateUrl: '/static/chroma_ui/source/iml/job-stats/assets/html/job-stats.js',
        resolve: {
          target: 'appJobstatsTarget',
          metrics: 'appJobstatsMetrics'
        }
      });
  });
});
