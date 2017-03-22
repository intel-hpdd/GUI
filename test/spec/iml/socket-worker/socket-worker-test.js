import * as fp from 'intel-fp';

import { mock, resetAll } from '../../../system-mock.js';

describe('socket worker', () => {
  let worker,
    getWebWorker,
    arg0Eq,
    getArg1,
    STATIC_URL,
    socketWorker,
    disconnectListener;

  beforeEachAsync(async function() {
    arg0Eq = fp.eqFn(
      fp.identity,
      fp.view(fp.flow(fp.lensProp(0), fp.lensProp('args')))
    );
    getArg1 = fp.view(fp.flow(fp.lensProp(1), fp.lensProp('args')));

    worker = {
      addEventListener: jasmine.createSpy('addEventListener')
    };

    disconnectListener = {
      emit: jasmine.createSpy('emit')
    };

    getWebWorker = jasmine.createSpy('getWebWorker').and.returnValue(worker);

    STATIC_URL = '/gui/';

    const socketWorkerModule = await mock(
      'source/iml/socket-worker/socket-worker.js',
      {
        'source/iml/socket-worker/get-web-worker.js': { default: getWebWorker },
        'source/iml/disconnect-modal/disconnect-listener.js': {
          default: disconnectListener
        },
        'source/iml/environment.js': { STATIC_URL }
      }
    );

    socketWorker = socketWorkerModule.default;
  });

  afterEach(resetAll);

  it('should create a worker with a remote script', () => {
    expect(getWebWorker).toHaveBeenCalledOnceWith(
      `${STATIC_URL}node_modules/socket-worker/dist/bundle.js`
    );
  });

  it('should register a message handler', () => {
    expect(worker.addEventListener).toHaveBeenCalledOnceWith(
      'message',
      jasmine.any(Function)
    );
  });

  it('should register an error handler', () => {
    expect(worker.addEventListener).toHaveBeenCalledOnceWith(
      'error',
      jasmine.any(Function)
    );
  });

  it('should return the worker', () => {
    expect(worker).toBe(socketWorker);
  });

  it('should throw on error', () => {
    const getError = fp.flow(fp.find(arg0Eq('error')), getArg1);

    const err = new Error('boom!');

    expect(
      getError(worker.addEventListener.calls.all()).bind(null, err)
    ).toThrow(err);
  });

  describe('message handling', () => {
    let handler;

    beforeEach(() => {
      const getMessage = fp.flow(fp.find(arg0Eq('message')), getArg1);

      handler = getMessage(worker.addEventListener.calls.all());
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
        expect(disconnectListener.emit).toHaveBeenCalledOnceWith('open');
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
        expect(disconnectListener.emit).toHaveBeenCalledOnceWith('close');
      });
    });
  });
});
