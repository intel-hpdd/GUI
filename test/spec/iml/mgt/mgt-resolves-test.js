import highland from 'highland';

describe('mgt resolves', () => {
  let mockStore, mgtStream, mgtJobIndicatorStream, mgtAlertIndicatorStream;

  beforeEach(() => {
    jest.resetModules();
    mockStore = {
      select: jest.fn(() => highland())
    };

    jest.mock('../../../../source/iml/store/get-store', () => mockStore);

    const mod = require('../../../../source/iml/mgt/mgt-resolves.js');

    mgtStream = mod.mgt$;
    mgtJobIndicatorStream = mod.mgtJobIndicatorB;
    mgtAlertIndicatorStream = mod.mgtAlertIndicatorB;
  });

  afterEach(() => {
    window.angular = null;
  });

  it('should select alertIndicators', () => {
    mgtAlertIndicatorStream();

    expect(mockStore.select).toHaveBeenCalledOnceWith('alertIndicators');
  });

  it('should select jobIndicators', () => {
    mgtJobIndicatorStream();

    expect(mockStore.select).toHaveBeenCalledOnceWith('jobIndicators');
  });

  it('should select targets', () => {
    mockStore.select.mockReturnValue(highland());

    mgtStream();

    expect(mockStore.select).toHaveBeenCalledOnceWith('targets');
  });

  it('should filter targets for MGTs', () => {
    const spy = jest.fn();
    const s = highland();

    mockStore.select.mockReturnValue(s);

    mgtStream().each(spy);

    s.write([{ kind: 'OST' }, { kind: 'MGT' }]);

    expect(spy).toHaveBeenCalledOnceWith([{ kind: 'MGT' }]);
  });
});
