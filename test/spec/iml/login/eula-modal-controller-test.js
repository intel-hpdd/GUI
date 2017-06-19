import eulaModalController from '../../../../source/iml/login/eula-modal-controller.js';
import angular from '../../../angular-mock-setup.js';

describe('Eula Modal Controller', () => {
  let $scope, $httpBackend, $uibModalInstance, help, userModel;
  beforeEach(
    angular.mock.inject(($rootScope, _$httpBackend_, $http, $q) => {
      $scope = $rootScope.$new();
      $httpBackend = _$httpBackend_;
      help = {
        get: jest.fn(() => 'foo')
      };
      $uibModalInstance = { close: jest.fn(), dismiss: jest.fn() };
      userModel = {
        actOnEulaState: jest.fn(),
        $update: jest.fn(() => {
          $http.put('user/', { accepted_eula: userModel.accepted_eula });
          return $q.resolve('action-arg');
        })
      };
      eulaModalController($scope, $uibModalInstance, help, userModel);
    })
  );
  it('should update the user on accept', () => {
    $httpBackend.expectPUT('user/', { accepted_eula: true }).respond(202);
    $scope.eulaCtrl.accept();
    expect($uibModalInstance.close).not.toHaveBeenCalled();
    $httpBackend.flush();
    expect($uibModalInstance.close).toHaveBeenCalledWith('close', 'action-arg');
  });
  it('should perform the appropriate actions on reject', () => {
    $httpBackend.expectPUT('user/', { accepted_eula: false }).respond(202);
    expect($uibModalInstance.dismiss).not.toHaveBeenCalled();
    $scope.eulaCtrl.reject();
    $httpBackend.flush();
    expect($uibModalInstance.dismiss).toHaveBeenCalledWith(
      'dismiss',
      'action-arg'
    );
  });
});
