import * as fp from "@iml/fp";
import highland from "highland";
import angular from "../../../angular-mock-setup.js";

describe("server", () => {
  let $scope,
    pdshFilter,
    naturalSortFilter,
    server,
    $uibModal,
    serversStream,
    selectedServers,
    serverActions,
    jobMonitorStream,
    alertMonitorStream,
    lnetConfigurationStream,
    locksStream,
    locks$,
    openAddServerModal,
    openResult,
    localApply,
    serverController;
  let mockGetStore, mockGlobal;

  beforeEach(() => {
    mockGetStore = {
      dispatch: jest.fn()
    };
    jest.mock("../../../../source/iml/store/get-store.js", () => mockGetStore);

    mockGlobal = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    };
    jest.mock("../../../../source/iml/global.js", () => mockGlobal);

    const serverControllerModule = require("../../../../source/iml/server/server-controller.js");

    serverController = serverControllerModule.default;
  });

  beforeEach(
    angular.mock.inject(($rootScope, $controller, $q, propagateChange) => {
      $scope = $rootScope.$new();

      openResult = {
        result: {
          then: jest.fn()
        }
      };
      $uibModal = {
        open: jest.fn(() => openResult)
      };

      serversStream = highland();
      jest.spyOn(serversStream, "destroy");

      selectedServers = {
        servers: {},
        toggleType: jest.fn(),
        addNewServers: jest.fn()
      };

      serverActions = [
        {
          value: "Install Updates"
        }
      ];

      lnetConfigurationStream = highland();
      jest.spyOn(lnetConfigurationStream, "destroy");

      locks$ = highland();
      locksStream = jest.fn(() => locks$);
      locksStream.endBroadcast = jest.fn(() => locks$.end());

      jest.spyOn(locks$, "destroy");

      openAddServerModal = jest.fn(() => ({
        opened: {
          then: jest.fn()
        },
        result: {
          then: jest.fn()
        }
      }));

      pdshFilter = jest.fn();
      naturalSortFilter = jest.fn(fp.identity);

      jobMonitorStream = highland();
      jest.spyOn(jobMonitorStream, "destroy");
      alertMonitorStream = highland();
      jest.spyOn(alertMonitorStream, "destroy");

      localApply = jest.fn();

      $scope.$on = jest.fn();
      $scope.propagateChange = propagateChange;

      $controller(serverController, {
        $scope,
        $q,
        $uibModal,
        pdshFilter,
        naturalSortFilter,
        serverActions,
        selectedServers,
        streams: {
          serversStream,
          jobMonitorStream,
          alertMonitorStream,
          lnetConfigurationStream,
          locksStream
        },
        openAddServerModal,
        localApply
      });

      server = $scope.server;
    })
  );

  const expectedProperties = {
    maxSize: 10,
    itemsPerPage: 10,
    currentPage: 1,
    pdshFuzzy: false
  };

  Object.keys(expectedProperties).forEach(key => {
    describe("test initial values", () => {
      it("should have a " + key + " value of " + expectedProperties[key], () => {
        expect(server[key]).toEqual(expectedProperties[key]);
      });
    });
  });

  describe("verify streams are passed in", () => {
    it("should contain the job monitor spark", () => {
      expect(server.jobMonitorStream).toEqual(jobMonitorStream);
    });

    it("should contain the alert monitor stream", () => {
      expect(server.alertMonitorStream).toEqual(alertMonitorStream);
    });
  });

  it("should have a transform method", () => {
    expect(server.transform).toEqual(expect.any(Function));
  });

  it("should transform a stream", () => {
    const spy = jest.fn();

    const s = highland([
      [
        {
          host_id: 2
        },
        {
          host_id: 4
        }
      ]
    ]);

    server
      .transform(s, ["4"])
      .collect()
      .each(spy);

    expect(spy).toHaveBeenCalledWith([
      {
        host_id: 4
      }
    ]);
  });

  describe("table functionality", () => {
    describe("updating the expression", () => {
      beforeEach(() => {
        server.setItemsPerPage(10);
        server.currentPage = 5;
        server.pdshUpdate("expression", ["expression"], { expression: 1 });
      });

      it("should have populated hostnames", () => {
        expect(server.hostnames).toEqual(["expression"]);
      });
      it("should set the current page to 1", () => {
        expect(server.currentPage).toEqual(1);
      });
      it("should have populated the hostname hash", () => {
        expect(server.hostnamesHash).toEqual({ expression: 1 });
      });
    });

    it("should return the host name from getHostPath", () => {
      const hostname = server.getHostPath({ address: "hostname1.localdomain" });
      expect(hostname).toEqual("hostname1.localdomain");
    });

    it("should set the current page", () => {
      server.setPage(10);
      expect(server.currentPage).toEqual(10);
    });

    it("should close items per page", () => {
      server.closeItemsPerPage();
      expect(server.itemsPerPageIsOpen).toBe(false);
    });

    it("should have an ascending sorting class name", () => {
      server.inverse = true;
      expect(server.getSortClass()).toEqual("fa-sort-asc");
    });

    it("should return the correct items per page", () => {
      server.itemsPerPage = "6";
      expect(server.getItemsPerPage()).toEqual(6);
    });

    it("should have a descending sorting class name", () => {
      server.inverse = false;
      expect(server.getSortClass()).toEqual("fa-sort-desc");
    });

    describe("calling getTotalItems", () => {
      let result;
      beforeEach(() => {
        server.hostnamesHash = {
          hostname1: 1
        };
        server.hostnames = ["hostname1"];

        pdshFilter.mockReturnValue(["hostname1"]);
        result = server.getTotalItems();
      });

      it("should have one item in the result", () => {
        expect(result).toEqual(1);
      });

      it("should call the pdsh filter with appropriate args", () => {
        expect(pdshFilter).toHaveBeenCalledWith(server.servers, server.hostnamesHash, server.getHostPath, false);
      });
    });

    it("should set table editable", () => {
      server.setEditable(true);

      expect(server.editable).toBe(true);
    });

    it("should set the editable name", () => {
      server.setEditName("Install Updates");

      expect(server.editName).toEqual("Install Updates");
    });

    it("should open the addServer Dialog", () => {
      server.addServer();

      expect(openAddServerModal).toHaveBeenCalledTimes(1);
    });

    it("should get an action by value", () => {
      const result = server.getActionByValue("Install Updates");

      expect(result).toEqual({
        value: "Install Updates"
      });
    });

    describe("running an action", () => {
      let handler;

      beforeEach(() => {
        selectedServers.servers = {
          "https://hostname1.localdomain.com": true
        };

        pdshFilter.mockReturnValue([
          {
            fqdn: "https://hostname1.localdomain.com"
          }
        ]);

        server.runAction("Install Updates");

        handler = openResult.result.then.mock.calls[0][0];
      });

      it("should open a confirmation modal", () => {
        expect($uibModal.open).toHaveBeenCalledOnceWith({
          template: `<div class="modal-header">
  <h3 class="modal-title">Run {{confirmServerActionModal.actionName}}</h3>
</div>
<div class="modal-body">
  <h5>{{confirmServerActionModal.actionName}} will be run for the following servers:</h5>
  <ul class="well">
    <li ng-repeat="host in confirmServerActionModal.hosts">
      {{host.address}}
    </li>
  </ul>
</div>
<div class="modal-footer">
  <div class="btn-group" uib-dropdown>
    <button type="button" ng-click="confirmServerActionModal.go()" class="btn btn-success" ng-disabled="confirmServerActionModal.inProgress">
      Go <i class="fa" ng-class="{'fa-spinner fa-spin': confirmServerActionModal.inProgress, 'fa-check-circle-o': !confirmServerActionModal.inProgress }"></i>
    </button>
    <button type="button" class="btn btn-success dropdown-toggle" uib-dropdown-toggle ng-disabled="confirmServerActionModal.inProgress">
      <span class="caret"></span>
      <span class="sr-only">Split button</span>
    </button>
    <ul class="dropdown-menu" role="menu">
      <li><a ng-click="confirmServerActionModal.go(true)">Go and skip command view</a></li>
    </ul>
  </div>
  <button class="btn btn-danger" ng-disabled="confirmServerActionModal.inProgress" ng-click="$dismiss('cancel')">Cancel <i class="fa fa-times-circle-o"></i></button>
</div>`,
          controller: "ConfirmServerActionModalCtrl",
          windowClass: "confirm-server-action-modal",
          keyboard: false,
          backdrop: "static",
          resolve: {
            action: expect.any(Function),
            hosts: expect.any(Function)
          }
        });
      });

      it("should register a then listener", () => {
        expect(openResult.result.then).toHaveBeenCalledOnceWith(expect.any(Function));
      });

      it("should stop editing when confirmed", () => {
        handler();

        expect(server.editable).toBe(false);
      });

      describe("openCommandModal", () => {
        beforeEach(() => {
          handler({ foo: "bar" });
        });

        it("should launch the command modal", () => {
          expect(mockGetStore.dispatch).toHaveBeenCalledTimes(1);
          expect(mockGetStore.dispatch).toHaveBeenCalledWith({
            type: "SHOW_COMMAND_MODAL_ACTION",
            payload: [{ foo: "bar" }]
          });
        });
      });
    });

    describe("add server modal button", () => {
      let onOpenAddServerModal;
      beforeEach(() => {
        onOpenAddServerModal = mockGlobal.addEventListener.mock.calls[0][1];
      });

      it("should notify when it is clicked", () => {
        expect(mockGlobal.addEventListener).toHaveBeenCalledTimes(1);
        expect(mockGlobal.addEventListener).toHaveBeenCalledWith("open_add_server_modal", expect.any(Function));
      });

      describe("before clicking", () => {
        it("should show that the button was not clicked", () => {
          expect($scope.server.addServerClicked).toBeUndefined();
        });
      });

      describe("after clicking", () => {
        beforeEach(() => {
          onOpenAddServerModal({
            detail: {
              record: "record",
              step: "step"
            }
          });
        });

        it("should indicate that addServer was clicked", () => {
          expect($scope.server.addServerClicked).toBe(true);
        });
      });
    });
  });

  describe("locks stream data", () => {
    beforeEach(() => {
      locks$.write({
        "89:1": {
          action: "add",
          content_type_id: 89,
          description: "description",
          item_id: 1,
          job_id: 3,
          lock_type: "write"
        }
      });
    });

    it("should bind to the scope as data flows in", () => {
      expect(server.locks).toEqual({
        "89:1": {
          action: "add",
          content_type_id: 89,
          description: "description",
          item_id: 1,
          job_id: 3,
          lock_type: "write"
        }
      });
    });
  });

  describe("destroy", () => {
    beforeEach(() => {
      const handler = $scope.$on.mock.calls[0][1];
      handler();
    });

    it("should listen", () => {
      expect($scope.$on).toHaveBeenCalledWith("$destroy", expect.any(Function));
    });

    it("should destroy the job monitor", () => {
      expect(jobMonitorStream.destroy).toHaveBeenCalledTimes(1);
    });

    it("should destroy the alert monitor", () => {
      expect(alertMonitorStream.destroy).toHaveBeenCalledTimes(1);
    });

    it("should destroy the server stream", () => {
      expect(serversStream.destroy).toHaveBeenCalledTimes(1);
    });

    it("should destroy the LNet configuration stream", () => {
      expect(lnetConfigurationStream.destroy).toHaveBeenCalledTimes(1);
    });

    it("should end the locks broadcaster", () => {
      expect(locksStream.endBroadcast).toHaveBeenCalledTimes(1);
    });

    it("should destroy the locks stream", () => {
      expect(locks$.destroy).toHaveBeenCalledTimes(1);
    });

    it("should remopve the add server modal listener", () => {
      expect(mockGlobal.removeEventListener).toHaveBeenCalledTimes(1);
      expect(mockGlobal.removeEventListener).toHaveBeenCalledWith("open_add_server_modal", expect.any(Function));
    });
  });
});
