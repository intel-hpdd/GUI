// @flow
describe('tree utils', () => {
  let mockToggleCollectionOpen,
    mockToggleItemOpen,
    toggleCollection,
    mockUpdateCollectionOffset,
    updateCollOffset,
    toggleItem,
    mockStore;

  beforeEach(() => {
    jest.resetModules();
    mockToggleCollectionOpen = jest.fn().mockImplementation((id, open) => ({
      type: 'TOGGLE_COLLECTION_OPEN',
      payload: { id, open }
    }));
    mockToggleItemOpen = jest.fn().mockImplementation((id, itemId, open) => ({
      type: 'TOGGLE_ITEM_OPEN',
      payload: { id, itemId, open }
    }));
    mockUpdateCollectionOffset = jest.fn().mockImplementation((id, offset) => ({
      type: 'UPDATE_COLLECTION_OFFSET',
      payload: { id, offset }
    }));
    mockStore = { dispatch: jest.fn() };
    jest.mock('../../../../source/iml/tree/tree-actions.js', () => ({
      toggleCollectionOpen: mockToggleCollectionOpen,
      toggleItemOpen: mockToggleItemOpen,
      updateCollectionOffset: mockUpdateCollectionOffset
    }));
    jest.mock('../../../../source/iml/store/get-store.js', () => mockStore);

    const mod = require('../../../../source/iml/tree/tree-utils.js');
    ({ toggleCollection, toggleItem, updateCollOffset } = mod);
  });

  afterEach(() => {
    window.angular = null;
  });

  describe('toggle collection', () => {
    beforeEach(() => {
      toggleCollection(1, true);
    });
    it('should call toggle collection open', () => {
      expect(mockToggleCollectionOpen).toHaveBeenCalledOnceWith(1, true);
    });
    it('should dispatch to the store', () => {
      expect(mockStore.dispatch).toHaveBeenCalledOnceWith({
        type: 'TOGGLE_COLLECTION_OPEN',
        payload: { id: 1, open: true }
      });
    });
  });
  describe('update coll', () => {
    beforeEach(() => {
      updateCollOffset(1, 20);
    });
    it('should call toggle collection open', () => {
      expect(mockUpdateCollectionOffset).toHaveBeenCalledOnceWith(1, 20);
    });
    it('should dispatch to the store', () => {
      expect(mockStore.dispatch).toHaveBeenCalledOnceWith({
        type: 'UPDATE_COLLECTION_OFFSET',
        payload: { id: 1, offset: 20 }
      });
    });
  });
  describe('toggle item', () => {
    beforeEach(() => {
      toggleItem(1, 2, true);
    });
    it('should call toggle item open', () => {
      expect(mockToggleItemOpen).toHaveBeenCalledOnceWith(1, 2, true);
    });
    it('should dispatch to the store', () => {
      expect(mockStore.dispatch).toHaveBeenCalledOnceWith({
        type: 'TOGGLE_ITEM_OPEN',
        payload: { id: 1, itemId: 2, open: true }
      });
    });
  });
});
