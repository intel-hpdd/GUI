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
          data: {
            helpPage: 'server_tab.htm',
            access: GROUPS.FS_ADMINS,
            anonymousReadProtected: true,
            eulaState: true
          },
          resolve: {
            streams: ['serverResolves', jasmine.any(Function)]
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
          params: {
            id: {
              dynamic: false
            }
          },
          controller: 'ServerDetailController',
          controllerAs: 'serverDetail',
          templateUrl: '/static/chroma_ui/source/iml/server/assets/html/server-detail.js',
          data: {
            helpPage: 'server_detail_page.htm',
            access: GROUPS.FS_ADMINS,
            anonymousReadProtected: true,
            eulaState: true
          },
          resolve: {
            streams: ['serverDetailResolves', jasmine.any(Function)]
          }
        });
    });
  });
});