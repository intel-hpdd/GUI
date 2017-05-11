import { storageState } from '../../../../source/iml/storage/storage-states.js';

describe('storage states', () => {
  describe('storage state', () => {
    it('should create the storage state', () => {
      expect(storageState).toEqual({
        name: 'app.storage',
        url: '/configure/storage',
        params: {
          resetState: {
            dynamic: true
          }
        },
        data: {
          kind: 'Storage',
          icon: 'fa-hdd-o'
        },
        resolve: {},
        component: 'storage'
      });
    });
  });
});
