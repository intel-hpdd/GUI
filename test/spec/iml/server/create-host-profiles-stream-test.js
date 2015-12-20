import angular from 'angular';
const {module, inject} = angular.mock;

describe('host profile then', function () {
  'use strict';

  beforeEach(module('server', 'dataFixtures'));

  describe('get host profiles', function () {
    var CACHE_INITIAL_DATA;

    beforeEach(module(function ($provide) {
      CACHE_INITIAL_DATA = {
        server_profile: [
          {
            default: false,
            initial_state: 'unconfigured',
            managed: false,
            name: 'default',
            resource_uri: '/api/server_profile/default/',
            ui_description: 'An unconfigured server.',
            ui_name: 'Unconfigured Server',
            user_selectable: false,
            worker: false
          },
          {
            default: false,
            initial_state: 'configured',
            managed: true,
            name: 'base_managed',
            resource_uri: '/api/server_profile/base_managed/',
            ui_description: 'A storage server suitable for creating new HA-enabled filesystem targets',
            ui_name: 'Managed Storage Server',
            user_selectable: true,
            worker: false
          },
          {
            default: false,
            initial_state: 'configured',
            managed: false,
            name: 'base_monitored',
            resource_uri: '/api/server_profile/base_monitored/',
            ui_description: 'A storage server suitable for monitoring only',
            ui_name: 'Monitored Storage Server',
            user_selectable: true,
            worker: false
          },
          {
            default: false,
            initial_state: 'configured',
            managed: true,
            name: 'posix_copytool_worker',
            resource_uri: '/api/server_profile/posix_copytool_worker/',
            ui_description: 'An HSM agent node using the POSIX copytool',
            ui_name: 'POSIX HSM Agent Node',
            user_selectable: true,
            worker: true
          },
          {
            default: false,
            initial_state: 'configured',
            managed: true,
            name: 'robinhood_server',
            resource_uri: '/api/server_profile/robinhood_server/',
            ui_description: 'A server running the Robinhood Policy Engine',
            ui_name: 'Robinhood Policy Engine Server',
            user_selectable: true,
            worker: true
          }
        ]
      };
      $provide.constant('CACHE_INITIAL_DATA', CACHE_INITIAL_DATA);
    }));

    var spring, hostProfilesStream;

    beforeEach(inject(function (getHostProfiles) {
      spring = jasmine.createSpy('spring')
        .andReturn(highland());

      hostProfilesStream = getHostProfiles(spring, [{id: 1}, {id: 2}]);
    }));

    it('should retrieve profiles for given hosts', function () {
      expect(spring).toHaveBeenCalledOnceWith('hostProfile', '/host_profile', {
        qs: {
          id__in: [1, 2],
          server_profile__user_selectable: true,
          limit: 0
        }
      });
    });

    describe('response handling', function () {
      var response;

      beforeEach(function () {
        response = {
          meta: {
            limit: 20,
            next: null,
            offset: 0,
            previous: null,
            total_count: 2
          },
          objects: [
            {
              error: null,
              host_profiles: {
                address: 'lotus-34vm5.iml.intel.com',
                host: 28,
                profiles: {
                  base_managed: [
                    {
                      description: 'ZFS is installed but is unsupported by the Managed Storage Server profile',
                      error: 'Result unavailable while host agent starts',
                      pass: false,
                      test: 'zfs_installed == False'
                    }
                  ],
                  base_monitored: [],
                  posix_copytool_worker: [],
                  robinhood_server: []
                },
                resource_uri: '/api/host_profile/28/'
              },
              traceback: null
            },
            {
              error: null,
              host_profiles: {
                address: 'lotus-34vm6.iml.intel.com',
                host: 29,
                profiles: {
                  base_managed: [
                    {
                      description: 'ZFS is installed but is unsupported by the Managed Storage Server profile',
                      error: 'Result unavailable while host agent starts',
                      pass: false,
                      test: 'zfs_installed == False'
                    }
                  ],
                  base_monitored: [],
                  posix_copytool_worker: [],
                  robinhood_server: []
                },
                resource_uri: '/api/host_profile/29/'
              },
              traceback: null
            }
          ]
        };

        spring.plan().write(response);
      });

      it('should transform into top level profiles', inject(function (transformedHostProfileFixture) {
        var spy = jasmine.createSpy('spy');

        hostProfilesStream.each(spy);

        expect(spy).toHaveBeenCalledOnceWith(transformedHostProfileFixture);
      }));
    });
  });

  describe('create host profiles', function () {
    var socketStream, streams, waitForCommandCompletion;

    beforeEach(module(function ($provide) {
      waitForCommandCompletion = jasmine.createSpy('waitForCommandCompletion')
        .andReturn(jasmine.createSpy('innerWait').andReturn(highland()));
      $provide.value('waitForCommandCompletion', waitForCommandCompletion);

      streams = [];

      socketStream = jasmine
        .createSpy('socketStream')
        .andCallFake(function () {
          var stream = highland();
          streams.push(stream);

          return stream;
        });
      $provide.value('socketStream', socketStream);
    }));

    var profile, transformedHostProfileFixture, spy;

    beforeEach(inject(function ($q, createHostProfiles, _transformedHostProfileFixture_) {
      transformedHostProfileFixture = _transformedHostProfileFixture_;
      profile = transformedHostProfileFixture[0];

      spy = jasmine.createSpy('spy');
      createHostProfiles(profile, false)
        .each(spy);
    }));

    it('should fetch the hosts', function () {
      expect(socketStream).toHaveBeenCalledOnceWith('/host', {
        jsonMask: 'objects(id,address,server_profile)',
        qs: { limit: 0 }
      }, true);
    });

    describe('posting profiles', function () {
      beforeEach(function () {
        streams[0].write({
          objects: [
            {
              address: profile.hosts[0].address,
              id: 1,
              server_profile: {
                initial_state: 'unconfigured'
              }
            },
            {
              address: profile.hosts[1].address,
              id: 2,
              server_profile: {
                initial_state: 'deployed'
              }
            }
          ]
        });

        streams[1].write({
          objects: [
            { commands: [{ command: 1 }] }
          ]
        });
      });

      it('should post unconfigured host profiles', function () {
        expect(socketStream).toHaveBeenCalledOnceWith('/host_profile', {
          method: 'post',
          json: {
            objects: [
              {
                host: 1,
                profile: profile.name
              }
            ]
          }
        }, true);
      });

      it('should pass in the commands to wait for command completion', function () {
        expect(waitForCommandCompletion.plan()).toHaveBeenCalledOnceWith([
          {
            command: { command: 1 }
          }
        ]);
      });
    });
  });
});
