import { GROUPS } from '../../../../source/iml/auth/authorization.js';

describe('server states', () => {
  let serverState, serverDetailState;

  beforeEach(() => {
    jest.mock('../../../../source/iml/server/assets/html/server.html', () => {
      return 'serverTemplate';
    });
    jest.mock(
      '../../../../source/iml/server/assets/html/server-detail.html',
      () => 'serverDetailTemplate'
    );

    const mod = require('../../../../source/iml/server/server-states.js');

    serverState = mod.serverState;
    serverDetailState = mod.serverDetailState;
  });

  describe('server state', () => {
    it('should create the state', () => {
      expect(serverState).toEqual({
        name: 'app.server',
        url: '/configure/server',
        controller: 'ServerCtrl',
        template: 'serverTemplate',
        params: {
          resetState: {
            dynamic: true
          }
        },
        data: {
          helpPage: 'server_tab.htm',
          access: GROUPS.FS_ADMINS,
          anonymousReadProtected: true,
          eulaState: true,
          kind: 'Servers',
          icon: 'fa-tasks'
        },
        resolve: {
          streams: jasmine.any(Function)
        }
      });
    });
  });

  describe('server detail state', () => {
    it('should create the state', () => {
      expect(serverDetailState).toEqual({
        name: 'app.serverDetail',
        url: '/configure/server/:id',
        controller: 'ServerDetailController',
        controllerAs: 'serverDetail',
        template: 'serverDetailTemplate',
        params: {
          resetState: {
            dynamic: true
          }
        },
        data: {
          helpPage: 'server_detail_page.htm',
          access: GROUPS.FS_ADMINS,
          anonymousReadProtected: true,
          eulaState: true,
          kind: 'Server Detail',
          icon: 'fa-tasks'
        },
        resolve: {
          streams: jasmine.any(Function),
          getData: jasmine.any(Function)
        }
      });
    });
  });
});
