import {noop, curry} from 'intel-fp';
import highland from 'highland';


describe('socket stream', () => {
  var getEventSocket, socket, spy;

  beforeEach(module('socket-module', $provide => {
    socket = {
      connect: jasmine.createSpy('connect'),
      end: jasmine.createSpy('end'),
      send: jasmine.createSpy('send'),
      on: jasmine.createSpy('on')
    };

    spy = jasmine.createSpy('spy');

    getEventSocket = jasmine.createSpy('getEventSocket')
      .and.returnValue(socket);

    $provide.value('getEventSocket', getEventSocket);
  }));

  var socketStream;

  beforeEach(inject(_socketStream_ => {
    socketStream = _socketStream_;
  }));

  it('should be a function', () => {
    expect(socketStream).toEqual(jasmine.any(Function));
  });

  it('should return a stream', () => {
    expect(highland.isStream(socketStream('/'))).toBe(true);
  });

  it('should strip /api prefix', () => {
    socketStream('/api/host/');

    expect(socket.send).toHaveBeenCalledOnceWith({
      path: '/host/',
      options: {}
    });
  });

  it('should default to empty options', () => {
    socketStream('host/');

    expect(socket.send).toHaveBeenCalledOnceWith({
      path: 'host/',
      options: {}
    });
  });

  describe('ack', () => {
    var s;

    beforeEach(() => {
      s = socketStream('host/', {}, true);
    });

    it('should send data to the socket', () => {
      s.each(noop);
      expect(socket.send).toHaveBeenCalledOnceWith({
        path: 'host/',
        options: {}
      }, jasmine.any(Function));
    });

    it('should end after a response', () => {
      s.each(noop);

      var ack = socket.send.calls.mostRecent().args[1];

      ack({});

      expect(socket.end).toHaveBeenCalledOnce();
    });

    it('should end after an error', () => {
      s.each(noop);

      var ack = socket.send.calls.mostRecent().args[1];

      ack({ error: 'boom!' });

      expect(socket.end).toHaveBeenCalledOnce();
    });

    it('should end if stream is paused', () => {
      s.pull(noop);

      var ack = socket.send.calls.mostRecent().args[1];

      ack({
        error: 'boom!'
      });

      expect(socket.end).toHaveBeenCalledOnce();
    });

    it('should handle errors', () => {
      s.errors(curry(1, spy))
        .each(noop);

      var ack = socket.send.calls.mostRecent().args[1];

      ack({ error: 'boom!' });

      expect(spy).toHaveBeenCalledOnceWith(new Error('boom!'));
    });

    it('should handle the response', () => {
      s.each(spy);

      var ack = socket.send.calls.mostRecent().args[1];

      ack({ foo: 'bar' });

      expect(spy).toHaveBeenCalledOnceWith({ foo: 'bar' });
    });
  });

  describe('stream', () => {
    var s, handler;

    beforeEach(() => {
      s = socketStream('/host', {
        qs: { foo: 'bar' }
      });

      handler = socket.on.calls.mostRecent().args[1];
    });

    it('should connect the socket', () => {
      expect(socket.connect).toHaveBeenCalledOnce();
    });

    it('should send data to the socket', () => {
      expect(socket.send).toHaveBeenCalledOnceWith({
        path: '/host',
        options: {
          qs: { foo: 'bar' }
        }
      });
    });

    it('should end on destroy', () => {
      s.destroy();

      expect(socket.end).toHaveBeenCalledOnce();
    });

    it('should handle errors', () => {
      handler({
        error: new Error('boom!')
      });

      s
        .errors(curry(1, spy))
        .each(noop);

      expect(spy).toHaveBeenCalledOnceWith(new Error('boom!'));
    });

    it('should handle responses', () => {
      handler({ foo: 'bar' });

      s.each(spy);

      expect(spy).toHaveBeenCalledOnceWith({ foo: 'bar' });
    });
  });
});
