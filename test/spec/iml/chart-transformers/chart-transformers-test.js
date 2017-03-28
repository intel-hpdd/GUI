import highland from 'highland';
import {
  getConf,
  data$Fn,
  flushOnChange,
  waitForChartData
} from '../../../../source/iml/chart-transformers/chart-transformers.js';

import * as fp from 'intel-fp';

import {
  documentHidden,
  documentVisible
} from '../../../../source/iml/stream-when-visible/stream-when-visible.js';

describe('chart transformer', () => {
  let s, config1, config2, spy;

  beforeEach(() => {
    spy = jasmine.createSpy('spy');
    config1 = {
      configType: 'duration',
      size: 10,
      unit: 'minutes',
      startDate: 1465829589123,
      endDate: 1465829610575
    };

    config2 = {
      configType: 'range',
      size: 3,
      unit: 'hours',
      startDate: 1465829589123,
      endDate: 1465829761462
    };
  });

  describe('getConf', () => {
    let conf$;
    beforeEach(() => {
      conf$ = getConf('target8');
    });

    it('should be a function', () => {
      expect(getConf).toEqual(jasmine.any(Function));
    });

    it('should take the matching case', () => {
      s = highland([
        {
          base: config1,
          target8: config2
        }
      ]);
      conf$(s).each(spy);

      expect(spy).toHaveBeenCalledOnceWith(config2);
    });
  });

  describe('data$Fn', () => {
    let fn,
      createStream,
      durationStreamOverrides,
      durationStream,
      rangeStreamOverrides,
      rangeStream,
      overrides,
      chartStreamFn,
      chart$,
      duration$,
      range$;

    beforeEach(() => {
      duration$ = highland([]);
      durationStream = jasmine
        .createSpy('durationStream')
        .and.returnValue(duration$);
      durationStreamOverrides = jasmine
        .createSpy('durationStream')
        .and.returnValue(durationStream);
      range$ = highland([]);
      rangeStream = jasmine.createSpy('rangeStream').and.returnValue(range$);
      rangeStreamOverrides = jasmine
        .createSpy('rangeStream')
        .and.returnValue(rangeStream);
      createStream = {
        durationStream: durationStreamOverrides,
        rangeStream: rangeStreamOverrides
      };
      chart$ = highland([]);
      chartStreamFn = jasmine
        .createSpy('chartStreamFn')
        .and.returnValue(chart$);

      overrides = {
        qs: {
          id: 8
        }
      };

      fn = data$Fn(createStream);
    });

    describe('with duration type', () => {
      beforeEach(() => {
        s = fn(overrides, chartStreamFn, config1);
      });

      it('should invoke durationStream with the overrides', () => {
        expect(durationStreamOverrides).toHaveBeenCalledOnceWith(overrides);
      });

      it('should invoke rangeStream with the overrides', () => {
        expect(rangeStreamOverrides).toHaveBeenCalledOnceWith(overrides);
      });

      it('should invoke chartStreamFn with config', () => {
        expect(chartStreamFn).toHaveBeenCalledOnceWith(config1);
      });

      it('should invoke durationStream', () => {
        expect(durationStream).toHaveBeenCalledOnceWith(chart$, 10, 'minutes');
      });

      it('should return a duration stream', () => {
        expect(s).toEqual(duration$);
      });
    });

    describe('with range type', () => {
      beforeEach(() => {
        s = fn(overrides, chartStreamFn, config2);
      });

      it('should invoke durationStream with the overrides', () => {
        expect(durationStreamOverrides).toHaveBeenCalledOnceWith(overrides);
      });

      it('should invoke rangeStream with the overrides', () => {
        expect(rangeStreamOverrides).toHaveBeenCalledOnceWith(overrides);
      });

      it('should invoke chartStreamFn with config', () => {
        expect(chartStreamFn).toHaveBeenCalledOnceWith(config2);
      });

      it('should invoke rangeStream', () => {
        expect(rangeStream).toHaveBeenCalledOnceWith(
          chart$,
          1465829589123,
          1465829761462
        );
      });

      it('should return a duration stream', () => {
        expect(s).toEqual(range$);
      });
    });
  });
});

describe('flush on change', () => {
  let source$, s, spy;

  beforeEach(() => {
    spy = jasmine.createSpy('spy');
    source$ = highland();
    s = flushOnChange(source$);
    spyOn(s, 'destroy');
  });

  it('should write document hidden', () => {
    s.each(spy);

    expect(spy).toHaveBeenCalledOnceWith(documentHidden);
  });

  it('should write document visible', () => {
    source$.write('foo');
    s.each(spy);

    expect(spy).toHaveBeenCalledOnceWith(documentVisible);
  });

  it('should catch errors', () => {
    const error = new Error('it goes boom!');
    source$.write({
      __HighlandStreamError__: true,
      error
    });

    s.errors(fp.unary(spy)).each(fp.noop);

    expect(spy).toHaveBeenCalledOnceWith(error);
  });

  it('should handle ending a stream', () => {
    source$.end();
    s.each(spy);

    expect(s.destroy).toHaveBeenCalled();
  });
});

describe('waitForChartData', () => {
  let source$, s, spy;

  beforeEach(() => {
    spy = jasmine.createSpy('spy');
    source$ = highland();
    s = waitForChartData(source$);
    spyOn(s, 'destroy');

    source$.write(documentHidden);
    source$.write(documentVisible);
    source$.write({ x: 1 });
  });

  it('should not pass documentHidden to the stream', () => {
    s.each(spy);
    expect(spy).not.toHaveBeenCalledWith(documentHidden);
  });

  it('should not pass documentVisible to the stream', () => {
    s.each(spy);
    expect(spy).not.toHaveBeenCalledWith(documentVisible);
  });

  it('should pass the data', () => {
    s.each(spy);
    expect(spy).toHaveBeenCalledOnceWith({ x: 1 });
  });

  it('should catch errors', () => {
    const error = new Error('it goes boom!');
    source$.write({
      __HighlandStreamError__: true,
      error
    });

    s.errors(fp.unary(spy)).each(fp.noop);

    expect(spy).toHaveBeenCalledOnceWith(error);
  });

  it('should handle ending a stream', () => {
    source$.end();
    s.each(spy);

    expect(s.destroy).toHaveBeenCalled();
  });
});
