import * as fp from '@mfl/fp';
import highland from 'highland';
import angular from '../../../angular-mock-setup.js';

describe('server', () => {
  let $scope,
    pdshFilter,
    naturalSortFilter,
    server,
    $uibModal,
    serversStream,
    openCommandModal,
    selectedServers,
    serverActions,
    jobMonitorStream,
    alertMonitorStream,
    lnetConfigurationStream,
    openAddServerModal,
    commandStream,
    openResult,
    commandModalResult,
    mockGetCommandStream,
    overrideActionClick,
    serverController;

  beforeEach(() => {
    commandStream = highland();

    mockGetCommandStream = jest.fn(() => commandStream);

    jest.mock(
      '../../../../source/iml/command/get-command-stream.js',
      () => mockGetCommandStream
    );

    const serverControllerModule = require('../../../../source/iml/server/server-controller.js');

    serverController = serverControllerModule.default;
  });

  beforeEach(
    angular.mock.inject(($rootScope, $controller, $q) => {
      $scope = $rootScope.$new();

      openResult = {
        result: {
          then: jest.fn()
        }
      };
      $uibModal = {
        open: jest.fn(() => openResult)
      };

      jest.spyOn(commandStream, 'destroy');

      serversStream = highland();
      jest.spyOn(serversStream, 'destroy');

      selectedServers = {
        servers: {},
        toggleType: jest.fn(),
        addNewServers: jest.fn()
      };

      serverActions = [
        {
          value: 'Install Updates'
        }
      ];

      commandModalResult = {
        result: $q.when()
      };

      openCommandModal = jest.fn(() => commandModalResult);

      lnetConfigurationStream = highland();
      jest.spyOn(lnetConfigurationStream, 'destroy');

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
      jest.spyOn(jobMonitorStream, 'destroy');
      alertMonitorStream = highland();
      jest.spyOn(alertMonitorStream, 'destroy');

      overrideActionClick = jest.fn();

      $scope.$on = jest.fn();

      $controller(serverController, {
        $scope,
        $q,
        $uibModal,
        pdshFilter,
        naturalSortFilter,
        serverActions,
        selectedServers,
        openCommandModal,
        streams: {
          serversStream,
          jobMonitorStream,
          alertMonitorStream,
          lnetConfigurationStream
        },
        openAddServerModal,
        mockGetCommandStream,
        overrideActionClick
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
    describe('test initial values', () => {
      it(
        'should have a ' + key + ' value of ' + expectedProperties[key],
        () => {
          expect(server[key]).toEqual(expectedProperties[key]);
        }
      );
    });
  });

  describe('verify streams are passed in', () => {
    it('should contain the job monitor spark', () => {
      expect(server.jobMonitorStream).toEqual(jobMonitorStream);
    });

    it('should contain the alert monitor stream', () => {
      expect(server.alertMonitorStream).toEqual(alertMonitorStream);
    });
  });

  it('should have a transform method', () => {
    expect(server.transform).toEqual(expect.any(Function));
  });

  it('should transform a stream', () => {
    const spy = jest.fn();

    const s = highland([
      [
        {
          host: '/api/host/2/'
        },
        {
          host: '/api/host/4/'
        }
      ]
    ]);

    server.transform(s, ['/api/host/4/']).collect().each(spy);

    expect(spy).toHaveBeenCalledWith([
      {
        host: '/api/host/4/'
      }
    ]);
  });

  describe('table functionality', () => {
    describe('updating the expression', () => {
      beforeEach(() => {
        server.currentPage = 5;
        server.pdshUpdate('expression', ['expression'], { expression: 1 });
      });

      it('should have populated hostnames', () => {
        expect(server.hostnames).toEqual(['expression']);
      });
      it('should set the current page to 1', () => {
        expect(server.currentPage).toEqual(1);
      });
      it('should have populated the hostname hash', () => {
        expect(server.hostnamesHash).toEqual({ expression: 1 });
      });
    });

    it('should return the host name from getHostPath', () => {
      const hostname = server.getHostPath({ address: 'hostname1.localdomain' });
      expect(hostname).toEqual('hostname1.localdomain');
    });

    it('should set the current page', () => {
      server.setPage(10);
      expect(server.currentPage).toEqual(10);
    });

    it('should have an ascending sorting class name', () => {
      server.inverse = true;
      expect(server.getSortClass()).toEqual('fa-sort-asc');
    });

    it('should return the correct items per page', () => {
      server.itemsPerPage = '6';
      expect(server.getItemsPerPage()).toEqual(6);
    });

    it('should have a descending sorting class name', () => {
      server.inverse = false;
      expect(server.getSortClass()).toEqual('fa-sort-desc');
    });

    describe('calling getTotalItems', () => {
      let result;
      beforeEach(() => {
        server.hostnamesHash = {
          hostname1: 1
        };
        server.hostnames = ['hostname1'];

        pdshFilter.mockReturnValue(['hostname1']);
        result = server.getTotalItems();
      });

      it('should have one item in the result', () => {
        expect(result).toEqual(1);
      });

      it('should call the pdsh filter with appropriate args', () => {
        expect(pdshFilter).toHaveBeenCalledWith(
          server.servers,
          server.hostnamesHash,
          server.getHostPath,
          false
        );
      });
    });

    it('should set table editable', () => {
      server.setEditable(true);

      expect(server.editable).toBe(true);
    });

    it('should set the editable name', () => {
      server.setEditName('Install Updates');

      expect(server.editName).toEqual('Install Updates');
    });

    it('should open the addServer Dialog', () => {
      server.addServer();

      expect(openAddServerModal).toHaveBeenCalledTimes(1);
    });

    it('should get an action by value', () => {
      const result = server.getActionByValue('Install Updates');

      expect(result).toEqual({
        value: 'Install Updates'
      });
    });

    describe('running an action', () => {
      let handler;

      beforeEach(() => {
        selectedServers.servers = {
          'https://hostname1.localdomain.com': true
        };

        pdshFilter.mockReturnValue([
          {
            fqdn: 'https://hostname1.localdomain.com'
          }
        ]);

        server.runAction('Install Updates');

        handler = openResult.result.then.mock.calls[0][0];
      });

      it('should open a confirmation modal', () => {
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
          controller: 'ConfirmServerActionModalCtrl',
          windowClass: 'confirm-server-action-modal',
          keyboard: false,
          backdrop: 'static',
          resolve: {
            action: expect.any(Function),
            hosts: expect.any(Function)
          }
        });
      });

      it('should register a then listener', () => {
        expect(openResult.result.then).toHaveBeenCalledOnceWith(
          expect.any(Function)
        );
      });

      it('should stop editing when confirmed', () => {
        handler();

        expect(server.editable).toBe(false);
      });

      describe('openCommandModal', () => {
        beforeEach(() => {
          handler({ foo: 'bar' });
        });

        it('should open the command modal with the spark', () => {
          expect(openCommandModal).toHaveBeenCalledOnceWith(commandStream);
        });

        it('should call createCommandSpark', () => {
          expect(mockGetCommandStream).toHaveBeenCalledWith([{ foo: 'bar' }]);
        });

        it('should end the spark after the modal closes', () => {
          commandModalResult.result.then(() => {
            expect(commandStream.destroy).toHaveBeenCalled();
          });

          $scope.$digest();
        });
      });
    });
  });

  describe('destroy', () => {
    beforeEach(() => {
      const handler = $scope.$on.mock.calls[0][1];
      handler();
    });

    it('should listen', () => {
      expect($scope.$on).toHaveBeenCalledWith('$destroy', expect.any(Function));
    });

    it('should destroy the job monitor', () => {
      expect(jobMonitorStream.destroy).toHaveBeenCalledTimes(1);
    });

    it('should destroy the alert monitor', () => {
      expect(alertMonitorStream.destroy).toHaveBeenCalledTimes(1);
    });

    it('should destroy the server stream', () => {
      expect(serversStream.destroy).toHaveBeenCalledTimes(1);
    });

    it('should destroy the LNet configuration stream', () => {
      expect(lnetConfigurationStream.destroy).toHaveBeenCalledTimes(1);
    });
  });
});
