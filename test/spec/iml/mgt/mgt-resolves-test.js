import highland from 'highland';

import { mock, resetAll } from '../../../system-mock.js';

describe('mgt resolves', () => {
  let store, mgtStream, mgtJobIndicatorStream, mgtAlertIndicatorStream;

  beforeEachAsync(async function() {
    store = {
      select: jasmine.createSpy('select').and.returnValue(highland())
    };

    const mod = await mock('source/iml/mgt/mgt-resolves.js', {
      'source/iml/store/get-store': { default: store }
    });

    mgtStream = mod.mgt$;
    mgtJobIndicatorStream = mod.mgtJobIndicatorB;
    mgtAlertIndicatorStream = mod.mgtAlertIndicatorB;
  });

  afterEach(resetAll);

  it('should select alertIndicators', () => {
    mgtAlertIndicatorStream();

    expect(store.select).toHaveBeenCalledOnceWith('alertIndicators');
  });

  it('should select jobIndicators', () => {
    mgtJobIndicatorStream();

    expect(store.select).toHaveBeenCalledOnceWith('jobIndicators');
  });

  it('should select targets', () => {
    store.select.and.returnValue(highland());

    mgtStream();

    expect(store.select).toHaveBeenCalledOnceWith('targets');
  });

  it('should filter targets for MGTs', () => {
    const spy = jasmine.createSpy('spy');
    const s = highland();

    store.select.and.returnValue(s);

    mgtStream().each(spy);

    s.write([{ kind: 'OST' }, { kind: 'MGT' }]);

    expect(spy).toHaveBeenCalledOnceWith([{ kind: 'MGT' }]);
  });
});
