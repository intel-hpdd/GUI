import highland from "highland";
import broadcaster from "../../../../source/iml/broadcaster.js";
import dashboardController from "../../../../source/iml/dashboard/dashboard-controller.js";
import angular from "../../../angular-mock-setup.js";

describe("dashboard controller", () => {
  let $scope, $state, $stateParams, qsStream, qs$, fsStream, hostStream, targetStream, dashboard;

  beforeEach(
    angular.mock.inject(($rootScope, propagateChange) => {
      fsStream = highland();
      jest.spyOn(fsStream, "destroy");
      hostStream = highland();
      jest.spyOn(hostStream, "destroy");
      targetStream = highland();
      jest.spyOn(targetStream, "destroy");

      $scope = $rootScope.$new();
      jest.spyOn($rootScope, "$on");

      $stateParams = {};

      qs$ = highland();
      jest.spyOn(qs$, "destroy");
      qsStream = jest.fn(() => qs$);

      qs$.write({
        qs: ""
      });
      2;

      $state = {
        go: jest.fn()
      };

      dashboard = new dashboardController(
        qsStream,
        $scope,
        $state,
        $stateParams,
        broadcaster(fsStream),
        broadcaster(hostStream),
        broadcaster(targetStream),
        propagateChange
      );

      jest.useFakeTimers();
    })
  );

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it("should have a fs property", () => {
    expect(dashboard.fs).toEqual({
      name: "fs",
      selected: null,
      selectedTarget: null
    });
  });

  it("should have a host property", () => {
    expect(dashboard.host).toEqual({
      name: "server",
      selected: null,
      selectedTarget: null
    });
  });

  it("should start on the fs type", () => {
    expect(dashboard.type).toEqual(dashboard.fs);
  });

  it("should call qsStream", () => {
    expect(qsStream).toHaveBeenCalledOnceWith($stateParams, {
      to: expect.any(Function)
    });
  });

  describe("item changed", () => {
    it("should set targets to null if no item is selected", () => {
      dashboard.itemChanged({
        selected: null
      });

      expect(dashboard.targets).toBeNull();
    });

    it("should set targets to ones matching the current fs given an array", () => {
      dashboard.fs.selected = {
        id: 5
      };

      targetStream.write([
        {
          filesystems: [{ id: 5 }, { id: 6 }]
        },
        {
          filesystems: [{ id: 6 }, { id: 7 }]
        },
        {
          filesystem_id: 5
        },
        {
          filesystem_id: 8
        }
      ]);

      dashboard.itemChanged(dashboard.fs);

      expect(dashboard.targets).toEqual([
        {
          filesystems: [{ id: 5 }, { id: 6 }]
        },
        {
          filesystem_id: 5
        }
      ]);
    });

    it("should set targets to ones matching the current fs given an object", () => {
      dashboard.fs.selected = {
        id: 5
      };

      targetStream.write({
        1: {
          filesystems: [{ id: 5 }, { id: 6 }]
        },
        2: {
          filesystems: [{ id: 6 }, { id: 7 }]
        },
        3: {
          filesystem_id: 5
        },
        4: {
          filesystem_id: 8
        }
      });

      dashboard.itemChanged(dashboard.fs);

      expect(dashboard.targets).toEqual([
        {
          filesystems: [{ id: 5 }, { id: 6 }]
        },
        {
          filesystem_id: 5
        }
      ]);
    });

    it("should set targets to ones matching the current host given an array", () => {
      dashboard.host.selected = {
        id: "4"
      };

      dashboard.type = dashboard.host;

      targetStream.write([
        {
          primary_server: "/api/host/3/",
          failover_servers: ["/api/host/1/", "/api/host/4/"]
        },
        {
          primary_server: "/api/host/4/",
          failover_servers: ["/api/host/3/", "/api/host/2/"]
        },
        {
          primary_server: "/api/host/7/"
        }
      ]);

      dashboard.itemChanged(dashboard.host);

      expect(dashboard.targets).toEqual([
        {
          primary_server: "/api/host/3/",
          failover_servers: ["/api/host/1/", "/api/host/4/"]
        },
        {
          primary_server: "/api/host/4/",
          failover_servers: ["/api/host/3/", "/api/host/2/"]
        }
      ]);
    });
  });

  it("should set targets to ones matching the current host given an object", () => {
    dashboard.host.selected = {
      id: "4"
    };

    dashboard.type = dashboard.host;

    targetStream.write({
      1: {
        primary_server: "/api/host/3/",
        failover_servers: ["/api/host/1/", "/api/host/4/"]
      },
      2: {
        primary_server: "/api/host/4/",
        failover_servers: ["/api/host/3/", "/api/host/2/"]
      },
      3: {
        primary_server: "/api/host/7/"
      }
    });

    dashboard.itemChanged(dashboard.host);

    expect(dashboard.targets).toEqual([
      {
        primary_server: "/api/host/3/",
        failover_servers: ["/api/host/1/", "/api/host/4/"]
      },
      {
        primary_server: "/api/host/4/",
        failover_servers: ["/api/host/3/", "/api/host/2/"]
      }
    ]);
  });

  it("should build a fs path", () => {
    dashboard.onFilterView({
      name: "foo",
      selected: {
        id: "5"
      }
    });

    expect($state.go).toHaveBeenCalledOnceWith("app.dashboard.foo", {
      id: "5",
      resetState: true
    });
  });

  it("should build a target path", () => {
    dashboard.onFilterView({
      name: "bar",
      selected: {
        id: 6
      },
      selectedTarget: {
        kind: "foo",
        id: 7
      }
    });

    expect($state.go).toHaveBeenCalledOnceWith("app.dashboard.foo", {
      id: 7,
      resetState: true
    });
  });

  it("should set fileSystems on the dashboard", () => {
    fsStream.write([
      {
        id: 3
      }
    ]);

    expect(dashboard.fileSystems).toEqual([{ id: 3 }]);
  });

  it("should set hosts on the dashboard", () => {
    hostStream.write([
      {
        id: 4
      }
    ]);

    expect(dashboard.hosts).toEqual([{ id: 4 }]);
  });

  describe("on destroy", () => {
    beforeEach(() => {
      const handler = $scope.$on.mock.calls[0][1];
      handler();
    });

    it("should destroy the fsStream", () => {
      expect(fsStream.destroy).toHaveBeenCalled();
    });

    it("should destroy the hostStream", () => {
      expect(hostStream.destroy).toHaveBeenCalled();
    });

    it("should destroy the targetStream", () => {
      expect(targetStream.destroy).toHaveBeenCalled();
    });

    it("should destroy the qs$", () => {
      expect(qs$.destroy).toHaveBeenCalledTimes(1);
    });
  });
});
