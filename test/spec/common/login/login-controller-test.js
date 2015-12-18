describe('Login Controller', () => {
  var userEulaStates = {
    EULA: 'eula',
    PASS: 'pass',
    DENIED: 'denied'
  };

  var $modal, navigate;

  beforeEach(window.module('login', 'interceptors', ($provide) => {
    navigate = jasmine.createSpy('navigate');
    $provide.value('navigate', navigate);

    $provide.value('help', {
      get: jasmine.createSpy('help').andReturn('foo')
    });

    $provide.provider('$modal', function $modalProvider () {
      this.$get = ($q) => {
        $modal = {
          instances: {}
        };

        $modal.open = jasmine.createSpy('open').andCallFake((options) => {
          var modalResult = $q.defer();

          var modalInstance = {
            close: jasmine.createSpy('close').andCallFake((result) => {
              modalResult.resolve(result);
            }),
            dismiss: jasmine.createSpy('dismiss').andCallFake((reason) => {
              modalResult.reject(reason);
            }),
            result: modalResult.promise,
            opened: $q.defer().resolve(true)
          };

          $modal.instances[options.templateUrl || options.windowClass] = modalInstance;

          return modalInstance;
        });

        return $modal;
      };
    });
  }));

  var loginController, $httpBackend, sessionFixture, sessionFixtures, $rootScope;

  beforeEach(inject(($controller, _$httpBackend_, _$rootScope_, fixtures) => {
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
    sessionFixtures = fixtures.asName('session');

    loginController = $controller('LoginCtrl', {
      user_EULA_STATES: userEulaStates,
      ALLOW_ANONYMOUS_READ: true
    });

    sessionFixture = sessionFixtures.getFixture((fixture) => {
      return fixture.status === 200;
    });

    $httpBackend.whenPOST('session/').respond(201);
    $httpBackend.whenGET('session/').respond.apply(null, sessionFixture.toArray());
  }));

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
    var credentials = {
        username: 'foo',
        password: 'bar'
      };

    beforeEach(() => {
      $httpBackend.expectPOST('session/', credentials).respond(201);

      _.extend(loginController, credentials);

      loginController.submitLogin();

      expect($modal.open.callCount).toEqual(0);
    });

    it('should show the eula dialog if api says so', () => {
      $httpBackend.flush();

      expect($modal.open.callCount).toEqual(1);

      expect($modal.open).toHaveBeenCalledWith({
        templateUrl: 'common/login/assets/html/eula.html',
        keyboard: false,
        backdrop: 'static',
        controller: 'EulaCtrl',
        windowClass: 'eula-modal',
        resolve: jasmine.argThat((arg) => {
          return typeof arg.user === 'function';
        })
      });
    });

    it('should redirect to base uri if api says so', () => {
      sessionFixture.data.user.eula_state = userEulaStates.PASS;
      $httpBackend.expectGET('session/').respond.apply(null, sessionFixture.toArray());

      $httpBackend.flush();

      expect($modal.open.callCount).toEqual(0);
      expect(navigate).toHaveBeenCalledOnceWith();
    });

    it('should logout when eula is rejected', () => {
      $httpBackend.flush();

      $httpBackend.expectDELETE('session/').respond(204);

      $modal.instances['common/login/assets/html/eula.html'].dismiss('dismiss');

      $httpBackend.flush();
    });

    it('should login when eula is accepted', () => {
      $httpBackend.flush();

      $modal.instances['common/login/assets/html/eula.html'].close();

      $rootScope.$digest();

      expect(navigate).toHaveBeenCalledWith();
    });
  });

  describe('unauthenticated user', () => {
    beforeEach(() => {
      var failedAuth = sessionFixtures.getFixture((fixture) => {
        return fixture.status === 400;
      });

      $httpBackend.expectPOST('session/').respond.apply(null, failedAuth.toArray());

      _.extend(loginController, {username: 'badHacker', password: 'bruteForce'});
      loginController.submitLogin();
    });

    it('should have a rejected promise', () => {
      var err = jasmine.createSpy('err');

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
      var adminSession = sessionFixtures.getFixture((fixture) => {
        return fixture.data.user && fixture.data.user.username === 'admin';
      });

      $httpBackend.expectGET('session/').respond.apply(null, adminSession.toArray());

      angular.extend(loginController, {username: 'admin', password: 'foo'});
      loginController.submitLogin();

      $httpBackend.flush();
    });

    it('should be denied', () => {
      expect($modal.open.callCount).toEqual(1);

      expect($modal.open).toHaveBeenCalledWith({
        templateUrl: 'common/access-denied/assets/html/access-denied.html',
        keyboard: false,
        backdrop: 'static',
        controller: 'AccessDeniedCtrl',
        resolve: { message: jasmine.any(Function) }
      });
    });

    it('should not perform any further actions', () => {
      expect(navigate).not.toHaveBeenCalled();

      expect(loginController.inProgress).toBeTruthy();
    });
  });
});
