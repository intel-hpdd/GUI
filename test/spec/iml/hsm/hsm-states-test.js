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
      },
      'source/iml/hsm/assets/html/hsm-fs.html!text': {
        default: 'hsmFsTemplate'
      },
      'source/iml/hsm/assets/html/hsm.html!text': {
        default: 'hsmTemplate'
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
          template: 'hsmFsTemplate',
          resolve: {
            fsStream: 'fsCollStream'
          },
          data: {
            helpPage: 'hsm_page.htm',
            access: GROUPS.FS_ADMINS,
            anonymousReadProtected: true,
            eulaState: true
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
          template: 'hsmTemplate',
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
