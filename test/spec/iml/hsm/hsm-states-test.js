import {
  mock,
  resetAll
} from '../../../system-mock.js';

import {
  GROUPS
} from '../../../../source/iml/auth/authorization.js';

describe('hsm states', () => {
  let mod, copytoolStream,
    copytoolOperationStream,
    agentVsCopytoolChart,
    fsCollStreamFactory;

  beforeEachAsync(async function () {
    copytoolStream = 'copytoolStream';
    copytoolOperationStream = 'copytoolOperationStream';
    agentVsCopytoolChart = 'agentVsCopytoolChart';
    fsCollStreamFactory = 'fsCollStreamFactory';

    mod = await mock('source/iml/hsm/hsm-states.js', {
      'source/iml/hsm/hsm-resolves.js': {
        copytoolStream,
        copytoolOperationStream,
        agentVsCopytoolChart
      },
      'source/iml/hsm/hsm-fs-resolves.js': {
        default: fsCollStreamFactory
      }
    });
  });

  afterEach(resetAll);


  describe('hsm fs state', () => {
    it('should create the state', () => {
      expect(mod.hsmFsState)
        .toEqual({
          name: 'app.hsmFs',
          controller: 'HsmFsCtrl',
          controllerAs: 'hsmFs',
          templateUrl: '/static/chroma_ui/source/iml/hsm/assets/html/hsm-fs.js',
          resolve: {
            fsStream: 'fsCollStreamFactory'
          },
          data: {
            helpPage: 'hsm_page.htm',
            access: GROUPS.FS_ADMINS,
            anonymousReadProtected: true,
            eulaState: true,
            skipWhen: jasmine.any(Function)
          }
        });
    });
  });

  describe('hsm state', () => {
    it('should create the state', () => {
      expect(mod.hsmState)
        .toEqual({
          url: '/configure/hsm/:fsId',
          name: 'app.hsmFs.hsm',
          params: {
            fsId: {
              value: null,
              dynamic: false,
              squash: true
            }
          },
          controller: 'HsmCtrl',
          controllerAs: 'hsm',
          templateUrl: '/static/chroma_ui/source/iml/hsm/assets/html/hsm.js',
          resolve: {
            copytoolOperationStream: 'copytoolOperationStream',
            copytoolStream: 'copytoolStream',
            agentVsCopytoolChart: 'agentVsCopytoolChart'
          }
        });
    });
  });
});
