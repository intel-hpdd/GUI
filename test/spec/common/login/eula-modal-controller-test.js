import angular from 'angular';
const {module, inject} = angular.mock;

describe('Eula Modal Controller', () => {
  var $scope, $httpBackend, $modalInstance;

  beforeEach(module('login', 'interceptors', ($provide) => {
    $provide.value('help', {
      get: jasmine.createSpy('get').and.returnValue('foo')
    });
  }));

  beforeEach(inject(($controller, $rootScope, _$httpBackend_, UserModel) => {
    $scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;

    $modalInstance = {
      close: jasmine.createSpy('close'),
      dismiss: jasmine.createSpy('dismiss')
    };

    $controller('EulaCtrl', {
      $scope,
      $modalInstance,
      user: new UserModel()
    });
  }));

  it('should update the user on accept', () => {
    $httpBackend.expectPUT('user/', {accepted_eula: true}).respond(202);

    $scope.eulaCtrl.accept();

    expect($modalInstance.close).not.toHaveBeenCalled();

    $httpBackend.flush();

    expect($modalInstance.close).toHaveBeenCalled();
  });

  it('should perform the appropriate actions on reject', () => {
    $httpBackend.expectPUT('user/', {accepted_eula: false}).respond(202);

    expect($modalInstance.dismiss).not.toHaveBeenCalled();

    $scope.eulaCtrl.reject();

    $httpBackend.flush();

    expect($modalInstance.dismiss).toHaveBeenCalled();
  });
});
