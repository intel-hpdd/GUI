import {
  mgtState
} from '../../../../source/iml/mgt/mgt-states.js';

import {
  GROUPS
} from '../../../../source/iml/auth/authorization.js';

describe('mgt states', () => {
  it('should create the state', () => {
    expect(mgtState)
      .toEqual({
        name: 'app.mgt',
        url: '/configure/mgt',
        component: 'mgtPage',
        params: {
          resetState: {
            dynamic: true
          }
        },
        data: {
          helpPage: 'mgts_tab.htm',
          access: GROUPS.FS_ADMINS,
          anonymousReadProtected: true,
          eulaState: true
        },
        resolve: {
          mgt$: jasmine.any(Function),
          mgtAlertIndicatorB: jasmine.any(Function),
          mgtJobIndicatorB: jasmine.any(Function)
        }
      });
  });
});
