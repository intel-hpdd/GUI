import {
  ADD_SERVER_ITEMS,
  default as serverReducer
} from '../../../../source/iml/server/server-reducer.js';

describe('server reducer', () => {
  const hosts = [{
    address: 'lotus-35vm15.lotus.hpdd.lab.intel.com',
    available_actions: [{
      display_group: 1,
      display_order: 20,
      long_description: 'Install packages on this server',
      state: 'packages_installed',
      verb: 'Continue Server Configuration'
    }, {
      display_group: 4,
      display_order: 130,
      long_description: 'Remove this unconfigured server.',
      state: 'removed',
      verb: 'Remove'
    }, {
      args: {
        host_id: 1
      },
      class_name: 'ForceRemoveHostJob',
      confirmation: 'WARNING This command is destructive. This command should only be performed\nwhen the Remove \
        command has been unsuccessful. This command will remove this server from the\nIntel® Manager for Lustre \
        configuration, but Intel® Manager for Lustre software will not be removed\nfrom this server.  All targets that \
        depend on this server will also be removed without any attempt to\nunconfigure them. To completely remove the \
        Intel® Manager for Lustre software from this server\n(allowing it to be added to another Lustre file system) \
        you must first contact technical support.\nYou should only perform this command if this server is permanently \
        unavailable, or has never been\nsuccessfully deployed using Intel® Manager for Lustre software.',
      display_group: 5,
      display_order: 140,
      long_description: '<b> WARNING: This command is destructive.</b> This command should only be performed when \
        the Remove command has been unsuccessful. This command will remove this server from the Intel® Manager for \
        Lustre configuration, but Intel Manager for Lustre software will not be removed from this server.  All targets \
        that depend on this server will also be removed without any attempt to unconfigure them. To completely remove \
        the Intel® Manager for Lustre software from this server (allowing it to be added to another Lustre file \
          system) you must first contact technical support. <b>You should only perform this command if this server is \
          permanently unavailable, or has never been successfully deployed using Intel® Manager for Lustre software.\
          </b>',
      verb: 'Force Remove'
    }],
    available_jobs: [{
      args: {
        host_id: 1
      },
      class_name: 'ForceRemoveHostJob',
      confirmation: 'WARNING This command is destructive. This command should only be performed\nwhen the Remove \
        command has been unsuccessful. This command will remove this server from the\nIntel® Manager for Lustre \
        configuration, but Intel® Manager for Lustre software will not be removed\nfrom this server.  All targets that \
        depend on this server will also be removed without any attempt to\nunconfigure them. To completely remove the \
        Intel® Manager for Lustre software from this server\n(allowing it to be added to another Lustre file system) \
        you must first contact technical support.\nYou should only perform this command if this server is permanently \
        unavailable, or has never been\nsuccessfully deployed using Intel® Manager for Lustre software.',
      display_group: 5,
      display_order: 140,
      long_description: '<b> WARNING: This command is destructive.</b> This command should only be performed when \
        the Remove command has been unsuccessful. This command will remove this server from the Intel® Manager for \
        Lustre configuration, but Intel Manager for Lustre software will not be removed from this server.  All targets \
        that depend on this server will also be removed without any attempt to unconfigure them. To completely remove \
        the Intel® Manager for Lustre software from this server (allowing it to be added to another Lustre file \
          system) you must first contact technical support. <b>You should only perform this command if this server is \
          permanently unavailable, or has never been successfully deployed using Intel® Manager for Lustre software.\
          </b>',
      verb: 'Force Remove'
    }],
    available_transitions: [{
      display_group: 4,
      display_order: 130,
      long_description: 'Remove this unconfigured server.',
      state: 'removed',
      verb: 'Remove'
    }, {
      display_group: 1,
      display_order: 20,
      long_description: 'Install packages on this server',
      state: 'packages_installed',
      verb: 'Continue Server Configuration'
    }],
    boot_time: '2016-03-28T13:56:17+00:00',
    client_mounts: [],
    content_type_id: 72,
    corosync_configuration: '/api/corosync_configuration/1/',
    fqdn: 'lotus-35vm15.lotus.hpdd.lab.intel.com',
    id: '1',
    immutable_state: true,
    install_method: 'existing_keys_choice',
    label: 'lotus-35vm15.lotus.hpdd.lab.intel.com',
    lnet_configuration: '/api/lnet_configuration/1/',
    locks: {
      read: [],
      write: []
    },
    member_of_active_filesystem: false,
    needs_update: false,
    nids: [
      '10.14.82.24@tcp0'
    ],
    nodename: 'lotus-35vm15',
    pacemaker_configuration: '/api/pacemaker_configuration/1/',
    private_key: null,
    private_key_passphrase: null,
    properties: '{\"python_patchlevel\": 5, \"kernel_version\": \"3.10.0-327.10.1.el7_lustre.x86_64\", \
    \"zfs_installed\": false, \"distro_version\": 7.2000000000000002, \"python_version_major_minor\": \
    2.7000000000000002, \"distro\': \"CentOS Linux\"}',
    resource_uri: '/api/host/1/',
    root_pw: null,
    server_profile: {
      corosync: false,
      corosync2: true,
      default: false,
      initial_state: 'managed',
      managed: true,
      name: 'base_managed_rh7',
      ntp: true,
      pacemaker: true,
      resource_uri: '/api/server_profile/base_managed_rh7/',
      'rsyslog': true,
      'ui_description': 'A storage server suitable for creating new HA-enabled filesystem targets',
      'ui_name': 'Managed Storage Server For EL7.2',
      'user_selectable': true,
      'worker': false
    },
    'state': 'unconfigured',
    'state_modified_at': '2016-03-31T19:00:17.865980+00:00'
  }, {
    'address': 'lotus-35vm16.lotus.hpdd.lab.intel.com',
    'available_actions': [{
      'display_group': 1,
      'display_order': 10,
      'long_description': 'Deploy agent to host.',
      'state': 'unconfigured',
      'verb': 'Deploy agent'
    }, {
      'args': {
        'host_id': 2
      },
      'class_name': 'ForceRemoveHostJob',
      'confirmation': 'WARNING This command is destructive. This command should only be performed\nwhen the Remove \
        command has been unsuccessful. This command will remove this server from the\nIntel® Manager for Lustre \
        configuration, but Intel® Manager for Lustre software will not be removed\nfrom this server.  All targets that \
        depend on this server will also be removed without any attempt to\nunconfigure them. To completely remove the \
        Intel® Manager for Lustre software from this server\n(allowing it to be added to another Lustre file system) \
        you must first contact technical support.\nYou should only perform this command if this server is permanently \
        unavailable, or has never been\nsuccessfully deployed using Intel® Manager for Lustre software.',
      'display_group': 5,
      'display_order': 140,
      'long_description': '<b> WARNING: This command is destructive.</b> This command should only be performed when \
        the Remove command has been unsuccessful. This command will remove this server from the Intel® Manager for \
        Lustre configuration, but Intel Manager for Lustre software will not be removed from this server.  All targets \
        that depend on this server will also be removed without any attempt to unconfigure them. To completely remove \
        the Intel® Manager for Lustre software from this server (allowing it to be added to another Lustre file \
          system) you must first contact technical support. <b>You should only perform this command if this server \
          is permanently unavailable, or has never been successfully deployed using Intel® Manager for Lustre software\
          .</b>',
      'verb': 'Force Remove'
    }],
    'available_jobs': [{
      'args': {
        'host_id': 2
      },
      'class_name': 'ForceRemoveHostJob',
      'confirmation': 'WARNING This command is destructive. This command should only be performed\nwhen the Remove \
        command has been unsuccessful. This command will remove this server from the\nIntel® Manager for Lustre \
        configuration, but Intel® Manager for Lustre software will not be removed\nfrom this server.  All targets that \
        depend on this server will also be removed without any attempt to\nunconfigure them. To completely remove \
        the Intel® Manager for Lustre software from this server\n(allowing it to be added to another Lustre file \
          system) you must first contact technical support.\nYou should only perform this command if this server is \
          permanently unavailable, or has never been\nsuccessfully deployed using Intel® Manager for Lustre software.',
      'display_group': 5,
      'display_order': 140,
      'long_description': '<b> WARNING: This command is destructive.</b> This command should only be performed when \
        the Remove command has been unsuccessful. This command will remove this server from the Intel® Manager for \
        Lustre configuration, but Intel Manager for Lustre software will not be removed from this server.  All targets \
        that depend on this server will also be removed without any attempt to unconfigure them. To completely remove \
        the Intel® Manager for Lustre software from this server (allowing it to be added to another Lustre file \
          system) you must first contact technical support. <b>You should only perform this command if this server is \
          permanently unavailable, or has never been successfully deployed using Intel® Manager for Lustre software.\
          </b>',
      'verb': 'Force Remove'
    }],
    'available_transitions': [{
      'display_group': 1,
      'display_order': 10,
      'long_description': 'Deploy agent to host.',
      'state': 'unconfigured',
      'verb': 'Deploy agent'
    }],
    'boot_time': null,
    'client_mounts': [],
    'content_type_id': 72,
    'corosync_configuration': null,
    'fqdn': 'lotus-35vm16.lotus.hpdd.lab.intel.com',
    'id': '2',
    'immutable_state': true,
    'install_method': 'existing_keys_choice',
    'label': 'lotus-35vm16.lotus.hpdd.lab.intel.com',
    'lnet_configuration': '/api/lnet_configuration/2/',
    'locks': {
      'read': [],
      'write': []
    },
    'member_of_active_filesystem': false,
    'needs_update': false,
    'nids': [],
    'nodename': 'lotus-35vm16',
    'pacemaker_configuration': null,
    'private_key': null,
    'private_key_passphrase': null,
    'properties': '{}',
    'resource_uri': '/api/host/2/',
    'root_pw': null,
    'server_profile': {
      'corosync': false,
      'corosync2': false,
      'default': false,
      'initial_state': 'unconfigured',
      'managed': false,
      'name': 'default',
      'ntp': false,
      'pacemaker': false,
      'resource_uri': '/api/server_profile/default/',
      'rsyslog': false,
      'ui_description': 'An unconfigured server.',
      'ui_name': 'Unconfigured Server',
      'user_selectable': false,
      'worker': false
    },
    'state': 'undeployed',
    'state_modified_at': '2016-03-31T18:57:20.649503+00:00'
  }, {
    'address': 'lotus-35vm17.lotus.hpdd.lab.intel.com',
    'available_actions': [{
      'display_group': 1,
      'display_order': 10,
      'long_description': 'Deploy agent to host.',
      'state': 'unconfigured',
      'verb': 'Deploy agent'
    }, {
      'args': {
        'host_id': 3
      },
      'class_name': 'ForceRemoveHostJob',
      'confirmation': 'WARNING This command is destructive. This command should only be performed\nwhen the Remove \
        command has been unsuccessful. This command will remove this server from the\nIntel® Manager for Lustre \
        configuration, but Intel® Manager for Lustre software will not be removed\nfrom this server.  All targets that \
        depend on this server will also be removed without any attempt to\nunconfigure them. To completely remove the \
        Intel® Manager for Lustre software from this server\n(allowing it to be added to another Lustre file system) \
        you must first contact technical support.\nYou should only perform this command if this server is permanently \
        unavailable, or has never been\nsuccessfully deployed using Intel® Manager for Lustre software.',
      'display_group': 5,
      'display_order': 140,
      'long_description': '<b> WARNING: This command is destructive.</b> This command should only be performed when \
        the Remove command has been unsuccessful. This command will remove this server from the Intel® Manager for \
        Lustre configuration, but Intel Manager for Lustre software will not be removed from this server.  All targets \
        that depend on this server will also be removed without any attempt to unconfigure them. To completely remove \
        the Intel® Manager for Lustre software from this server (allowing it to be added to another Lustre file \
          system) you must first contact technical support. <b>You should only perform this command if this server is \
          permanently unavailable, or has never been successfully deployed using Intel® Manager for Lustre software.\
          </b>',
      'verb': 'Force Remove'
    }],
    'available_jobs': [{
      'args': {
        'host_id': 3
      },
      'class_name': 'ForceRemoveHostJob',
      'confirmation': 'WARNING This command is destructive. This command should only be performed\nwhen the Remove \
        command has been unsuccessful. This command will remove this server from the\nIntel® Manager for Lustre \
        configuration, but Intel® Manager for Lustre software will not be removed\nfrom this server.  All targets that \
        depend on this server will also be removed without any attempt to\nunconfigure them. To completely remove the \
        Intel® Manager for Lustre software from this server\n(allowing it to be added to another Lustre file system) \
        you must first contact technical support.\nYou should only perform this command if this server is permanently \
        unavailable, or has never been\nsuccessfully deployed using Intel® Manager for Lustre software.',
      'display_group': 5,
      'display_order': 140,
      'long_description': '<b> WARNING: This command is destructive.</b> This command should only be performed when \
        the Remove command has been unsuccessful. This command will remove this server from the Intel® Manager for \
        Lustre configuration, but Intel Manager for Lustre software will not be removed from this server.  All targets \
        that depend on this server will also be removed without any attempt to unconfigure them. To completely remove \
        the Intel® Manager for Lustre software from this server (allowing it to be added to another Lustre file \
          system) you must first contact technical support. <b>You should only perform this command if this server is \
          permanently unavailable, or has never been successfully deployed using Intel® Manager for Lustre software.\
          </b>',
      'verb': 'Force Remove'
    }],
    'available_transitions': [{
      'display_group': 1,
      'display_order': 10,
      'long_description': 'Deploy agent to host.',
      'state': 'unconfigured',
      'verb': 'Deploy agent'
    }],
    'boot_time': null,
    'client_mounts': [],
    'content_type_id': 72,
    'corosync_configuration': null,
    'fqdn': 'lotus-35vm17.lotus.hpdd.lab.intel.com',
    'id': '3',
    'immutable_state': true,
    'install_method': 'existing_keys_choice',
    'label': 'lotus-35vm17.lotus.hpdd.lab.intel.com',
    'lnet_configuration': '/api/lnet_configuration/3/',
    'locks': {
      'read': [],
      'write': []
    },
    'member_of_active_filesystem': false,
    'needs_update': false,
    'nids': [],
    'nodename': 'lotus-35vm17',
    'pacemaker_configuration': null,
    'private_key': null,
    'private_key_passphrase': null,
    'properties': '{}',
    'resource_uri': '/api/host/3/',
    'root_pw': null,
    'server_profile': {
      'corosync': false,
      'corosync2': false,
      'default': false,
      'initial_state': 'unconfigured',
      'managed': false,
      'name': 'default',
      'ntp': false,
      'pacemaker': false,
      'resource_uri': '/api/server_profile/default/',
      'rsyslog': false,
      'ui_description': 'An unconfigured server.',
      'ui_name': 'Unconfigured Server',
      'user_selectable': false,
      'worker': false
    },
    'state': 'undeployed',
    'state_modified_at': '2016-03-31T18:57:21.743775+00:00'
  }, {
    'address': 'lotus-35vm18.lotus.hpdd.lab.intel.com',
    'available_actions': [{
      'display_group': 1,
      'display_order': 20,
      'long_description': 'Install packages on this server',
      'state': 'packages_installed',
      'verb': 'Continue Server Configuration'
    }, {
      'display_group': 4,
      'display_order': 130,
      'long_description': 'Remove this unconfigured server.',
      'state': 'removed',
      'verb': 'Remove'
    }, {
      'args': {
        'host_id': 4
      },
      'class_name': 'ForceRemoveHostJob',
      'confirmation': 'WARNING This command is destructive. This command should only be performed\nwhen the Remove \
        command has been unsuccessful. This command will remove this server from the\nIntel® Manager for Lustre \
        configuration, but Intel® Manager for Lustre software will not be removed\nfrom this server.  All targets that \
        depend on this server will also be removed without any attempt to\nunconfigure them. To completely remove the \
        Intel® Manager for Lustre software from this server\n(allowing it to be added to another Lustre file system) \
        you must first contact technical support.\nYou should only perform this command if this server is permanently \
        unavailable, or has never been\nsuccessfully deployed using Intel® Manager for Lustre software.',
      'display_group': 5,
      'display_order': 140,
      'long_description': '<b> WARNING: This command is destructive.</b> This command should only be performed when \
        the Remove command has been unsuccessful. This command will remove this server from the Intel® Manager for \
        Lustre configuration, but Intel Manager for Lustre software will not be removed from this server.  All targets \
        that depend on this server will also be removed without any attempt to unconfigure them. To completely remove \
        the Intel® Manager for Lustre software from this server (allowing it to be added to another Lustre file \
          system) you must first contact technical support. <b>You should only perform this command if this server is \
          permanently unavailable, or has never been successfully deployed using Intel® Manager for Lustre software.\
          </b>',
      'verb': 'Force Remove'
    }],
    'available_jobs': [{
      'args': {
        'host_id': 4
      },
      'class_name': 'ForceRemoveHostJob',
      'confirmation': 'WARNING This command is destructive. This command should only be performed\nwhen the Remove \
        command has been unsuccessful. This command will remove this server from the\nIntel® Manager for Lustre \
        configuration, but Intel® Manager for Lustre software will not be removed\nfrom this server.  All targets that \
        depend on this server will also be removed without any attempt to\nunconfigure them. To completely remove the \
        Intel® Manager for Lustre software from this server\n(allowing it to be added to another Lustre file system) \
        you must first contact technical support.\nYou should only perform this command if this server is permanently \
        unavailable, or has never been\nsuccessfully deployed using Intel® Manager for Lustre software.',
      'display_group': 5,
      'display_order': 140,
      'long_description': '<b> WARNING: This command is destructive.</b> This command should only be performed when \
        the Remove command has been unsuccessful. This command will remove this server from the Intel® Manager for \
        Lustre configuration, but Intel Manager for Lustre software will not be removed from this server.  All targets \
        that depend on this server will also be removed without any attempt to unconfigure them. To completely remove \
        the Intel® Manager for Lustre software from this server (allowing it to be added to another Lustre file \
          system) you must first contact technical support. <b>You should only perform this command if this server is \
          permanently unavailable, or has never been successfully deployed using Intel® Manager for Lustre software.\
          </b>',
      'verb': 'Force Remove'
    }],
    'available_transitions': [{
      'display_group': 4,
      'display_order': 130,
      'long_description': 'Remove this unconfigured server.',
      'state': 'removed',
      'verb': 'Remove'
    }, {
      'display_group': 1,
      'display_order': 20,
      'long_description': 'Install packages on this server',
      'state': 'packages_installed',
      'verb': 'Continue Server Configuration'
    }],
    'boot_time': '2016-03-30T08:07:27+00:00',
    'client_mounts': [],
    'content_type_id': 72,
    'corosync_configuration': null,
    'fqdn': 'lotus-35vm18.lotus.hpdd.lab.intel.com',
    'id': '4',
    'immutable_state': true,
    'install_method': 'existing_keys_choice',
    'label': 'lotus-35vm18.lotus.hpdd.lab.intel.com',
    'lnet_configuration': '/api/lnet_configuration/4/',
    'locks': {
      'read': [],
      'write': []
    },
    'member_of_active_filesystem': false,
    'needs_update': false,
    'nids': [
      '10.14.82.27@tcp0'
    ],
    'nodename': 'lotus-35vm18',
    'pacemaker_configuration': null,
    'private_key': null,
    'private_key_passphrase': null,
    'properties': '{\"python_patchlevel\": 5, \"kernel_version\": \"3.10.0-327.10.1.el7_lustre.x86_64\", \
    \"zfs_installed\": false, \"distro_version\": 7.2000000000000002, \"python_version_major_minor\": \
    2.7000000000000002, \"distro\': \"CentOS Linux\"}',
    'resource_uri': '/api/host/4/',
    'root_pw': null,
    'server_profile': {
      'corosync': false,
      'corosync2': false,
      'default': false,
      'initial_state': 'unconfigured',
      'managed': false,
      'name': 'default',
      'ntp': false,
      'pacemaker': false,
      'resource_uri': '/api/server_profile/default/',
      'rsyslog': false,
      'ui_description': 'An unconfigured server.',
      'ui_name': 'Unconfigured Server',
      'user_selectable': false,
      'worker': false
    },
    'state': 'unconfigured',
    'state_modified_at': '2016-03-31T18:57:27.081871+00:00'
  }];

  const alerts = [{
    'affected': [
      '/api/host/1/'
    ],
    'message': 'Lost contact with host lotus-35vm15.lotus.hpdd.lab.intel.com'
  }, {
    'affected': [
      '/api/host/4/'
    ],
    'message': 'Lost contact with host lotus-35vm18.lotus.hpdd.lab.intel.com'
  }];

  var result;

  describe('matching type', () => {
    beforeEach(() => {
      result = serverReducer(hosts, {
        type: ADD_SERVER_ITEMS,
        payload: hosts
      });
    });

    it('should return the payload', () => {
      expect(result).toEqual(hosts);
    });
  });

  describe('non-matching type', () => {
    beforeEach(() => {
      result = serverReducer(hosts, {
        type: 'ADD_ALERT_INDICATOR_ITEMS',
        payload: alerts
      });
    });

    it('should return the state', () => {
      expect(result).toEqual(hosts);
    });
  });
});
