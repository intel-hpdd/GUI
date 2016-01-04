import angular from 'angular';
const {module, inject} = angular.mock;

import {find, eqFn, flow, pathLens, identity} from 'intel-fp/fp';

describe('socket worker', () => {
  var worker, getWebWorker, arg0Eq, getArg1,
    disconnectModal, $timeout, STATIC_URL,
    disconnectModalInstance;

  beforeEach(module('socket-worker', ($provide) => {
    arg0Eq = eqFn(identity, pathLens(['args', '0']));
    getArg1 = pathLens(['args', '1']);

    disconnectModalInstance = {
      close: jasmine.createSpy('close')
    };
    disconnectModal = jasmine.createSpy('disconnectModal')
      .and.returnValue(disconnectModalInstance);
    $provide.value('disconnectModal', disconnectModal);

    $timeout = jasmine.createSpy('$timeout')
      .and.callFake((fn, delay, invokeApply, pass) => {
        return fn(pass);
      });

    worker = {
      addEventListener: jasmine.createSpy('addEventListener')
    };

    STATIC_URL = '/static/chroma_ui/';

    getWebWorker = jasmine.createSpy('getWebWorker').and.returnValue(worker);
    $provide.value('getWebWorker', getWebWorker);
    $provide.value('STATIC_URL', STATIC_URL);
    $provide.value('$timeout', $timeout);
  }));

  var socketWorker;

  beforeEach(inject((_socketWorker_) => {
    socketWorker = _socketWorker_;
  }));

  it('should create a worker with a remote script', () => {
    expect(getWebWorker).toHaveBeenCalledOnceWith(STATIC_URL + 'bundle.js');
  });

  it('should register a message handler', () => {
    expect(worker.addEventListener).toHaveBeenCalledOnceWith('message', jasmine.any(Function));
  });

  it('should register an error handler', () => {
    expect(worker.addEventListener).toHaveBeenCalledOnceWith('error', jasmine.any(Function));
  });

  it('should return the worker', () => {
    expect(worker).toBe(socketWorker);
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

      it('should start the disconnectModal', () => {
        expect(disconnectModal).toHaveBeenCalledOnce();
      });

      it('should not restart the disconnectModal when it\'s already open', () => {
        handler(ev);

        expect(disconnectModal).toHaveBeenCalledOnce();
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

      it('should close the modal', () => {
        expect(disconnectModalInstance.close).toHaveBeenCalledOnce();
      });

      it('should not close the modal when it\'s already closed', () => {
        handler(ev);

        expect(disconnectModalInstance.close).toHaveBeenCalledOnce();
      });
    });
  });
});
