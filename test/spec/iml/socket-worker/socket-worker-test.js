describe('socket worker', function () {
  'use strict';

  var worker, getWebWorker, disconnectModal, $timeout, STATIC_URL;

  beforeEach(module('socket-worker', function ($provide) {
    disconnectModal = jasmine.createSpy('disconnectModal').andReturn({
      close: jasmine.createSpy('close')
    });
    $provide.value('disconnectModal', disconnectModal);

    $timeout = jasmine.createSpy('$timeout')
      .andCallFake(fp.identity);

    worker = {
      addEventListener: jasmine.createSpy('addEventListener')
    };

    STATIC_URL = '/static/chroma_ui/';

    getWebWorker = jasmine.createSpy('getWebWorker').andReturn(worker);
    $provide.value('getWebWorker', getWebWorker);
    $provide.value('STATIC_URL', STATIC_URL);
    $provide.value('$timeout', $timeout);
  }));

  var socketWorker;

  beforeEach(inject(function (_socketWorker_) {
    socketWorker = _socketWorker_;
  }));

  it('should create a worker with a remote script', function () {
    expect(getWebWorker).toHaveBeenCalledOnceWith(STATIC_URL + 'bundle.js');
  });

  it('should register a message handler', function () {
    expect(worker.addEventListener).toHaveBeenCalledOnceWith('message', jasmine.any(Function));
  });

  it('should register an error handler', function () {
    expect(worker.addEventListener).toHaveBeenCalledOnceWith('error', jasmine.any(Function));
  });

  it('should return the worker', function () {
    expect(worker).toBe(socketWorker);
  });

  it('should throw on error', function () {
    var handler = worker.addEventListener.mostRecentCallThat(function (call) {
      return call.args[0] === 'error';
    }).args[1];

    var err = new Error('boom!');

    expect(handler.bind(null, err)).toThrow(err);
  });

  describe('message handling', function () {
    var handler;

    beforeEach(function () {
      handler = worker.addEventListener.mostRecentCallThat(function (call) {
        return call.args[0] === 'message';
      }).args[1];
    });

    describe('reconnecting', function () {
      var ev;

      beforeEach(function () {
        ev = {
          data: { type: 'reconnecting' }
        };

        handler(ev);
      });

      it('should start the disconnectModal', function () {
        expect(disconnectModal).toHaveBeenCalledOnce();
      });

      it('should not restart the disconnectModal when it\'s already open', function () {
        handler(ev);

        expect(disconnectModal).toHaveBeenCalledOnce();
      });
    });

    describe('reconnect', function () {
      var ev;

      beforeEach(function () {
        ev = {
          data: { type: 'reconnecting' }
        };

        handler(ev);

        ev.data.type = 'reconnect';
        handler(ev);
      });

      it('should close the modal', function () {
        expect(disconnectModal.plan().close).toHaveBeenCalledOnce();
      });

      it('should not close the modal when it\'s already closed', function () {
        handler(ev);

        expect(disconnectModal.plan().close).toHaveBeenCalledOnce();
      });
    });
  });
});
