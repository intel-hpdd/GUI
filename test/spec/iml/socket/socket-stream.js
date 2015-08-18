describe('socket stream', function () {
  'use strict';

  var getEventSocket, socket, spy;

  beforeEach(module('socket-module', function ($provide) {
    socket = {
      connect: jasmine.createSpy('connect'),
      end: jasmine.createSpy('end'),
      send: jasmine.createSpy('send'),
      on: jasmine.createSpy('on')
    };

    spy = jasmine.createSpy('spy');

    getEventSocket = jasmine.createSpy('getEventSocket')
      .andReturn(socket);

    $provide.value('getEventSocket', getEventSocket);
  }));

  var socketStream;

  beforeEach(inject(function (_socketStream_) {
    socketStream = _socketStream_;
  }));

  it('should be a function', function () {
    expect(socketStream).toEqual(jasmine.any(Function));
  });

  it('should return a stream', function () {
    expect(highland.isStream(socketStream('/'))).toBe(true);
  });

  it('should strip /api prefix', function () {
    socketStream('/api/host/');

    expect(socket.send).toHaveBeenCalledOnceWith({
      path: '/host/',
      options: {}
    });
  });

  it('should default to empty options', function () {
    socketStream('host/');

    expect(socket.send).toHaveBeenCalledOnceWith({
      path: 'host/',
      options: {}
    });
  });

  describe('ack', function () {
    var s;

    beforeEach(function () {
      s = socketStream('host/', {}, true);
    });

    it('should send data to the socket', function () {
      s.each(_.noop);
      expect(socket.send).toHaveBeenCalledOnceWith({
        path: 'host/',
        options: {}
      }, jasmine.any(Function));
    });

    it('should end after a response', function () {
      s.each(_.noop);

      var ack = socket.send.mostRecentCall.args[1];

      ack({});

      expect(socket.end).toHaveBeenCalledOnce();
    });

    it('should end after an error', function () {
      s.each(_.noop);

      var ack = socket.send.mostRecentCall.args[1];

      ack({ error: 'boom!' });

      expect(socket.end).toHaveBeenCalledOnce();
    });

    it('should end if stream is paused', function () {
      s.pull(_.noop);

      var ack = socket.send.mostRecentCall.args[1];

      ack({
        error: 'boom!'
      });

      expect(socket.end).toHaveBeenCalledOnce();
    });

    it('should handle errors', function () {
      s.errors(_.unary(spy))
        .each(_.noop);

      var ack = socket.send.mostRecentCall.args[1];

      ack({ error: 'boom!' });

      expect(spy).toHaveBeenCalledOnceWith(new Error('boom!'));
    });

    it('should handle the response', function () {
      s.each(spy);

      var ack = socket.send.mostRecentCall.args[1];

      ack({ foo: 'bar' });

      expect(spy).toHaveBeenCalledOnceWith({ foo: 'bar' });
    });
  });

  describe('stream', function () {
    var s, handler;

    beforeEach(function () {
      s = socketStream('/host', {
        qs: { foo: 'bar' }
      });

      handler = socket.on.mostRecentCall.args[1];
    });

    it('should connect the socket', function () {
      expect(socket.connect).toHaveBeenCalledOnce();
    });

    it('should send data to the socket', function () {
      expect(socket.send).toHaveBeenCalledOnceWith({
        path: '/host',
        options: {
          qs: { foo: 'bar' }
        }
      });
    });

    it('should end on destroy', function () {
      s.destroy();

      expect(socket.end).toHaveBeenCalledOnce();
    });

    it('should handle errors', function () {
      handler({
        error: new Error('boom!')
      });

      s
        .errors(_.unary(spy))
        .each(_.noop);

      expect(spy).toHaveBeenCalledOnceWith(new Error('boom!'));
    });

    it('should handle responses', function () {
      handler({ foo: 'bar' });

      s.each(spy);

      expect(spy).toHaveBeenCalledOnceWith({ foo: 'bar' });
    });
  });
});
