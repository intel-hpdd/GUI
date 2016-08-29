import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('job stats states', () => {
  let jobStatsState,
    jobstats$,
    getData;

  beforeEachAsync(async function () {
    jobstats$ = 'jobstats$';
    getData = 'getData';

    const mod = await mock('source/iml/job-stats/job-stats-states.js', {
      'source/iml/job-stats/job-stats-resolves.js': {
        jobstats$,
        getData
      },
      'source/iml/auth/authorization.js': {
        GROUPS: {
          FS_ADMINS: 'FS_ADMINS'
        }
      }
    });

    jobStatsState = mod.jobStatsState;
  });

  afterEach(resetAll);

  it('should create the state', () => {
    expect(jobStatsState)
      .toEqualComponent({
        name: 'app.jobstats',
        url: '/jobstats?id&startDate&endDate',
        resolve: {
          jobstats$: 'jobstats$',
          getData: 'getData'
        },
        params: {
          resetState: {
            dynamic: true
          }
        },
        data: {
          helpPage: 'view_job_statistics.htm',
          anonymousReadProtected: true,
          eulaState: true,
          kind: 'Job Stats',
          icon: 'fa-signal'
        },
        template: `
          <div class="container container-full">
            <job-stats-table stats-$="$resolve.jobstats$"></job-stats-table>
          </div>
        `
      });
  });
});
