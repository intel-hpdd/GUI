import highland from 'highland';
import broadcaster from '../../../../source/iml/broadcaster.js';
import dashboardModule from '../../../../source/iml/dashboard/dashboard-module';

describe('dashboard controller', () => {
  beforeEach(module(dashboardModule));

  var $scope, $location, $routeSegment,
    fsStream, hostStream, targetStream,
    $routeParams, dashboard;

  beforeEach(inject(function ($controller, $rootScope) {
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
      $scope,
      $routeParams,
      $location,
      $routeSegment,
      fsStream: broadcaster(fsStream),
      hostStream: broadcaster(hostStream),
      targetStream: broadcaster(targetStream)
    });

    jasmine.clock().install();
  }));

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should have a fs property', () => {
    expect(dashboard.fs)
      .toEqual({
        name: 'fs',
        selected: null,
        selectedTarget: null
      });
  });

  it('should have a host property', () => {
    expect(dashboard.host)
      .toEqual({
        name: 'server',
        selected: null,
        selectedTarget: null
      });
  });

  it('should start on the fs type', () => {
    expect(dashboard.type)
      .toEqual(dashboard.fs);
  });

  describe('item changed', () => {
    it('should set targets to null if no item is selected', () => {
      dashboard
        .itemChanged({
          selected: null
        });

      expect(dashboard.targets)
        .toBeNull();
    });

    it('should set targets to ones matching the current fs', () => {
      dashboard.fs.selected = {
        id: 5
      };

      targetStream.write([
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
      ]);

      dashboard
        .itemChanged(dashboard.fs);

      expect(dashboard.targets)
        .toEqual([
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

    it('should set targets to ones matching the current host', () => {
      dashboard.host.selected = {
        id: '4'
      };

      dashboard.type = dashboard.host;

      targetStream.write([
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
      ]);

      dashboard
        .itemChanged(dashboard.host);

      expect(dashboard.targets)
        .toEqual([
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

  it('should build a fs path', () => {
    dashboard.onFilterView({
      name: 'foo',
      selected: {
        id: '5'
      }
    });

    expect($location.path)
      .toHaveBeenCalledOnceWith('dashboard/foo/5/');
  });

  it('should build a target and fs path', () => {
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

    expect($location.path)
      .toHaveBeenCalledOnceWith('dashboard/bar/6/foo/7/');
  });

  it('should set fileSystems on the dashboard', () => {
    fsStream
      .write([
        {
          id: 3
        }
      ]);

    expect(dashboard.fileSystems)
      .toEqual([{ id: 3 }]);
  });

  it('should set hosts on the dashboard', () => {
    hostStream
      .write([
        {
          id: 4
        }
      ]);

    expect(dashboard.hosts)
      .toEqual([{ id: 4 }]);
  });

  describe('on destroy', () => {
    beforeEach(() => {
      var handler = $scope.$on.calls.argsFor(0)[1];
      handler();
    });

    it('should destroy the fsStream', () => {
      expect(fsStream.destroy).toHaveBeenCalled();
    });

    it('should destroy the hostStream', () => {
      expect(hostStream.destroy).toHaveBeenCalled();
    });

    it('should destroy the targetStream', () => {
      expect(targetStream.destroy).toHaveBeenCalled();
    });
  });

  describe('on route change success', () => {
    var handler;

    beforeEach(() => {
      handler = $scope.$root.$on.calls.mostRecent().args[1];
      $routeSegment.contains.and.returnValue(true);
    });

    it('should set fsData', () => {
      handler(null, {
        params: {
          fsId: '5'
        }
      });

      fsStream
        .write([
          {
            id: '5'
          }
        ]);

      jasmine.clock().tick();

      expect(dashboard.fsData)
        .toEqual({
          id: '5'
        });
    });

    it('should set hostData', () => {
      handler(null, {
        params: {
          serverId: '6'
        }
      });

      hostStream.write([
        {
          id: '6'
        }
      ]);

      jasmine.clock().tick();

      expect(dashboard.hostData)
        .toEqual({
          id: '6'
        });
    });

    it('should set target data', () => {
      handler(null, {
        params: {
          targetId: '8'
        }
      });

      targetStream.write([
        {
          id: '8'
        }
      ]);

      jasmine.clock().tick();

      expect(dashboard.targetData)
        .toEqual({
          id: '8'
        });
    });
  });
});
