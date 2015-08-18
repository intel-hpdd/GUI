describe('buffer data newer than', function () {
  'use strict';

  var getServerMoment;

  beforeEach(module('charting', function ($provide) {

    getServerMoment = jasmine.createSpy('getServerMoment');

    $provide.value('getServerMoment', getServerMoment);
  }));

  var bufferDataNewerThan, spy;

  beforeEach(inject(function (_bufferDataNewerThan_) {
    bufferDataNewerThan = _bufferDataNewerThan_;

    spy = jasmine.createSpy('spy');
  }));

  it('should flatten milliseconds single seconds', function () {
    getServerMoment.andReturn(moment('2015-05-11T00:00:03.565Z'));

    highland([{ ts: '2015-05-10T23:50:00.000Z' }])
      .through(bufferDataNewerThan(10, 'minutes'))
      .each(spy);

    expect(spy).toHaveBeenCalledOnceWith({
      ts: '2015-05-10T23:50:00.000Z'
    });
  });

  it('should keep points within the window', function () {
    getServerMoment.andReturn(moment('2015-05-11T00:00:00.000Z'));

    highland([{ ts: '2015-05-10T23:50:59.999Z' }])
      .through(bufferDataNewerThan(10, 'minutes'))
      .each(spy);

    expect(spy).toHaveBeenCalledOnceWith({
      ts: '2015-05-10T23:50:59.999Z'
    });
  });

  it('should remove points outside the window', function () {
    getServerMoment.andReturn(moment('2015-05-11T00:00:00.000Z'));

    highland([{ ts: '2015-05-10T23:49:50.000Z' }])
      .through(bufferDataNewerThan(10, 'minutes'))
      .each(spy);

    expect(spy).not.toHaveBeenCalled();
  });

  it('should sort the dates', function () {
    getServerMoment.andReturn(moment('2015-05-11T00:00:00.000Z'));

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

  it('should buffer points', function () {
    getServerMoment.andReturn(moment('2015-05-11T00:00:00.000Z'));

    var s1 = highland();
    var s2 = highland();

    var buff = bufferDataNewerThan(10, 'minutes');

    s1
      .through(buff)
      .each(_.noop);

    s2
      .through(buff)
      .collect()
      .each(spy);

    s1.write({ ts: '2015-05-10T23:50:50.000Z' });
    s2.write({ ts: '2015-05-10T23:51:50.000Z' });
    s2.write({ ts: '2015-05-10T23:52:50.000Z' });
    s1.end();
    s2.end();

    expect(spy).toHaveBeenCalledOnceWith([
      { ts: '2015-05-10T23:50:50.000Z' },
      { ts: '2015-05-10T23:51:50.000Z' },
      { ts: '2015-05-10T23:52:50.000Z' }
    ]);
  });
});
