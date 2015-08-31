describe('step modal', function () {
  'use strict';

  beforeEach(module('command'));

  describe('step modal controller', function () {
    var $scope, stepModal, stepsStream, jobStream;

    beforeEach(inject(function ($rootScope, $controller) {
      spyOn($rootScope, '$on').andCallThrough();

      jobStream = highland();
      spyOn(jobStream, 'destroy').andCallThrough();
      stepsStream = highland();
      spyOn(stepsStream, 'destroy').andCallThrough();

      $scope = $rootScope.$new();

      stepModal = $controller('StepModalCtrl', {
        $scope: $scope,
        stepsStream: stepsStream,
        jobStream: jobStream
      });
    }));

    it('should have a getDescription method', function () {
      expect(stepModal.getDescription).toEqual(jasmine.any(Function));
    });

    it('should return class_name if description starts with it', function () {
      var step = {
        class_name: 'foo',
        description: 'foo bar'
      };

      expect(stepModal.getDescription(step)).toEqual('foo');
    });

    it('should return description if it does not start with class_name', function () {
      var step = {
        class_name: 'baz',
        description: 'foo bar'
      };

      expect(stepModal.getDescription(step)).toEqual('foo bar');
    });

    it('should listen for destroy', function () {
      expect($scope.$on).toHaveBeenCalledTwiceWith('$destroy', jasmine.any(Function));
    });

    describe('destroy', function () {
      beforeEach(function () {
        $scope.$destroy();
      });

      it('should destroy the job stream', function () {
        expect(jobStream.destroy).toHaveBeenCalledOnce();
      });

      it('should destroy the steps stream', function () {
        expect(stepsStream.destroy).toHaveBeenCalledOnce();
      });
    });

    it('should have a list of steps', function () {
      expect(stepModal.steps).toEqual([]);
    });

    it('should open the first accordion', function () {
      expect(stepModal.accordion0).toBe(true);
    });

    var states = {
      'waiting to run': {
        state: 'pending'
      },
      running: {
        state: 'tasked'
      },
      cancelled: {
        cancelled: true,
        state: 'complete'
      },
      failed: {
        errored: true,
        state: 'complete'
      },
      succeeded: {
        state: 'complete'
      }
    };

    Object.keys(states).forEach(function assertState (state) {
      it('should return the adjective ' + state + ' for the given job', function () {
        var result = stepModal.getJobAdjective(states[state]);

        expect(result).toEqual(state);
      });
    });

    it('should set job data', function () {
      jobStream.write({foo: 'bar'});

      expect(stepModal.job).toEqual({foo: 'bar'});
    });

    it('should set step data', function () {
      stepsStream.write({foo: 'bar'});

      expect(stepModal.steps).toEqual({foo: 'bar'});
    });
  });

  describe('open step modal', function () {
    var $modal, socketStream, stream;

    beforeEach(module(function ($provide) {
      socketStream = jasmine.createSpy('socketStream').andCallFake(function () {
        return (stream = highland());
      });
      $provide.value('socketStream', socketStream);

      $modal = {
        open: jasmine.createSpy('open')
      };

      $provide.value('$modal', $modal);
    }));

    var openStepModal, job;

    beforeEach(inject(function (_openStepModal_) {
      openStepModal = _openStepModal_;

      job = {
        id: '1',
        steps: [
          '/api/step/1/',
          '/api/step/2/'
        ]
      };

      openStepModal(job);
    }));

    it('should open the modal with the expected object', function () {
      expect($modal.open).toHaveBeenCalledOnceWith({
        templateUrl: 'iml/command/assets/html/step-modal.html',
        controller: 'StepModalCtrl',
        controllerAs: 'stepModal',
        windowClass: 'step-modal',
        backdrop: 'static',
        resolve: {
          jobStream: jasmine.any(Function),
          stepsStream: jasmine.any(Function)
        }
      });
    });

    describe('get jobs and steps', function () {
      var jobStream, stepsStream;

      beforeEach(function () {
        var resolves = $modal.open.mostRecentCall.args[0].resolve;

        jobStream = resolves.jobStream();
        stepsStream = resolves.stepsStream();
      });

      it('should get the job', function () {
        expect(socketStream).toHaveBeenCalledOnceWith('/job/1');
      });

      it('should set last data', function () {
        stepsStream.resume();

        jobStream.each(function (x) {
          expect(x).toEqual(job);
        });
      });

      it('should get the steps', function () {
        jobStream.resume();
        stepsStream.resume();

        expect(socketStream).toHaveBeenCalledOnceWith('/step', {
          qs: {
            id__in: ['1', '2'],
            limit: 0
          }
        }, true);
      });

      it('should return steps', function () {
        jobStream.resume();

        stepsStream.each(function (x) {
          expect(x).toEqual([{ id: 1, name: 'step' }]);
        });

        stream.write({
          objects: [
            { id: 1, name: 'step' }
          ]
        });
      });
    });
  });
});
