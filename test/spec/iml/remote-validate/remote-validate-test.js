import angular from 'angular';

import { mock, resetAll } from '../../../system-mock.js';

describe('Remote validate directive', () => {
  let controller, formControllerSpy, $q, $scope, $element;

  function createComponent(name) {
    return jasmine.createSpyObj(name, ['$setValidity']);
  }

  let remoteValidateForm, remoteValidateComponent;

  beforeEachAsync(async function() {
    const mod = await mock('source/iml/remote-validate/remote-validate.js', {});

    ({
      remoteValidateForm,
      remoteValidateComponent
    } = mod);
  });

  afterEach(resetAll);

  beforeEach(
    module($compileProvider => {
      $compileProvider.directive(
        'remoteValidateForm',
        () => remoteValidateForm
      );
      $compileProvider.directive(
        'remoteValidateComponent',
        () => remoteValidateComponent
      );
    })
  );

  beforeEach(
    inject(($controller, $rootScope, _$q_) => {
      $q = _$q_;

      $scope = $rootScope.$new();

      $element = {
        controller: () => {
          formControllerSpy = createComponent('formController');
          return formControllerSpy;
        }
      };

      controller = $controller(remoteValidateForm.controller, {
        $scope,
        $element
      });
    })
  );

  describe('controller', () => {
    it('should register components', () => {
      const obj = {};
      controller.registerComponent('foo', obj);

      expect(controller.components.foo).toBe(obj);
    });

    it('should get components', () => {
      const obj = {};
      controller.registerComponent('foo', obj);

      expect(controller.getComponent('foo')).toBe(obj);
      expect(controller.getComponent('bar')).toBeUndefined();
    });

    it('should reset components validity', () => {
      $scope.serverValidationError = {
        foo: ['bar']
      };

      const obj = createComponent('obj');
      controller.registerComponent('foo', obj);

      controller.resetComponentsValidity();

      expect(formControllerSpy.$setValidity).toHaveBeenCalledWith(
        'server',
        true
      );

      expect(obj.$setValidity).toHaveBeenCalledWith('server', true);
      expect($scope.serverValidationError.foo).toBeUndefined();
    });

    it('should have the form registered as a component', () => {
      expect(controller.getComponent('__all__')).toBe(formControllerSpy);
    });
  });

  describe('linking function', () => {
    let deferred;

    beforeEach(() => {
      deferred = $q.defer();

      controller.registerComponent('foo', createComponent('foo'));
      controller.registerComponent('bar', createComponent('bar'));

      remoteValidateForm.link(
        $scope,
        $element,
        { validate: 'validate' },
        controller
      );
      $scope.$digest();

      $scope.validate = deferred.promise;
      $scope.$digest();
    });

    it('should mark components with validation errors', () => {
      expect(
        controller.getComponent('foo').$setValidity
      ).not.toHaveBeenCalled();
      expect(
        controller.getComponent('bar').$setValidity
      ).not.toHaveBeenCalled();

      deferred.reject({
        data: {
          foo: ['Required Field']
        }
      });

      $scope.$digest();

      expect(controller.getComponent('foo').$setValidity).toHaveBeenCalledWith(
        'server',
        false
      );
      expect($scope.serverValidationError.foo).toEqual(['Required Field']);

      expect(
        controller.getComponent('bar').$setValidity
      ).not.toHaveBeenCalledWith('server', false);
    });

    it('should reset validity when the component has no errors', () => {
      expect(
        controller.getComponent('foo').$setValidity
      ).not.toHaveBeenCalled();

      $scope.serverValidationError.foo = ['blah'];

      deferred.resolve();

      $scope.$digest();

      expect(controller.getComponent('foo').$setValidity).toHaveBeenCalledWith(
        'server',
        true
      );
      expect($scope.serverValidationError.foo).toBeUndefined();
    });

    it('should map the __all__ property to the form itself', () => {
      expect(formControllerSpy.$setValidity).not.toHaveBeenCalled();

      deferred.reject({
        data: {
          __all__: 'Missing some info.'
        }
      });
      $scope.$digest();

      expect(formControllerSpy.$setValidity).toHaveBeenCalledWith(
        'server',
        true
      );
      expect($scope.serverValidationError.__all__).toEqual([
        'Missing some info.'
      ]);
    });
  });

  describe('form component directive', () => {
    it(
      "should register it's model onto the form controller",
      inject($rootScope => {
        const controllers = [controller, jasmine.createSpy('ngModel')];
        const scope = $rootScope.$new();
        const attrs = {
          name: 'foo'
        };

        remoteValidateComponent.link(scope, {}, attrs, controllers);

        expect(controller.getComponent('foo')).toBe(controllers[1]);
      })
    );
  });

  describe('testing the directive set', () => {
    let form, getDeferred;

    beforeEach(
      inject(($rootScope, $compile) => {
        const template = `
        <form name="testForm" remote-validate-form validate="validate">
          <ul ng-repeat="error in serverValidationError.__all__">
            <li>{{ error }}</li>
          </ul>
          <input remote-validate-component type="text" name="foo" ng-model="foo" />
          <select remote-validate-component name="bar" ng-model="bar"></select>
        </form>`;

        form = $compile(template)($scope)[0];
        $scope.$digest();

        getDeferred = () => {
          const deferred = $q.defer();

          angular.extend($scope, {
            validate: deferred.promise
          });

          return deferred;
        };
      })
    );

    it('should validate fields', () => {
      getDeferred().reject({
        data: {
          __all__: 'uh-oh',
          foo: 'Missing some info.',
          bar: 'Missing some info.'
        }
      });

      $scope.$digest();

      expect(form).toBeInvalid();
      expect(form).toHaveClass('ng-invalid-server');

      const ul = form.querySelector('ul');

      expect(ul).not.toBeNull();

      expect(ul.querySelectorAll('li').length).toBe(1);

      expect(ul.querySelector('li').textContent.trim()).toBe('uh-oh');

      expect(form.querySelector('input')).toBeInvalid();

      expect(form.querySelector('input')).toHaveClass('ng-invalid-server');

      expect(form.querySelector('select')).toBeInvalid();
      expect(form.querySelector('select')).toHaveClass('ng-invalid-server');

      getDeferred().resolve();
      $scope.$digest();

      expect(form).toBeValid();

      expect(form.querySelector('ul')).toBeNull();

      const input = form.querySelector('input');

      expect(input).toBeValid();

      expect(input).not.toHaveClass('ng-invalid-server');

      const select = form.querySelector('select');

      expect(select).toBeValid();
      expect(select).not.toHaveClass('ng-invalid-server');
    });
  });
});
