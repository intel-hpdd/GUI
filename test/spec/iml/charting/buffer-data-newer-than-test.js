import moment from 'moment';
import highland from 'highland';

describe('buffer data newer than', () => {
  let mockGetServerMoment, bufferDataNewerThan, spy;

  beforeEach(() => {

    jest.useFakeTimers();

    spy = jest.fn();
    mockGetServerMoment = jest.fn();

    jest.mock(
      '../../../../source/iml/get-server-moment.js',
      () => mockGetServerMoment
    );

    const mod = require('../../../../source/iml/charting/buffer-data-newer-than.js');

    bufferDataNewerThan = mod.default;
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should flatten milliseconds single seconds', () => {
    mockGetServerMoment.mockReturnValue(moment('2015-05-11T00:00:03.565Z'));

    highland([{ ts: '2015-05-10T23:50:00.000Z' }])
      .through(bufferDataNewerThan(10, 'minutes'))
      .each(spy);

    expect(spy).toHaveBeenCalledOnceWith({
      ts: '2015-05-10T23:50:00.000Z'
    });
  });

  it('should keep points within the window', () => {
    mockGetServerMoment.mockReturnValue(moment('2015-05-11T00:00:00.000Z'));

    highland([{ ts: '2015-05-10T23:50:59.999Z' }])
      .through(bufferDataNewerThan(10, 'minutes'))
      .each(spy);

    expect(spy).toHaveBeenCalledOnceWith({
      ts: '2015-05-10T23:50:59.999Z'
    });
  });

  it('should remove points outside the window', () => {
    mockGetServerMoment.mockReturnValue(moment('2015-05-11T00:00:00.000Z'));

    highland([{ ts: '2015-05-10T23:49:50.000Z' }])
      .through(bufferDataNewerThan(10, 'minutes'))
      .each(spy);

    expect(spy).not.toHaveBeenCalled();
  });

  it('should sort the dates', () => {
    mockGetServerMoment.mockReturnValue(moment('2015-05-11T00:00:00.000Z'));

    highland([
      { ts: '2015-05-10T23:51:50.000Z' },
      { ts: '2015-05-10T23:50:50.000Z' }
    ])
      .through(bufferDataNewerThan(10, 'minutes'))
      .collect()
      .each(spy);

    expect(spy).toHaveBeenCalledOnceWith([
      { ts: '2015-05-10T23:50:50.000Z' },
      { ts: '2015-05-10T23:51:50.000Z' }
    ]);
  });

  it('should buffer points', () => {
    mockGetServerMoment.mockReturnValue(moment('2015-05-11T00:00:00.000Z'));

    const s1 = highland();
    const s2 = highland();

    const buff = bufferDataNewerThan(10, 'minutes');

    s1.through(buff).each(() => {});

    s1.write({ ts: '2015-05-10T23:50:50.000Z' });
    s1.end();
    jest.runAllTimers();

    s2.through(buff).collect().each(spy);
    s2.write({ ts: '2015-05-10T23:51:50.000Z' });
    s2.write({ ts: '2015-05-10T23:52:50.000Z' });
    s2.end();
    jest.runAllTimers();

    expect(spy).toHaveBeenCalledOnceWith([
      { ts: '2015-05-10T23:50:50.000Z' },
      { ts: '2015-05-10T23:51:50.000Z' },
      { ts: '2015-05-10T23:52:50.000Z' }
    ]);
  });
});
