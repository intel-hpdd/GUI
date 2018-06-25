import createStore from '../../../../source/iml/store/create-store.js';
import deepFreeze from '@iml/deep-freeze';

const SET_STATE = 'SET_STATE';
const SET_OTHER_STATE = 'SET_OTHER_STATE';
const UPDATE_STATE = 'UPDATE_STATE';

describe('create store', () => {
  let store, spy;

  beforeEach(() => {
    spy = jest.fn();

    store = createStore({
      stuff: (state = [], { type, payload }) => {
        switch (type) {
          case SET_STATE:
            return payload;
          case UPDATE_STATE:
            return state.map(item => {
              return item.id === payload.id ? { ...item, ...payload } : item;
            });
          default:
            return state;
        }
      },
      moreStuff: (state = [], { type, payload }) => {
        switch (type) {
          case SET_OTHER_STATE:
            return payload;
          default:
            return state;
        }
      }
    });
  });

  it('should be a function', () => {
    expect(createStore).toEqual(expect.any(Function));
  });

  it('should not emit when store is empty', () => {
    const s = store.select('stuff');
    s.each(spy);
    s.destroy();

    expect(spy).not.toHaveBeenCalled();
  });

  describe('using the store', () => {
    beforeEach(() => {
      store.dispatch(
        deepFreeze({
          type: SET_STATE,
          payload: [{ id: 1, name: 'foo' }, { id: 2, name: 'bar' }]
        })
      );

      store.dispatch(
        deepFreeze({
          type: SET_OTHER_STATE,
          payload: [{ id: 3, name: 'some' }, { id: 4, name: 'stuff' }]
        })
      );
    });

    it('should emit state', () => {
      const s = store.select('stuff');

      s.each(spy);
      s.destroy();

      expect(spy).toHaveBeenCalledOnceWith([{ id: 1, name: 'foo' }, { id: 2, name: 'bar' }]);
    });

    it('should emit moreStuff state', () => {
      const s = store.select('moreStuff');

      s.each(spy);
      s.destroy();

      expect(spy).toHaveBeenCalledOnceWith([{ id: 3, name: 'some' }, { id: 4, name: 'stuff' }]);
    });

    it('should emit updated state', () => {
      const s = store.select('stuff');

      s.each(spy);

      store.dispatch({
        type: UPDATE_STATE,
        payload: { id: 1, name: 'boop' }
      });

      s.destroy();

      expect(spy).toHaveBeenCalledOnceWith([{ id: 1, name: 'boop' }, { id: 2, name: 'bar' }]);
    });

    it('should emit once per change', () => {
      const s = store.select('stuff');

      store.dispatch(
        deepFreeze({
          type: SET_OTHER_STATE,
          payload: [{ id: 3, name: 'some' }, { id: 4, name: 'stuff' }]
        })
      );

      store.dispatch(
        deepFreeze({
          type: SET_OTHER_STATE,
          payload: [{ id: 5, name: 'even' }, { id: 6, name: 'more' }]
        })
      );

      s.each(spy);

      expect(spy).toHaveBeenCalledOnceWith([{ id: 1, name: 'foo' }, { id: 2, name: 'bar' }]);
    });

    it('should not emit after destroy', () => {
      const s = store.select('stuff');

      s.each(spy);
      s.destroy();

      store.dispatch({
        type: UPDATE_STATE,
        payload: { id: 1, name: 'boop' }
      });

      expect(spy).not.toHaveBeenCalledWith([{ id: 1, name: 'boop' }, { id: 2, name: 'bar' }]);
    });

    it('should not remove other viewers when destroy is called twice', () => {
      store.select('stuff');
      const s2 = store.select('stuff');
      const s3 = store.select('stuff');

      s3.each(spy);

      s2.destroy();
      s2.destroy();

      store.dispatch({
        type: UPDATE_STATE,
        payload: { id: 1, name: 'boop' }
      });

      expect(spy).toHaveBeenCalledOnceWith([{ id: 1, name: 'boop' }, { id: 2, name: 'bar' }]);
    });
  });
});
