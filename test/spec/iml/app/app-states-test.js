import {
  appState
} from '../../../../source/iml/app/app-states.js';


import {
  identity
} from 'intel-fp';

describe('app states', () => {
  it('should create the state', () => {
    expect(appState)
      .toEqual({
        name: 'app',
        url: '',
        redirectTo: 'app.dashboard.overview',
        controller: 'AppCtrl',
        controllerAs: 'app',
        templateUrl: jasmine.any(String),
        resolve: {
          alertStream: ['appAlertStream', jasmine.any(Function)],
          notificationStream: ['appNotificationStream', jasmine.any(Function)],
          session: ['appSession', identity]
        }
      });
  });
});
