import angular from 'angular';
const {module, inject} = angular.mock;

import {tail} from 'intel-fp/fp';

describe('Add copytool modal', () => {
  beforeEach(module('hsm'));

  describe('add copytool modal controller', () => {
    var $scope, addCopytoolModalCtrl,
      $uibModalInstance, socketStream, workerStream, fsStream;

    beforeEach(inject(($controller, $rootScope) => {
      $scope = $rootScope.$new();

      $uibModalInstance = {
        close: jasmine.createSpy('close')
      };

      socketStream = jasmine.createSpy('socketStream')
        .andReturn(highland());

      workerStream = highland();

      fsStream = highland();

      addCopytoolModalCtrl = $controller('AddCopytoolModalCtrl', {
        $scope,
        $uibModalInstance,
        λ: highland,
        socketStream,
        workerStream,
        fsStream
      });
    }));

    it('should expose the expected interface', () => {
      expect(addCopytoolModalCtrl).toEqual({
        inProgress: false,
        filesystems: [],
        workers: [],
        copytool: {},
        onSubmit: jasmine.any(Function)
      });
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

        socketStream.plan().write(null);
        socketStream.plan().end();
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
    var $uibModal;

    beforeEach(module(($provide) => {
      $uibModal = {
        open: jasmine.createSpy('open')
          .andReturn({
            result: jasmine.createSpy('result')
          })
      };

      $provide.value('$uibModal', $uibModal);
    }));

    var result;

    beforeEach(inject((openAddCopytoolModal) => {
      result = openAddCopytoolModal();
    }));

    it('should return the result', () => {
      expect(result).toEqual($uibModal.open.plan().result);
    });

    it('should have the expected open config', () => {
      expect($uibModal.open).toHaveBeenCalledOnceWith({
        templateUrl: 'iml/hsm/assets/html/add-copytool-modal.html',
        controller: 'AddCopytoolModalCtrl as addCopytool',
        backdrop: 'static',
        windowClass: 'add-copytool-modal',
        resolve: {
          fsStream: jasmine.any(Array),
          workerStream: jasmine.any(Array)
        }
      });
    });

    describe('resolving deps', () => {
      var resolveStream, socketStream, getResolve;

      beforeEach(() => {
        socketStream = jasmine.createSpy('socketStream').andReturn({});

        resolveStream = jasmine.createSpy('resolveStream').andReturn({});

        getResolve = (name) => tail($uibModal.open.mostRecentCall.args[0].resolve[name]);
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
          expect(resolveStream).toHaveBeenCalledOnceWith(socketStream.plan());
        });

        it('should return resolving the stream', () => {
          expect(result).toBe(resolveStream.plan());
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
          expect(resolveStream).toHaveBeenCalledOnceWith(socketStream.plan());
        });

        it('should return resolving the stream', () => {
          expect(result).toBe(resolveStream.plan());
        });
      });
    });
  });
});
