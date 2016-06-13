import highland from 'highland';
import {AddCopytoolModalCtrl} from '../../../../source/iml/hsm/add-copytool-modal';
import hsmModule from '../../../../source/iml/hsm/hsm-module';

describe('Add copytool modal', () => {
  beforeEach(module(hsmModule));

  describe('add copytool modal controller', () => {
    var $scope, addCopytoolModalCtrl, s,
      $uibModalInstance, socketStream, workerStream, fsStream;

    beforeEach(inject(($controller, $rootScope) => {
      $scope = $rootScope.$new();

      $uibModalInstance = {
        close: jasmine.createSpy('close')
      };

      s = highland();

      socketStream = jasmine.createSpy('socketStream')
        .and.returnValue(s);

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
    var $uibModal, openResult;

    beforeEach(module(($provide) => {

      openResult = {
        result: jasmine.createSpy('result')
      };
      $uibModal = {
        open: jasmine.createSpy('open')
          .and.returnValue(openResult)
      };

      $provide.value('$uibModal', $uibModal);
    }));

    var result;

    beforeEach(inject((openAddCopytoolModal) => {
      result = openAddCopytoolModal();
    }));

    it('should return the result', () => {
      expect(result).toEqual(openResult.result);
    });

    it('should have the expected open config', () => {
      expect($uibModal.open).toHaveBeenCalledOnceWith({
        templateUrl: '/static/chroma_ui/source/iml/hsm/assets/html/add-copytool-modal.js',
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
      var resolveStream, socketStream, getResolve, s, rs;

      beforeEach(() => {
        s = {};
        socketStream = jasmine.createSpy('socketStream').and.returnValue(s);

        rs = {};
        resolveStream = jasmine.createSpy('resolveStream').and.returnValue(rs);

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
