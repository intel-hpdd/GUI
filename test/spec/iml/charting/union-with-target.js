import angular from 'angular';
const {module, inject} = angular.mock;

describe('union with target', function () {
  'use strict';

  var socketStream, targetStream;

  beforeEach(module('charting', function ($provide) {
    targetStream = highland();

    socketStream = jasmine.createSpy('socketStream')
      .andReturn(targetStream);

    $provide.value('socketStream', socketStream);
  }));

  var unionWithTarget, spy;

  beforeEach(inject(function (_unionWithTarget_) {
    unionWithTarget = _unionWithTarget_;

    spy = jasmine.createSpy('spy');
  }));

  it('should be a function', function () {
    expect(unionWithTarget).toEqual(jasmine.any(Function));
  });

  it('should union with targets', function () {
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

  it('should keep targets without a matching id', function () {
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

  it('should keep all ids if targets is empty', function () {
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

  it('should keep all ids if targets don\'t match', function () {
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

  it('should return empty metrics', function () {
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

    expect(spy).toHaveBeenCalledOnceWith([]);
  });
});
