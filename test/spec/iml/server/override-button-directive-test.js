import serverModule from '../../../../source/iml/server/server-module';

describe('Override Directive', function () {

  beforeEach(module(serverModule));

  let $scope,
    element,
    button;

  beforeEach(inject(function ($rootScope, $compile) {
    const markup = `<override-button overridden="overridden" is-valid="isValid" on-change="onChange(message)"
      is-disabled="disabled"></override-button>`;

    $scope = $rootScope.$new();

    $scope.onChange = jasmine.createSpy('onChange');

    element = $compile(markup)($scope)[0];
    $scope.$digest();

    button = () => element.querySelector('button');
  }));

  it('should start with the override button', function () {
    expect(button().textContent.trim())
      .toBe('Override');
  });

  it('should transition to proceed after clicking override', function () {
    button().click();

    expect(button().textContent.trim())
      .toBe('Proceed');
  });

  it('should have a link to skip the command view', function () {
    button().click();
    element.querySelectorAll('button')[1].click();

    element.querySelector('.dropdown-menu a').click();

    expect($scope.onChange)
      .toHaveBeenCalledOnceWith('proceed and skip');
  });

  it('should not override if valid', function () {
    $scope.isValid = true;
    $scope.$digest();

    expect(button()).toHaveClass('btn-success');
  });

  it('should tell that override was clicked', function () {
    button().click();

    expect($scope.onChange).toHaveBeenCalledOnceWith('override');
  });

  it('should tell that proceed was clicked', function () {
    button().click();
    button().click();

    expect($scope.onChange).toHaveBeenCalledOnceWith('proceed');
  });

  it('should be disabled after proceeding', function () {
    button().click();
    button().click();

    expect(button().textContent.trim()).toEqual('Working');
  });
});
