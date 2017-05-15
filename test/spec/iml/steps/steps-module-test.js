import stepsModule from '../../../../source/iml/steps/steps-module';
import angular from '../../../angular-mock-setup.js';

describe('Steps module', () => {
  beforeEach(angular.mock.module(stepsModule));

  beforeEach(
    angular.mock.module($provide => {
      $provide.value('foo', 'bar');
    })
  );

  let $rootScope, $scope, $q, $compile, stepsManager;

  beforeEach(
    inject((_$rootScope_, _$compile_, _$q_, _stepsManager_) => {
      $rootScope = _$rootScope_;
      $compile = _$compile_;
      $q = _$q_;
      $scope = $rootScope.$new();
      stepsManager = _stepsManager_;
    })
  );

  describe('step container', () => {
    let template, node;

    beforeEach(() => {
      template = '<step-container manager="manager"></step-container>';

      $scope.manager = stepsManager();

      $scope.manager.addStep('step', {
        template: '<div>{{foo}}</div>',
        controller: function controller($scope) {
          'ngInject';
          $scope.foo = 'bar';
        },
        transition: function transition() {}
      });
    });

    describe('directive when all promises are resolved', () => {
      beforeEach(() => {
        node = $compile(template)($scope);

        $scope.$digest();
      });

      it('should start empty', () => {
        expect(node.html()).toEqual('');
      });

      it('should populate with the step on start.', () => {
        $scope.manager.start('step');

        $scope.$digest();

        expect(node.html()).toEqual(
          '<div class="ng-binding ng-scope">bar</div>'
        );
      });
    });

    describe('directive before all promises have resolved', () => {
      beforeEach(() => {
        $scope.manager.addWaitingStep({
          template: '<div>waiting</div>',
          controller: function controller($scope) {
            'ngInject';
            $scope.foo = 'bar';
          },
          transition: function transition() {}
        });

        node = $compile(template)($scope);
      });

      it('should load the waiting template', () => {
        const deferred = $q.defer();
        const resolves = {
          resolve1: deferred.promise
        };

        $scope.manager.start('step', resolves);

        $scope.$digest();

        expect(node.html()).toEqual('<div class="ng-scope">waiting</div>');
      });
    });
  });

  describe('steps manager', () => {
    let stepsManagerInstance, waitingStep;

    beforeEach(() => {
      stepsManagerInstance = stepsManager();
      waitingStep = {
        template: 'untilLoadedTemplate'
      };
    });

    it('should return the expected interface', () => {
      expect(stepsManagerInstance).toEqual({
        addWaitingStep: jasmine.any(Function),
        addStep: jasmine.any(Function),
        start: jasmine.any(Function),
        onEnter: jasmine.any(Function),
        end: jasmine.any(Function),
        transition: jasmine.any(Function),
        registerChangeListener: jasmine.any(Function),
        destroy: jasmine.any(Function),
        result: {
          end: jasmine.any(Object)
        }
      });
    });

    describe('calling addWaitingStep multiple times', () => {
      let error;
      beforeEach(() => {
        try {
          stepsManagerInstance
            .addWaitingStep(waitingStep)
            .addWaitingStep(waitingStep);
        } catch (e) {
          error = e;
        }
      });

      it('should throw an error when addWaitingStep is called twice', () => {
        expect(error.message).toEqual(
          'Cannot assign the waiting step as it is already defined.'
        );
      });
    });

    describe('interacting', () => {
      let listener, step1, step2;

      beforeEach(() => {
        listener = jasmine.createSpy('listener');

        step1 = {
          templateUrl: 'assets/html/step1',
          controller: 'Step1Ctrl',
          transition: function transition(steps) {
            return steps.step2;
          }
        };

        step2 = {
          templateUrl: 'assets/html/step2',
          controller: 'Step2Ctrl',
          transition: function transition(steps) {
            return steps.step1;
          }
        };

        stepsManagerInstance
          .addWaitingStep(waitingStep)
          .addStep('step1', step1)
          .addStep('step2', step2)
          .registerChangeListener(listener)
          .start('step1');
      });

      it('should start on step1', () => {
        expect(listener).toHaveBeenCalledOnceWith(
          step1,
          undefined,
          waitingStep
        );
      });

      it('should transition to step2', () => {
        stepsManagerInstance.transition();

        $rootScope.$digest();

        expect(listener).toHaveBeenCalledOnceWith(step2, undefined);
      });

      it('should transition back to step1', () => {
        stepsManagerInstance.transition();

        $rootScope.$digest();

        stepsManagerInstance.transition();

        $rootScope.$digest();

        expect(listener).toHaveBeenCalledOnceWith(
          step1,
          undefined,
          waitingStep
        );
        expect(listener).toHaveBeenCalledOnceWith(step1, undefined);
      });

      it('should destroy a listener', () => {
        stepsManagerInstance.destroy();

        stepsManagerInstance.transition();

        $rootScope.$digest();

        expect(listener).not.toHaveBeenCalledOnceWith(
          step2,
          undefined,
          waitingStep
        );
      });
    });
  });
});
