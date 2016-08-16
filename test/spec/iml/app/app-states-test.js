import {
  mock,
  resetAll
} from '../../../system-mock.js';

import {
  identity
} from 'intel-fp';

describe('app states', () => {
  let appState;

  beforeEachAsync(async function () {
    const mod = await mock('source/iml/app/app-states.js', {
      'source/iml/app/assets/html/app.html!text': { default: 'appTemplate' }
    });

    appState = mod.appState;
  });

  afterEach(resetAll);

  it('should create the state', () => {
    expect(appState)
      .toEqual({
        name: 'app',
        url: '',
        redirectTo: 'app.dashboard.overview',
        controller: 'AppCtrl',
        controllerAs: 'app',
        template: 'appTemplate',
        resolve: {
          alertStream: ['appAlertStream', jasmine.any(Function)],
          notificationStream: ['appNotificationStream', jasmine.any(Function)],
          session: ['appSession', identity]
        }
      });
  });
});
