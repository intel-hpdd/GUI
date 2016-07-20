import {
  mock,
  resetAll
} from '../../../system-mock.js';

import highland from 'highland';

describe('old gui states', () => {
  let getStore, socketStream, mod;

  beforeEachAsync(async function () {
    getStore = {
      select: jasmine.createSpy('select')
    };
    socketStream = jasmine.createSpy('socketStream');

    mod = await mock('source/iml/old-gui-shim/old-gui-resolves.js', {
      'source/iml/store/get-store.js': { default: getStore },
      'source/iml/socket/socket-stream.js': { default: socketStream }
    });
  });

  afterEach(resetAll);

  describe('old filesystem detail resolve', () => {
    itAsync('should resolve with the specified id', async function () {
      getStore.select.and.callFake(key => {
        if (key === 'fileSystems')
          return highland([[
            {id:5, label:'fs5'},
            {id:7, label:'fs7'},
            {id: 10, label:'fs10'}
          ]]);
      });

      const result = await mod.oldFilesystemDetailResolve.resolve.getData({id: 7});
      expect(result).toEqual({id:7, label:'fs7'});
    });
  });

  describe('old user detail resolve', () => {
    itAsync('should resolve with the specified id', async function () {
      getStore.select.and.callFake(key => {
        if (key === 'users')
          return highland([[
            {id:5, username:'adam'},
            {id:7, username:'stephany'},
            {id: 10, username:'mickey'}
          ]]);
      });

      const result = await mod.oldUserDetailResolve.resolve.getData({id: 7});
      expect(result).toEqual({label:'stephany'});
    });
  });

  describe('old target resolve', () => {
    itAsync('should resolve with the specified id', async function () {
      getStore.select.and.callFake(key => {
        if (key === 'targets')
          return highland([[
            {id:5, label:'target5'},
            {id:7, label:'target7'},
            {id: 10, label:'target10'}
          ]]);
      });

      const result = await mod.oldTargetResolve.resolve.getData({id: 7});
      expect(result).toEqual({id:7, label:'target7'});
    });
  });

  describe('old storage plugin resolve', () => {
    itAsync('should resolve with the specified id', async function () {
      socketStream.and.callFake(url => {
        if (url === '/storage_resource/7')
          return highland([
            {id:7, plugin_name:'plugin2'}
          ]);
      });

      const result = await mod.oldStoragePluginResolve.resolve.getData({id: 7});
      expect(result).toEqual({label:'plugin2'});
    });
  });
});
