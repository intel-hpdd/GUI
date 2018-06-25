import highland from 'highland';
import angular from '../../../angular-mock-setup.js';

describe('get ost balance chart', () => {
  let mockGetOstBalanceStream,
    getOstBalanceChartFactory,
    mockChartCompiler,
    streamWhenVisible,
    config1$,
    config2$,
    getOstBalanceChart,
    localApply,
    mockGetStore,
    standardConfig,
    selectStoreCount,
    mockGetConf;

  beforeEach(() => {
    mockGetOstBalanceStream = jest.fn(() => highland());

    standardConfig = {
      percentage: 0
    };

    config1$ = highland([
      {
        ostBalanceChart: { ...standardConfig }
      }
    ]);
    jest.spyOn(config1$, 'destroy');
    config2$ = highland([
      {
        ostBalanceChart: standardConfig
      }
    ]);
    jest.spyOn(config2$, 'destroy');
    selectStoreCount = 0;

    mockGetStore = {
      dispatch: jest.fn(),
      select: jest.fn(() => {
        switch (selectStoreCount) {
          case 0:
            selectStoreCount++;
            return config1$;
          default:
            return config2$;
        }
      })
    };

    mockGetConf = jest.fn(page => {
      return s => {
        return s.map(x => {
          return x[page];
        });
      };
    });

    mockChartCompiler = jest.fn();

    jest.mock('../../../../source/iml/ost-balance/get-ost-balance-stream.js', () => mockGetOstBalanceStream);
    jest.mock('../../../../source/iml/chart-compiler/chart-compiler.js', () => mockChartCompiler);
    jest.mock('../../../../source/iml/store/get-store.js', () => mockGetStore);
    jest.mock('../../../../source/iml/chart-transformers/chart-transformers.js', () => ({ getConf: mockGetConf }));

    const mod = require('../../../../source/iml/ost-balance/get-ost-balance-chart.js');

    getOstBalanceChartFactory = mod.default;
  });

  beforeEach(() => {
    streamWhenVisible = jest.fn(x => x());

    localApply = jest.fn();

    getOstBalanceChart = getOstBalanceChartFactory(streamWhenVisible, localApply);

    getOstBalanceChart(
      {
        qs: {
          filesystem_id: '1'
        }
      },
      'ostBalanceChart'
    );

    const s = mockChartCompiler.mock.calls[0][1];
    s.each(() => {});
  });

  it('should return a factory function', () => {
    expect(getOstBalanceChart).toEqual(expect.any(Function));
  });

  it('should dispatch to the store', () => {
    expect(mockGetStore.dispatch).toHaveBeenCalledOnceWith({
      type: 'DEFAULT_OST_BALANCE_CHART_ITEMS',
      payload: {
        percentage: 0,
        page: 'ostBalanceChart'
      }
    });
  });

  it('should call getConf with the page', () => {
    expect(mockGetConf).toHaveBeenCalledOnceWith('ostBalanceChart');
  });

  it('should call streamWhenVisible', () => {
    expect(streamWhenVisible).toHaveBeenCalledOnceWith(expect.any(Function));
  });

  it('should setup the OstBalanceChart', () => {
    expect(mockChartCompiler).toHaveBeenCalledOnceWith(
      `<div config-toggle>
  <h5>OST Balance</h5>
  <div class="controls" ng-if="configToggle.inactive()">
    <button class="btn btn-xs btn-primary" ng-click="configToggle.setActive()">Configure <i class="fa fa-cog"></i></button>
    <a full-screen-btn class="btn btn-primary btn-xs"></a>
    <a class="drag btn btn-xs btn-default">Drag <i class="fa fa-arrows"></i></a>
  </div>
  <div class="configuration" ng-if="configToggle.active()">
    <div class="well well-lg">
      <ng-form name="ostBalanceForm" novalidate>
        <resettable-group>
          <div class="form-group" ng-class="{'has-error': ostBalanceForm.percentage.$invalid, 'has-success': ostBalanceForm.percentage.$valid}">
            <label>Filter by usage</label>
            <div class="input-group">
              <div class="input-group-addon">Filter usage</div>
              <input class="form-control" type="number" ng-model="chart.percentage" name="percentage" min="0" max="100" required />
              <iml-tooltip class="error-tooltip" toggle="ostBalanceForm.percentage.$invalid" direction="bottom">
                <span ng-if="ostBalanceForm.percentage.$error.max || ostBalanceForm.percentage.$error.min">
                  Usage filter must be between 0% and 100%.
                </span>
                <span ng-if="ostBalanceForm.percentage.$error.required && !ostBalanceForm.$pristine">
                  Usage filter is required.
                </span>
              </iml-tooltip>
              <span class="input-group-addon">%</span>
            </div>
          </div>
          <button type="submit" ng-click="::configToggle.setInactive(chart.onSubmit(ostBalanceForm))" class="btn btn-success btn-block" ng-disabled="ostBalanceForm.$invalid">Update</button>
          <button ng-click="::configToggle.setInactive();" resetter class="btn btn-cancel btn-block">Cancel</button>
        </resettable-group>
      </ng-form>
    </div>
  </div>
  <multi-bar-chart options="::chart.options" stream="chart.stream"></multi-bar-chart>
</div>`,
      expect.any(Object),
      expect.any(Function)
    );
  });

  it('should create a new stream', () => {
    expect(mockGetOstBalanceStream).toHaveBeenCalledOnceWith(0, {
      qs: {
        filesystem_id: '1'
      }
    });
  });

  describe('conf setup', () => {
    let fn, s, $scope, conf;

    beforeEach(
      angular.mock.inject($rootScope => {
        fn = mockChartCompiler.mock.calls[0][2];

        s = highland();
        jest.spyOn(s, 'destroy');

        $scope = $rootScope.$new();

        conf = fn($scope, s);
      })
    );

    it('should setup the conf', () => {
      expect(conf).toEqual({
        percentage: 0,
        page: '',
        stream: s,
        onSubmit: expect.any(Function),
        options: {
          setup: expect.any(Function)
        }
      });
    });

    it('should destroy the existing stream', () => {
      $scope.$destroy();

      expect(s.destroy).toHaveBeenCalled();
      expect(config1$.destroy).toHaveBeenCalled();
      expect(config2$.destroy).toHaveBeenCalled();
    });

    describe('on submit', () => {
      beforeEach(() => {
        conf.onSubmit({
          percentage: {
            $modelValue: 10
          }
        });
      });

      it('should dispatch to the store', () => {
        expect(mockGetStore.dispatch).toHaveBeenCalledOnceWith({
          type: 'UPDATE_OST_BALANCE_CHART_ITEMS',
          payload: {
            percentage: 10,
            page: 'ostBalanceChart'
          }
        });
      });
    });

    describe('setup', () => {
      let d3Chart, d3, formatter;

      beforeEach(() => {
        d3Chart = {
          forceY: jest.fn(),
          stacked: jest.fn(),
          yAxis: {
            tickFormat: jest.fn()
          },
          showXAxis: jest.fn(),
          tooltip: {
            contentGenerator: jest.fn()
          }
        };

        formatter = {};

        d3 = {
          format: jest.fn(() => formatter)
        };

        conf.options.setup(d3Chart, d3);
      });

      it('should force Y', () => {
        expect(d3Chart.forceY).toHaveBeenCalledOnceWith([0, 1]);
      });

      it('should set to stacked', () => {
        expect(d3Chart.stacked).toHaveBeenCalledOnceWith(true);
      });

      it('should set tick format on the Y axis', () => {
        expect(d3Chart.yAxis.tickFormat).toHaveBeenCalledOnceWith(formatter);
      });

      it('should generate tooltip content', () => {
        expect(d3Chart.tooltip.contentGenerator).toHaveBeenCalledOnceWith(expect.any(Function));
      });
    });
  });
});
