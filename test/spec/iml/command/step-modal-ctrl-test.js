import highland from 'highland';
import commandModule from '../../../../source/iml/command/command-module';

import { mock, resetAll } from '../../../system-mock.js';

describe('step modal', () => {
  beforeEach(module(commandModule));

  describe('step modal controller', () => {
    let $scope, stepModal, stepsStream, jobStream;

    beforeEach(
      inject(($rootScope, $controller) => {
        spyOn($rootScope, '$on').and.callThrough();

        jobStream = highland();
        spyOn(jobStream, 'destroy').and.callThrough();
        stepsStream = highland();
        spyOn(stepsStream, 'destroy').and.callThrough();

        $scope = $rootScope.$new();

        stepModal = $controller('StepModalCtrl', {
          $scope: $scope,
          stepsStream: stepsStream,
          jobStream: jobStream
        });
      })
    );

    it('should have a getDescription method', () => {
      expect(stepModal.getDescription).toEqual(expect.any(Function));
    });

    it('should return class_name if description starts with it', () => {
      const step = {
        class_name: 'foo',
        description: 'foo bar'
      };

      expect(stepModal.getDescription(step)).toEqual('foo');
    });

    it('should return description if it does not start with class_name', () => {
      const step = {
        class_name: 'baz',
        description: 'foo bar'
      };

      expect(stepModal.getDescription(step)).toEqual('foo bar');
    });

    it('should listen for destroy', () => {
      expect($scope.$on).toHaveBeenCalledTwiceWith(
        '$destroy',
        expect.any(Function)
      );
    });

    describe('destroy', () => {
      beforeEach(() => {
        $scope.$destroy();
      });

      it('should destroy the job stream', () => {
        expect(jobStream.destroy).toHaveBeenCalled();
      });

      it('should destroy the steps stream', () => {
        expect(stepsStream.destroy).toHaveBeenCalled();
      });
    });

    it('should have a list of steps', () => {
      expect(stepModal.steps).toEqual([]);
    });

    it('should open the first accordion', () => {
      expect(stepModal.accordion0).toBe(true);
    });

    const states = {
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

    Object.keys(states).forEach(state => {
      it(`should return the adjective ${state} for the given job`, () => {
        const result = stepModal.getJobAdjective(states[state]);

        expect(result).toEqual(state);
      });
    });

    it('should set job data', () => {
      jobStream.write({ foo: 'bar' });

      expect(stepModal.job).toEqual({ foo: 'bar' });
    });

    it('should set step data', () => {
      stepsStream.write({ foo: 'bar' });

      expect(stepModal.steps).toEqual({ foo: 'bar' });
    });
  });

  describe('open step modal', () => {
    let $uibModal, socketStream, stream, job;

    beforeEachAsync(async function() {
      socketStream = jasmine.createSpy('socketStream').and.callFake(() => {
        return (stream = highland());
      });

      const mod = await mock('source/iml/command/step-modal-ctrl.js', {
        'source/iml/socket/socket-stream.js': {
          default: socketStream
        }
      });

      $uibModal = {
        open: jasmine.createSpy('open')
      };

      const openStepModal = mod.openStepModalFactory($uibModal);

      job = {
        id: '1',
        steps: ['/api/step/1/', '/api/step/2/']
      };

      openStepModal(job);
    });

    afterEach(resetAll);

    it('should open the modal with the expected object', () => {
      expect($uibModal.open).toHaveBeenCalledOnceWith({
        template: 'stepModalTemplate',
        controller: 'StepModalCtrl',
        controllerAs: 'stepModal',
        windowClass: 'step-modal',
        backdrop: 'static',
        resolve: {
          jobStream: expect.any(Function),
          stepsStream: expect.any(Function)
        }
      });
    });

    describe('get jobs and steps', () => {
      let jobStream, stepsStream;

      beforeEach(() => {
        const resolves = $uibModal.open.calls.mostRecent().args[0].resolve;

        jobStream = resolves.jobStream();
        stepsStream = resolves.stepsStream();
      });

      it('should get the job', () => {
        expect(socketStream).toHaveBeenCalledOnceWith('/job/1');
      });

      it('should set last data', () => {
        stepsStream.resume();

        jobStream.each(x => {
          expect(x).toEqual(job);
        });
      });

      it('should get the steps', () => {
        jobStream.resume();
        stepsStream.resume();

        expect(socketStream).toHaveBeenCalledOnceWith(
          '/step',
          {
            qs: {
              id__in: ['1', '2'],
              limit: 0
            }
          },
          true
        );
      });

      it('should return steps', () => {
        jobStream.resume();

        stepsStream.each(x => {
          expect(x).toEqual([{ id: 1, name: 'step' }]);
        });

        stream.write({
          objects: [{ id: 1, name: 'step' }]
        });
      });
    });
  });
});
