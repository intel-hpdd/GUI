import highland from 'highland';

import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('union with target', () => {
  let socketStream, targetStream, spy, unionWithTarget;

  beforeEachAsync(async function () {
    targetStream = highland();

    socketStream = jasmine
      .createSpy('socketStream')
      .and
      .returnValue(targetStream);

    spy = jasmine.createSpy('spy');

    const mod = await mock('source/iml/charting/union-with-target.js', {
      'source/iml/socket/socket-stream.js': {
        default: socketStream
      }
    });

    unionWithTarget = mod.default;

    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  afterEach(resetAll);

  it('should be a function', () => {
    expect(unionWithTarget)
      .toEqual(jasmine.any(Function));
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
    jasmine.clock().tick();

    expect(spy)
      .toHaveBeenCalledOnceWith([
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
    jasmine.clock().tick();

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
    jasmine.clock().tick();

    expect(spy)
      .toHaveBeenCalledOnceWith([
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

  it('should keep all ids if targets don\'t match', () => {
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
    jasmine.clock().tick();

    expect(spy)
      .toHaveBeenCalledOnceWith([
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
    highland([])
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
    jasmine.clock().tick();

    expect(spy).toHaveBeenCalledOnceWith([]);
  });
});
