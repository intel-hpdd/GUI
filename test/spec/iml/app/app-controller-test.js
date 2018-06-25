import highland from 'highland';
import angular from '../../../angular-mock-setup.js';
import fixturesModule from '../../../fixtures/fixtures.js';

describe('App controller', () => {
  let $scope,
    appController,
    sessionFixture,
    deferred,
    navigate,
    help,
    ENV,
    GROUPS,
    alertStream,
    notificationStream,
    mockAuthorization,
    mockGlobal;

  beforeEach(angular.mock.module(fixturesModule));
  beforeEach(
    angular.mock.inject(($rootScope, $q, fixtures) => {
      help = { get: jest.fn(() => '2015') };
      GROUPS = {};
      ENV = { RUNTIME_VERSION: 'dev' };
      navigate = jest.fn();
      $scope = $rootScope.$new();
      deferred = $q.defer();
      sessionFixture = fixtures.getFixture('session', fixture => {
        return fixture.status === 200;
      });
      alertStream = highland();
      jest.spyOn(alertStream, 'destroy');
      notificationStream = highland();
      jest.spyOn(notificationStream, 'destroy');

      mockAuthorization = {
        getCSRFToken: jest.fn(() => ({
          'X-CSRFToken': 'qqo4KXV34frTf0mzlKlEK7FaTffEoqqb'
        }))
      };
      jest.mock('../../../../source/iml/auth/authorization.js', () => mockAuthorization);

      mockGlobal = {
        fetch: jest.fn(() => Promise.resolve())
      };
      jest.mock('../../../../source/iml/global.js', () => mockGlobal);

      const mod = require('../../../../source/iml/app/app-controller.js');
      appController = {};
      mod.default.bind(appController)(
        $scope,
        {
          user: sessionFixture.data.user,
          $delete: jest.fn().mockReturnValue(deferred.promise)
        },
        navigate,
        ENV,
        GROUPS,
        help,
        notificationStream,
        alertStream
      );
    })
  );
  it('should retrieve the copyright year from help text', () => {
    expect(help.get).toHaveBeenCalledOnceWith('copyright_year');
  });
  it('should set the copyright year on the controller', () => {
    expect(appController.COPYRIGHT_YEAR).toBe('2015');
  });
  it('should have a method to redirect to login', () => {
    appController.login();
    expect(navigate).toHaveBeenCalledOnceWith('login/');
  });
  it('should tell if the user is logged in', () => {
    expect(appController.loggedIn).toBe(true);
  });
  it('should direct the on click method to the proper action', () => {
    expect(appController.onClick).toBe(appController.logout);
  });
  it('should tell if the user is logged in', () => {
    expect(appController.loggedIn).toBe(true);
  });
  it('should direct the on click method to the proper action', () => {
    expect(appController.onClick).toBe(appController.logout);
  });
  describe('above limit', () => {
    beforeEach(() => {
      notificationStream.write({ count: 100 });
    });
    it('should tell we are above the limit', () => {
      expect(appController.status.aboveLimit).toBe(true);
    });
    it('should cap the count at limit', () => {
      expect(appController.status.count).toBe(99);
    });
  });
  describe('below limit', () => {
    beforeEach(() => {
      notificationStream.write({ count: 1 });
    });
    it('should tell we are below the limit', () => {
      expect(appController.status.aboveLimit).toBe(false);
    });
    it('should not cap the count', () => {
      expect(appController.status.count).toBe(1);
    });
  });
  describe('logout', () => {
    beforeEach(() => {
      appController.logout();
      deferred.resolve();
      $scope.$apply();
    });
    it('should delete the session', () => {
      expect(mockGlobal.fetch).toHaveBeenCalledWith('/api/session/', {
        method: 'delete',
        credentials: 'same-origin',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=UTF-8',
          'X-CSRFToken': 'qqo4KXV34frTf0mzlKlEK7FaTffEoqqb'
        }
      });
      expect(mockGlobal.fetch).toHaveBeenCalledTimes(1);
    });
    it('should navigate to login', () => {
      expect(navigate).toHaveBeenCalledWith('login/', undefined);
      expect(navigate).toHaveBeenCalledTimes(1);
    });
  });
  describe('destroy', () => {
    beforeEach(() => {
      $scope.$destroy();
    });
    it('should destroy the notification stream', () => {
      expect(notificationStream.destroy).toHaveBeenCalledTimes(1);
    });
    it('should destroy the alert stream', () => {
      expect(alertStream.destroy).toHaveBeenCalledTimes(1);
    });
  });
});
