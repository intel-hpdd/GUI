// @flow

import { mock, resetAll } from '../../../system-mock.js';

describe('tree utils', () => {
  let toggleCollectionOpen,
    toggleItemOpen,
    toggleCollection,
    updateCollectionOffset,
    updateCollOffset,
    toggleItem,
    store;

  beforeEachAsync(async function() {
    toggleCollectionOpen = jasmine
      .createSpy('toggleCollectionOpen')
      .and.callFake((id, open) => ({
        type: 'TOGGLE_COLLECTION_OPEN',
        payload: {
          id,
          open
        }
      }));

    toggleItemOpen = jasmine
      .createSpy('toggleItemOpen')
      .and.callFake((id, itemId, open) => ({
        type: 'TOGGLE_ITEM_OPEN',
        payload: {
          id,
          itemId,
          open
        }
      }));

    updateCollectionOffset = jasmine
      .createSpy('updateCollectionOffset')
      .and.callFake((id, offset) => ({
        type: 'UPDATE_COLLECTION_OFFSET',
        payload: {
          id,
          offset
        }
      }));

    store = {
      dispatch: jasmine.createSpy('dispatch')
    };

    const mod = await mock('source/iml/tree/tree-utils.js', {
      'source/iml/tree/tree-actions.js': {
        toggleCollectionOpen,
        toggleItemOpen,
        updateCollectionOffset
      },
      'source/iml/store/get-store.js': {
        default: store
      }
    });

    ({
      toggleCollection,
      toggleItem,
      updateCollOffset
    } = mod);
  });

  afterEach(resetAll);

  describe('toggle collection', () => {
    beforeEach(() => {
      toggleCollection(1, true);
    });

    it('should call toggle collection open', () => {
      expect(toggleCollectionOpen).toHaveBeenCalledOnceWith(1, true);
    });

    it('should dispatch to the store', () => {
      expect(store.dispatch).toHaveBeenCalledOnceWith({
        type: 'TOGGLE_COLLECTION_OPEN',
        payload: {
          id: 1,
          open: true
        }
      });
    });
  });

  describe('update coll', () => {
    beforeEach(() => {
      updateCollOffset(1, 20);
    });

    it('should call toggle collection open', () => {
      expect(updateCollectionOffset).toHaveBeenCalledOnceWith(1, 20);
    });

    it('should dispatch to the store', () => {
      expect(store.dispatch).toHaveBeenCalledOnceWith({
        type: 'UPDATE_COLLECTION_OFFSET',
        payload: {
          id: 1,
          offset: 20
        }
      });
    });
  });

  describe('toggle item', () => {
    beforeEach(() => {
      toggleItem(1, 2, true);
    });

    it('should call toggle item open', () => {
      expect(toggleItemOpen).toHaveBeenCalledOnceWith(1, 2, true);
    });

    it('should dispatch to the store', () => {
      expect(store.dispatch).toHaveBeenCalledOnceWith({
        type: 'TOGGLE_ITEM_OPEN',
        payload: {
          id: 1,
          itemId: 2,
          open: true
        }
      });
    });
  });
});
