import { mock, resetAll } from '../../../system-mock.js';

describe('get event socket', () => {
  let socketWorker, getRandomValue, emitter, getEventSocket, eventSocket;

  beforeEachAsync(async function() {
    socketWorker = {
      addEventListener: jasmine.createSpy('addEventListener'),
      postMessage: jasmine.createSpy('postMessage')
    };

    emitter = {
      once: jasmine.createSpy('once'),
      removeAllListeners: jasmine.createSpy('removeAllListeners')
    };

    function EventEmitter() {
      return this;
    }
    EventEmitter.prototype = emitter;

    getRandomValue = jasmine.createSpy('getRandomValue').and.returnValue(5);

    const getEventSocketModule = await mock(
      'source/iml/socket-worker/get-event-socket.js',
      {
        'source/iml/event-emitter.js': { default: EventEmitter },
        'source/iml/get-random-value.js': { default: getRandomValue },
        'source/iml/socket-worker/socket-worker.js': { default: socketWorker }
      }
    );
    getEventSocket = getEventSocketModule.default;
    eventSocket = getEventSocket();
  });

  afterEach(resetAll);

  it('should be a function', () => {
    expect(getEventSocket).toEqual(jasmine.any(Function));
  });

  it('should have a connect method', () => {
    expect(eventSocket.connect).toEqual(jasmine.any(Function));
  });

  it('should have a send method', () => {
    expect(eventSocket.send).toEqual(jasmine.any(Function));
  });

  it('should get an id', () => {
    expect(getRandomValue).toHaveBeenCalledOnce();
  });

  describe('connect', () => {
    beforeEach(() => {
      eventSocket.connect();
    });

    it('should send a postMessage to the worker', () => {
      expect(socketWorker.postMessage).toHaveBeenCalledOnceWith({
        type: 'connect',
        id: 5
      });
    });

    it('should return if connect was already called without end', () => {
      eventSocket.connect();
      expect(socketWorker.postMessage).toHaveBeenCalledOnce();
    });
  });

  it('should send a message', () => {
    eventSocket.send();

    expect(socketWorker.postMessage).toHaveBeenCalledOnceWith({
      type: 'send',
      id: 5
    });
  });

  it('should send a message with a payload', () => {
    eventSocket.send({ path: '/host' });

    expect(socketWorker.postMessage).toHaveBeenCalledOnceWith({
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
    expect(emitter.removeAllListeners).toHaveBeenCalledOnce();
  });

  describe('ack', () => {
    let ack, spy;

    beforeEach(() => {
      eventSocket.connect();

      spy = jasmine.createSpy('spy');

      eventSocket.send({ path: '/host' }, spy);

      ack = eventSocket.once.calls.mostRecent().args[1];
    });

    it('should send a message with a payload and ack', () => {
      expect(socketWorker.postMessage).toHaveBeenCalledOnceWith({
        type: 'send',
        id: 5,
        payload: { path: '/host' },
        ack: true
      });
    });

    it('should register a once listener on ack send', () => {
      expect(emitter.once).toHaveBeenCalledOnceWith(
        'message',
        jasmine.any(Function)
      );
    });

    it('should ack the response', () => {
      ack({ foo: 'bar' });

      expect(spy).toHaveBeenCalledOnceWith({ foo: 'bar' });
    });
  });
});
