import { mock, resetAll } from '../../../system-mock.js';

import * as fp from '@mfl/fp';

describe('app states', () => {
  let appState;

  beforeEachAsync(async function() {
    const mod = await mock('source/iml/app/app-states.js', {
      'source/iml/app/assets/html/app.html': { default: 'appTemplate' }
    });

    appState = mod.appState;
  });

  afterEach(resetAll);

  it('should create the state', () => {
    expect(appState).toEqual({
      name: 'app',
      url: '',
      redirectTo: 'app.dashboard.overview',
      controller: 'AppCtrl',
      controllerAs: 'app',
      template: 'appTemplate',
      resolve: {
        alertStream: ['appAlertStream', expect.any(Function)],
        notificationStream: ['appNotificationStream', expect.any(Function)],
        session: ['appSession', fp.identity]
      }
    });
  });
});
