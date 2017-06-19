describe('socket worker', () => {
  let worker, mockGetWebWorker, socketWorker, mockDisconnectListener;

  beforeEach(() => {
    worker = {
      addEventListener: jest.fn()
    };

    mockDisconnectListener = {
      emit: jest.fn()
    };

    mockGetWebWorker = jest.fn(() => worker);

    jest.mock(
      '../../../../source/iml/socket-worker/get-web-worker.js',
      () => mockGetWebWorker
    );
    jest.mock(
      '../../../../source/iml/disconnect-modal/disconnect-listener.js',
      () => mockDisconnectListener
    );
    jest.mock('../../../../source/iml/environment.js', () => ({
      STATIC_URL: '/gui/'
    }));

    const socketWorkerModule = require('../../../../source/iml/socket-worker/socket-worker.js');

    socketWorker = socketWorkerModule.default;
  });

  it('should create a worker with a remote script', () => {
    expect(mockGetWebWorker).toHaveBeenCalledOnceWith(
      `/gui/node_modules/socket-worker/dist/bundle.js`
    );
  });

  it('should register a message handler', () => {
    expect(worker.addEventListener).toHaveBeenCalledOnceWith(
      'message',
      expect.any(Function)
    );
  });

  it('should register an error handler', () => {
    expect(worker.addEventListener).toHaveBeenCalledOnceWith(
      'error',
      expect.any(Function)
    );
  });

  it('should return the worker', () => {
    expect(worker).toBe(socketWorker);
  });

  it('should throw on error', () => {
    const err = new Error('boom!');
    expect(worker.addEventListener.mock.calls[1][1].bind(null, err)).toThrow(
      'boom!'
    );
  });

  describe('message handling', () => {
    let handler;

    beforeEach(() => {
      handler = worker.addEventListener.mock.calls[0][1];
    });

    describe('reconnecting', () => {
      let ev;

      beforeEach(() => {
        ev = {
          data: { type: 'reconnecting' }
        };

        handler(ev);
      });

      it('should emit open on disconnectListener', () => {
        expect(mockDisconnectListener.emit).toHaveBeenCalledOnceWith('open');
      });
    });

    describe('reconnect', () => {
      let ev;

      beforeEach(() => {
        ev = {
          data: { type: 'reconnecting' }
        };

        handler(ev);

        ev.data.type = 'reconnect';
        handler(ev);
      });

      it('should emit close on disconnectListener', () => {
        expect(mockDisconnectListener.emit).toHaveBeenCalledOnceWith('close');
      });
    });
  });
});
