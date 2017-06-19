import angular from '../../../angular-mock-setup.js';
import fixtures from '../../../fixtures/fixtures.js';

describe('Login Controller', () => {
  const userEulaStates = { EULA: 'eula', PASS: 'pass', DENIED: 'denied' };
  let $uibModal, navigate, LoginCtrl, help, mod, SessionModel;
  beforeEach(() => {

    mod = require('../../../../source/iml/login/login-controller.js');
    LoginCtrl = mod.default;

    navigate = jest.fn();
    help = { get: jest.fn(() => 'foo') };

    $uibModal = { instances: {} };
  });

  beforeEach(angular.mock.module(fixtures));

  let loginController,
    $httpBackend,
    sessionFixture,
    sessionFixtures,
    sessionPromise,
    sessionData,
    failedSessionFixture,
    failedSessionPromise,
    failedSessionData,
    actOnEulaState,
    $rootScope;
  beforeEach(
    angular.mock.inject(
      ($controller, $q, $http, _$httpBackend_, _$rootScope_, fixtures) => {
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;

        $uibModal.open = jest.fn(options => {
          const modalResult = $q.defer();
          const modalInstance = {
            close: jest.fn(result => {
              modalResult.resolve(result);
            }),
            dismiss: jest.fn(reason => {
              $http.delete('session/');
              modalResult.reject(reason);
            }),
            result: modalResult.promise,
            opened: $q.defer().resolve(true)
          };
          $uibModal.instances[
            (options.template, options.windowClass)
          ] = modalInstance;

          return modalInstance;
        });

        sessionFixtures = fixtures.asName('session');
        sessionFixture = sessionFixtures.getFixture(fixture => {
          return fixture.status === 200;
        });

        actOnEulaState = eulaState =>
          jest.fn((initializeEulaDialog, initializeDeniedDialog) => {
            switch (eulaState) {
              case userEulaStates.EULA:
                return initializeEulaDialog(sessionData.user);
              case userEulaStates.DENIED:
                $http.get('session/');
                return initializeDeniedDialog();
              default:
                $http.get('session/');
            }
          });
        sessionData = {
          ...sessionFixture.data,
          user: {
            ...sessionFixture.data.user,
            actOnEulaState: actOnEulaState(userEulaStates.EULA)
          }
        };

        sessionPromise = {
          $promise: $q.resolve(sessionData)
        };
        failedSessionPromise = $q.reject(failedSessionData);
        SessionModel = {
          login: jest.fn((username, password) => {
            $http.post('session/', { username, password });

            return sessionPromise;
          }),
          delete: jest.fn(() => ({
            $promise: $q.resolve()
          }))
        };

        loginController = {};
        LoginCtrl.bind(loginController)(
          $uibModal,
          $q,
          SessionModel,
          help,
          navigate,
          true
        );

        $httpBackend.whenPOST('session/').respond(201);
        $httpBackend
          .whenGET('session/')
          .respond.apply(null, sessionFixture.toArray());
      }
    )
  );
  afterEach(() => {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should have an ALLOW_ANONYMOUS_READ property', () => {
    expect(loginController.ALLOW_ANONYMOUS_READ).toBe(true);
  });

  it('should have a method to go to index', () => {
    loginController.goToIndex();
    expect(navigate).toHaveBeenCalledWith();
  });

  describe('authenticated user', () => {
    const credentials = { username: 'foo', password: 'bar' };
    beforeEach(() => {
      $httpBackend.expectPOST('session/', credentials).respond(201);
      loginController = { ...loginController, ...credentials };
      loginController.submitLogin();
      expect($uibModal.open.mock.calls.length).toEqual(0);
    });

    it('should show the eula dialog if api says so', () => {
      $httpBackend.flush();
      expect($uibModal.open.mock.calls.length).toEqual(1);
      expect($uibModal.open).toHaveBeenCalledWith({
        template: `<div class="modal-header">
  <h3>End User License Agreement Terms</h3>
</div>
<div class="modal-body eula">
  <div class="well" at-scroll-boundary one-hit="{{ true }}" ng-bind-html="eulaCtrl.eula"></div>
</div>
<div class="modal-footer">
  <button class="btn btn-success" ng-disabled="!hitBoundary" ng-click="eulaCtrl.accept()">Agree</button>
  <button class="btn btn-danger" ng-click="eulaCtrl.reject()">Do Not Agree</button>
</div>`,
        keyboard: false,
        backdrop: 'static',
        controller: 'EulaCtrl',
        windowClass: 'eula-modal',
        resolve: { user: expect.any(Function) }
      });
    });
    it('should redirect to base uri if api says so', () => {
      sessionData.user.eula_state = userEulaStates.PASS;
      sessionData.user.actOnEulaState = actOnEulaState(userEulaStates.PASS);
      $httpBackend
        .expectGET('session/')
        .respond.apply(null, sessionFixture.toArray());
      $httpBackend.flush();
      expect($uibModal.open.mock.calls.length).toEqual(0);
      expect(navigate).toHaveBeenCalledTimes(1);
    });
    it('should logout when eula is rejected', () => {
      $httpBackend.flush();
      $httpBackend.expectDELETE('session/').respond(204);
      $uibModal.instances['eula-modal'].dismiss('dismiss');
      $httpBackend.flush();
    });
    it('should login when eula is accepted', () => {
      $httpBackend.flush();
      $uibModal.instances['eula-modal'].close();
      $rootScope.$digest();
      expect(navigate).toHaveBeenCalledTimes(1);
    });
  });
  describe('unauthenticated user', () => {
    beforeEach(() => {
      failedSessionFixture = sessionFixtures.getFixture(fixture => {
        return fixture.status === 400;
      });

      failedSessionData = {
        ...failedSessionFixture.data,
        user: {
          ...failedSessionFixture.data.user,
          actOnEulaState: actOnEulaState(userEulaStates.EULA)
        }
      };

      $httpBackend
        .expectPOST('session/')
        .respond.apply(null, failedSessionFixture.toArray());
      loginController = {
        ...loginController,
        ...{
          username: 'badHacker',
          password: 'bruteForce'
        }
      };

      sessionPromise.$promise = failedSessionPromise;

      loginController.submitLogin();
    });
    it('should have a rejected promise', () => {
      const err = jest.fn();
      loginController.validate.catch(err);
      $httpBackend.flush();
      $rootScope.$digest();
      expect(err).toHaveBeenCalled();
    });
    it('should update progress', () => {
      expect(loginController.inProgress).toBeTruthy();
      $httpBackend.flush();
      expect(loginController.inProgress).toBeFalsy();
    });
  });
  describe('non-superuser', () => {
    let adminSessionData, adminSession;
    beforeEach(
      angular.mock.inject($q => {
        adminSession = sessionFixtures.getFixture(fixture => {
          return fixture.data.user && fixture.data.user.username === 'admin';
        });
        adminSessionData = {
          ...adminSession.data,
          user: {
            ...adminSession.data.user,
            actOnEulaState: actOnEulaState(userEulaStates.DENIED)
          }
        };

        sessionPromise.$promise = $q.resolve(adminSessionData);

        $httpBackend
          .expectGET('session/')
          .respond.apply(null, adminSession.toArray());
        loginController = {
          ...loginController,
          ...{ username: 'admin', password: 'foo' }
        };
        loginController.submitLogin();
        $httpBackend.flush();
      })
    );
    it('should be denied', () => {
      expect($uibModal.open.mock.calls.length).toEqual(1);
      expect($uibModal.open).toHaveBeenCalledWith({
        template: `<div class="modal-header">
    <h3><i class="fa fa-ban"></i> Access Denied</h3>
</div>
<div class="modal-body access-denied">{{ accessDeniedCtrl.message }}</div>`,
        keyboard: false,
        backdrop: 'static',
        controller: 'AccessDeniedCtrl',
        resolve: { message: expect.any(Function) }
      });
    });
    it('should not perform any further actions', () => {
      expect(navigate).not.toHaveBeenCalled();
      expect(loginController.inProgress).toBeTruthy();
    });
  });
});
