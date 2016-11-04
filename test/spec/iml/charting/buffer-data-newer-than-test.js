import moment from 'moment';
import highland from 'highland';

import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('buffer data newer than', () => {
  let getServerMoment, bufferDataNewerThan, spy;

  beforeEachAsync(async function () {
    jasmine.clock().install();

    spy = jasmine.createSpy('spy');
    getServerMoment = jasmine.createSpy('getServerMoment');

    const mod = await mock('source/iml/charting/buffer-data-newer-than.js', {
      'source/iml/get-server-moment.js': {
        default: getServerMoment
      }
    });

    bufferDataNewerThan = mod.default;
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  afterEach(resetAll);

  it('should flatten milliseconds single seconds', () => {
    getServerMoment.and.returnValue(moment('2015-05-11T00:00:03.565Z'));

    highland([{ ts: '2015-05-10T23:50:00.000Z' }])
      .through(bufferDataNewerThan(10, 'minutes'))
      .each(spy);

    expect(spy).toHaveBeenCalledOnceWith({
      ts: '2015-05-10T23:50:00.000Z'
    });
  });

  it('should keep points within the window', () => {
    getServerMoment.and.returnValue(moment('2015-05-11T00:00:00.000Z'));

    highland([{ ts: '2015-05-10T23:50:59.999Z' }])
      .through(bufferDataNewerThan(10, 'minutes'))
      .each(spy);

    expect(spy).toHaveBeenCalledOnceWith({
      ts: '2015-05-10T23:50:59.999Z'
    });
  });

  it('should remove points outside the window', () => {
    getServerMoment.and.returnValue(moment('2015-05-11T00:00:00.000Z'));

    highland([{ ts: '2015-05-10T23:49:50.000Z' }])
      .through(bufferDataNewerThan(10, 'minutes'))
      .each(spy);

    expect(spy).not.toHaveBeenCalled();
  });

  it('should sort the dates', () => {
    getServerMoment.and.returnValue(moment('2015-05-11T00:00:00.000Z'));

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
    getServerMoment.and.returnValue(moment('2015-05-11T00:00:00.000Z'));

    const s1 = highland();
    const s2 = highland();

    const buff = bufferDataNewerThan(10, 'minutes');

    s1
      .through(buff)
      .each(() => {});

    s1.write({ ts: '2015-05-10T23:50:50.000Z' });
    s1.end();
    jasmine.clock().tick(1);

    s2
      .through(buff)
      .collect()
      .each(spy);
    s2.write({ ts: '2015-05-10T23:51:50.000Z' });
    s2.write({ ts: '2015-05-10T23:52:50.000Z' });
    s2.end();
    jasmine.clock().tick(1);


    expect(spy).toHaveBeenCalledOnceWith([
      { ts: '2015-05-10T23:50:50.000Z' },
      { ts: '2015-05-10T23:51:50.000Z' },
      { ts: '2015-05-10T23:52:50.000Z' }
    ]);
  });
});
