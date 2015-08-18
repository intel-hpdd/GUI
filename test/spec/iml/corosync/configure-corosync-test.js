describe('configure corosync', function () {
  'use strict';

  beforeEach(module('corosyncModule', 'highland'));

  describe('controller', function () {
    var $scope, $exceptionHandler, localApply, s,
      socketStream, socketResponse, waitForCommandCompletion, bigDiffer;

    beforeEach(inject(function ($controller, $rootScope, addProperty) {
      $scope = $rootScope.$new();

      s = highland();
      spyOn(s, 'destroy');
      $scope.stream = s.through(addProperty);
      $scope.alertStream = highland();
      spyOn($scope.alertStream, 'destroy');
      $scope.jobStream = highland();
      spyOn($scope.jobStream, 'destroy');

      $exceptionHandler = jasmine.createSpy('$exceptionHandler');

      localApply = jasmine.createSpy('localApply');

      socketResponse = highland();
      socketStream = jasmine.createSpy('socketStream')
        .andReturn(socketResponse.through(addProperty));

      waitForCommandCompletion = jasmine.createSpy('waitForCommandCompletion')
        .andCallFake(function (bool, x) {
          return [x];
        });

      bigDiffer = {
        mergeObj: jasmine.createSpy('mergeObj'),
        diffObj3: jasmine.createSpy('diffObj3'),
        getDiffMessage: jasmine.createSpy('getDiffMessage')
      };

      $controller('ConfigureCorosyncController', {
        $scope: $scope,
        $exceptionHandler: $exceptionHandler,
        localApply: localApply,
        socketStream: socketStream,
        waitForCommandCompletion: fp.curry(2, waitForCommandCompletion),
        bigDiffer: {
          mergeObj: fp.curry(3, bigDiffer.mergeObj),
          diffObj3: fp.curry(4, bigDiffer.diffObj3),
          getDiffMessage: fp.curry(2, bigDiffer.getDiffMessage)
        }
      });
    }));

    describe('on destroy', function () {
      beforeEach(function () {
        $scope.$destroy();
      });

      it('should destroy the stream', function () {
        expect(s.destroy).toHaveBeenCalledOnce();
      });

      it('should destroy the alert stream', function () {
        expect($scope.alertStream.destroy).toHaveBeenCalledOnce();
      });

      it('should destroy the job stream', function () {
        expect($scope.jobStream.destroy).toHaveBeenCalledOnce();
      });
    });

    it('should setup scope as expected', function () {
      expect($scope.corosync).toEqual({
        alertStream: jasmine.any(Object),
        jobStream: jasmine.any(Object),
        stream: jasmine.any(Object),
        reset: jasmine.any(Function),
        diff: jasmine.any(Function),
        setEditable: jasmine.any(Function),
        save: jasmine.any(Function)
      });
    });

    describe('diff and merge', function () {
      beforeEach(function () {
        $scope.corosync.stream
          .stopOnError(fp.noop)
          .each(fp.noop);

        bigDiffer.mergeObj.andCallFake(function (prop, local, remote) {
          return remote;
        });

        s.write({
          fooBar: 5000
        });
      });


      describe('reset', function () {
        beforeEach(function () {
          $scope.corosync.reset();
        });

        it('should reset config', function () {
          expect($scope.corosync.config).toEqual({
            fooBar: 5000
          });
        });

        it('should reset initial', function () {
          bigDiffer.diffObj3.andReturn({});

          s.write({
            fooBar: 6000
          });

          $scope.corosync.reset();

          $scope.corosync.diff({});

          expect(bigDiffer.diffObj3).toHaveBeenCalledOnceWith(
            {
              mcastPort: jasmine.any(Function)
            },
            {
              fooBar: 6000
            },
            {},
            {
              fooBar: 6000
            }
          );
        });
      });

      describe('diff', function () {
        it('should return the diff', function () {
          bigDiffer.diffObj3.andReturn({
            mcastPort: {
              type: 'local'
            }
          });

          expect($scope.corosync.diff({})).toEqual({
            type: 'local'
          });
        });
      });
    });

    it('should have a way to set editable state', function () {
      $scope.corosync.setEditable(true);

      expect($scope.corosync.editable).toBe(true);
    });

    describe('save', function () {
      beforeEach(function () {
        $scope.corosync.config = {
          id: '1'
        };

        $scope.corosync.save();
      });

      it('should set saving to true', function () {
        expect($scope.corosync.saving).toBe(true);
      });

      it('should set editable to false', function () {
        expect($scope.corosync.editable).toBe(false);
      });

      it('should put to /corosync_configuration', function () {
        expect(socketStream).toHaveBeenCalledOnceWith('/corosync_configuration/1', {
          method: 'put',
          json: {
            id: '1'
          }
        }, true);
      });

      it('should wait for command completion', function () {
        socketResponse.write({});

        expect(waitForCommandCompletion).toHaveBeenCalledOnceWith(true, {});
      });

      it('should stop on an error', function () {
        socketResponse.write({
          __HighlandStreamError__: true,
          error: new Error('boom!')
        });

        expect($exceptionHandler).toHaveBeenCalledOnceWith(new Error('boom!'));
      });

      it('should set saving to false', function () {
        socketResponse.write({});

        expect($scope.corosync.saving).toBe(false);
      });

      it('should call localApply', function () {
        socketResponse.write({});

        expect(localApply).toHaveBeenCalledOnceWith($scope);
      });
    });

    describe('configure corosync stream', function () {
      beforeEach(function () {
        $scope.corosync.stream
          .stopOnError(fp.noop)
          .each(fp.noop);

        bigDiffer.mergeObj.andCallFake(function (prop, local, remote) {
          return remote;
        });

        $scope.corosync.config = {
          foo: 'baz'
        };
      });

      it('should stop on error', function () {
        s.write({
          __HighlandStreamError__: true,
          error: new Error('boom!')
        });

        expect($exceptionHandler).toHaveBeenCalledOnceWith(new Error('boom!'));
      });

      it('should merge a config with a value', function () {
        s.write({
          foo: 'bar'
        });

        expect(bigDiffer.mergeObj).toHaveBeenCalledOnceWith(
          {
            mcastPort: jasmine.any(Function)
          },
          {
            foo: 'baz'
          },
          {
            foo: 'bar'
          }
        );
      });

      it('should set the merged value to the scope', function () {
        s.write({
          foo: 'bar'
        });

        expect($scope.corosync.config).toEqual({
          foo: 'bar'
        });
      });

      it('should call local apply', function () {
        s.write({});

        expect(localApply).toHaveBeenCalledOnceWith($scope, {});
      });
    });
  });
});
