import serverModule from '../../../../source/iml/server/server-module';

import λ from 'highland';
import {identity} from 'intel-fp';

describe('server', () => {
  var $scope, pdshFilter, naturalSortFilter,
    server, $uibModal, serversStream, openCommandModal,
    selectedServers, serverActions, jobMonitorStream,
    alertMonitorStream, lnetConfigurationStream, openAddServerModal,
    commandStream, openResult, commandModalResult,
    getCommandStream, overrideActionClick;

  beforeEach(module(serverModule));

  beforeEach(inject(($rootScope, $controller, $q) => {
    $scope = $rootScope.$new();

    openResult = {
      result: {
        then: jasmine.createSpy('then')
      }
    };
    $uibModal = {
      open: jasmine.createSpy('open').and.returnValue(openResult)
    };

    commandStream = λ();

    getCommandStream = jasmine.createSpy('getCommandStream')
      .and.returnValue(commandStream);
    spyOn(commandStream, 'destroy');

    serversStream = λ();
    spyOn(serversStream, 'destroy');

    selectedServers = {
      servers: {},
      toggleType: jasmine.createSpy('toggleType'),
      addNewServers: jasmine.createSpy('addNewServers')
    };

    serverActions = [{
      value: 'Install Updates'
    }
    ];

    commandModalResult = {
      result: $q.when()
    };

    openCommandModal = jasmine.createSpy('openCommandModal')
      .and.returnValue(commandModalResult);

    lnetConfigurationStream = λ();
    spyOn(lnetConfigurationStream, 'destroy');

    openAddServerModal = jasmine.createSpy('openAddServerModal').and.returnValue({
      opened: {
        then: jasmine.createSpy('then')
      },
      result: {
        then: jasmine.createSpy('then')
      }
    });

    pdshFilter = jasmine.createSpy('pdshFilter');
    naturalSortFilter = jasmine.createSpy('naturalSortFilter')
      .and.callFake(identity);

    jobMonitorStream = λ();
    spyOn(jobMonitorStream, 'destroy');
    alertMonitorStream = λ();
    spyOn(alertMonitorStream, 'destroy');

    overrideActionClick = jasmine.createSpy('overrideActionClick');

    $scope.$on = jasmine.createSpy('$on');

    $controller('ServerCtrl', {
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
      getCommandStream,
      overrideActionClick
    });

    server = $scope.server;
  }));

  var expectedProperties = {
    maxSize: 10,
    itemsPerPage: 10,
    currentPage: 1,
    pdshFuzzy: false
  };

  Object.keys(expectedProperties).forEach(function verifyScopeValue (key) {
    describe('test initial values', () => {
      it('should have a ' + key + ' value of ' + expectedProperties[key], () => {
        expect(server[key]).toEqual(expectedProperties[key]);
      });
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
    expect(server.transform).toEqual(jasmine.any(Function));
  });

  it('should transform a stream', () => {
    var spy = jasmine.createSpy('spy');

    var s = λ([[
      {
        host: '/api/host/2/'
      },
      {
        host: '/api/host/4/'
      }
    ]
    ]);

    server.transform(s, ['/api/host/4/'])
      .collect()
      .each(spy);

    expect(spy).toHaveBeenCalledOnceWith([
      {
        host: '/api/host/4/'
      }
    ]);
  });

  describe('test table functionality', () => {
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
      var hostname = server.getHostPath({ address: 'hostname1.localdomain' });
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
      var result;
      beforeEach(() => {
        server.hostnamesHash = {
          hostname1: 1
        };
        server.hostnames = ['hostname1'];

        pdshFilter.and.returnValue(['hostname1']);
        result = server.getTotalItems();
      });

      it('should have one item in the result', () => {
        expect(result).toEqual(1);
      });

      it('should call the pdsh filter with appropriate args', () => {
        expect(pdshFilter).toHaveBeenCalledWith(server.servers, server.hostnamesHash, server.getHostPath,
          false);
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

      expect(openAddServerModal).toHaveBeenCalledOnce();
    });

    it('should get an action by value', () => {
      var result = server.getActionByValue('Install Updates');

      expect(result).toEqual({
        value: 'Install Updates'
      });
    });

    describe('running an action', () => {
      var handler;

      beforeEach(() => {
        selectedServers.servers = {
          'https://hostname1.localdomain.com': true
        };

        pdshFilter.and.returnValue([{
          fqdn: 'https://hostname1.localdomain.com'
        }
        ]);

        server.runAction('Install Updates');

        handler = openResult.result.then.calls.mostRecent().args[0];
      });

      it('should open a confirmation modal', () => {
        expect($uibModal.open).toHaveBeenCalledOnceWith({
          templateUrl: '/static/chroma_ui/source/iml/server/assets/html/confirm-server-action-modal.js',
          controller: 'ConfirmServerActionModalCtrl',
          windowClass: 'confirm-server-action-modal',
          keyboard: false,
          backdrop: 'static',
          resolve: {
            action: jasmine.any(Function),
            hosts: jasmine.any(Function)
          }
        });
      });

      it('should register a then listener', () => {
        expect(openResult.result.then).toHaveBeenCalledOnceWith(jasmine.any(Function));
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
          expect(getCommandStream).toHaveBeenCalledWith([{ foo: 'bar' }]);
        });

        it('should end the spark after the modal closes', () => {
          commandModalResult.result.then(function whenModalClosed () {
            expect(commandStream.destroy).toHaveBeenCalled();
          });

          $scope.$digest();
        });
      });
    });
  });

  describe('destroy', () => {
    beforeEach(() => {
      var handler = $scope.$on.calls.mostRecent().args[1];
      handler();
    });

    it('should listen', () => {
      expect($scope.$on).toHaveBeenCalledWith('$destroy', jasmine.any(Function));
    });

    it('should destroy the job monitor', () => {
      expect(jobMonitorStream.destroy).toHaveBeenCalledOnce();
    });

    it('should destroy the alert monitor', () => {
      expect(alertMonitorStream.destroy).toHaveBeenCalledOnce();
    });

    it('should destroy the server stream', () => {
      expect(serversStream.destroy).toHaveBeenCalledOnce();
    });

    it('should destroy the LNet configuration stream', () => {
      expect(lnetConfigurationStream.destroy).toHaveBeenCalledOnce();
    });
  });
});