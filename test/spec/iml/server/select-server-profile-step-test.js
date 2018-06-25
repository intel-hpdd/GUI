import transformedHostProfileFixture from '../../../data-fixtures/transformed-host-profile-fixture.json';
import highland from 'highland';
import * as fp from '@iml/fp';
import angular from '../../../angular-mock-setup.js';

describe('select server profile', () => {
  let SelectServerProfileStepCtrl, selectServerProfileStep;

  beforeEach(
    angular.mock.module($provide => {
      $provide.value('OVERRIDE_BUTTON_TYPES', {
        OVERRIDE: 'override',
        PROCEED: 'proceed',
        PROCEED_SKIP: 'proceed and skip'
      });
    })
  );

  beforeEach(() => {
    const mod = require('../../../../source/iml/server/select-server-profile-step.js');
    SelectServerProfileStepCtrl = mod.SelectServerProfileStepCtrl;
    selectServerProfileStep = mod.selectServerProfileStep();
  });

  describe('select server profile step ctrl', () => {
    let $scope, $stepInstance, data, createHostProfiles, hostProfileStream, selectServerProfileStep;

    beforeEach(
      angular.mock.inject(($rootScope, $controller) => {
        $scope = $rootScope.$new();
        $stepInstance = {
          transition: jest.fn()
        };

        hostProfileStream = highland();
        jest.spyOn(hostProfileStream, 'destroy');

        createHostProfiles = jest.fn(() => highland());

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
      const instance = {
        pdsh: data.pdsh,
        transition: expect.any(Function),
        onSelected: expect.any(Function),
        getHostPath: expect.any(Function),
        pdshUpdate: expect.any(Function),
        close: expect.any(Function)
      };

      expect(selectServerProfileStep).toEqual(instance);
    });

    describe('transition', () => {
      let action;
      beforeEach(() => {
        action = 'previous';
        selectServerProfileStep.transition(action);
      });

      it('should end the hostProfileSpark', () => {
        expect(hostProfileStream.destroy).toHaveBeenCalledTimes(1);
      });

      it('should call transition on the step instance', () => {
        expect($stepInstance.transition).toHaveBeenCalledOnceWith(action, {
          data: data
        });
      });
    });

    describe('receiving data change on hostProfileSpark', () => {
      beforeEach(
        angular.mock.inject(() => {
          hostProfileStream.write(transformedHostProfileFixture);
        })
      );

      it('should set the profiles', () => {
        expect(selectServerProfileStep.profiles).toEqual(transformedHostProfileFixture);
      });

      describe('receiving more data', () => {
        beforeEach(() => {
          hostProfileStream.write(transformedHostProfileFixture);
        });

        it('should keep the same profile', () => {
          expect(selectServerProfileStep.profile).toEqual(transformedHostProfileFixture[0]);
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
          expect(selectServerProfileStep.profile).toEqual(transformedHostProfileFixture[0]);
        });
      });
    });

    describe('profile stream', () => {
      let hostProfileFixture;
      beforeEach(() => {
        hostProfileFixture = require('../../../data-fixtures/transformed-host-profile-fixture.json');
      });

      it('should display in the correct order', () => {
        const setValid = x => {
          x.invalid = false;
          return x;
        };
        const hostProfiles = fp.map(setValid)(hostProfileFixture);

        hostProfileStream.write(hostProfiles);
        expect(selectServerProfileStep.profiles).toMatchSnapshot();
      });

      describe('with invalid profiles', () => {
        it('should display in the correct order', () => {
          hostProfileStream.write(hostProfileFixture);
          expect(selectServerProfileStep.profiles).toMatchSnapshot();
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
        template: `<div class="modal-header">
  <button type="button" class="close" ng-click="selectServerProfile.close()" ng-disabled="selectServerProfile.disabled">
    <i class="fa fa-times"></i>
  </button>
  <h4 class="modal-title">Add Server - Add Server Profiles</h4>
  <span class="tooltip-container tooltip-hover">
    <i class="fa fa-question-circle">
      <iml-tooltip size="'large'" direction="bottom">
        <span>Select the server profile to be applied to all servers. Green squares represent servers that are compatible with the selected profile. Red squares represent servers that are incompatible with the selected server profile.</span>
      </iml-tooltip>
    </i>
  </span>
</div>
<div class="modal-body select-server-profile-step clearfix">
  <div ng-if="selectServerProfile.overridden" class="alert alert-danger" role="alert">
    You are about to configure one or more servers with an incompatible server profile.
    Configuring servers with incompatible server profiles is unsupported.
    Click <strong>proceed</strong> to continue.
  </div>
  <div>
    <label>Select Server Profile</label>
    <span class="tooltip-container tooltip-hover">
      <i class="fa fa-question-circle">
        <iml-tooltip size="'large'" direction="right">
          <span>Select a server profile to set on unconfigured servers.</span>
        </iml-tooltip>
      </i>
    </span>
  </div>
  <div class="btn-group fancy-select-box" uib-dropdown on-toggle="open = !open">
    <button type="button" class="form-control dropdown-toggle" ng-disabled="disabled" uib-dropdown-toggle>
      <span ng-if="selectServerProfile.profile.invalid" class="label label-danger">Incompatible</span>
      <span>{{ selectServerProfile.profile.uiName }}</span>
      <i class="fa" ng-class="{'fa-caret-down': open, 'fa-caret-up': !open}"></i>
    </button>
    <ul role="menu" uib-dropdown-menu>
      <li ng-repeat="profile in selectServerProfile.profiles track by profile.name" ng-click="selectServerProfile.onSelected(profile)">
        <a class="fancy-select-option">
          <span ng-if="profile.invalid" class="label label-danger">Incompatible</span>
          <span class="fancy-select-text">{{ profile.uiName }}</span>
        </a>
      </li>
    </ul>
  </div>

  <form class="filterServerForm" name="filterServerForm" novalidate>
    <div class="form-group pdsh-input" ng-class="{'has-error': filterServerForm.pdsh.$invalid, 'has-success': filterServerForm.pdsh.$valid}">
      <div>
        <label>Filter by Hostname / Hostlist Expression</label>
        <span class="tooltip-container tooltip-hover">
          <i class="fa fa-question-circle">
            <iml-tooltip size="'large'" direction="right">
              <span>Enter a hostname / hostlist expression to filter servers.</span>
            </iml-tooltip>
          </i>
        </span>
      </div>
      <pdsh pdsh-initial="selectServerProfile.pdsh" pdsh-change="selectServerProfile.pdshUpdate(pdsh, hostnames, hostnamesHash)"></pdsh>
    </div>
  </form>
  <div class="status-cell-container" ng-repeat="host in selectServerProfile.profile.hosts | pdsh:selectServerProfile.hostnamesHash:selectServerProfile.getHostPath track by host.address">
    <div ng-class="{invalid: host.invalid, valid: !host.invalid }"
    class="status-cell activate-popover tooltip-container tooltip-hover">
      <iml-tooltip size="'large'" direction="right">
        <span>Address: {{host.address}}</span>
      </iml-tooltip>
    </div>
    <iml-popover title="Status for {{ host.address }}" placement="bottom">
      <div ng-if="!host.invalid">
        <i class="fa fa-check-circle"></i> {{ host.uiName }} profile is compatible.
      </div>
      <div ng-if="host.invalid">
        <div class="callout callout-danger">
          <span>{{ host.address }}</span> incompatible with <span>{{ host.uiName }}</span> profile.
        </div>
        <h4>Reasons: </h4>
        <ul>
          <li ng-repeat="problem in host.problems track by problem.test">
            <i class="fa fa-times-circle"></i>
            <span ng-if="problem.error">There was an error: {{ problem.error }}.</span>
            <span ng-if="!problem.error">{{ problem.description }}.</span>
          </li>
        </ul>
      </div>
    </iml-popover>
  </div>
</div>
<div class="modal-footer">
  <button ng-disabled="selectServerProfile.disabled" ng-click="selectServerProfile.transition('previous')" class="btn btn-default"><i class="fa fa-long-arrow-left"></i> Previous</button>
  <override-button overridden="selectServerProfile.overridden" is-valid="!selectServerProfile.profile.invalid" on-change="selectServerProfile.transition(message)" is-disabled="selectServerProfile.disabled"></override-button>
</div>`,
        controller: 'SelectServerProfileStepCtrl as selectServerProfile',
        onEnter: expect.any(Function),
        transition: expect.any(Function)
      });
    });

    it('should transition to the server status step', () => {
      const steps = {
        serverStatusStep: {}
      };

      expect(selectServerProfileStep.transition(steps)).toEqual(steps.serverStatusStep);
    });

    describe('on enter', () => {
      let onEnter,
        data,
        createOrUpdateHostsStream,
        getHostProfiles,
        waitForCommandCompletion,
        waitForCommandCompletionInner,
        result,
        response,
        spy;

      beforeEach(async () => {
        data = {
          spring: jest.fn(),
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

        createOrUpdateHostsStream = jest.fn(() => highland([response]));

        waitForCommandCompletionInner = jest.fn(() => highland([]));
        waitForCommandCompletion = jest.fn(() => waitForCommandCompletionInner);

        getHostProfiles = jest.fn(() =>
          highland([
            {
              some: 'profiles'
            }
          ])
        );

        onEnter = selectServerProfileStep.onEnter;

        result = onEnter(data, createOrUpdateHostsStream, getHostProfiles, waitForCommandCompletion, true);

        spy = jest.fn();

        const stream = await result.hostProfileStream;
        stream.each(spy);
      });

      it('should create or update the hosts', () => {
        expect(createOrUpdateHostsStream).toHaveBeenCalledOnceWith(data.servers);
      });

      it('should pass commands to wait for command completion', () => {
        expect.assertions(2);

        const commands = fp.flow(
          x => x.objects,
          fp.map(x => x.command_and_host),
          fp.map(x => x.command),
          fp.filter(x => x)
        )(response);

        expect(waitForCommandCompletion).toHaveBeenCalledOnceWith(true);
        expect(waitForCommandCompletionInner).toHaveBeenCalledOnceWith(commands);
      });

      it('should call getHostProfiles', () => {
        const hosts = fp.map(x => x.command_and_host.host)(response.objects);

        expect(getHostProfiles).toHaveBeenCalledOnceWith(data.spring, hosts);
      });

      it('should return data and a hostProfileStream', () => {
        expect(result).toEqual({
          data: data,
          hostProfileStream: expect.any(Promise)
        });
      });

      it('should return the profiles', () => {
        expect(spy).toHaveBeenCalledOnceWith({ some: 'profiles' });
      });
    });
  });
});
