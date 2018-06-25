import highland from 'highland';
import angular from '../../../angular-mock-setup.js';

describe('step modal', () => {
  beforeEach(() => {});

  describe('step modal controller', () => {
    let $scope, stepModal, stepsStream, jobStream, mockSocketStream, mod, $uibModal, stream, job;

    beforeEach(
      angular.mock.inject($rootScope => {
        jest.spyOn($rootScope, '$on');

        jobStream = highland();
        jest.spyOn(jobStream, 'destroy');
        stepsStream = highland();
        jest.spyOn(stepsStream, 'destroy');

        $scope = $rootScope.$new();

        stepModal = {};
        mockSocketStream = jest.fn(() => {
          return (stream = highland());
        });

        jest.mock('../../../../source/iml/socket/socket-stream.js', () => mockSocketStream);

        mod = require('../../../../source/iml/command/step-modal-ctrl.js');

        mod.StepModalCtrl.bind(stepModal)($scope, stepsStream, jobStream);
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
      expect($scope.$on).toHaveBeenCalledTwiceWith('$destroy', expect.any(Function));
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

    describe('open step modal', () => {
      beforeEach(() => {
        $uibModal = {
          open: jest.fn()
        };

        const openStepModal = mod.openStepModalFactory($uibModal);

        job = {
          id: '1',
          steps: ['/api/step/1/', '/api/step/2/']
        };

        openStepModal(job);
      });

      it('should open the modal with the expected object', () => {
        expect($uibModal.open).toHaveBeenCalledOnceWith({
          template: `<div class="modal-header">
  <h3 class="modal-title">{{ ::stepModal.job.description }}</h3>
</div>
<div class="modal-body">
  <h4>Details:</h4>
  <table class="table">
    <tr>
      <td>Run At</td>
      <td>{{ ::stepModal.job.modified_at | date:'MMM dd yyyy HH:mm:ss' }}</td>
    </tr>
    <tr>
      <td>Status</td>
      <td><job-states job="stepModal.job"></job-states> {{ stepModal.getJobAdjective(stepModal.job) | capitalize }}</td>
    </tr>
  </table>
  <h4>Steps</h4>
  <div class="well" ng-if="stepModal.steps.length === 0">
    Loading Steps... <i class="fa fa-spinner fa-spin"></i>
  </div>
  <uib-accordion close-others="false" ng-if="stepModal.steps.length > 0">
    <uib-accordion-group is-open="stepModal['accordion' + $index]" ng-repeat="step in stepModal.steps track by step.id">
      <uib-accordion-heading>
        <i class="fa" ng-class="{'fa-chevron-down': stepModal['accordion' + $index], 'fa-chevron-right': !stepModal['accordion' + $index]}"></i>
        <i class="fa header-status" ng-class="{'fa-exclamation': step.state === 'failed', 'fa-check': step.state === 'success', 'fa-refresh fa-spin': step.state === 'incomplete'}"></i>
        <span>
          {{ ::step.step_index + 1  }}/{{ ::step.step_count }}  {{ ::stepModal.getDescription(step) }}
        </span>
      </uib-accordion-heading>
      <h4>Arguments</h4>
      <pre class="logs">{{ step.args|json }}</pre>
      <div ng-if="step.console">
        <h4>Logs</h4>
        <pre class="logs">{{ step.console }}</pre>
      </div>
      <div ng-if="step.backtrace">
        <h4>Backtrace</h4>
        <pre class="logs">{{ step.backtrace }}</pre>
      </div>
    </uib-accordion-group>
  </uib-accordion>
</div>
<div class="modal-footer">
  <button class="btn btn-danger" ng-click="$close('close')">Close <i class="fa fa-times-circle-o"></i></button>
</div>`,
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
          const resolves = $uibModal.open.mock.calls[0][0].resolve;

          jobStream = resolves.jobStream();
          stepsStream = resolves.stepsStream();
        });

        it('should get the job', () => {
          expect(mockSocketStream).toHaveBeenCalledOnceWith('/job/1');
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

          expect(mockSocketStream).toHaveBeenCalledWith(
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
});
