describe('server', function() {
  'use strict';

  var $scope, pdshParser, pdshFilter, naturalSortFilter,
    server, $modal, serversStream, openCommandModal,
    selectedServers, serverActions, jobMonitorStream,
    alertMonitorStream, lnetConfigurationStream, openAddServerModal,
    getCommandStream, overrideActionClick, corosyncConfigurationStream;

  beforeEach(module('server', 'command'));

  beforeEach(inject(function ($rootScope, $controller, $q) {
    $scope = $rootScope.$new();

    $modal = {
      open: jasmine.createSpy('open').andReturn({
        result: {
          then: jasmine.createSpy('then')
        }
      })
    };

    getCommandStream = jasmine.createSpy('getCommandStream')
      .andReturn(highland());
    spyOn(getCommandStream.plan(), 'destroy');

    serversStream = highland();
    spyOn(serversStream, 'destroy');

    selectedServers = {
      servers: {},
      toggleType: jasmine.createSpy('toggleType'),
      addNewServers: jasmine.createSpy('addNewServers')
    };

    serverActions = [{
      value: 'Install Updates'
    }];

    openCommandModal = jasmine.createSpy('openCommandModal')
      .andReturn({
        result: $q.when()
      });

    lnetConfigurationStream = highland();
    spyOn(lnetConfigurationStream, 'destroy');

    corosyncConfigurationStream = highland();
    spyOn(corosyncConfigurationStream, 'destroy');

    openAddServerModal = jasmine.createSpy('openAddServerModal').andReturn({
      opened: {
        then: jasmine.createSpy('then')
      },
      result: {
        then: jasmine.createSpy('then')
      }
    });

    pdshParser = jasmine.createSpy('pdshParser');
    pdshFilter = jasmine.createSpy('pdshFilter');
    naturalSortFilter = jasmine.createSpy('naturalSortFilter').andCallFake(_.identity);

    jobMonitorStream = highland();
    spyOn(jobMonitorStream, 'destroy');
    alertMonitorStream = highland();
    spyOn(alertMonitorStream, 'destroy');

    overrideActionClick = jasmine.createSpy('overrideActionClick');

    $scope.$on = jasmine.createSpy('$on');

    $controller('ServerCtrl', {
      $scope: $scope,
      $q: $q,
      $modal: $modal,
      pdshParser: pdshParser,
      pdshFilter: pdshFilter,
      naturalSortFilter: naturalSortFilter,
      serverActions: serverActions,
      selectedServers: selectedServers,
      openCommandModal: openCommandModal,
      streams: {
        serversStream: serversStream,
        jobMonitorStream: jobMonitorStream,
        alertMonitorStream: alertMonitorStream,
        lnetConfigurationStream: lnetConfigurationStream,
        corosyncConfigurationStream: corosyncConfigurationStream
      },
      openAddServerModal: openAddServerModal,
      getCommandStream: getCommandStream,
      overrideActionClick: overrideActionClick
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
    describe('test initial values', function() {
      it('should have a ' + key + ' value of ' + expectedProperties[key], function () {
        expect(server[key]).toEqual(expectedProperties[key]);
      });
    });
  });

  describe('verify streams are passed in', function () {
    it('should contain the job monitor spark', function () {
      expect(server.jobMonitorStream).toEqual(jobMonitorStream);
    });

    it('should contain the alert monitor stream', function () {
      expect(server.alertMonitorStream).toEqual(alertMonitorStream);
    });
  });

  describe('test table functionality', function () {
    describe('updating the expression', function () {
      beforeEach(function () {
        server.currentPage = 5;
        pdshParser.andReturn({expansion: ['expression1']});
        server.pdshUpdate('expression', ['expression'], {expression: 1});
      });

      it('should have populated hostnames', function () {
        expect(server.hostnames).toEqual(['expression']);
      });
      it('should set the current page to 1', function () {
        expect(server.currentPage).toEqual(1);
      });
      it('should have populated the hostname hash', function () {
        expect(server.hostnamesHash).toEqual({expression: 1});
      });
    });

    it('should return the host name from getHostPath', function () {
      var hostname = server.getHostPath({address: 'hostname1.localdomain'});
      expect(hostname).toEqual('hostname1.localdomain');
    });

    it('should set the current page', function () {
      server.setPage(10);
      expect(server.currentPage).toEqual(10);
    });

    it('should have an ascending sorting class name', function () {
      server.inverse = true;
      expect(server.getSortClass()).toEqual('fa-sort-asc');
    });

    it('should return the correct items per page', function () {
      server.itemsPerPage = '6';
      expect(server.getItemsPerPage()).toEqual(6);
    });

    it('should have a descending sorting class name', function () {
      server.inverse = false;
      expect(server.getSortClass()).toEqual('fa-sort-desc');
    });

    describe('calling getTotalItems', function () {
      var result;
      beforeEach(function () {
        server.hostnamesHash = {
          hostname1: 1
        };
        server.hostnames = ['hostname1'];

        pdshFilter.andReturn(['hostname1']);
        result = server.getTotalItems();
      });

      it('should have one item in the result', function () {
        expect(result).toEqual(1);
      });

      it('should call the pdsh filter with appropriate args', function () {
        expect(pdshFilter).toHaveBeenCalledWith(server.servers, server.hostnamesHash, server.getHostPath,
          false);
      });
    });

    it('should set table editable', function () {
      server.setEditable(true);

      expect(server.editable).toBe(true);
    });

    it('should set the editable name', function () {
      server.setEditName('Install Updates');

      expect(server.editName).toEqual('Install Updates');
    });

    it('should open the addServer Dialog', function () {
      server.addServer();

      expect(openAddServerModal).toHaveBeenCalledOnce();
    });

    it('should get an action by value', function () {
      var result = server.getActionByValue('Install Updates');

      expect(result).toEqual({
        value: 'Install Updates'
      });
    });

    describe('running an action', function () {
      var handler;

      beforeEach(function () {
        selectedServers.servers = {
          'https://hostname1.localdomain.com': true
        };

        pdshFilter.andReturn([{
          fqdn: 'https://hostname1.localdomain.com'
        }]);

        server.runAction('Install Updates');

        handler = $modal.open.plan().result.then.mostRecentCall.args[0];
      });

      it('should open a confirmation modal', function () {
        expect($modal.open).toHaveBeenCalledOnceWith({
          templateUrl: 'iml/server/assets/html/confirm-server-action-modal.html',
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

      it('should register a then listener', function () {
        expect($modal.open.plan().result.then).toHaveBeenCalledOnceWith(jasmine.any(Function));
      });

      it('should stop editing when confirmed', function () {
        handler();

        expect(server.editable).toBe(false);
      });

      describe('openCommandModal', function () {
        beforeEach(function () {
          handler({ foo: 'bar' });
        });

        it('should open the command modal with the spark', function () {
          expect(openCommandModal).toHaveBeenCalledOnceWith(getCommandStream.plan());
        });

        it('should call createCommandSpark', function () {
          expect(getCommandStream).toHaveBeenCalledWith([{ foo: 'bar' }]);
        });

        it('should end the spark after the modal closes', function () {
          openCommandModal.plan().result.then(function whenModalClosed () {
            expect(getCommandStream.plan().destroy).toHaveBeenCalled();
          });

          $scope.$digest();
        });
      });
    });
  });

  describe('destroy', function () {
    beforeEach(function () {
      var handler = $scope.$on.mostRecentCall.args[1];
      handler();
    });

    it('should listen', function () {
      expect($scope.$on).toHaveBeenCalledWith('$destroy', jasmine.any(Function));
    });

    it('should destroy the job monitor', function () {
      expect(jobMonitorStream.destroy).toHaveBeenCalledOnce();
    });

    it('should destroy the alert monitor', function () {
      expect(alertMonitorStream.destroy).toHaveBeenCalledOnce();
    });

    it('should destroy the server stream', function () {
      expect(serversStream.destroy).toHaveBeenCalledOnce();
    });

    it('should destroy the LNet configuration stream', function () {
      expect(lnetConfigurationStream.destroy).toHaveBeenCalledOnce();
    });
  });
});
