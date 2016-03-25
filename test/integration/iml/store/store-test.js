import createStore from '../../../../source/iml/store/store.js';

const SET_STATE = 'SET_STATE';
const UPDATE_STATE = 'UPDATE_STATE';

describe('store', () => {
  var store, spy;

  beforeEach(() => {
    spy = jasmine.createSpy('spy');

    store = createStore({
      stuff: (state = [], {type, payload}) => {
        switch (type) {
        case SET_STATE:
          return payload;
        case UPDATE_STATE:
          return state.map(item => {
            return item.id === payload.id ? Object.assign({}, item, payload) : item;
          });
        default:
          return state;
        }
      }
    });
  });

  it('should be a function', () => {
    expect(createStore).toEqual(jasmine.any(Function));
  });

  it('should not emit when store is empty', () => {
    const s = store.select('stuff');
    s.each(spy);
    s.destroy();


    expect(spy).not.toHaveBeenCalled();
  });

  describe('using the store', () => {
    beforeEach(() => {
      store.dispatch({
        type: SET_STATE,
        payload: [
          {id: 1, name: 'foo'},
          {id: 2, name: 'bar'}
        ]
      });
    });

    it('should emit state', () => {
      const s = store.select('stuff');

      s.each(spy);
      s.destroy();

      expect(spy).toHaveBeenCalledOnceWith([
        {id: 1, name: 'foo'},
        {id: 2, name: 'bar'}
      ]);
    });

    it('should emit updated state', () => {
      const s = store.select('stuff');

      s.each(spy);

      store.dispatch({
        type: UPDATE_STATE,
        payload: {id: 1, name: 'boop'}
      });

      s.destroy();

      expect(spy).toHaveBeenCalledOnceWith([
        {id: 1, name: 'boop'},
        {id: 2, name: 'bar'}
      ]);
    });
  });
});
