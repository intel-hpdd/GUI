import * as fp from '@mfl/fp';
import agentVsCopytoolModule
  from '../../../../source/iml/agent-vs-copytool/agent-vs-copytool-module';
import highland from 'highland';

import { mock, resetAll } from '../../../system-mock.js';

describe('get agent vs copytool chart exports', () => {
  let getAgentVsCopytoolStream,
    createDate,
    chartCompiler,
    getAgentVsCopytoolChart,
    agentVsCopytoolChart,
    d3,
    timeScale,
    linearScale,
    ordinalScale,
    getAgentVsCopytoolChartFactory,
    standardConfig,
    config1$,
    config2$,
    selectStoreCount,
    getStore,
    durationPayload,
    submitHandler,
    durationSubmitHandler,
    getConf,
    localApply,
    data$Fn,
    initStream;

  beforeEachAsync(async function() {
    getAgentVsCopytoolStream = jasmine.createSpy('getAgentVsCopytoolStream');
    createDate = jasmine.createSpy('createDate');

    standardConfig = {
      configType: 'duration',
      size: 10,
      unit: 'minutes',
      startDate: 1464812942650,
      endDate: 1464812997102
    };

    config1$ = highland([
      {
        base: { ...standardConfig }
      }
    ]);
    spyOn(config1$, 'destroy');
    config2$ = highland([
      {
        base: standardConfig
      }
    ]);
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

    durationPayload = jasmine.createSpy('durationPayload').and.callFake(x => {
      return { ...standardConfig, ...x };
    });

    submitHandler = jasmine.createSpy('submitHandler');
    durationSubmitHandler = jasmine
      .createSpy('durationSubmitHandler')
      .and.returnValue(submitHandler);

    getConf = jasmine.createSpy('getConf').and.callFake(page => {
      return s => {
        return s.map(x => {
          return x[page];
        });
      };
    });

    localApply = jasmine.createSpy('localApply');

    initStream = highland();
    spyOn(initStream, 'destroy');

    data$Fn = jasmine.createSpy('data$Fn').and.callFake((overrides, fn) => {
      fn()();
      return initStream;
    });

    chartCompiler = jasmine
      .createSpy('chartCompiler')
      .and.returnValue('chartCompiler');

    const mod = await mock(
      'source/iml/agent-vs-copytool/get-agent-vs-copytool-chart.js',
      {
        'source/iml/agent-vs-copytool/get-agent-vs-copytool-stream.js': {
          default: getAgentVsCopytoolStream
        },
        'source/iml/agent-vs-copytool/assets/html/agent-vs-copytool-chart.html': {
          default: 'agentTemplate'
        },
        'source/iml/chart-compiler/chart-compiler.js': {
          default: chartCompiler
        },
        'source/iml/create-date.js': { default: createDate },
        'source/iml/store/get-store.js': { default: getStore },
        'source/iml/duration-picker/duration-payload.js': {
          default: durationPayload
        },
        'source/iml/duration-picker/duration-submit-handler.js': {
          default: durationSubmitHandler
        },
        'source/iml/chart-transformers/chart-transformers.js': { getConf }
      }
    );

    getAgentVsCopytoolChartFactory = mod.default;
  });

  afterEach(resetAll);

  beforeEach(module(agentVsCopytoolModule));

  beforeEach(
    inject(_d3_ => {
      d3 = _d3_;
      spyOn(d3.time, 'scale').and.callFake(() => {
        timeScale = {};

        timeScale.domain = jasmine
          .createSpy('domain')
          .and.returnValue(timeScale);
        timeScale.range = jasmine.createSpy('range').and.returnValue(timeScale);

        return timeScale;
      });
      spyOn(d3.scale, 'linear').and.callFake(() => {
        linearScale = {};

        linearScale.domain = jasmine
          .createSpy('domain')
          .and.returnValue(linearScale);
        linearScale.range = jasmine
          .createSpy('range')
          .and.returnValue(linearScale);

        return linearScale;
      });
      spyOn(d3.scale, 'ordinal').and.callFake(() => {
        ordinalScale = {};

        ordinalScale.domain = jasmine.createSpy('domain').and.callFake(xs => {
          if (xs) return ordinalScale;
          else return currentRange;
        });

        let currentRange;
        ordinalScale.range = jasmine.createSpy('range').and.callFake(xs => {
          if (xs) {
            currentRange = xs;
            return ordinalScale;
          } else {
            return currentRange;
          }
        });

        return ordinalScale;
      });

      getAgentVsCopytoolChart = getAgentVsCopytoolChartFactory(
        localApply,
        fp.curry3(data$Fn),
        d3
      );

      agentVsCopytoolChart = getAgentVsCopytoolChart({
        foo: 'bar'
      });

      const s = chartCompiler.calls.argsFor(0)[1];
      s.each(() => {});
    })
  );

  it('should return a function', () => {
    expect(getAgentVsCopytoolChart).toEqual(jasmine.any(Function));
  });

  it('should dispatch to the store', () => {
    expect(getStore.dispatch).toHaveBeenCalledOnceWith({
      type: 'DEFAULT_AGENT_VS_COPYTOOL_CHART_ITEMS',
      payload: {
        page: 'base',
        configType: 'duration',
        size: 10,
        unit: 'minutes',
        startDate: 1464812942650,
        endDate: 1464812997102
      }
    });
  });

  it('should select the agentVsCopytoolCharts store', () => {
    expect(getStore.select).toHaveBeenCalledOnceWith('agentVsCopytoolCharts');
  });

  it('should call getConf', () => {
    expect(getConf).toHaveBeenCalledOnceWith('base');
  });

  it('should call data$Fn', () => {
    expect(data$Fn).toHaveBeenCalledOnceWith(
      {
        foo: 'bar'
      },
      jasmine.any(Function),
      standardConfig
    );
  });

  it('should invoke the getAgentVsCopytoolStream', () => {
    expect(getAgentVsCopytoolStream).toHaveBeenCalledTimes(1);
  });

  it('should invoke the chart compiler', () => {
    expect(chartCompiler).toHaveBeenCalledOnceWith(
      'agentTemplate',
      jasmine.any(Object),
      jasmine.any(Function)
    );
  });

  it('should return a chart compiler', () => {
    expect(agentVsCopytoolChart).toBe('chartCompiler');
  });

  it('should create a xScale', () => {
    expect(d3.time.scale).toHaveBeenCalledTimes(1);
  });

  it('should create a yScale', () => {
    expect(d3.scale.linear).toHaveBeenCalled();
  });

  describe('name color scale', () => {
    it('should be an ordinal scale', () => {
      expect(d3.scale.ordinal).toHaveBeenCalledTimes(1);
    });

    it('should set the domain', () => {
      expect(ordinalScale.domain).toHaveBeenCalledOnceWith([
        'running actions',
        'waiting requests',
        'idle workers'
      ]);
    });

    it('should set the range', () => {
      expect(ordinalScale.range).toHaveBeenCalledOnceWith([
        '#F3B600',
        '#A3B600',
        '#0067B4'
      ]);
    });
  });

  describe('compiler', () => {
    let $scope, s, config;

    beforeEach(
      inject($rootScope => {
        $scope = $rootScope.$new();
        s = highland();
        spyOn(s, 'destroy');
        config = chartCompiler.calls.mostRecent().args[2]($scope, s);
      })
    );

    it('should return a conf', () => {
      expect(config).toEqual({
        stream: s,
        configType: 'duration',
        page: '',
        startDate: 1464812942650,
        endDate: 1464812997102,
        size: 10,
        unit: 'minutes',
        xScale: timeScale,
        yScale: linearScale,
        onUpdate: [
          jasmine.any(Function),
          jasmine.any(Function),
          jasmine.any(Function),
          jasmine.any(Function)
        ],
        rangeLabelOnUpdate: [
          jasmine.any(Function),
          jasmine.any(Function),
          jasmine.any(Function)
        ],
        labels: [
          jasmine.any(Function),
          jasmine.any(Function),
          jasmine.any(Function)
        ],
        colors: ['#F3B600', '#A3B600', '#0067B4'],
        nameColorScale: ordinalScale,
        calcRange: jasmine.any(Function),
        xValue: jasmine.any(Function),
        xComparator: jasmine.any(Function),
        onSubmit: jasmine.any(Function)
      });
    });

    it('should destroy the stream when the chart is destroyed', () => {
      $scope.$destroy();

      expect(initStream.destroy).toHaveBeenCalled();
      expect(config1$.destroy).toHaveBeenCalled();
      expect(config2$.destroy).toHaveBeenCalled();
    });

    describe('on update', () => {
      it('should update xScale domain', () => {
        createDate.and.callFake(fp.identity);

        config.onUpdate[0]({
          xs: [
            {
              ts: '1'
            },
            {
              ts: '2'
            }
          ]
        });

        expect(timeScale.domain).toHaveBeenCalledOnceWith(['1', '2']);
      });

      it('should update yScale domain', () => {
        config.onUpdate[1]({
          xs: [
            {
              a: 100,
              ts: 10000
            },
            {
              b: 9000
            },
            {
              c: 200
            }
          ]
        });

        expect(linearScale.domain).toHaveBeenCalledOnceWith([0, 9001]);
      });

      it('should update xScale range', () => {
        config.onUpdate[2]({ width: 500 });

        expect(timeScale.range).toHaveBeenCalledOnceWith([0, 500]);
      });

      it('should update yScale Range', () => {
        config.onUpdate[3]({ height: 300 });

        expect(linearScale.range).toHaveBeenCalledOnceWith([280, 30]);
      });

      describe('range label on update', () => {
        it('should update label width', () => {
          const label = {
            width: jasmine.createSpy('width')
          };

          config.rangeLabelOnUpdate[0]({
            label,
            width: 50
          });

          expect(label.width).toHaveBeenCalledOnceWith(50);
        });

        it('should update label height', () => {
          const label = {
            height: jasmine.createSpy('height')
          };

          config.rangeLabelOnUpdate[1]({
            label
          });

          expect(label.height).toHaveBeenCalledOnceWith(20);
        });

        it('should translate node', () => {
          const node = {
            attr: jasmine.createSpy('attr')
          };

          config.rangeLabelOnUpdate[2]({
            node,
            height: 60
          });

          expect(node.attr).toHaveBeenCalledOnceWith(
            'transform',
            'translate(0,60)'
          );
        });
      });
    });
  });

  describe('on submit', () => {
    let handler, $scope, config;

    beforeEach(
      inject($rootScope => {
        handler = chartCompiler.calls.mostRecent().args[2];
        $scope = $rootScope.$new();

        config = handler($scope, initStream);

        config.onSubmit();
      })
    );

    it('should call durationSubmitHandler', () => {
      expect(
        durationSubmitHandler
      ).toHaveBeenCalledOnceWith('UPDATE_AGENT_VS_COPYTOOL_CHART_ITEMS', {
        page: 'base'
      });
    });

    it('should invoke the submit handler', () => {
      expect(submitHandler).toHaveBeenCalledTimes(1);
    });
  });
});
