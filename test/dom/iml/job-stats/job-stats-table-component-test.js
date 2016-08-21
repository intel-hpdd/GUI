import highland from 'highland';

import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('jobstats table component', () => {
  let jobstatsTableComponent,
    config$,
    store;

  beforeEachAsync(async function () {
    config$ = highland();

    store = {
      select: jasmine
        .createSpy('select')
        .and
        .returnValue(config$),
      dispatch: jasmine
        .createSpy('dispatch')
    };

    const mod = await mock('source/iml/job-stats/job-stats-table-component.js', {

      'source/iml/store/get-store.js': {
        default: store
      }
    });

    jobstatsTableComponent = mod.default;
  });

  afterEach(resetAll);

  beforeEach(module('extendScope', 'asValue', 'filters', ($compileProvider, $provide) => {
    $provide.value('$state', {

    });
    $provide.value('$stateParams', {

    });
    $compileProvider.component('jobStatsTable', jobstatsTableComponent);
  }));

  let $scope,
    el;

  beforeEach(inject(($compile:$compileT, $rootScope:$scopeT) => {
    $scope = $rootScope.$new();
    $scope.jobstats$ = highland();

    const template = '<job-stats-table stats-$="jobstats$"></job-stats-table>';
    el = $compile(template)($scope)[0];
    $scope.$digest();
  }));

  describe('with data', () => {
    beforeEach(() => {
      config$.write({
        duration: 10,
        orderBy: 'read_bytes',
        desc: true
      });

      $scope.jobstats$.write([
        {
          id: 'cp.0',
          read_bytes: 1024,
          write_bytes: 1024,
          read_iops: 100,
          write_iops: 100
        },
        {
          id: 'dd.0',
          read_bytes: 2048,
          write_bytes: 2048,
          read_iops: 200,
          write_iops: 200
        }
      ]);
    });

    it('should start sorting read_bytes desc', () => {
      expect(el.querySelectorAll('th a i')[1])
        .toHaveClass('fa-sort-desc');
    });

    it('should put highest read_bytes first', () => {
      const elm = el
        .querySelector('tbody')
        .querySelector('tr')
        .querySelectorAll('td')[2];

      expect(elm)
        .toHaveText('2.000 kB/s');
    });

    describe('clicking', () => {
      beforeEach(() => {
        document
          .body
          .appendChild(el);

        el
          .querySelectorAll('th a')[1].click();
      });

      afterEach(() => {
        document
          .body
          .removeChild(el);
      });

      it('should update the store', () => {
        expect(store.dispatch)
          .toHaveBeenCalledOnceWith({
            type: 'SET_SORT',
            payload: {
              orderBy: 'read_bytes',
              desc: false
            }
          });
      });

      it('should toggle the selector', () => {
        config$.write({
          duration: 10,
          orderBy: 'read_bytes',
          desc: false
        });

        expect(el.querySelectorAll('th a i')[1])
          .toHaveClass('fa-sort-asc');
      });

      it('should put lowest read_bytes first', () => {
        config$.write({
          duration: 10,
          orderBy: 'read_bytes',
          desc: false
        });

        const elm = el
          .querySelector('tbody')
          .querySelector('tr')
          .querySelectorAll('td')[2];

        expect(elm)
          .toHaveText('1.000 kB/s');
      });
    });
  });

  describe('without data', () => {
    beforeEach(() => {
      $scope.jobstats$.write([]);
    });

    it('should have a help message', () => {
      expect(el.querySelector('h4').textContent)
        .toContain('Jobstats not found');
    });

    it('should have a help link', () => {
      expect(el.querySelector('h4 a').getAttribute('href'))
        .toBe('/static/webhelp/?view_job_statistics.htm');
    });
  });
});
