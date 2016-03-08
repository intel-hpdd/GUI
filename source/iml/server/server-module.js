// @flow

//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2016 Intel Corporation All Rights Reserved.
//
// The source code contained or described herein and all documents related
// to the source code ("Material") are owned by Intel Corporation or its
// suppliers or licensors. Title to the Material remains with Intel Corporation
// or its suppliers and licensors. The Material contains trade secrets and
// proprietary and confidential information of Intel or its suppliers and
// licensors. The Material is protected by worldwide copyright and trade secret
// laws and treaty provisions. No part of the Material may be used, copied,
// reproduced, modified, published, uploaded, posted, transmitted, distributed,
// or disclosed in any way without Intel's prior express written permission.
//
// No license under any patent, copyright, trade secret or other intellectual
// property right is granted to or conferred upon you by disclosure or delivery
// of the Materials, either expressly, by implication, inducement, estoppel or
// otherwise. Any license under such intellectual property rights must be
// express and approved by Intel in writing.

import angular from 'angular';
import uiBootstrapModule from 'angular-ui-bootstrap';

import ServerCtrl from './server-controller';
import serverActionsFactory from './server-actions';
import serverResolvesFactory from './server-resolves';
import ConfirmServerActionModalCtrl from './confirm-server-action-modal-ctrl';
import {
  ADD_SERVER_AUTH_CHOICES, AddServerStepCtrl, addServersStepFactory
}
  from './add-server-step';
import {SelectServerProfileStepCtrl, selectServerProfileStep} from './select-server-profile-step';
import ServerDetailController from './server-detail-controller';
import filtersModule from '../filters/filters-module';
import lnetModule from '../lnet/lnet-module';
import corosyncModule from '../corosync/corosync-module';
import pacemakerModule from '../pacemaker/pacemaker-module';
import socketModule from '../socket/socket-module';
import commandModule from '../command/command-module';
import actionDropdownModule from '../action-dropdown/action-dropdown-module';
import jobIndicatorModule from '../job-indicator/job-indicator-module';
import alertIndicatorModule from '../alert-indicator/alert-indicator-module';
import stepsModule from '../steps/steps-module';
import extendScopeModule from '../extend-scope-module';
import highlandModule from '../highland/highland-module';
import asValueModule from '../as-value/as-value-module';
import asStreamModule from '../as-stream/as-stream-module';
import pdshModule from '../pdsh/pdsh-module';
import SelectedServersService from './selected-servers-service';
import {
  AddServerModalCtrl, openAddServerModalFactory, throwIfServerErrorsFactory
}
  from './add-server-modal-ctrl';
import overrideActionClickFactory from './override-action-click';
import overrideButtonDirective from './override-button-directive';

import {getHostProfilesFactory, createHostProfilesFactory} from './create-host-profiles-stream';
import {addServerStepsFactory, getAddServerManagerFactory} from './get-add-server-manager';
import getTestHostStreamFactory from './get-test-host-stream';
import hostlistFilterFactory from './hostlist-filter';
import {ServerStatusStepCtrl, serverStatusStepFactory} from './server-status-step';
import {waitUntilLoadedCtrl, waitUntilLoadedStep} from './wait-until-loaded-step';
import serverDetailResolvesFactory from './server-detail-resolves';
import serversToApiObjectsFactory from './servers-to-api-objects';
import createOrUpdateHostsStreamFactory from './create-or-update-hosts-stream';

// $FlowIgnore: HTML templates that flow does not recognize.
import addServerModalTemplate from './assets/html/add-server-modal';

// $FlowIgnore: HTML templates that flow does not recognize.
import addServerStepTemplate from './assets/html/add-server-step';

// $FlowIgnore: HTML templates that flow does not recognize.
import confirmServerActionModalTemplate from './assets/html/confirm-server-action-modal';

// $FlowIgnore: HTML templates that flow does not recognize.
import overrideButtonTemplate from './assets/html/override-button';

// $FlowIgnore: HTML templates that flow does not recognize.
import selectServerProfileStepTemplate from './assets/html/select-server-profile-step';

// $FlowIgnore: HTML templates that flow does not recognize.
import serverStatusStepTemplate from './assets/html/server-status-step';

// $FlowIgnore: HTML templates that flow does not recognize.
import waitUntilLoadedTemplate from './assets/html/wait-until-loaded-step';

export default angular.module('server', [pdshModule, filtersModule, lnetModule,
    corosyncModule, pacemakerModule, socketModule, commandModule, actionDropdownModule,
    jobIndicatorModule, alertIndicatorModule, stepsModule,
    extendScopeModule, highlandModule, asValueModule, asStreamModule,
    addServerStepTemplate, overrideButtonTemplate, uiBootstrapModule,
    addServerModalTemplate, serverStatusStepTemplate, confirmServerActionModalTemplate,
    selectServerProfileStepTemplate, waitUntilLoadedTemplate
  ])
  .constant('OVERRIDE_BUTTON_TYPES', {
    OVERRIDE: 'override',
    PROCEED: 'proceed',
    PROCEED_SKIP: 'proceed and skip'
  })
  .constant('ADD_SERVER_STEPS', {
    ADD: 'addServersStep',
    STATUS: 'serverStatusStep',
    SELECT_PROFILE: 'selectServerProfileStep'
  })
  .controller('ServerCtrl', ServerCtrl)
  .controller('ConfirmServerActionModalCtrl', ConfirmServerActionModalCtrl)
  .factory('serverActions', serverActionsFactory)
  .factory('serverResolves', serverResolvesFactory)
  .constant('ADD_SERVER_AUTH_CHOICES', ADD_SERVER_AUTH_CHOICES)
  .controller('AddServerStepCtrl', AddServerStepCtrl)
  .factory('addServersStep', addServersStepFactory)
  .controller('SelectServerProfileStepCtrl', SelectServerProfileStepCtrl)
  .factory('selectServerProfileStep', selectServerProfileStep)
  .controller('ServerDetailController', ServerDetailController)
  .controller('AddServerModalCtrl', AddServerModalCtrl)
  .service('selectedServers', SelectedServersService)
  .factory('openAddServerModal', openAddServerModalFactory)
  .factory('throwIfServerErrors', throwIfServerErrorsFactory)
  .factory('overrideActionClick', overrideActionClickFactory)
  .directive('overrideButton', overrideButtonDirective)
  .factory('getHostProfiles', getHostProfilesFactory)
  .factory('createHostProfiles', createHostProfilesFactory)
  .factory('addServerSteps', addServerStepsFactory)
  .factory('createOrUpdateHostsStream', createOrUpdateHostsStreamFactory)
  .factory('getAddServerManager', getAddServerManagerFactory)
  .factory('getTestHostStream', getTestHostStreamFactory)
  .factory('hostlistFilter', hostlistFilterFactory)
  .controller('ServerStatusStepCtrl', ServerStatusStepCtrl)
  .factory('serverStatusStep', serverStatusStepFactory)
  .controller('WaitUntilLoadedCtrl', waitUntilLoadedCtrl)
  .factory('waitUntilLoadedStep', waitUntilLoadedStep)
  .factory('serverDetailResolves', serverDetailResolvesFactory)
  .factory('serversToApiObjects', serversToApiObjectsFactory)
  .name;