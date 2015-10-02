describe('Add copytool modal', function () {
  'use strict';

  var configs;

  beforeEach(module('hsm', function () {
    configs = angular.module('hsm')._configBlocks;
    angular.module('hsm')._configBlocks = [];
  }, 'hsm'));

  afterEach(function () {
    angular.module('hsm')._configBlocks = configs;
  });

  describe('add copytool modal controller', function () {
    var $scope, addCopytoolModalCtrl,
      $modalInstance, socketStream, workerStream, fsStream;

    beforeEach(inject(function ($controller, $rootScope) {
      $scope = $rootScope.$new();

      $modalInstance = {
        close: jasmine.createSpy('close')
      };

      socketStream = jasmine.createSpy('socketStream')
        .andReturn(highland());

      workerStream = highland();

      fsStream = highland();

      addCopytoolModalCtrl = $controller('AddCopytoolModalCtrl', {
        $scope: $scope,
        $modalInstance: $modalInstance,
        λ: highland,
        socketStream: socketStream,
        workerStream: workerStream,
        fsStream: fsStream
      });
    }));

    it('should expose the expected interface', function () {
      expect(addCopytoolModalCtrl).toEqual({
        inProgress: false,
        filesystems: [],
        workers: [],
        copytool: {},
        onSubmit: jasmine.any(Function)
      });
    });

    it('should set fs on the controller', function () {
      fsStream.write({
        objects: [
          { foo: 'bar' }
        ]
      });

      expect(addCopytoolModalCtrl.filesystems).toEqual([{ foo: 'bar' }]);
    });

    it('should set workers on the controller', function () {
      workerStream.write({
        objects: [
          { bar: 'baz' }
        ]
      });

      expect(addCopytoolModalCtrl.workers).toEqual([{ bar: 'baz' }]);
    });

    describe('submit copytool', function () {
      var copytool;

      beforeEach(function () {
        copytool = {};

        addCopytoolModalCtrl.onSubmit(copytool);

        socketStream.plan().write(null);
        socketStream.plan().end();
      });

      it('should create a new copytool', function () {
        expect(socketStream).toHaveBeenCalledOnceWith('/copytool', {
          method: 'post',
          json: copytool
        }, true);
      });

      it('should close the modal', function () {
        expect($modalInstance.close).toHaveBeenCalledOnce();
      });
    });
  });

  describe('open', function () {
    var $modal;

    beforeEach(module(function ($provide) {
      $modal = {
        open: jasmine.createSpy('open')
          .andReturn({
            result: jasmine.createSpy('result')
          })
      };

      $provide.value('$modal', $modal);
    }));

    var result;

    beforeEach(inject(function (openAddCopytoolModal) {
      result = openAddCopytoolModal();
    }));

    it('should return the result', function () {
      expect(result).toEqual($modal.open.plan().result);
    });

    it('should have the expected open config', function () {
      expect($modal.open).toHaveBeenCalledOnceWith({
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

    describe('resolving deps', function () {
      var resolveStream, socketStream, getResolve;

      beforeEach(function () {
        socketStream = jasmine.createSpy('socketStream').andReturn({});

        resolveStream = jasmine.createSpy('resolveStream').andReturn({});

        getResolve = function getResolve (name) {
          return fp.tail($modal.open.mostRecentCall.args[0].resolve[name]);
        };
      });

      describe('fs stream', function () {
        var result;

        beforeEach(function () {
          result = getResolve('fsStream')(resolveStream, socketStream);
        });

        it('should create a new fs stream', function () {
          expect(socketStream).toHaveBeenCalledOnceWith('/filesystem', {
            jsonMask: 'objects(resource_uri,label)'
          });
        });

        it('should resolve the stream', function () {
          expect(resolveStream).toHaveBeenCalledOnceWith(socketStream.plan());
        });

        it('should return resolving the stream', function () {
          expect(result).toBe(resolveStream.plan());
        });
      });

      describe('worker stream', function () {
        var result;

        beforeEach(function () {
          result = getResolve('workerStream')(resolveStream, socketStream);
        });

        it('should create a new worker stream', function () {
          expect(socketStream).toHaveBeenCalledOnceWith('/host', {
            qs: { worker: true },
            jsonMask: 'objects(resource_uri,label)'
          });
        });

        it('should resolve the stream', function () {
          expect(resolveStream).toHaveBeenCalledOnceWith(socketStream.plan());
        });

        it('should return resolving the stream', function () {
          expect(result).toBe(resolveStream.plan());
        });
      });
    });
  });
});
