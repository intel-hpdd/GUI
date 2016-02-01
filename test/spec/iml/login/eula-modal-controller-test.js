import loginModule
  from '../../../../source/iml/login/login-module';
import interceptorsModule
  from '../../../../source/iml/interceptors/interceptor-module';

describe('Eula Modal Controller', () => {
  var $scope, $httpBackend, $uibModalInstance;

  beforeEach(module(loginModule, interceptorsModule, $provide => {
    $provide.value('help', {
      get: jasmine.createSpy('get').and.returnValue('foo')
    });
  }));

  beforeEach(inject(($controller, $rootScope, _$httpBackend_, UserModel) => {
    $scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;

    $uibModalInstance = {
      close: jasmine.createSpy('close'),
      dismiss: jasmine.createSpy('dismiss')
    };

    $controller('EulaCtrl', {
      $scope,
      $uibModalInstance,
      user: new UserModel()
    });
  }));

  it('should update the user on accept', () => {
    $httpBackend.expectPUT('user/', {accepted_eula: true}).respond(202);

    $scope.eulaCtrl.accept();

    expect($uibModalInstance.close).not.toHaveBeenCalled();

    $httpBackend.flush();

    expect($uibModalInstance.close).toHaveBeenCalled();
  });

  it('should perform the appropriate actions on reject', () => {
    $httpBackend.expectPUT('user/', {accepted_eula: false}).respond(202);

    expect($uibModalInstance.dismiss).not.toHaveBeenCalled();

    $scope.eulaCtrl.reject();

    $httpBackend.flush();

    expect($uibModalInstance.dismiss).toHaveBeenCalled();
  });
});
