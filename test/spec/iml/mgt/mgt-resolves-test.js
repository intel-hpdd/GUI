import mgtModule from '../../../../source/iml/mgt/mgt-module.js';
import highland from 'highland';

import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('mgt resolves', () => {
  var addProperty, store, resolvesModule;

  beforeEachAsync(async function () {
    store = {
      select: jasmine.createSpy('select')
    };

    resolvesModule = await mock('source/iml/mgt/mgt-resolves.js', {
      'source/iml/store/get-store': { default: store }
    });
  });

  afterEach(resetAll);

  beforeEach(module(mgtModule, $provide => {
    addProperty = jasmine.createSpy('addProperty');
    $provide.value('addProperty', addProperty);

    $provide.factory('mgtAlertIndicatorStream', resolvesModule.mgtAlertIndicatorStream);
    $provide.factory('mgtJobIndicatorStream', resolvesModule.mgtJobIndicatorStream);
    $provide.factory('mgtStream', resolvesModule.mgtStream);
  }));

  var mgtStream, mgtJobIndicatorStream, mgtAlertIndicatorStream;

  beforeEach(inject((_mgtStream_, _mgtJobIndicatorStream_, _mgtAlertIndicatorStream_) => {
    mgtStream = _mgtStream_;
    mgtJobIndicatorStream = _mgtJobIndicatorStream_;
    mgtAlertIndicatorStream = _mgtAlertIndicatorStream_;
  }));

  it('should select alertIndicators', () => {
    mgtAlertIndicatorStream();

    expect(store.select)
      .toHaveBeenCalledOnceWith('alertIndicators');
  });

  it('should select jobIndicators', () => {
    mgtJobIndicatorStream();

    expect(store.select)
      .toHaveBeenCalledOnceWith('jobIndicators');
  });

  it('should select targets', () => {
    store.select.and.returnValue(highland());

    mgtStream();

    expect(store.select)
      .toHaveBeenCalledOnceWith('targets');
  });

  it('should filter targets for MGTs', () => {
    const spy = jasmine.createSpy('spy');
    const s = highland();

    store.select.and.returnValue(s);

    mgtStream()
      .each(spy);

    s.write([
      {kind: 'OST'},
      {kind: 'MGT'}
    ]);

    expect(spy).toHaveBeenCalledOnceWith([
      {kind: 'MGT'}
    ]);
  });
});
