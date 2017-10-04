import highland from 'highland';
import angular from '../../../angular-mock-setup.js';
import asValue from '../../../../source/iml/as-value/as-value.js';
import throughputFilter from '../../../../source/iml/filters/throughput-filter.js';
import roundFilter from '../../../../source/iml/filters/round-filter.js';

describe('jobstats table component', () => {
  let jobstatsTableComponent, config$, mockStore;

  beforeEach(() => {
    config$ = highland();
    mockStore = { select: jest.fn(() => config$), dispatch: jest.fn() };
    jest.mock('../../../../source/iml/store/get-store.js', () => mockStore);

    jobstatsTableComponent = require('../../../../source/iml/job-stats/job-stats-table-component.js')
      .default;
  });

  beforeEach(
    angular.mock.module(($compileProvider, $provide, $filterProvider) => {
      $provide.value('$state', {});
      $provide.value('$stateParams', {});
      $compileProvider.component('jobStatsTable', jobstatsTableComponent);
      $compileProvider.directive('asValue', asValue);
      $filterProvider.register('throughput', throughputFilter);
      $filterProvider.register('round', roundFilter);
    })
  );

  let $scope, el;
  beforeEach(
    angular.mock.inject(($compile: $compileT, $rootScope: $scopeT) => {
      $scope = $rootScope.$new();
      $scope.jobstats$ = highland();
      const template =
        '<job-stats-table stats-$="jobstats$"></job-stats-table>';
      el = $compile(template)($scope)[0];
      $scope.$digest();
    })
  );

  describe('with data', () => {
    beforeEach(() => {
      config$.write({
        duration: 10,
        orderBy: 'read_bytes_average',
        desc: true
      });

      $scope.jobstats$.write([
        {
          id: 'cp.0',
          read_bytes_average: 1024,
          write_bytes_average: 1024,
          read_iops_average: 100,
          write_iops_average: 100
        },
        {
          id: 'dd.0',
          read_bytes_average: 2048,
          write_bytes_average: 2048,
          read_iops_average: 200,
          write_iops_average: 200
        }
      ]);
    });

    it('should start sorting read_bytes_average desc', () => {
      expect(el.querySelectorAll('th a i')[1]).toHaveClass('fa-sort-desc');
    });

    it('should put highest read_bytes_average first', () => {
      const elm = el
        .querySelector('tbody')
        .querySelector('tr')
        .querySelectorAll('td')[1];
      expect(elm).toHaveText('2.000 kB/s');
    });

    describe('clicking', () => {
      beforeEach(() => {
        document.body.appendChild(el);
        el.querySelectorAll('th a')[1].click();
      });

      afterEach(() => {
        document.body.removeChild(el);
      });

      it('should update the store', () => {
        expect(mockStore.dispatch).toHaveBeenCalledOnceWith({
          type: 'SET_SORT',
          payload: { orderBy: 'read_bytes_average', desc: false }
        });
      });

      it('should toggle the selector', () => {
        config$.write({
          duration: 10,
          orderBy: 'read_bytes_average',
          desc: false
        });

        expect(el.querySelectorAll('th a i')[1]).toHaveClass('fa-sort-asc');
      });

      it('should put lowest read_bytes_average first', () => {
        config$.write({
          duration: 10,
          orderBy: 'read_bytes_average',
          desc: false
        });

        const elm = el
          .querySelector('tbody')
          .querySelector('tr')
          .querySelectorAll('td')[1];
        expect(elm).toHaveText('1.000 kB/s');
      });
    });
  });

  describe('without data', () => {
    beforeEach(() => {
      $scope.jobstats$.write([]);
    });

    it('should have a help message', () => {
      expect(el.querySelector('h4').textContent).toContain(
        'Jobstats not found'
      );
    });

    it('should have a help link', () => {
      expect(el.querySelector('h4 a').getAttribute('href')).toBe(
        '/help/docs/Graphical_User_Interface_9_0.html#9.4'
      );
    });
  });
});
