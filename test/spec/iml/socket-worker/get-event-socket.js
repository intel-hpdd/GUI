describe('get event socket', function () {
  'use strict';

  var socketWorker, getRandomValue, emitter;

  beforeEach(window.module('socket-module', function ($provide) {
    socketWorker = {
      addEventListener: jasmine.createSpy('addEventListener'),
      postMessage: jasmine.createSpy('postMessage')
    };

    $provide.value('EventEmitter', EventEmitter);

    emitter = {
      once: jasmine.createSpy('once'),
      removeAllListeners: jasmine.createSpy('removeAllListeners')
    };

    function EventEmitter () {
      return emitter;
    }

    $provide.value('socketWorker', socketWorker);

    getRandomValue = jasmine.createSpy('getRandomValue').andReturn(5);
    $provide.value('getRandomValue', getRandomValue);
  }));

  var getEventSocket, eventSocket;

  beforeEach(inject(function (_getEventSocket_) {
    getEventSocket = _getEventSocket_;
    eventSocket = getEventSocket();
  }));

  it('should be a function', function () {
    expect(getEventSocket).toEqual(jasmine.any(Function));
  });

  it('should have a connect method', function () {
    expect(eventSocket.connect).toEqual(jasmine.any(Function));
  });

  it('should have a send method', function () {
    expect(eventSocket.send).toEqual(jasmine.any(Function));
  });

  it('should get an id', function () {
    expect(getRandomValue).toHaveBeenCalledOnce();
  });

  describe('connect', function () {
    beforeEach(function () {
      eventSocket.connect();
    });

    it('should send a postMessage to the worker', function () {
      expect(socketWorker.postMessage).toHaveBeenCalledOnceWith({ type: 'connect', id: 5 });
    });

    it('should return if connect was already called without end', function () {
      eventSocket.connect();
      expect(socketWorker.postMessage).toHaveBeenCalledOnce();
    });
  });

  it('should send a message', function () {
    eventSocket.send();

    expect(socketWorker.postMessage).toHaveBeenCalledOnceWith({ type: 'send', id: 5 });
  });

  it('should send a message with a payload', function () {
    eventSocket.send({ path: '/host' });

    expect(socketWorker.postMessage).toHaveBeenCalledOnceWith({
      type: 'send',
      id: 5,
      payload: { path: '/host' }
    });
  });

  it('should not end if not connected', function () {
    eventSocket.end();

    expect(emitter.removeAllListeners).not.toHaveBeenCalled();
  });

  it('should removeAllListeners on end', function () {
    eventSocket.connect();
    eventSocket.end();
    expect(emitter.removeAllListeners).toHaveBeenCalledOnce();
  });

  describe('ack', function () {
    var ack, spy;

    beforeEach(function () {
      eventSocket.connect();

      spy = jasmine.createSpy('spy');

      eventSocket.send({ path: '/host' }, spy);

      ack = eventSocket.once.mostRecentCall.args[1];
    });

    it('should send a message with a payload and ack', function () {
      expect(socketWorker.postMessage).toHaveBeenCalledOnceWith({
        type: 'send',
        id: 5,
        payload: { path: '/host' },
        ack: true
      });
    });

    it('should register a once listener on ack send', function () {
      expect(emitter.once).toHaveBeenCalledOnceWith('message', jasmine.any(Function));
    });

    it('should ack the response', function () {
      ack({ foo: 'bar' });

      expect(spy).toHaveBeenCalledOnceWith({ foo: 'bar' });
    });
  });
});
