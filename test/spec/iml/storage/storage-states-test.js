import {
  storageState,
  addStorageState
} from '../../../../source/iml/storage/storage-states.js';
import {
  storageB,
  alertIndicatorB
} from '../../../../source/iml/storage/storage-resolves.js';

describe('add storage state', () => {
  it('should create the storage state', () => {
    expect(addStorageState).toEqual({
      name: 'app.addStorage',
      url: '/configure/storage/add',
      params: {
        resetState: {
          dynamic: true
        }
      },
      data: {
        kind: 'Add Storage Device',
        icon: 'fa-hdd-o'
      },
      resolve: { storageB },
      component: 'addStorage'
    });
  });
});

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
      resolve: { storageB, alertIndicatorB },
      component: 'storage'
    });
  });
});
