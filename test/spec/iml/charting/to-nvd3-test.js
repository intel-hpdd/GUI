import highland from 'highland';
import chartingModule from '../../../../source/iml/charting/charting-module';

describe('the to nvd3 plugin', function () {
  beforeEach(module(chartingModule));

  var toNvd3, spy;

  beforeEach(inject(function (_toNvd3_) {
    toNvd3 = _toNvd3_;
    spy = jasmine.createSpy('spy');
  }));

  it('should convert items to nvd3 format', function () {
    highland([
      { ts: '2015-05-10T23:50:50.000Z', data: { read: 3, write: 4 } },
      { ts: '2015-05-10T23:51:50.000Z', data: { read: 5, write: 6 } }
    ])
      .through(toNvd3(['read', 'write']))
      .each(spy);

    expect(spy).toHaveBeenCalledOnceWith([
      {
        key: 'read',
        values: [
          {
            x: new Date('2015-05-10T23:50:50.000Z'),
            y: 3
          },
          {
            x: new Date('2015-05-10T23:51:50.000Z'),
            y: 5
          }
        ]
      },
      {
        key: 'write',
        values: [
          {
            x: new Date('2015-05-10T23:50:50.000Z'),
            y: 4
          },
          {
            x: new Date('2015-05-10T23:51:50.000Z'),
            y: 6
          }
        ]
      }
    ]);
  });

  it('should return an empty struct when there is no data', function () {
    highland([])
      .through(toNvd3(['read', 'write']))
      .each(spy);

    expect(spy).toHaveBeenCalledOnceWith([
      { key: 'read', values: [] },
      { key: 'write', values: [] }
    ]);
  });
});
