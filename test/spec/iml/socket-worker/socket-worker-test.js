import {find, eqFn, flow, view, lensProp, identity} from 'intel-fp';
import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('socket worker', () => {
  var worker, getWebWorker, arg0Eq, getArg1,
    STATIC_URL, socketWorker, disconnectListener;

  beforeEachAsync(async function () {
    arg0Eq = eqFn(identity, view(flow(lensProp(0), lensProp('args'))));
    getArg1 = view(flow(lensProp(1), lensProp('args')));

    worker = {
      addEventListener: jasmine
        .createSpy('addEventListener')
    };

    disconnectListener = {
      emit: jasmine.createSpy('emit')
    };

    getWebWorker = jasmine
      .createSpy('getWebWorker')
      .and
      .returnValue(worker);

    STATIC_URL = '/static/chroma_ui/';

    const socketWorkerModule = await mock('source/iml/socket-worker/socket-worker.js', {
      'source/iml/socket-worker/get-web-worker.js': { default: getWebWorker },
      'source/iml/disconnect-modal/disconnect-listener.js': { default: disconnectListener },
      'source/iml/environment.js': { STATIC_URL }
    });

    socketWorker = socketWorkerModule.default;
  });

  afterEach(resetAll);

  it('should create a worker with a remote script', () => {
    expect(getWebWorker)
      .toHaveBeenCalledOnceWith(`${STATIC_URL}node_modules/intel-socket-worker/dist/bundle.js`);
  });

  it('should register a message handler', () => {
    expect(worker.addEventListener)
      .toHaveBeenCalledOnceWith('message', jasmine.any(Function));
  });

  it('should register an error handler', () => {
    expect(worker.addEventListener)
      .toHaveBeenCalledOnceWith('error', jasmine.any(Function));
  });

  it('should return the worker', () => {
    expect(worker)
      .toBe(socketWorker);
  });

  it('should throw on error', () => {
    const getError = flow(
      find(arg0Eq('error')),
      getArg1
    );

    const err = new Error('boom!');

    expect(getError(worker.addEventListener.calls.all()).bind(null, err))
      .toThrow(err);
  });

  describe('message handling', () => {
    var handler;

    beforeEach(() => {
      const getMessage = flow(
        find(arg0Eq('message')),
        getArg1
      );

      handler = getMessage(worker.addEventListener.calls.all());
    });

    describe('reconnecting', () => {
      var ev;

      beforeEach(() => {
        ev = {
          data: { type: 'reconnecting' }
        };

        handler(ev);
      });

      it('should emit open on disconnectListener', () => {
        expect(disconnectListener.emit)
          .toHaveBeenCalledOnceWith('open');
      });
    });

    describe('reconnect', () => {
      var ev;

      beforeEach(() => {
        ev = {
          data: { type: 'reconnecting' }
        };

        handler(ev);

        ev.data.type = 'reconnect';
        handler(ev);
      });

      it('should emit close on disconnectListener', () => {
        expect(disconnectListener.emit)
          .toHaveBeenCalledOnceWith('close');
      });
    });
  });
});
