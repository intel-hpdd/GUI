import highland from 'highland';
import {curry} from 'intel-fp';

import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('MDO chart', () => {
  var chartCompiler, getMdoStream, selectStoreCount,
    submitHandler, config1$, config2$,
    getMdoChart, getStore, standardConfig,
    durationPayload, data$Fn, initStream,
    durationSubmitHandler, localApply, mod,
    getConf;

  beforeEachAsync(async function () {
    getMdoStream = {};

    standardConfig = {
      configType: 'duration',
      size: 10,
      unit: 'minutes',
      startDate: 1464812942650,
      endDate: 1464812997102
    };

    config1$ = highland([{
      'mdoChart': {...standardConfig}
    }]);
    spyOn(config1$, 'destroy');
    config2$ = highland([{
      'mdoChart': standardConfig
    }]);
    spyOn(config2$, 'destroy');
    selectStoreCount = 0;

    getStore = {
      dispatch: jasmine.createSpy('dispatch'),
      select: jasmine.createSpy('select').and.callFake(() => {
        switch (selectStoreCount) {
        case 0:
          selectStoreCount++;
          return config1$;
        default:
          return config2$;
        }
      })
    };

    durationPayload = jasmine.createSpy('durationPayload')
      .and.callFake(x => {
        return {...standardConfig, ...x};
      });

    submitHandler = jasmine.createSpy('submitHandler');
    durationSubmitHandler = jasmine.createSpy('durationSubmitHandler')
      .and.returnValue(submitHandler);

    getConf = jasmine.createSpy('getConf')
      .and.callFake(page => {
        return s => {
          return s.map(x => {
            return x[page];
          });
        };
      });

    mod = await mock('source/iml/mdo/get-mdo-chart.js', {
      'source/iml/mdo/get-mdo-stream.js': { default: getMdoStream },
      'source/iml/store/get-store.js': { default: getStore },
      'source/iml/duration-picker/duration-payload.js': { default: durationPayload },
      'source/iml/duration-picker/duration-submit-handler.js': { default: durationSubmitHandler },
      'source/iml/chart-transformers/chart-transformers.js': { getConf: getConf }
    });
  });

  afterEach(resetAll);

  beforeEach(() => {
    chartCompiler = jasmine.createSpy('chartCompiler');

    initStream = highland();
    spyOn(initStream, 'destroy');

    data$Fn = jasmine.createSpy('data$Fn')
      .and.callFake(() => initStream);

    localApply = jasmine.createSpy('localApply');

    getMdoChart = mod.default(chartCompiler, localApply, curry(3, data$Fn));
  });

  it('should return a factory function', () => {
    expect(getMdoChart).toEqual(jasmine.any(Function));
  });

  describe('for page mdoChart', () => {
    beforeEach(() => {
      getMdoChart({
        qs: {
          host_id: '1'
        }
      }, 'mdoChart');

      var s = chartCompiler.calls.argsFor(0)[1];
      s.each(() => {});
    });

    it('should dispatch mdoChart to the store', () => {
      expect(getStore.dispatch).toHaveBeenCalledOnceWith({
        type: 'DEFAULT_MDO_CHART_ITEMS',
        payload: {
          page: 'mdoChart',
          configType: 'duration',
          size: 10,
          unit: 'minutes',
          startDate: 1464812942650,
          endDate: 1464812997102
        }
      });
    });

    it('should select the mdoChart store', () => {
      expect(getStore.select).toHaveBeenCalledOnceWith('mdoCharts');
    });

    it('should call getConf', () => {
      expect(getConf).toHaveBeenCalledOnceWith('mdoChart');
    });

    it('should call data$Fn', () => {
      expect(data$Fn).toHaveBeenCalledOnceWith(
        {
          qs: {
            host_id: '1'
          }
        },
        jasmine.any(Function),
        standardConfig
      );
    });

    it('should call the chart compiler', () => {
      expect(chartCompiler).toHaveBeenCalledOnceWith(
        '/static/chroma_ui/source/iml/mdo/assets/html/mdo.js',
        jasmine.any(Object),
        jasmine.any(Function)
      );
    });
  });

  describe('setup', () => {
    var handler, $scope, config;

    beforeEach(inject(($rootScope) => {
      getMdoChart({
        qs: {
          host_id: '1'
        }
      }, 'mdoChart');

      handler = chartCompiler.calls.mostRecent().args[2];
      $scope = $rootScope.$new();

      config = handler($scope, initStream);
    }));

    it('should return a config', () => {
      expect(config).toEqual({
        stream: initStream,
        configType: 'duration',
        page: '',
        startDate: 1464812942650,
        endDate: 1464812997102,
        size: 10,
        unit: 'minutes',
        onSubmit: submitHandler,
        options: {
          setup: jasmine.any(Function)
        }
      });
    });

    it('should select the mdoChart store', () => {
      expect(getStore.select).toHaveBeenCalledTwiceWith('mdoCharts');
    });

    it('should call getConf', () => {
      expect(getConf).toHaveBeenCalledTwiceWith('mdoChart');
    });

    it('should call localApply', () => {
      expect(localApply).toHaveBeenCalledOnceWith($scope);
    });

    it('should destroy the stream when the chart is destroyed', () => {
      $scope.$destroy();

      expect(initStream.destroy).toHaveBeenCalled();
      expect(config1$.destroy).toHaveBeenCalled();
      expect(config2$.destroy).toHaveBeenCalled();
    });

    describe('chart', () => {
      var chart, tickFormat;

      beforeEach(() => {
        tickFormat = jasmine.createSpy('tickFormat');

        chart = {
          useInteractiveGuideline: jasmine.createSpy('useInteractiveGuideline'),
          interactiveLayer: {
            tooltip: {
              headerFormatter: jasmine.createSpy('headerFormatter')
            }
          },
          yAxis: {
            tickFormat: tickFormat
          },
          forceY: jasmine.createSpy('forceY'),
          xAxis: {
            showMaxMin: jasmine.createSpy('showMaxMin')
          }
        };

        config.options.setup(chart);
      });

      it('should use interactive guideline', () => {
        expect(chart.useInteractiveGuideline)
          .toHaveBeenCalledOnceWith(true);
      });

      it('should should force y', () => {
        expect(chart.forceY).toHaveBeenCalledOnceWith([0, 1]);
      });

      it('should set y tick format', () => {
        expect(tickFormat)
          .toHaveBeenCalledOnceWith(jasmine.any(Function));
      });

      it('should not show max or min over the x axis', () => {
        expect(chart.xAxis.showMaxMin).toHaveBeenCalledOnceWith(false);
      });
    });
  });

  describe('on submit', () => {
    var handler, $scope, config;

    beforeEach(inject(($rootScope) => {
      getMdoChart({
        qs: {
          host_id: '1'
        }
      }, 'mdoChart');

      handler = chartCompiler.calls.mostRecent().args[2];
      $scope = $rootScope.$new();

      config = handler($scope, initStream);

      config.onSubmit();
    }));

    it('should call durationSubmitHandler', () => {
      expect(durationSubmitHandler).toHaveBeenCalledOnceWith('UPDATE_MDO_CHART_ITEMS', {page: 'mdoChart'});
    });

    it('should invoke the submit handler', () => {
      expect(submitHandler).toHaveBeenCalledOnce();
    });
  });
});
