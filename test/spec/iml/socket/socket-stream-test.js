import highland from 'highland';
import * as fp from '@mfl/fp';

describe('socket stream', () => {
  let mockGetEventSocket, socket, spy, socketStream;

  beforeEach(() => {
    socket = {
      connect: jest.fn(),
      end: jest.fn(),
      send: jest.fn(),
      on: jest.fn()
    };

    spy = jest.fn();

    mockGetEventSocket = jest.fn(() => socket);

    jest.mock(
      '../../../../source/iml/socket-worker/get-event-socket.js',
      () => mockGetEventSocket
    );

    const socketStreamModule = require('../../../../source/iml/socket/socket-stream.js');

    socketStream = socketStreamModule.default;
  });

  it('should be a function', () => {
    expect(socketStream).toEqual(expect.any(Function));
  });

  it('should return a stream', () => {
    expect(highland.isStream(socketStream('/'))).toBe(true);
  });

  it('should strip /api prefix', () => {
    socketStream('/api/host/');

    expect(socket.send).toHaveBeenCalledOnceWith({
      path: '/host/',
      options: {
        method: 'get'
      }
    });
  });

  it('should default to empty options', () => {
    socketStream('host/');

    expect(socket.send).toHaveBeenCalledOnceWith({
      path: 'host/',
      options: {
        method: 'get'
      }
    });
  });

  describe('ack', () => {
    let s;

    beforeEach(() => {
      s = socketStream('host/', {}, true);
    });

    it('should send data to the socket', () => {
      s.each(fp.noop);
      expect(socket.send).toHaveBeenCalledOnceWith(
        {
          path: 'host/',
          options: {
            method: 'get'
          }
        },
        expect.any(Function)
      );
    });

    it('should end after a response', () => {
      s.each(fp.noop);

      const ack = socket.send.mock.calls[0][1];

      ack({});

      expect(socket.end).toHaveBeenCalledTimes(1);
    });

    it('should end after an error', () => {
      s.each(fp.noop);

      const ack = socket.send.mock.calls[0][1];

      ack({ error: 'boom!' });

      expect(socket.end).toHaveBeenCalledTimes(1);
    });

    it('should end if stream is paused', () => {
      s.pull(fp.noop);

      const ack = socket.send.mock.calls[0][1];

      ack({
        error: 'boom!'
      });

      expect(socket.end).toHaveBeenCalledTimes(1);
    });

    it('should handle errors', () => {
      s.errors(x => spy(x)).each(fp.noop);

      const ack = socket.send.mock.calls[0][1];

      ack({ error: 'boom!' });

      expect(spy).toHaveBeenCalledOnceWith(new Error('boom!'));
    });

    it('should handle the response', () => {
      s.each(spy);

      const ack = socket.send.mock.calls[0][1];

      ack({ foo: 'bar' });

      expect(spy).toHaveBeenCalledOnceWith({ foo: 'bar' });
    });
  });

  describe('stream', () => {
    let s, handler;

    beforeEach(() => {
      s = socketStream('/host', {
        qs: { foo: 'bar' }
      });

      handler = socket.on.mock.calls[0][1];
    });

    it('should connect the socket', () => {
      expect(socket.connect).toHaveBeenCalledTimes(1);
    });

    it('should send data to the socket', () => {
      expect(socket.send).toHaveBeenCalledOnceWith({
        path: '/host',
        options: {
          method: 'get',
          qs: { foo: 'bar' }
        }
      });
    });

    it('should end on destroy', () => {
      s.destroy();

      expect(socket.end).toHaveBeenCalledTimes(1);
    });

    it('should handle errors', () => {
      handler({
        error: new Error('boom!')
      });

      s.errors(x => spy(x)).each(fp.noop);

      expect(spy).toHaveBeenCalledOnceWith(new Error('boom!'));
    });

    it('should handle responses', () => {
      handler({ foo: 'bar' });

      s.each(spy);

      expect(spy).toHaveBeenCalledOnceWith({ foo: 'bar' });
    });
  });
});
