import {
  serverState,
  serverDetailState
} from '../../../../source/iml/server/server-states.js';

import {
  GROUPS
} from '../../../../source/iml/auth/authorization.js';

describe('server states', () => {
  describe('server state', () => {
    it('should create the state', () => {
      expect(serverState)
        .toEqual({
          name: 'app.server',
          url: '/configure/server',
          controller: 'ServerCtrl',
          templateUrl: '/static/chroma_ui/source/iml/server/assets/html/server.js',
          params: {
            resetState: {
              dynamic: true
            }
          },
          data: {
            helpPage: 'server_tab.htm',
            access: GROUPS.FS_ADMINS,
            anonymousReadProtected: true,
            eulaState: true
          },
          resolve: {
            streams: jasmine.any(Function)
          }
        });
    });
  });

  describe('server detail state', () => {
    it('should create the state', () => {
      expect(serverDetailState)
        .toEqual({
          name: 'app.serverDetail',
          url: '/configure/server/:id',
          controller: 'ServerDetailController',
          controllerAs: 'serverDetail',
          templateUrl: '/static/chroma_ui/source/iml/server/assets/html/server-detail.js',
          params: {
            resetState: {
              dynamic: true
            }
          },
          data: {
            helpPage: 'server_detail_page.htm',
            access: GROUPS.FS_ADMINS,
            anonymousReadProtected: true,
            eulaState: true
          },
          resolve: {
            streams: jasmine.any(Function)
          }
        });
    });
  });
});
