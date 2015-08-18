xdescribe('router', function () {
  'use strict';

  beforeEach(module('imlRoutes'));

  var el;

  beforeEach(function () {
    el = angular
      .element('<div><div app-view-segment="0"></div></div>');
  });

  xdescribe('the login route', function () {
    var $location, $routeSegment, scope;

    beforeEach(inject(function (_$location_, _$routeSegment_, $templateCache,  $rootScope, $compile) {
      $location = _$location_;
      $routeSegment = _$routeSegment_;
      scope = $rootScope.$new();

      $templateCache
        .put('common/login/assets/html/login.html', '<div class="login">Login</div>');

      $compile(el)(scope);
    }));

    describe('loading the page', function () {
      var login;

      beforeEach(function () {
        $location.path('/login');
        scope.$apply();

        login = el.find('.login');
      });

      it('should look at the login route segment', function () {
        expect($routeSegment.name).toBe('login');
      });

      it('should load the login page', function () {
        expect(login).toBeShown();
      });

      it('should attach the controller to scope', function () {
        expect(login.scope().login).toEqual(jasmine.any(Object));
      });
    });
  });


  describe('the dashboard', function () {
    var AppController, DashboardCtrl, BaseDashboardCtrl, appAlertStream,
      appNotificationStream, appSession,
      dashboardHostStream, dashboardTargetStream,
      dashboardFsStream;

    beforeEach(module(function ($provide, $controllerProvider) {
      AppController = function AppController () {};
      $controllerProvider.register('AppCtrl', AppController);

      DashboardCtrl = function DashboardCtrl () {};
      $controllerProvider.register('DashboardCtrl', DashboardCtrl);

      BaseDashboardCtrl = function BaseDashboardCtrl () {};
      $controllerProvider.register('BaseDashboardCtrl', BaseDashboardCtrl);

      appAlertStream = jasmine.createSpy('appAlertStream');
      $provide.value('appAlertStream', appAlertStream);
      $provide.decorator('appAlertStream', function ($delegate, $q) {
        return $delegate.andCallFake(function () {
          return $q.when();
        });
      });

      appNotificationStream = jasmine.createSpy('appNotificationStream');
      $provide.value('appNotificationStream', appNotificationStream);
      $provide.decorator('appNotificationStream', function ($delegate, $q) {
        return $delegate.andCallFake(function () {
          return $q.when();
        });
      });

      appSession = {};
      $provide.value('appSession', appSession);

      dashboardFsStream = jasmine.createSpy('dashboardFsStream');
      $provide.value('dashboardFsStream', dashboardFsStream);
      $provide.decorator('dashboardFsStream', function ($delegate, $q) {
        return $delegate.andCallFake(function () {
          return $q.when();
        });
      });

      dashboardHostStream = jasmine.createSpy('dashboardHostStream');
      $provide.value('dashboardHostStream', dashboardHostStream);
      $provide.decorator('dashboardHostStream', function ($delegate, $q) {
        return $delegate.andCallFake(function () {
          return $q.when();
        });
      });

      dashboardTargetStream = jasmine.createSpy('dashboardTargetStream');
      $provide.value('dashboardTargetStream', dashboardTargetStream);
      $provide.decorator('dashboardTargetStream', function ($delegate, $q) {
        return $delegate.andCallFake(function () {
          return $q.when();
        });
      });

      var baseDashboardChartResolves = jasmine.createSpy('baseDashboardChartResolves');
      $provide.value('baseDashboardChartResolves', baseDashboardChartResolves);
      $provide.decorator('baseDashboardChartResolves', function ($delegate, $q) {
        return $delegate.andCallFake(function () {
          return $q.when();
        });
      });

      var baseDashboardFsStream = jasmine.createSpy('baseDashboardFsStream');
      $provide.value('baseDashboardFsStream', baseDashboardFsStream);
      $provide.decorator('baseDashboardFsStream', function ($delegate, $q) {
        return $delegate.andCallFake(function () {
          return $q.when();
        });
      });

    }));

    describe('loading', function () {
      beforeEach(inject(function ($location, $templateCache, $rootScope, $compile) {
        $templateCache
          .put('common/loading/assets/html/loading.html', '<div class="loading">Loading</div>');
        $templateCache
          .put('iml/app/assets/html/app.html', '<div class="app" app-view-segment="1"></div>');
        $templateCache
          .put('iml/dashboard/assets/html/dashboard.html', '<div app-view-segment="2" class="dashboard"></div>');
        $templateCache
          .put('iml/dashboard/assets/html/base-dashboard.html', '<div class="base-dashboard"></div>');

        $compile(el)($rootScope.$new());
        $location.path('/');
        $rootScope.$apply();
      }));

      it('should display loading until resolves are finished', function () {
        expect(el.find('.loading')).toBeShown();
      });

      it('should get the notificationStream', function () {
        expect(appNotificationStream).toHaveBeenCalledOnce();
      });

      it('should get the host stream', function () {
        expect(dashboardHostStream).toHaveBeenCalledOnce();
      });

      it('should get the target stream', function () {
        expect(dashboardTargetStream).toHaveBeenCalledOnce();
      });

      it('should get the fsStream', function () {
        expect(dashboardFsStream).toHaveBeenCalledOnce();
      });
    });

    xdescribe('base', function () {
      var BaseDashboardCtrl, baseDashboardChartResolves;

      beforeEach(module(function ($provide, $controllerProvider) {
        BaseDashboardCtrl = function BaseDashboardCtrl () {};
        $controllerProvider.register('BaseDashboardCtrl', BaseDashboardCtrl);

        baseDashboardChartResolves = jasmine.createSpy('baseDashboardChartResolves');
        $provide.value('baseDashboardChartResolves', baseDashboardChartResolves);
      }));

      var $location, $routeSegment, $templateCache, scope;

      beforeEach(inject(function (_$location_, _$routeSegment_, _$templateCache_, $rootScope, $compile) {
        $location = _$location_;
        $routeSegment = _$routeSegment_;
        $templateCache = _$templateCache_;
        scope = $rootScope.$new();

        $templateCache
          .put(
            'common/loading/assets/html/loading.html',
            '<div class="loading">Loading</div>'
          );
        $templateCache
          .put(
            'iml/app/assets/html/app.html',
            '<div class="app" app-view-segment="1"></div>'
          );
        $templateCache
          .put(
            'iml/dashboard/assets/html/dashboard.html',
            '<div app-view-segment="2" class="dashboard"></div>'
          );
        $templateCache
          .put(
            'iml/dashboard/assets/html/base-dashboard.html',
            '<div class="base-dashboard">Base Dashboard</div>'
          );

        $compile(el)(scope);
        $location.path('/');
        scope.$apply();
        $rootScope.$apply();
      }));

      it('should get the charts', function () {
        expect(baseDashboardChartResolves).toHaveBeenCalledOnce();
      });

      it('should get fs info', function () {
        expect(getFsStream)
          .toHaveBeenCalledOnceWith({
            jsonMask: 'objects(name,bytes_total,bytes_free,files_free,files_total,client_count,immutable_state,\
id,osts,mdts(id),mgt(primary_server,primary_server_name)',
            qs: { limit: 0 }
          });
      });
    });
  });

  xdescribe('the server page', function () {
    var AppController, ServerCtrl,
      notificationStream, serverStreamsResolves, authorization;

    beforeEach(module(function ($provide, $controllerProvider) {
      AppController = function AppController () {};
      $controllerProvider.register('AppCtrl', AppController);

      ServerCtrl = function ServerCtrl () {};
      $controllerProvider.register('ServerCtrl', ServerCtrl);

      socketStream = jasmine.createSpy('socketStream')
        .andCallFake(function (path) {
          if (path === '/notification')
            return (notificationStream = highland([{}]));
        });
      $provide.value('socketStream', socketStream);

      serverStreamsResolves = jasmine.createSpy('serverStreamsResolves');
      $provide.value('serverStreamsResolves', serverStreamsResolves);
      $provide.decorator('serverStreamsResolves', function ($q, $delegate) {
        return $delegate.andCallFake(function () {
          return $q.when('foo');
        });
      });

      authorization = {
        readEnabled: true,
        groupAllowed: fp.always(true)
      };
      $provide.value('authorization', authorization);
    }));

    var $routeSegment;

    beforeEach(inject(function ($location, _$routeSegment_, $templateCache, $rootScope, $compile) {
      $routeSegment = _$routeSegment_;

      $templateCache
        .put(
        'common/loading/assets/html/loading.html',
        '<div class="loading">Loading</div>'
      );

      $templateCache
        .put(
        'iml/app/assets/html/app.html',
        '<div class="app" app-view-segment="1"></div>'
      );
      $templateCache
        .put(
        'iml/server/assets/html/server.html',
        '<div class="server">Server</div>'
      );

      var scope = $rootScope.$new();

      $compile(el)(scope);
      $location.path('/configure/server');
      scope.$apply();
    }));

    it('should look at the server route segment', function () {
      expect($routeSegment.name).toBe('app.server');
    });
  });

  xdescribe('the server detail page', function () {
    var AppController, ServerDetailController,
      notificationStream, serverDetailResolves, authorization;

    beforeEach(module(function ($provide, $controllerProvider) {
      AppController = function AppController () {};
      $controllerProvider.register('AppCtrl', AppController);

      ServerDetailController = function ServerDetailController () {}
      $controllerProvider.register('ServerDetailController', ServerDetailController);

      socketStream = jasmine.createSpy('socketStream')
        .andCallFake(function (path) {
          if (path === '/notification')
            return (notificationStream = highland([{}]));
        });
      $provide.value('socketStream', socketStream);

      serverDetailResolves = jasmine.createSpy('serverDetailResolves');
      $provide.value('serverDetailResolves', serverDetailResolves);
      $provide.decorator('serverDetailResolves', function ($q, $delegate) {
        return $delegate.andCallFake(function () {
          return $q.when('foo');
        });
      });

      authorization = {
        readEnabled: true,
        groupAllowed: fp.always(true)
      };
      $provide.value('authorization', authorization);
    }));

    var $routeSegment;

    beforeEach(inject(function ($location, _$routeSegment_, $templateCache, $rootScope, $compile) {
      $routeSegment = _$routeSegment_;

      $templateCache
        .put(
        'common/loading/assets/html/loading.html',
        '<div class="loading">Loading</div>'
      );

      $templateCache
        .put(
        'iml/app/assets/html/app.html',
        '<div class="app" app-view-segment="1"></div>'
      );
      $templateCache
        .put(
        'iml/server/assets/html/server-detail.html',
        '<div class="server-detail">Server Detail</div>'
      );

      var scope = $rootScope.$new();

      $compile(el)(scope);
      $location.path('/configure/server/1');
      scope.$apply();
    }));

    it('should look at the server detail route segment', function () {
      expect($routeSegment.name).toBe('app.serverDetail');
    });

    it('should load the server detail controller', function () {
      expect(el.find('.server-detail').scope().serverDetail).toEqual(jasmine.any(Object));
    });
  });
});
