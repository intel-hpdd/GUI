describe('get event socket', () => {
  let mockSocketWorker,
    mockGetRandomValue,
    emitter,
    getEventSocket,
    eventSocket;

  beforeEach(() => {
    mockSocketWorker = {
      addEventListener: jest.fn(),
      postMessage: jest.fn()
    };

    emitter = {
      once: jest.fn(),
      removeAllListeners: jest.fn()
    };

    function mockEventEmitter() {
      return this;
    }
    mockEventEmitter.prototype = emitter;

    mockGetRandomValue = jest.fn(() => 5);

    jest.mock(
      '../../../../source/iml/event-emitter.js',
      () => mockEventEmitter
    );
    jest.mock(
      '../../../../source/iml/get-random-value.js',
      () => mockGetRandomValue
    );
    jest.mock(
      '../../../../source/iml/socket-worker/socket-worker.js',
      () => mockSocketWorker
    );
    const getEventSocketModule = require('../../../../source/iml/socket-worker/get-event-socket.js');

    getEventSocket = getEventSocketModule.default;
    eventSocket = getEventSocket();
  });

  it('should be a function', () => {
    expect(getEventSocket).toEqual(expect.any(Function));
  });

  it('should have a connect method', () => {
    expect(eventSocket.connect).toEqual(expect.any(Function));
  });

  it('should have a send method', () => {
    expect(eventSocket.send).toEqual(expect.any(Function));
  });

  it('should get an id', () => {
    expect(mockGetRandomValue).toHaveBeenCalledTimes(1);
  });

  describe('connect', () => {
    beforeEach(() => {
      eventSocket.connect();
    });

    it('should send a postMessage to the worker', () => {
      expect(mockSocketWorker.postMessage).toHaveBeenCalledOnceWith({
        type: 'connect',
        id: 5
      });
    });

    it('should return if connect was already called without end', () => {
      eventSocket.connect();
      expect(mockSocketWorker.postMessage).toHaveBeenCalledTimes(1);
    });
  });

  it('should send a message', () => {
    eventSocket.send();

    expect(mockSocketWorker.postMessage).toHaveBeenCalledOnceWith({
      type: 'send',
      id: 5
    });
  });

  it('should send a message with a payload', () => {
    eventSocket.send({ path: '/host' });

    expect(mockSocketWorker.postMessage).toHaveBeenCalledOnceWith({
      type: 'send',
      id: 5,
      payload: { path: '/host' }
    });
  });

  it('should not end if not connected', () => {
    eventSocket.end();

    expect(emitter.removeAllListeners).not.toHaveBeenCalled();
  });

  it('should removeAllListeners on end', () => {
    eventSocket.connect();
    eventSocket.end();
    expect(emitter.removeAllListeners).toHaveBeenCalledTimes(1);
  });

  describe('ack', () => {
    let ack, spy;

    beforeEach(() => {
      eventSocket.connect();

      spy = jest.fn();

      eventSocket.send({ path: '/host' }, spy);

      ack = eventSocket.once.mock.calls[0][1];
    });

    it('should send a message with a payload and ack', () => {
      expect(mockSocketWorker.postMessage).toHaveBeenCalledOnceWith({
        type: 'send',
        id: 5,
        payload: { path: '/host' },
        ack: true
      });
    });

    it('should register a once listener on ack send', () => {
      expect(emitter.once).toHaveBeenCalledOnceWith(
        'message',
        expect.any(Function)
      );
    });

    it('should ack the response', () => {
      ack({ foo: 'bar' });

      expect(spy).toHaveBeenCalledOnceWith({ foo: 'bar' });
    });
  });
});
