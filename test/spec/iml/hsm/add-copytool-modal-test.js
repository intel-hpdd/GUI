import highland from 'highland';
import hsmModule from '../../../../source/iml/hsm/hsm-module';

import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('Add copytool modal', () => {
  var $scope, addCopytoolModalCtrl, s, AddCopytoolModalCtrl, mod,
    $uibModalInstance, socketStream, workerStream, fsStream, resolveStream;

  beforeEachAsync(async function () {
    socketStream = jasmine.createSpy('socketStream');
    resolveStream = jasmine.createSpy('resolveStream');

    mod = await mock('source/iml/hsm/add-copytool-modal.js', {
      'source/iml/hsm/assets/html/add-copytool-modal.html!text': {
        default: 'addCopytoolModalTemplate'
      },
      'source/iml/promise-transforms.js': { resolveStream },
      'source/iml/socket/socket-stream.js': { default: socketStream }
    });

    AddCopytoolModalCtrl = mod.AddCopytoolModalCtrl;
  });

  afterEach(resetAll);

  beforeEach(module(hsmModule));

  describe('add copytool modal controller', () => {
    beforeEach(inject(($controller, $rootScope) => {
      $scope = $rootScope.$new();

      $uibModalInstance = {
        close: jasmine.createSpy('close')
      };

      s = highland();
      socketStream
        .and.returnValue(s);

      workerStream = highland();

      fsStream = highland();

      addCopytoolModalCtrl = $controller(AddCopytoolModalCtrl, {
        $scope,
        $uibModalInstance,
        workerStream,
        fsStream
      });
    }));

    it('should expose the expected interface', () => {
      const scope = window.extendWithConstructor(AddCopytoolModalCtrl, {
        inProgress: false,
        filesystems: [],
        workers: [],
        copytool: {},
        onSubmit: jasmine.any(Function)
      });

      expect(addCopytoolModalCtrl).toEqual(scope);
    });

    it('should set fs on the controller', () => {
      fsStream.write({
        objects: [
          { foo: 'bar' }
        ]
      });

      expect(addCopytoolModalCtrl.filesystems).toEqual([{ foo: 'bar' }]);
    });

    it('should set workers on the controller', () => {
      workerStream.write({
        objects: [
          { bar: 'baz' }
        ]
      });

      expect(addCopytoolModalCtrl.workers).toEqual([{ bar: 'baz' }]);
    });

    describe('submit copytool', () => {
      var copytool;

      beforeEach(() => {
        copytool = {};

        addCopytoolModalCtrl.onSubmit(copytool);

        s.write(null);
        s.end();
      });

      it('should create a new copytool', () => {
        expect(socketStream).toHaveBeenCalledOnceWith('/copytool', {
          method: 'post',
          json: copytool
        }, true);
      });

      it('should close the modal', () => {
        expect($uibModalInstance.close).toHaveBeenCalledOnce();
      });
    });
  });

  describe('open', () => {
    var $uibModal, openResult, result;

    beforeEach(() => {

      openResult = {
        result: jasmine.createSpy('result')
      };
      $uibModal = {
        open: jasmine.createSpy('open')
          .and.returnValue(openResult)
      };

      result = mod.openAddCopytoolModalFactory($uibModal)();
    });

    it('should return the result', () => {
      expect(result).toEqual(openResult.result);
    });

    it('should have the expected open config', () => {
      expect($uibModal.open).toHaveBeenCalledOnceWith({
        template: 'addCopytoolModalTemplate',
        controller: 'AddCopytoolModalCtrl as addCopytool',
        backdrop: 'static',
        windowClass: 'add-copytool-modal',
        resolve: {
          fsStream: jasmine.any(Function),
          workerStream: jasmine.any(Function)
        }
      });
    });

    describe('resolving deps', () => {
      var getResolve, s, rs;

      beforeEach(() => {
        s = {};
        socketStream
          .and.returnValue(s);

        rs = {};
        resolveStream
          .and.returnValue(rs);

        getResolve = (name) => $uibModal.open.calls.mostRecent().args[0].resolve[name];
      });

      describe('fs stream', () => {
        var result;

        beforeEach(() => {
          result = getResolve('fsStream')(resolveStream, socketStream);
        });

        it('should create a new fs stream', () => {
          expect(socketStream).toHaveBeenCalledOnceWith('/filesystem', {
            jsonMask: 'objects(resource_uri,label)'
          });
        });

        it('should resolve the stream', () => {
          expect(resolveStream).toHaveBeenCalledOnceWith(s);
        });

        it('should return resolving the stream', () => {
          expect(result).toBe(rs);
        });
      });

      describe('worker stream', () => {
        var result;

        beforeEach(() => {
          result = getResolve('workerStream')(resolveStream, socketStream);
        });

        it('should create a new worker stream', () => {
          expect(socketStream).toHaveBeenCalledOnceWith('/host', {
            qs: { worker: true },
            jsonMask: 'objects(resource_uri,label)'
          });
        });

        it('should resolve the stream', () => {
          expect(resolveStream).toHaveBeenCalledOnceWith(s);
        });

        it('should return resolving the stream', () => {
          expect(result).toBe(rs);
        });
      });
    });
  });
});
