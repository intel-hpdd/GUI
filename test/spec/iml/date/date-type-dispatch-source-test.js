// @flow

import highland from 'highland';

describe('date type dispatch source', () => {
  let mockDispatch, mockCanDispatch, mockSelect, dateType$, errSpy;
  beforeEach(() => {
    errSpy = jest.fn();
    mockDispatch = jest.fn();
    mockCanDispatch = jest.fn(() => false);
    dateType$ = highland();
    mockSelect = jest.fn(key => {
      if (key === 'dateType') return dateType$;
    });

    jest.mock('../../../../source/iml/store/get-store.js', () => ({
      dispatch: mockDispatch,
      select: mockSelect
    }));

    jest.mock('../../../../source/iml/dispatch-source-utils.js', () => ({
      canDispatch: mockCanDispatch
    }));
  });

  describe('if dispatching is disabled', () => {
    it('should not dispatch anything', () => {
      dateType$ = highland();
      require('../../../../source/iml/date/date-type-dispatch-source.js');
      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });

  describe('if dispatching is enabled', () => {
    beforeEach(() => {
      mockCanDispatch.mockImplementation(() => true);
    });

    describe('without error', () => {
      beforeEach(() => {
        dateType$.write({ isUtc: false });
        require('../../../../source/iml/date/date-type-dispatch-source.js');
      });

      it('should dispatch the date type data', () => {
        expect(mockDispatch).toHaveBeenCalledOnceWith({
          type: 'SET_DATE_TYPE',
          payload: false
        });
      });
    });

    describe('with error', () => {
      beforeEach(() => {
        const err = {
          __HighlandStreamError__: true,
          error: new Error('boom!')
        };
        dateType$.stopOnError(e => errSpy(e)).each(() => {});
        dateType$.write(err);
        require('../../../../source/iml/date/date-type-dispatch-source.js');
      });

      it('should not dispatch the date type data', () => {
        expect(mockDispatch).not.toHaveBeenCalled();
      });

      it('should emit the error', () => {
        expect(errSpy).toHaveBeenCalledWith(new Error('boom!'));
      });
    });
  });
});
