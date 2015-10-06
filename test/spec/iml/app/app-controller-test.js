describe('App controller', function () {
  beforeEach(module('app'));

  var $scope, $routeSegment, appController,
    sessionFixture, deferred, navigate, help, ENV, GROUPS,
    alertStream, notificationStream;

  beforeEach(inject(function ($rootScope, $q, $controller, fixtures) {
    help = {
      get: jasmine.createSpy('help').andReturn('2015')
    };

    GROUPS = {};

    ENV = {
      RUNTIME_VERSION: 'dev'
    };

    $routeSegment = {};
    navigate = jasmine.createSpy('navigate');

    $scope = $rootScope.$new();

    deferred = $q.defer();

    sessionFixture = fixtures.getFixture('session', function (fixture) {
      return fixture.status === 200;
    });

    alertStream = highland();
    spyOn(alertStream, 'destroy');

    notificationStream = highland();
    spyOn(notificationStream, 'destroy');

    appController = $controller('AppCtrl', {
      $scope: $scope,
      session: {
        user: sessionFixture.data.user,
        $delete: jasmine.createSpy('$delete')
          .andReturn(deferred.promise)
      },
      navigate: navigate,
      $routeSegment: $routeSegment,
      help: help,
      alertStream: alertStream,
      notificationStream: notificationStream,
      ENV: ENV,
      GROUPS: GROUPS
    });
  }));

  it('should retrieve the copyright year from help text', function () {
    expect(help.get).toHaveBeenCalledOnceWith('copyright_year');
  });

  it('should set the copyright year on the controller', function () {
    expect(appController.COPYRIGHT_YEAR).toBe('2015');
  });

  it('should have a method to redirect to login', function () {
    appController.login();

    expect(navigate).toHaveBeenCalledOnceWith('login/');
  });

  it('should expose the $routeSegment on the controller', function () {
    expect(appController.$routeSegment).toEqual($routeSegment);
  });

  it('should tell if the user is logged in', function () {
    expect(appController.loggedIn).toBe(true);
  });

  it('should direct the on click method to the proper action', function () {
    expect(appController.onClick).toBe(appController.logout);
  });

  it('should tell if the user is logged in', function () {
    expect(appController.loggedIn).toBe(true);
  });

  it('should direct the on click method to the proper action', function () {
    expect(appController.onClick).toBe(appController.logout);
  });

  describe('above limit', function () {
    beforeEach(function () {
      notificationStream.write({ count: 100 });
    });

    it('should tell we are above the limit', function () {
      expect(appController.status.aboveLimit).toBe(true);
    });

    it('should cap the count at limit', function () {
      expect(appController.status.count).toBe(99);
    });
  });

  describe('below limit', function () {
    beforeEach(function () {
      notificationStream.write({ count: 1 });
    });

    it('should tell we are below the limit', function () {
      expect(appController.status.aboveLimit).toBe(false);
    });

    it('should not cap the count', function () {
      expect(appController.status.count).toBe(1);
    });
  });

  describe('logout', function () {
    beforeEach(function () {
      appController.logout();

      deferred.resolve();
      $scope.$apply();
    });

    it('should delete the session', function () {
      expect(appController.session.$delete).toHaveBeenCalledOnce();
    });

    it('should navigate to login', function () {
      expect(navigate).toHaveBeenCalledOnceWith('login/', undefined);
    });
  });

  describe('destroy', function () {
    beforeEach(function () {
      $scope.$destroy();
    });

    it('should destroy the notification stream', function () {
      expect(notificationStream.destroy).toHaveBeenCalledOnce();
    });

    it('should destroy the alert stream', function () {
      expect(alertStream.destroy).toHaveBeenCalledOnce();
    });
  });
});
