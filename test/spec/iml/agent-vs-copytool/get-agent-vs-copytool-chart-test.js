import {identity} from 'intel-fp';
import agentVsCopytoolModule from '../../../../source/iml/agent-vs-copytool/agent-vs-copytool-module';
import highland from 'highland';

describe('get agent vs copytool chart exports', () => {
  var createStream, getAgentVsCopytoolStream, createDate,
    chartCompiler, durationStream, durationStreamInstance, rangeStream, rangeStreamInstance;

  beforeEach(module(agentVsCopytoolModule, ($provide) => {
    durationStreamInstance = highland();
    spyOn(durationStreamInstance, 'destroy');
    durationStream = jasmine.createSpy('durationStream')
      .and.returnValue(durationStreamInstance);

    rangeStreamInstance = highland();
    rangeStream = jasmine.createSpy('rangeStream')
      .and.returnValue(rangeStreamInstance);

    createStream = {
      durationStream: jasmine.createSpy('durationStreamWrapper')
        .and.returnValue(durationStream),
      rangeStream: jasmine.createSpy('rangeStreamWrapper')
        .and.returnValue(rangeStream)
    };
    $provide.value('createStream', createStream);

    getAgentVsCopytoolStream = jasmine.createSpy('getAgentVsCopytoolStream');
    $provide.value('getAgentVsCopytoolStream', getAgentVsCopytoolStream);

    chartCompiler = jasmine.createSpy('chartCompiler')
      .and.returnValue('chartCompiler');
    $provide.value('chartCompiler', chartCompiler);

    createDate = jasmine.createSpy('createDate');
    $provide.value('createDate', createDate);
  }));

  var getAgentVsCopytoolChart, agentVsCopytoolChart, d3,
    timeScale, linearScale, ordinalScale;

  beforeEach(inject((_getAgentVsCopytoolChart_, _d3_) => {
    getAgentVsCopytoolChart = _getAgentVsCopytoolChart_;

    d3 = _d3_;
    spyOn(d3.time, 'scale').and.callFake(() => {
      timeScale = {};

      timeScale.domain = jasmine.createSpy('domain')
        .and.returnValue(timeScale);
      timeScale.range = jasmine.createSpy('range')
        .and.returnValue(timeScale);

      return timeScale;
    });
    spyOn(d3.scale, 'linear').and.callFake(() => {
      linearScale = {};

      linearScale.domain = jasmine.createSpy('domain')
        .and.returnValue(linearScale);
      linearScale.range = jasmine.createSpy('range')
        .and.returnValue(linearScale);

      return linearScale;
    });
    spyOn(d3.scale, 'ordinal').and.callFake(() => {
      ordinalScale = {};

      ordinalScale.domain = jasmine.createSpy('domain')
        .and.callFake((xs) => {
          if (xs)
            return ordinalScale;
          else
            return currentRange;
        });

      var currentRange;
      ordinalScale.range = jasmine.createSpy('range')
        .and.callFake((xs) => {
          if (xs) {
            currentRange = xs;
            return ordinalScale;
          } else {
            return currentRange;
          }
        });

      return ordinalScale;
    });

    agentVsCopytoolChart = getAgentVsCopytoolChart({
      foo: 'bar'
    });
  }));

  it('should return a function', () => {
    expect(getAgentVsCopytoolChart)
      .toEqual(jasmine.any(Function));
  });

  it('should return a chart compiler', () => {
    expect(agentVsCopytoolChart).toBe('chartCompiler');
  });

  it('should create a duration stream', () => {
    expect(createStream.durationStream)
      .toHaveBeenCalledOnceWith(getAgentVsCopytoolStream, {
        foo: 'bar'
      });
  });

  it('should create a range stream', () => {
    expect(createStream.rangeStream)
      .toHaveBeenCalledOnceWith(getAgentVsCopytoolStream, {
        foo: 'bar'
      });
  });

  it('should create a xScale', () => {
    expect(d3.time.scale)
      .toHaveBeenCalledOnce();
  });

  it('should create a yScale', () => {
    expect(d3.scale.linear)
      .toHaveBeenCalled();
  });

  describe('name color scale', () => {
    it('should be an ordinal scale', () => {
      expect(d3.scale.ordinal)
        .toHaveBeenCalledOnce();
    });

    it('should set the domain', () => {
      expect(ordinalScale.domain)
        .toHaveBeenCalledOnceWith(['running actions', 'waiting requests', 'idle workers']);
    });

    it('should set the range', () => {
      expect(ordinalScale.range)
        .toHaveBeenCalledOnceWith(['#F3B600', '#A3B600', '#0067B4']);
    });
  });

  it('should call the chartCompiler', () => {
    expect(chartCompiler)
      .toHaveBeenCalledOnceWith(
        '/static/chroma_ui/source/iml/agent-vs-copytool/assets/html/agent-vs-copytool-chart.js',
        durationStreamInstance,
        jasmine.any(Function));
  });

  describe('compiler', () => {
    var $scope, s, config;

    beforeEach(inject(($rootScope) => {
      $scope = $rootScope.$new();
      s = highland();
      spyOn(s, 'destroy');
      config = chartCompiler.calls.mostRecent().args[2]($scope, s);
    }));

    it('should return a conf', () => {
      expect(config).toEqual({
        stream: s,
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
        size: 10,
        unit: 'minutes',
        onSubmit: jasmine.any(Function)
      });
    });

    it('should destroy the stream', () => {
      $scope.$destroy();

      expect(s.destroy)
        .toHaveBeenCalledOnce();
    });

    describe('on submit', () => {
      describe('with a duration', () => {
        beforeEach(() => {
          config.onSubmit({
            durationForm: {
              size: { $modelValue: 5 },
              unit: { $modelValue: 'hours' }
            }
          });
        });

        it('should create a duration stream', () => {
          expect(durationStream).toHaveBeenCalledOnceWith(5, 'hours');
        });
      });

      describe('with a range', () => {
        beforeEach(() => {
          config.onSubmit({
            rangeForm: {
              start: { $modelValue: '2015-05-03T07:25' },
              end: { $modelValue: '2015-05-03T07:35' }
            }
          });
        });

        it('should create a range stream', () => {
          expect(rangeStream).toHaveBeenCalledOnceWith('2015-05-03T07:25', '2015-05-03T07:35');
        });
      });
    });

    describe('on update', () => {
      it('should update xScale domain', () => {
        createDate.and.callFake(identity);

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

        expect(timeScale.domain)
          .toHaveBeenCalledOnceWith(['1', '2']);
      });

      it('should update yScale domain', () => {
        config.onUpdate[1]({xs: [
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
        ]});

        expect(linearScale.domain)
          .toHaveBeenCalledOnceWith([0, 9001]);
      });

      it('should update xScale range', () => {
        config.onUpdate[2]({width: 500});

        expect(timeScale.range)
          .toHaveBeenCalledOnceWith([0, 500]);
      });

      it('should update yScale Range', () => {
        config.onUpdate[3]({height: 300});

        expect(linearScale.range)
          .toHaveBeenCalledOnceWith([280, 30]);
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

          expect(label.width)
            .toHaveBeenCalledOnceWith(50);
        });

        it('should update label height', () => {
          const label = {
            height: jasmine.createSpy('height')
          };

          config.rangeLabelOnUpdate[1]({
            label
          });

          expect(label.height)
            .toHaveBeenCalledOnceWith(20);
        });

        it('should translate node', () => {
          const node = {
            attr: jasmine.createSpy('attr')
          };

          config.rangeLabelOnUpdate[2]({
            node,
            height: 60
          });

          expect(node.attr)
            .toHaveBeenCalledOnceWith('transform', 'translate(0,60)');
        });
      });
    });
  });
});
