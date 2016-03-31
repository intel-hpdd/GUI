import mgtModule from '../../../../source/iml/mgt/mgt-module.js';
import highland from 'highland';

describe('mgt resolves', () => {
  var addProperty, getStore;

  beforeEach(module(mgtModule, $provide => {
    addProperty = jasmine.createSpy('addProperty');
    $provide.value('addProperty', addProperty);

    getStore = {
      select: jasmine.createSpy('select')
    };
    $provide.value('getStore', getStore);
  }));

  var mgtStream, mgtJobIndicatorStream, mgtAlertIndicatorStream;

  beforeEach(inject((_mgtStream_, _mgtJobIndicatorStream_, _mgtAlertIndicatorStream_) => {
    mgtStream = _mgtStream_;
    mgtJobIndicatorStream = _mgtJobIndicatorStream_;
    mgtAlertIndicatorStream = _mgtAlertIndicatorStream_;
  }));

  it('should select alertIndicators', () => {
    mgtAlertIndicatorStream();

    expect(getStore.select)
      .toHaveBeenCalledOnceWith('alertIndicators');
  });

  it('should select jobIndicators', () => {
    mgtJobIndicatorStream();

    expect(getStore.select)
      .toHaveBeenCalledOnceWith('jobIndicators');
  });

  it('should select targets', () => {
    getStore.select.and.returnValue(highland());

    mgtStream();

    expect(getStore.select)
      .toHaveBeenCalledOnceWith('targets');
  });

  it('should filter targets for MGTs', () => {
    const spy = jasmine.createSpy('spy');
    const s = highland();

    getStore.select.and.returnValue(s);

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
