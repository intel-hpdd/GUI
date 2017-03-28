import serverModule from '../../../../source/iml/server/server-module';
import transformedHostProfileFixture
  from '../../../data-fixtures/transformed-host-profile-fixture.json!json';
import highland from 'highland';
import * as fp from 'intel-fp';

import { mock, resetAll } from '../../../system-mock.js';

describe('select server profile', () => {
  let SelectServerProfileStepCtrl, selectServerProfileStep;

  beforeEach(module(serverModule));

  beforeEachAsync(async function() {
    const mod = await mock('source/iml/server/select-server-profile-step.js', {
      'source/iml/server/assets/html/select-server-profile-step.html!text': {
        default: 'serverProfileStepTemplate'
      }
    });

    SelectServerProfileStepCtrl = mod.SelectServerProfileStepCtrl;
    selectServerProfileStep = mod.selectServerProfileStep();
  });

  afterEach(resetAll);

  describe('select server profile step ctrl', () => {
    let $scope,
      $stepInstance,
      data,
      createHostProfiles,
      hostProfileStream,
      selectServerProfileStep;

    beforeEach(
      inject(($rootScope, $controller) => {
        $scope = $rootScope.$new();
        $stepInstance = {
          transition: jasmine.createSpy('transition')
        };

        hostProfileStream = highland();
        spyOn(hostProfileStream, 'destroy');

        createHostProfiles = jasmine
          .createSpy('createHostProfiles')
          .and.returnValue(highland());

        data = { pdsh: 'storage0.localdomain' };

        selectServerProfileStep = $controller(SelectServerProfileStepCtrl, {
          $scope,
          $stepInstance,
          data,
          hostProfileStream,
          createHostProfiles
        });
      })
    );

    it('should setup the controller', () => {
      const instance = window.extendWithConstructor(
        SelectServerProfileStepCtrl,
        {
          pdsh: data.pdsh,
          transition: jasmine.any(Function),
          onSelected: jasmine.any(Function),
          getHostPath: jasmine.any(Function),
          pdshUpdate: jasmine.any(Function),
          close: jasmine.any(Function)
        }
      );

      expect(selectServerProfileStep).toEqual(instance);
    });

    describe('transition', () => {
      let action;
      beforeEach(() => {
        action = 'previous';
        selectServerProfileStep.transition(action);
      });

      it('should end the hostProfileSpark', () => {
        expect(hostProfileStream.destroy).toHaveBeenCalledOnce();
      });

      it('should call transition on the step instance', () => {
        expect($stepInstance.transition).toHaveBeenCalledOnceWith(action, {
          data: data
        });
      });
    });

    describe('receiving data change on hostProfileSpark', () => {
      beforeEach(
        inject(() => {
          hostProfileStream.write(transformedHostProfileFixture);
        })
      );

      it('should set the profiles', () => {
        expect(selectServerProfileStep.profiles).toEqual(
          transformedHostProfileFixture
        );
      });

      describe('receiving more data', () => {
        beforeEach(() => {
          hostProfileStream.write(transformedHostProfileFixture);
        });

        it('should keep the same profile', () => {
          expect(selectServerProfileStep.profile).toEqual(
            transformedHostProfileFixture[0]
          );
        });
      });

      describe('onSelected', () => {
        beforeEach(() => {
          selectServerProfileStep.onSelected(transformedHostProfileFixture[0]);
        });

        it('should set overridden to false', () => {
          expect(selectServerProfileStep.overridden).toEqual(false);
        });

        it('should set the profile on the scope', () => {
          expect(selectServerProfileStep.profile).toEqual(
            transformedHostProfileFixture[0]
          );
        });
      });
    });

    describe('get host path', () => {
      let item;
      beforeEach(() => {
        item = {
          address: 'address'
        };
      });

      it('should retrieve the host address', () => {
        expect(selectServerProfileStep.getHostPath(item)).toEqual(item.address);
      });
    });

    describe('pdsh update', () => {
      let pdsh, hostnames, hostnamesHash;
      beforeEach(() => {
        pdsh = 'test[001-002].localdomain';
        hostnames = ['test001.localdomain', 'test002.localdomain'];
        hostnamesHash = {
          'test001.localdomain': 1,
          'test002.localdomain': 1
        };
      });

      beforeEach(() => {
        selectServerProfileStep.pdshUpdate(pdsh, hostnames, hostnamesHash);
      });

      it('should have the hostnamesHash', () => {
        expect(selectServerProfileStep.hostnamesHash).toEqual(hostnamesHash);
      });
    });
  });

  describe('selectServerProfileStep', () => {
    it('should contain the appropriate properties', () => {
      expect(selectServerProfileStep).toEqual({
        template: 'serverProfileStepTemplate',
        controller: 'SelectServerProfileStepCtrl as selectServerProfile',
        onEnter: jasmine.any(Function),
        transition: jasmine.any(Function)
      });
    });

    it('should transition to the server status step', () => {
      const steps = {
        serverStatusStep: {}
      };

      expect(selectServerProfileStep.transition(steps)).toEqual(
        steps.serverStatusStep
      );
    });

    describe('on enter', () => {
      let onEnter,
        data,
        createOrUpdateHostsStream,
        getHostProfiles,
        waitForCommandCompletion,
        result,
        response,
        spy;

      beforeEachAsync(async function() {
        data = {
          spring: jasmine.createSpy('spring'),
          servers: [],
          serverSpark: {}
        };

        response = {
          objects: [
            {
              command_and_host: {
                command: {
                  cancelled: false,
                  complete: false,
                  created_at: '2014-12-10T17:11:00.852148+00:00',
                  dismissed: false,
                  errored: false,
                  id: '390',
                  jobs: ['/api/job/390/'],
                  logs: '',
                  message: 'Setting up host lotus-34vm5.iml.intel.com',
                  resource_uri: '/api/command/390/'
                },
                host: {
                  address: 'lotus-34vm5.iml.intel.com',
                  available_actions: [],
                  available_jobs: [],
                  available_transitions: [],
                  boot_time: null,
                  client_mounts: [],
                  content_type_id: 35,
                  corosync_reported_up: false,
                  fqdn: 'lotus-34vm5.iml.intel.com',
                  id: '32',
                  immutable_state: true,
                  install_method: 'existing_keys_choice',
                  label: 'lotus-34vm5.iml.intel.com',
                  locks: {
                    read: [],
                    write: [390]
                  },
                  member_of_active_filesystem: false,
                  needs_fence_reconfiguration: false,
                  needs_update: false,
                  nids: [],
                  nodename: 'lotus-34vm5',
                  private_key: null,
                  private_key_passphrase: null,
                  properties: '{}',
                  resource_uri: '/api/host/32/',
                  root_pw: null,
                  server_profile: {
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
                  state: 'undeployed',
                  state_modified_at: '2014-12-10T17:11:00.845748+00:00',
                  version: null
                }
              },
              error: null,
              traceback: null
            },
            {
              command_and_host: {
                command: {
                  cancelled: false,
                  complete: false,
                  created_at: '2014-12-10T17:11:03.280882+00:00',
                  dismissed: false,
                  errored: false,
                  id: '391',
                  jobs: ['/api/job/391/'],
                  logs: '',
                  message: 'Setting up host lotus-34vm6.iml.intel.com',
                  resource_uri: '/api/command/391/'
                },
                host: {
                  address: 'lotus-34vm6.iml.intel.com',
                  available_actions: [],
                  available_jobs: [],
                  available_transitions: [],
                  boot_time: null,
                  client_mounts: [],
                  content_type_id: 35,
                  corosync_reported_up: false,
                  fqdn: 'lotus-34vm6.iml.intel.com',
                  id: '33',
                  immutable_state: true,
                  install_method: 'existing_keys_choice',
                  label: 'lotus-34vm6.iml.intel.com',
                  locks: {
                    read: [],
                    write: [391]
                  },
                  member_of_active_filesystem: false,
                  needs_fence_reconfiguration: false,
                  needs_update: false,
                  nids: [],
                  nodename: 'lotus-34vm6',
                  private_key: null,
                  private_key_passphrase: null,
                  properties: '{}',
                  resource_uri: '/api/host/33/',
                  root_pw: null,
                  server_profile: {
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
                  state: 'undeployed',
                  state_modified_at: '2014-12-10T17:11:03.273059+00:00',
                  version: null
                }
              },
              error: null,
              traceback: null
            },
            {
              command_and_host: {
                command: false,
                host: {
                  address: 'lotus-34vm7.iml.intel.com',
                  available_actions: [],
                  available_jobs: [],
                  available_transitions: [],
                  boot_time: null,
                  client_mounts: [],
                  content_type_id: 35,
                  corosync_reported_up: false,
                  fqdn: 'lotus-34vm7.iml.intel.com',
                  id: '33',
                  immutable_state: true,
                  install_method: 'existing_keys_choice',
                  label: 'lotus-34vm7.iml.intel.com',
                  locks: {
                    read: [],
                    write: [391]
                  },
                  member_of_active_filesystem: false,
                  needs_fence_reconfiguration: false,
                  needs_update: false,
                  nids: [],
                  nodename: 'lotus-34vm7',
                  private_key: null,
                  private_key_passphrase: null,
                  properties: '{}',
                  resource_uri: '/api/host/34/',
                  root_pw: null,
                  server_profile: {
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
                  state: 'undeployed',
                  state_modified_at: '2014-12-10T17:11:03.273059+00:00',
                  version: null
                }
              },
              error: null,
              traceback: null
            }
          ]
        };

        createOrUpdateHostsStream = jasmine
          .createSpy('createOrUpdateHostsStream')
          .and.returnValue(highland([response]));

        waitForCommandCompletion = jasmine
          .createSpy('waitForCommandCompletion')
          .and.callFake(val => highland([val]));

        getHostProfiles = jasmine.createSpy('getHostProfiles').and.returnValue(
          highland([
            {
              some: 'profiles'
            }
          ])
        );

        onEnter = selectServerProfileStep.onEnter;

        result = onEnter(
          data,
          createOrUpdateHostsStream,
          getHostProfiles,
          waitForCommandCompletion,
          true
        );

        spy = jasmine.createSpy('spy');

        const stream = await result.hostProfileStream;
        stream.each(spy);
      });

      it('should create or update the hosts', () => {
        expect(createOrUpdateHostsStream).toHaveBeenCalledOnceWith(
          data.servers
        );
      });

      it('should pass commands to wait for command completion', () => {
        const commands = fp.flow(
          x => x.objects,
          fp.map(x => x.command_and_host),
          fp.map(x => x.command),
          fp.filter(x => x)
        )(response);

        expect(waitForCommandCompletion).toHaveBeenCalledOnceWith(
          true,
          commands
        );
      });

      it('should call getHostProfiles', () => {
        const hosts = fp.map(x => x.command_and_host.host, response.objects);

        expect(getHostProfiles).toHaveBeenCalledOnceWith(data.spring, hosts);
      });

      it('should return data and a hostProfileStream', () => {
        expect(result).toEqual({
          data: data,
          hostProfileStream: jasmine.any(Promise)
        });
      });

      it('should return the profiles', () => {
        expect(spy).toHaveBeenCalledOnceWith({ some: 'profiles' });
      });
    });
  });
});
