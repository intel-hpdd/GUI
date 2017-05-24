import angular from '../../../angular-mock-setup.js';
import overrideButtonDirective
  from '../../../../source/iml/server/override-button-directive.js';
import uiBootstrapModule from 'angular-ui-bootstrap';

describe('Override Directive', () => {
  let $scope, element, button;

  beforeEach(angular.mock.module(uiBootstrapModule));

  beforeEach(
    angular.mock.module(($provide, $compileProvider) => {
      $provide.value('OVERRIDE_BUTTON_TYPES', {
        OVERRIDE: 'override',
        PROCEED: 'proceed',
        PROCEED_SKIP: 'proceed and skip'
      });
      $compileProvider.directive('overrideButton', overrideButtonDirective);
    })
  );

  beforeEach(
    angular.mock.inject(($rootScope, $compile) => {
      const markup = `<override-button overridden="overridden" is-valid="isValid" on-change="onChange(message)"
      is-disabled="disabled"></override-button>`;

      $scope = $rootScope.$new();

      $scope.onChange = jest.fn();

      element = $compile(markup)($scope)[0];
      $scope.$digest();

      button = () => element.querySelector('button');
    })
  );

  it('should start with the override button', () => {
    expect(button().textContent.trim()).toBe('Override');
  });

  it('should transition to proceed after clicking override', () => {
    button().click();

    expect(button().textContent.trim()).toBe('Proceed');
  });

  it('should have a link to skip the command view', () => {
    button().click();
    element.querySelectorAll('button')[1].click();

    element.querySelector('.dropdown-menu a').click();

    expect($scope.onChange).toHaveBeenCalledOnceWith('proceed and skip');
  });

  it('should not override if valid', () => {
    $scope.isValid = true;
    $scope.$digest();

    expect(button()).toHaveClass('btn-success');
  });

  it('should tell that override was clicked', () => {
    button().click();

    expect($scope.onChange).toHaveBeenCalledOnceWith('override');
  });

  it('should tell that proceed was clicked', () => {
    button().click();
    button().click();

    expect($scope.onChange).toHaveBeenCalledOnceWith('proceed');
  });

  it('should be disabled after proceeding', () => {
    button().click();
    button().click();

    expect(button().textContent.trim()).toEqual('Working');
  });
});
