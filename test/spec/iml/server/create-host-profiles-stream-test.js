import angular from '../../../angular-mock-setup.js';
import transformedHostProfileFixture from '../../../data-fixtures/transformed-host-profile-fixture.json';

import highland from 'highland';
import * as fp from '@iml/fp';

describe('host profile then', () => {
  let mockSocketStream,
    streams,
    getHostProfilesFactory,
    createHostProfilesFactory;

  beforeEach(() => {
    jest.useFakeTimers();

    mockSocketStream = jest.fn(() => {
      const stream = highland();
      streams.push(stream);

      return stream;
    });

    jest.mock(
      '../../../../source/iml/socket/socket-stream.js',
      () => mockSocketStream
    );

    ({
      getHostProfilesFactory,
      createHostProfilesFactory
    } = require('../../../../source/iml/server/create-host-profiles-stream.js'));
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  describe('get host profiles', () => {
    let CACHE_INITIAL_DATA;

    beforeEach(
      angular.mock.module($provide => {
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
              ui_description:
                'A storage server suitable for creating new HA-enabled filesystem targets',
              ui_name: 'Managed Storage Server',
              user_selectable: true,
              worker: false
            },
            {
              default: false,
              initial_state: 'configured',
              managed: true,
              name: 'base_managed_rh7',
              resource_uri: '/api/server_profile/base_managed_rh7/',
              ui_description:
                'A storage server suitable for creating new HA-enabled filesystem targets on RH 7.2',
              ui_name: 'Managed Storage Server For EL7.2',
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

        $provide.factory('getHostProfiles', getHostProfilesFactory);
        $provide.factory('createHostProfiles', createHostProfilesFactory);
      })
    );

    let spring, hostProfilesStream, springStream;

    beforeEach(
      angular.mock.inject(getHostProfiles => {
        springStream = highland();
        spring = jest.fn(() => springStream);

        hostProfilesStream = getHostProfiles(spring, [{ id: 1 }, { id: 2 }]);
      })
    );

    it('should retrieve profiles for given hosts', () => {
      expect(spring).toHaveBeenCalledOnceWith('hostProfile', '/host_profile', {
        qs: {
          id__in: [1, 2],
          server_profile__user_selectable: true,
          limit: 0
        }
      });
    });

    describe('response handling', () => {
      let response, spy;

      beforeEach(() => {
        spy = jest.fn();

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
                profiles_valid: true,
                profiles: {
                  base_managed: [
                    {
                      description:
                        'ZFS is installed but is unsupported by the Managed Storage Server profile',
                      error: 'Result unavailable while host agent starts',
                      pass: false,
                      test: 'zfs_installed == False'
                    }
                  ],
                  base_managed_rh7: [
                    {
                      description:
                        'The profile is designed for version 7 of EL',
                      error: '',
                      pass: false,
                      test: 'distro_version < 8 and distro_version >= 7'
                    },
                    {
                      description:
                        'ZFS is installed but is unsupported by the Managed Storage Server profile',
                      error: '',
                      pass: true,
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
                profiles_valid: true,
                profiles: {
                  base_managed: [
                    {
                      description:
                        'ZFS is installed but is unsupported by the Managed Storage Server profile',
                      error: 'Result unavailable while host agent starts',
                      pass: false,
                      test: 'zfs_installed == False'
                    }
                  ],
                  base_managed_rh7: [
                    {
                      description:
                        'The profile is designed for version 7 of EL',
                      error: '',
                      pass: false,
                      test: 'distro_version < 8 and distro_version >= 7'
                    },
                    {
                      description:
                        'ZFS is installed but is unsupported by the Managed Storage Server profile',
                      error: '',
                      pass: true,
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
      });

      describe('with valid profiles', () => {
        it('should transform into top level profiles', () => {
          springStream.write(response);
          hostProfilesStream.each(spy);

          expect(spy).toHaveBeenCalledOnceWith(transformedHostProfileFixture);
        });
      });

      describe('with invalid profiles', () => {
        it('should not pass values down the stream', () => {
          const profilesLens = fp.compose(
            fp.lensProp('objects'),
            fp.mapped,
            fp.compose(
              fp.lensProp('host_profiles'),
              fp.lensProp('profiles_valid')
            )
          );

          response = fp.set(profilesLens)(false)(response);

          springStream.write(response);
          hostProfilesStream.each(spy);

          expect(spy).not.toHaveBeenCalled();
        });
      });

      describe('with profiles_valid missing', () => {
        it('should not pass values down the stream', () => {
          response.objects = response.objects.map(x => {
            delete x.host_profiles.profiles_valid;
            return x;
          });

          springStream.write(response);
          hostProfilesStream.each(spy);

          expect(spy).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('create host profiles', () => {
    let profile, spy, waitForCommandCompletion;

    beforeEach(() => {
      streams = [];

      const mod = require('../../../../source/iml/server/create-host-profiles-stream.js');

      waitForCommandCompletion = jest.fn(() => highland());

      const createHostProfiles = mod.createHostProfilesFactory(
        waitForCommandCompletion
      );
      profile = transformedHostProfileFixture[0];

      spy = jest.fn();
      createHostProfiles(profile, false).each(spy);
    });

    it('should fetch the hosts', () => {
      expect(mockSocketStream).toHaveBeenCalledOnceWith(
        '/host',
        {
          jsonMask: 'objects(id,address,server_profile)',
          qs: { limit: 0 }
        },
        true
      );
    });

    describe('posting profiles', () => {
      beforeEach(() => {
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
          objects: [{ commands: [{ command: 1 }] }]
        });
      });

      it('should post unconfigured host profiles', () => {
        jest.runAllTimers();
        expect(mockSocketStream).toHaveBeenCalledOnceWith(
          '/host_profile',
          {
            method: 'post',
            json: {
              objects: [
                {
                  host: 1,
                  profile: profile.name
                }
              ]
            }
          },
          true
        );
      });

      it('should pass in the commands to wait for command completion', () => {
        jest.runAllTimers();
        expect(waitForCommandCompletion).toHaveBeenCalledOnceWith(false, [
          {
            command: 1
          }
        ]);
      });
    });
  });
});
