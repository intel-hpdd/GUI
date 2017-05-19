import angular from 'angular';

import loginModule from '../../../../source/iml/login/login-module';

import interceptorsModule
  from '../../../../source/iml/interceptors/interceptor-module';

import { mock, resetAll } from '../../../system-mock.js';

describe('Login Controller', () => {
  const userEulaStates = {
    EULA: 'eula',
    PASS: 'pass',
    DENIED: 'denied'
  };

  let $uibModal, navigate, LoginCtrl;

  beforeEachAsync(async function() {
    const mod = await mock('source/iml/login/login-controller.js', {
      'source/iml/login/assets/html/eula.html': {
        default: 'eulaTemplate'
      },
      'source/iml/access-denied/assets/html/access-denied.html': {
        default: 'accessDeniedTemplate'
      }
    });

    LoginCtrl = mod.default;
  });

  afterEach(resetAll);

  beforeEach(
    module(loginModule, interceptorsModule, $provide => {
      navigate = jasmine.createSpy('navigate');
      $provide.value('navigate', navigate);

      $provide.value('help', {
        get: jasmine.createSpy('help').and.returnValue('foo')
      });

      $provide.provider('$uibModal', function $uibModalProvider() {
        'ngInject';
        this.$get = $q => {
          $uibModal = {
            instances: {}
          };

          $uibModal.open = jasmine.createSpy('open').and.callFake(options => {
            const modalResult = $q.defer();

            const modalInstance = {
              close: jasmine.createSpy('close').and.callFake(result => {
                modalResult.resolve(result);
              }),
              dismiss: jasmine.createSpy('dismiss').and.callFake(reason => {
                modalResult.reject(reason);
              }),
              result: modalResult.promise,
              opened: $q.defer().resolve(true)
            };

            $uibModal.instances[
              options.template || options.windowClass
            ] = modalInstance;

            return modalInstance;
          });

          return $uibModal;
        };
      });
    })
  );

  let loginController,
    $httpBackend,
    sessionFixture,
    sessionFixtures,
    $rootScope;

  beforeEach(
    inject(($controller, _$httpBackend_, _$rootScope_, fixtures) => {
      $httpBackend = _$httpBackend_;
      $rootScope = _$rootScope_;
      sessionFixtures = fixtures.asName('session');

      loginController = $controller(LoginCtrl, {
        user_EULA_STATES: userEulaStates,
        ALLOW_ANONYMOUS_READ: true
      });

      sessionFixture = sessionFixtures.getFixture(fixture => {
        return fixture.status === 200;
      });

      $httpBackend.whenPOST('session/').respond(201);
      $httpBackend
        .whenGET('session/')
        .respond.apply(null, sessionFixture.toArray());
    })
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
    const credentials = {
      username: 'foo',
      password: 'bar'
    };

    beforeEach(() => {
      $httpBackend.expectPOST('session/', credentials).respond(201);

      angular.extend(loginController, credentials);

      loginController.submitLogin();

      expect($uibModal.open.calls.count()).toEqual(0);
    });

    it('should show the eula dialog if api says so', () => {
      $httpBackend.flush();

      expect($uibModal.open.calls.count()).toEqual(1);

      expect($uibModal.open).toHaveBeenCalledWith({
        template: 'eulaTemplate',
        keyboard: false,
        backdrop: 'static',
        controller: 'EulaCtrl',
        windowClass: 'eula-modal',
        resolve: {
          user: expect.any(Function)
        }
      });
    });

    it('should redirect to base uri if api says so', () => {
      sessionFixture.data.user.eula_state = userEulaStates.PASS;
      $httpBackend
        .expectGET('session/')
        .respond.apply(null, sessionFixture.toArray());

      $httpBackend.flush();

      expect($uibModal.open.calls.count()).toEqual(0);
      expect(navigate).toHaveBeenCalledTimes(1);
    });

    it('should logout when eula is rejected', () => {
      $httpBackend.flush();

      $httpBackend.expectDELETE('session/').respond(204);

      $uibModal.instances['eulaTemplate'].dismiss('dismiss');

      $httpBackend.flush();
    });

    it('should login when eula is accepted', () => {
      $httpBackend.flush();

      $uibModal.instances['eulaTemplate'].close();

      $rootScope.$digest();

      expect(navigate).toHaveBeenCalledTimes(1);
    });
  });

  describe('unauthenticated user', () => {
    beforeEach(() => {
      const failedAuth = sessionFixtures.getFixture(fixture => {
        return fixture.status === 400;
      });

      $httpBackend
        .expectPOST('session/')
        .respond.apply(null, failedAuth.toArray());

      angular.extend(loginController, {
        username: 'badHacker',
        password: 'bruteForce'
      });
      loginController.submitLogin();
    });

    it('should have a rejected promise', () => {
      const err = jasmine.createSpy('err');

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
    beforeEach(() => {
      const adminSession = sessionFixtures.getFixture(fixture => {
        return fixture.data.user && fixture.data.user.username === 'admin';
      });

      $httpBackend
        .expectGET('session/')
        .respond.apply(null, adminSession.toArray());

      angular.extend(loginController, { username: 'admin', password: 'foo' });
      loginController.submitLogin();

      $httpBackend.flush();
    });

    it('should be denied', () => {
      expect($uibModal.open.calls.count()).toEqual(1);

      expect($uibModal.open).toHaveBeenCalledWith({
        template: 'accessDeniedTemplate',
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
