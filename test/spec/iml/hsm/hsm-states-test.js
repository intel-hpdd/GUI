import {
  mock,
  resetAll
} from '../../../system-mock.js';

import {
  GROUPS
} from '../../../../source/iml/auth/authorization.js';

describe('hsm states', () => {
  let mod,
    copytoolStream,
    copytoolOperationStream,
    agentVsCopytoolChart,
    fsCollStream,
    getData;

  beforeEachAsync(async function () {
    copytoolStream = 'copytoolStream';
    copytoolOperationStream = 'copytoolOperationStream';
    agentVsCopytoolChart = 'agentVsCopytoolChart';
    fsCollStream = 'fsCollStream';
    getData = 'getData';

    mod = await mock('source/iml/hsm/hsm-states.js', {
      'source/iml/hsm/hsm-resolves.js': {
        copytoolStream,
        copytoolOperationStream,
        agentVsCopytoolChart
      },
      'source/iml/hsm/hsm-fs-resolves.js': {
        fsCollStream,
        getData
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
            fsStream: 'fsCollStream'
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
            },
            resetState: {
              dynamic: true
            }
          },
          data: {
            kind: 'HSM',
            icon: 'fa-files-o'
          },
          controller: 'HsmCtrl',
          controllerAs: 'hsm',
          templateUrl: '/static/chroma_ui/source/iml/hsm/assets/html/hsm.js',
          resolve: {
            getData: 'getData',
            copytoolOperationStream: 'copytoolOperationStream',
            copytoolStream: 'copytoolStream',
            agentVsCopytoolChart: 'agentVsCopytoolChart'
          }
        });
    });
  });
});
