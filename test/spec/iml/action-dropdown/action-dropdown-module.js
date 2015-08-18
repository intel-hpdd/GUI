describe('action dropdown', function () {
  'use strict';

  beforeEach(module('action-dropdown-module'));

  describe('ordering groups', function () {
    beforeEach(module('dataFixtures'));

    var groupActionsFilter, groupActionsFixtures;

    beforeEach(inject(function ($filter, _groupActionsFixtures_) {
      groupActionsFilter = $filter('groupActions');
      groupActionsFixtures = _groupActionsFixtures_;
    }));

    it('should work', function () {
      groupActionsFixtures.forEach(function testItem (item) {
        var result = groupActionsFilter(item.in);

        expect(result).toEqual(item.out);
      });
    });
  });

  describe('directive', function () {
    var element, handleAction, openCommandModal, $scope, node, getCommandStream;

    beforeEach(module('templates', function ($provide) {
      handleAction = jasmine.createSpy('handleAction')
        .andReturn(highland());

      $provide.value('handleAction', handleAction);

      var commandStream = highland();
      spyOn(commandStream, 'destroy');

      getCommandStream = jasmine.createSpy('getCommandStream')
        .andReturn(commandStream);

      $provide.value('getCommandStream', getCommandStream);

      openCommandModal = jasmine.createSpy('openCommandModal')
        .andReturn({
          resultStream: highland([''])
        });
      $provide.value('openCommandModal', openCommandModal);
    }));

    describe('override click', function () {
      var markup;

      beforeEach(function () {
        markup = '<action-dropdown record="host" override-click="overrideClick(record, action)">' +
        '</action-dropdown>';
      });

      describe('fallback', function () {
        beforeEach(inject(function ($rootScope, $compile) {
          compileElement($rootScope, $compile, markup, highland(['fallback']));
        }));

        it('should not disable the action drop down', function () {
          expect($scope.$$childHead.actionDropdown.disabled).toEqual(false);
        });

        describe('has data to open modal', function () {
          beforeEach(function () {
            node.find('li a').eq(0).trigger('click');
            handleAction.plan().write({ command: 'command' });
            $scope.$apply();
          });

          it('should call overrideClick', function () {
            expect($scope.overrideClick).toHaveBeenCalledWith($scope.host, $scope.host.available_actions[0]);
          });

          it('should open the command modal', function () {
            expect(openCommandModal).toHaveBeenCalledOnceWith(getCommandStream.plan());
          });

          it('should end the stream after the modal closes', function () {
            expect(getCommandStream.plan().destroy).toHaveBeenCalledOnce();
          });

          it('should have its flag set to false', function () {
            expect($scope.$$childHead.actionDropdown.confirmOpen).toEqual(false);
          });
        });

        describe('no data so modal does not open', function () {
          beforeEach(function () {
            node.find('li a').eq(0).trigger('click');
            handleAction.plan().write(undefined);
            handleAction.plan().write(highland.nil);
            $scope.$apply();
          });

          it('should call overrideClick', function () {
            expect($scope.overrideClick).toHaveBeenCalledWith($scope.host, $scope.host.available_actions[0]);
          });

          it('should not open the command modal', function () {
            expect(openCommandModal).not.toHaveBeenCalled();
          });

          it('should have its flag set to false', function () {
            expect($scope.$$childHead.actionDropdown.confirmOpen).toEqual(false);
          });
        });
      });

      describe('no fallback', function () {
        beforeEach(inject(function ($rootScope, $compile) {
          compileElement($rootScope, $compile, markup, highland(['no fallback']));
          node.find('li a').eq(0).trigger('click');
          handleAction.plan().write(undefined);
          handleAction.plan().write(highland.nil);
          $scope.$apply();
        }));

        it('should not disable the action drop down', function () {
          expect($scope.$$childHead.actionDropdown.disabled).toEqual(false);
        });

        it('should call overrideClick', function () {
          expect($scope.overrideClick).toHaveBeenCalledWith($scope.host, $scope.host.available_actions[0]);
        });

        it('should not open the command modal', function () {
          expect(openCommandModal).not.toHaveBeenCalled();
        });

        it('should have its flag set to false', function () {
          expect($scope.$$childHead.actionDropdown.confirmOpen).toEqual(false);
        });
      });
    });

    describe('without override click', function () {
      var markup;
      beforeEach(inject(function ($rootScope, $compile) {
        markup = '<action-dropdown record="host"></action-dropdown>';
        compileElement($rootScope, $compile, markup);
      }));

      it('should not disable the action drop down', function () {
        expect($scope.$$childHead.actionDropdown.disabled).toEqual(false);
      });

      describe('has data to open modal', function () {
        beforeEach(function () {
          node.find('li a').eq(0).trigger('click');
          handleAction.plan().write({ command: 'command' });
          handleAction.plan().write(highland.nil);

          $scope.$apply();
        });

        it('should not have overrideClick on the scope', function () {
          expect($scope.overrideClick).toEqual(undefined);
        });

        it('should open the command modal', function () {
          expect(openCommandModal).toHaveBeenCalledOnceWith(getCommandStream.plan());
        });

        it('should call getCommandStream', function () {
          expect(getCommandStream).toHaveBeenCalledOnceWith(['command']);
        });

        it('should end the spark after the modal closes', function () {
          expect(getCommandStream.plan().destroy).toHaveBeenCalledOnce();
        });

        it('should have its flag set to false', function () {
          expect($scope.$$childHead.actionDropdown.confirmOpen).toEqual(false);
        });
      });

      describe('no data so modal does not open', function () {
        beforeEach(function () {
          node.find('li a').eq(0).trigger('click');
          handleAction.plan().write(undefined);
          handleAction.plan().write(highland.nil);
          $scope.$apply();
        });

        it('should not have overrideClick on the scope', function () {
          expect($scope.overrideClick).toEqual(undefined);
        });

        it('should not open the command modal', function () {
          expect(openCommandModal).not.toHaveBeenCalled();
        });

        it('should have its flag set to false', function () {
          expect($scope.$$childHead.actionDropdown.confirmOpen).toEqual(false);
        });
      });
    });

    function compileElement($rootScope, $compile, markup, overrideClickReturn) {
      element = angular.element(markup);

      $scope = $rootScope.$new();

      $scope.host = {
        address: 'storage0.localdomain',
        available_actions: [
          {
            display_group: 1,
            display_order: 20,
            long_description: 'Setup this host',
            state: 'configured',
            verb: 'Setup server',
            last: true
          },
          {
            display_group: 4,
            display_order: 130,
            long_description: 'Remove this unconfigured server.',
            state: 'removed',
            verb: 'Remove',
            last: true
          },
          {
            args: {
              host_id: 20
            },
            class_name: 'ForceRemoveHostJob',
            confirmation: 'WARNING This command is destructive. ' +
            ' This command should only be performed\nwhen the Remove ' +
            'command has been unsuccessful. This command will remove this server from the\nIntel® Manager for Lustre ' +
            'configuration, but Intel® Manager for Lustre software will not be removed\nfrom this server.  All ' +
            'targets that depend on this server will also be removed without any attempt to\nunconfigure them. To ' +
            'completely remove the Intel® Manager for Lustre software from this server\n(allowing it to be added to ' +
            'another Lustre file system) you must first contact technical support.\nYou should only perform this ' +
            'command if this server is permanently unavailable, or has never been\nsuccessfully deployed using ' +
            'Intel® Manager for Lustre software.',
            display_group: 5,
            display_order: 140,
            long_description: '<b> WARNING: This command is destructive.</b> This command should only be performed ' +
            'when the Remove command has been unsuccessful. This command will remove this server from the Intel® ' +
            'Manager for Lustre configuration, but Intel Manager for Lustre software will not be removed from this ' +
            'server.  All targets that depend on this server will also be removed without any attempt to unconfigure ' +
            'them. To completely remove the Intel® Manager for Lustre software from this server (allowing it to be ' +
            'added to another Lustre file system) you must first contact technical support. <b>You should only ' +
            'perform this command if this server is permanently unavailable, or has never been successfully deployed ' +
            'using Intel® Manager for Lustre software.</b>',
            verb: 'Force Remove'
          }
        ],
        available_jobs: [
          {
            args: {
              host_id: 20
            },
            class_name: 'ForceRemoveHostJob',
            confirmation: 'WARNING This command is destructive. ' +
            ' This command should only be performed\nwhen the Remove ' +
            'command has been unsuccessful. This command will remove this server from the\nIntel® Manager for ' +
            'Lustre configuration, but Intel® Manager for Lustre software will not be removed\nfrom this server.  ' +
            'All targets that depend on this server will also be removed without any attempt to\nunconfigure them. ' +
            'To completely remove the Intel® Manager for Lustre software from this server\n(allowing it to be added ' +
            'to another Lustre file system) you must first contact technical support.\nYou should only perform this ' +
            'command if this server is permanently unavailable, or has never been\nsuccessfully deployed using ' +
            'Intel® Manager for Lustre software.',
            display_group: 5,
            display_order: 140,
            long_description: '<b> WARNING: This command is destructive.</b> This command should only be performed ' +
            'when the Remove command has been unsuccessful. This command will remove this server from the Intel® ' +
            'Manager for Lustre configuration, but Intel Manager for Lustre software will not be removed from this ' +
            'server.  All targets that depend on this server will also be removed without any attempt to unconfigure ' +
            'them. To completely remove the Intel® Manager for Lustre software from this server (allowing it to be ' +
            'added to another Lustre file system) you must first contact technical support. <b>You should only ' +
            'perform this command if this server is permanently unavailable, or has never been successfully ' +
            'deployed using Intel® Manager for Lustre software.</b>',
            verb: 'Force Remove'
          }
        ],
        available_transitions: [
          {
            display_group: 4,
            display_order: 130,
            long_description: 'Remove this unconfigured server.',
            state: 'removed',
            verb: 'Remove'
          },
          {
            display_group: 1,
            display_order: 20,
            long_description: 'Setup this host',
            state: 'configured',
            verb: 'Setup server'
          }
        ],
        boot_time: '2014-09-11T10:08:12+00:00',
        client_mounts: [],
        content_type_id: 31,
        corosync_reported_up: false,
        fqdn: 'storage0.localdomain',
        id: '20',
        immutable_state: true,
        install_method: 'id_password_root',
        label: 'storage0',
        locks: {
          read: [],
          write: []
        },
        member_of_active_filesystem: false,
        needs_fence_reconfiguration: false,
        needs_update: false,
        nids: [],
        nodename: 'storage0.localdomain',
        private_key: null,
        private_key_passphrase: null,
        properties: '{}',
        resource_uri: '/api/host/20/',
        root_pw: null,
        server_profile: {
          default: false,
          initial_state: 'unconfigured',
          managed: false,
          name: 'default',
          resource_uri: '/api/server_profile/default/',
          ui_description: 'An unconfigured server',
          ui_name: 'Unconfigured Server',
          user_selectable: false,
          worker: false
        },
        state: 'unconfigured',
        state_modified_at: '2014-09-11T20:09:29.268719+00:00',
        version: 1410466175.022611
      };

      if (overrideClickReturn)
        $scope.overrideClick = jasmine.createSpy('overrideClick').andReturn(overrideClickReturn);

      node = $compile(element)($scope);

      $scope.$digest();
    }
  });
});
