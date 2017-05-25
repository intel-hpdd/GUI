import highland from 'highland';

describe('union with target', () => {
  let mockSocketStream, targetStream, spy, unionWithTarget;

  beforeEach(() => {
    targetStream = highland();

    mockSocketStream = jest.fn(() => targetStream);

    spy = jest.fn();

    jest.mock(
      '../../../../source/iml/socket/socket-stream.js',
      () => mockSocketStream
    );

    const mod = require('../../../../source/iml/charting/union-with-target.js');

    unionWithTarget = mod.default;

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should be a function', () => {
    expect(unionWithTarget).toEqual(expect.any(Function));
  });

  it('should union with targets', () => {
    highland([
      {
        data: { foo: 'bar' },
        ts: '2013-11-18T22:45:30+00:00',
        id: '18',
        name: '18'
      },
      {
        data: { foo: 'baz' },
        ts: '2013-11-18T22:45:30+00:00',
        id: '19',
        name: '19'
      }
    ])
      .through(unionWithTarget)
      .collect()
      .each(spy);

    targetStream.write({
      objects: [
        {
          id: '18',
          name: 'OST001'
        },
        {
          id: '19',
          name: 'OST002'
        }
      ]
    });
    targetStream.end();
    jest.runAllTimers();

    expect(spy).toHaveBeenCalledOnceWith([
      {
        data: { foo: 'bar' },
        ts: '2013-11-18T22:45:30+00:00',
        id: '18',
        name: 'OST001'
      },
      {
        data: { foo: 'baz' },
        ts: '2013-11-18T22:45:30+00:00',
        id: '19',
        name: 'OST002'
      }
    ]);
  });

  it('should keep targets without a matching id', () => {
    highland([
      {
        data: { foo: 'bar' },
        ts: '2013-11-18T22:45:30+00:00',
        id: '18',
        name: '18'
      },
      {
        data: { foo: 'baz' },
        ts: '2013-11-18T22:45:30+00:00',
        id: '19',
        name: '19'
      }
    ])
      .through(unionWithTarget)
      .collect()
      .each(spy);

    targetStream.write({
      objects: [
        {
          id: '18',
          name: 'OST001'
        }
      ]
    });
    targetStream.end();
    jest.runAllTimers();

    expect(spy).toHaveBeenCalledOnceWith([
      {
        data: { foo: 'bar' },
        ts: '2013-11-18T22:45:30+00:00',
        id: '18',
        name: 'OST001'
      },
      {
        data: { foo: 'baz' },
        ts: '2013-11-18T22:45:30+00:00',
        id: '19',
        name: '19'
      }
    ]);
  });

  it('should keep all ids if targets is empty', () => {
    highland([
      {
        data: { foo: 'bar' },
        ts: '2013-11-18T22:45:30+00:00',
        id: '18',
        name: '18'
      },
      {
        data: { foo: 'baz' },
        ts: '2013-11-18T22:45:30+00:00',
        id: '19',
        name: '19'
      }
    ])
      .through(unionWithTarget)
      .collect()
      .each(spy);

    targetStream.write({
      objects: []
    });
    targetStream.end();
    jest.runAllTimers();

    expect(spy).toHaveBeenCalledOnceWith([
      {
        data: { foo: 'bar' },
        ts: '2013-11-18T22:45:30+00:00',
        id: '18',
        name: '18'
      },
      {
        data: { foo: 'baz' },
        ts: '2013-11-18T22:45:30+00:00',
        id: '19',
        name: '19'
      }
    ]);
  });

  it("should keep all ids if targets don't match", () => {
    highland([
      {
        data: { foo: 'bar' },
        ts: '2013-11-18T22:45:30+00:00',
        id: '18',
        name: '18'
      },
      {
        data: { foo: 'baz' },
        ts: '2013-11-18T22:45:30+00:00',
        id: '19',
        name: '19'
      }
    ])
      .through(unionWithTarget)
      .collect()
      .each(spy);

    targetStream.write({
      objects: [
        {
          id: '20',
          name: 'OST003'
        },
        {
          id: '21',
          name: 'OST004'
        }
      ]
    });
    targetStream.end();
    jest.runAllTimers();

    expect(spy).toHaveBeenCalledOnceWith([
      {
        data: { foo: 'bar' },
        ts: '2013-11-18T22:45:30+00:00',
        id: '18',
        name: '18'
      },
      {
        data: { foo: 'baz' },
        ts: '2013-11-18T22:45:30+00:00',
        id: '19',
        name: '19'
      }
    ]);
  });

  it('should return empty metrics', () => {
    highland([]).through(unionWithTarget).collect().each(spy);

    targetStream.write({
      objects: [
        {
          id: '20',
          name: 'OST003'
        },
        {
          id: '21',
          name: 'OST004'
        }
      ]
    });
    targetStream.end();
    jest.runAllTimers();

    expect(spy).toHaveBeenCalledOnceWith([]);
  });
});
