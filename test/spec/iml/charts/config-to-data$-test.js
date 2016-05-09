import highland from 'highland';
import {noop} from 'intel-fp';

import chartsModule from '../../../../source/iml/charts/charts-module.js';
import {configChange} from '../../../../source/iml/charts/config-to-data$.js';

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
      const data$ = highland();

      if (x.percentage < 50) {
        data$.write(5);
        data$.write(6);
        data$.write(7);
      } else if (x.percentage >= 50 && x.percentage <= 80){
        data$.write(8);
        data$.write(9);
        data$.write(10);
      } else if (x.percentage > 80) {
        config$.write({
          __HighlandStreamError__: true,
          error: e
        });
      }

      return data$;
    };
  });

  describe('without errors', () => {

    beforeEach(() => {
      config$ = highland();
      config$.write({percentage: 10});

      data$ = configToData$(data$Fn, config$);
    });

    it('should return a factory function', () => {
      expect(configToData$).toEqual(jasmine.any(Function));
    });

    it('should return each item on the stream and lastly the configChange object', () => {
      data$
        .collect()
        .each(spy);
      config$.destroy();

      expect(spy).toHaveBeenCalledOnceWith([5, 6, 7, configChange]);
    });

    it('should end the stream', () => {

      data$
        .done(spy);
      config$.destroy();

      expect(spy).toHaveBeenCalledOnce();
    });

    it('should push new chart data through when the config stream changes', () => {
      config$.write({percentage: 80});

      data$
        .collect()
        .each(spy);
      config$.destroy();

      expect(spy).toHaveBeenCalledOnceWith([5,6,7,configChange,8,9,10,configChange]);
    });

    it('should push errors coming from the data stream', () => {
      config$.write({percentage: 95});

      data$
        .errors(spy)
        .each(noop);

      expect(spy).toHaveBeenCalledOnceWith(e, jasmine.any(Function));
    });
  });
});
