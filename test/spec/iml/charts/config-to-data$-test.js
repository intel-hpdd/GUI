import chartsModule from '../../../../source/iml/charts/charts-module.js';
import {configChange} from '../../../../source/iml/charts/base-chart.js';
import highland from 'highland';
import {noop} from 'intel-fp';

describe('configToData$', () => {
  var configToData$, data$Fn, config$, data$, spy;
  const e = new Error('oh noooos!');

  beforeEach(module(chartsModule));

  beforeEach(inject((_configToData$_) => {
    configToData$ = _configToData$_;
  }));

  beforeEach(() => {
    spy = jasmine.createSpy('spy');

    data$Fn = x => {
      if (x.percentage < 50) {
        data$ = highland();
        data$.write(5);
        data$.write(6);
        data$.write(7);
      } else if (x.percentage >= 50 && x.percentage <= 80){
        data$ = highland();
        data$.write(8);
        data$.write(9);
        data$.write(10);
      } else if (x.percentage > 80) {
        data$ = highland();
        data$.write(e);
      }

      spyOn(data$, 'destroy');
      return data$;
    };
    config$ = highland();
    config$.write({percentage: 10});

    data$ = configToData$(data$Fn, config$);
  });

  it('should return a factory function', () => {
    expect(configToData$).toEqual(jasmine.any(Function));
  });

  it('should return each item on the stream and lastly the configChange object', () => {
    config$.end();

    data$
      .collect()
      .each(spy);

    expect(spy).toHaveBeenCalledOnceWith([5, 6, 7, configChange]);
  });

  it('should destroy the stream', () => {
    config$.end();

    data$
      .collect()
      .each(noop);

    expect(data$.destroy).toHaveBeenCalledOnce();
  });

  it('should push new chart data through when the config stream changes', () => {
    config$.write({percentage: 80});
    config$.end();

    data$
      .collect()
      .each(spy);

    expect(spy).toHaveBeenCalledOnceWith([5,6,7,configChange,8,9,10,configChange]);
  });

  it('should push errors coming from the data stream', () => {
    config$.write({percentage: 95});
    config$.end();

    data$
      .collect()
      .each(spy);

    expect(spy).toHaveBeenCalledOnceWith([5,6,7,configChange,e,configChange]);
  });

  describe('error case', () => {
    beforeEach(() => {
      config$.write({
        __HighlandStreamError__: true,
        error: e
      });
      config$.end();
    });

    it('should catch errors', () => {
      data$
        .errors((e, push) => {
          spy(e);
          push(null, e);
        })
        .each(noop);

      expect(spy).toHaveBeenCalledOnceWith(e);
    });

    it('should include the error if rethrown', () => {
      data$
        .errors((e, push) => {
          push(null, e);
        })
        .collect()
        .each(spy);

      expect(spy).toHaveBeenCalledOnceWith([5,6,7,e,configChange]);
    });
  });
});
