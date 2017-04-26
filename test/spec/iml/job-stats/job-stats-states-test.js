describe('job stats states', () => {
  let jobStatsState, mockJobstats$, mockGetData;

  beforeEach(() => {
    mockJobstats$ = 'jobstats$';
    mockGetData = 'getData';

    jest.mock('../../../../source/iml/job-stats/job-stats-resolves.js', () => ({
      jobstats$: mockJobstats$,
      getData: mockGetData
    }));

    jest.mock('../../../../source/iml/auth/authorization.js', () => ({
      GROUPS: {
        FS_ADMINS: 'FS_ADMINS'
      }
    }));

    const mod = require('../../../../source/iml/job-stats/job-stats-states.js');

    jobStatsState = mod.jobStatsState;
  });

  it('should create the state', () => {
    expect(jobStatsState).toEqualComponent({
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
