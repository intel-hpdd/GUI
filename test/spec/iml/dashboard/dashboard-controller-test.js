import highland from 'highland';

import dashboardModule from '../../../../source/iml/dashboard/dashboard-module';

describe('dashboard controller', () => {
  beforeEach(module(dashboardModule));

  var $scope, $location, $routeSegment,
    fsStream, hostStream, targetStream,
    $routeParams, dashboard;

  beforeEach(inject(function ($controller, $rootScope, addProperty) {
    fsStream = highland();
    spyOn(fsStream, 'destroy');
    hostStream = highland();
    spyOn(hostStream, 'destroy');
    targetStream = highland();
    spyOn(targetStream, 'destroy');

    $scope = $rootScope.$new();
    spyOn($rootScope, '$on').and.callThrough();

    $routeParams = {};
    $routeSegment = {
      $routeParams: $routeParams,
      contains: jasmine.createSpy('contains')
    };

    $location = {
      path: jasmine.createSpy('path')
    };

    dashboard = $controller('DashboardCtrl', {
      $scope: $scope,
      $routeParams: $routeParams,
      $location: $location,
      $routeSegment: $routeSegment,
      fsStream: fsStream.through(addProperty),
      hostStream: hostStream.through(addProperty),
      targetStream: targetStream.through(addProperty)
    });
  }));

  it('should have a fs property', function () {
    expect(dashboard.fs).toEqual({
      name: 'fs',
      selected: null,
      selectedTarget: null
    });
  });

  it('should have a host property', function () {
    expect(dashboard.host).toEqual({
      name: 'server',
      selected: null,
      selectedTarget: null
    });
  });

  it('should start on the fs type', function () {
    expect(dashboard.type).toEqual(dashboard.fs);
  });

  describe('item changed', function () {
    it('should set targets to null if no item is selected', function () {
      dashboard.itemChanged({ selected: null });

      expect(dashboard.targets).toBe(null);
    });

    it('should set targets to ones matching the current fs', function () {
      dashboard.fs.selected = {
        id: 5
      };

      targetStream.write({
        objects: [
          {
            filesystems: [
              { id: 5 },
              { id: 6 }
            ]
          },
          {
            filesystems: [
              { id: 6 },
              { id: 7 }
            ]
          },
          {
            filesystem_id: 5
          },
          {
            filesystem_id: 8
          }
        ]
      });

      dashboard.itemChanged(dashboard.fs);

      expect(dashboard.targets).toEqual([
        {
          filesystems: [
            { id: 5 },
            { id: 6 }
          ]
        },
        {
          filesystem_id: 5
        }
      ]);
    });

    it('should set targets to ones matching the current host', function () {
      dashboard.host.selected = {
        id: '4'
      };

      dashboard.type = dashboard.host;

      targetStream.write({
        objects: [
          {
            primary_server: '/api/host/3/',
            failover_servers: [
              '/api/host/1/',
              '/api/host/4/'
            ]
          },
          {
            primary_server: '/api/host/4/',
            failover_servers: [
              '/api/host/3/',
              '/api/host/2/'
            ]
          },
          {
            primary_server: '/api/host/7/'
          }
        ]
      });

      dashboard.itemChanged(dashboard.host);

      expect(dashboard.targets).toEqual([
        {
          primary_server: '/api/host/3/',
          failover_servers: [ '/api/host/1/', '/api/host/4/' ]
        },
        {
          primary_server: '/api/host/4/',
          failover_servers: [ '/api/host/3/', '/api/host/2/' ]
        }
      ]);
    });
  });

  it('should build a fs path', function () {
    dashboard.onFilterView({
      name: 'foo',
      selected: {
        id: '5'
      }
    });

    expect($location.path).toHaveBeenCalledOnceWith('dashboard/foo/5/');
  });

  it('should build a target and fs path', function () {
    dashboard.onFilterView({
      name: 'bar',
      selected: {
        id: 6
      },
      selectedTarget: {
        kind: 'foo',
        id: 7
      }
    });

    expect($location.path).toHaveBeenCalledOnceWith('dashboard/bar/6/foo/7/');
  });

  it('should set fileSystems on the dashboard', function () {
    fsStream.write([{ id: 3 }]);

    expect(dashboard.fileSystems).toEqual([{ id: 3 }]);
  });

  it('should set hosts on the dashboard', function () {
    hostStream.write({
      objects: [{ id: 4 }]
    });

    expect(dashboard.hosts).toEqual([{ id: 4 }]);
  });

  describe('on destroy', function () {
    beforeEach(function () {
      var handler = $scope.$on.calls.argsFor(0)[1];
      handler();
    });

    it('should destroy the fsStream', function () {
      expect(fsStream.destroy).toHaveBeenCalledOnce();
    });

    it('should destroy the hostStream', function () {
      expect(hostStream.destroy).toHaveBeenCalledOnce();
    });

    it('should destroy the targetStream', function () {
      expect(targetStream.destroy).toHaveBeenCalledOnce();
    });
  });

  describe('on route change success', function () {
    var handler;

    beforeEach(function () {
      handler = $scope.$root.$on.calls.mostRecent().args[1];
      $routeSegment.contains.and.returnValue(true);
    });

    it('should set fsData', function () {
      handler(null, {
        params: { fsId: '5' }
      });

      fsStream.write([{ id: '5' }]);

      expect(dashboard.fsData).toEqual({ id: '5' });
    });

    it('should set hostData', function () {
      handler(null, {
        params: { serverId: '6' }
      });

      hostStream.write({
        objects: [{ id: '6' }]
      });

      expect(dashboard.hostData).toEqual({ id: '6' });
    });

    it('should set target data', function () {
      handler(null, {
        params: { targetId: '8' }
      });

      targetStream.write({
        objects: [{ id: '8' }]
      });

      expect(dashboard.targetData).toEqual({ id: '8' });
    });
  });
});
