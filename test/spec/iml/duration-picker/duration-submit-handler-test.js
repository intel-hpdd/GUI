describe('duration submit handler', () => {
  let mockGetStore, durationSubmitter, mod;
  beforeEach(() => {
    jest.resetModules();
    mockGetStore = {
      dispatch: jest.fn()
    };

    jest.mock('../../../../source/iml/store/get-store.js', () => mockGetStore);

    mod = require('../../../../source/iml/duration-picker/duration-submit-handler.js');

    durationSubmitter = mod.default('chart_type', { page: 'base' });
  });

  describe('passing a range form', () => {
    it('should dispatch the range form changes to the store', () => {
      const forms = {
        rangeForm: {
          start: {
            $modelValue: '2016-05-05T01:00:00'
          },
          end: {
            $modelValue: '2016-05-05T01:05:00'
          }
        }
      };

      durationSubmitter({ dataType: 'my-data-type' }, forms);

      expect(mockGetStore.dispatch).toHaveBeenCalledOnceWith({
        type: 'chart_type',
        payload: {
          page: 'base',
          configType: 'range',
          startDate: '2016-05-05T01:00:00',
          endDate: '2016-05-05T01:05:00',
          dataType: 'my-data-type'
        }
      });
    });
  });

  describe('passing a duration form', () => {
    it('should dispatch the duration form changes to the store', () => {
      const forms = {
        durationForm: {
          size: {
            $modelValue: 15
          },
          unit: {
            $modelValue: 'hours'
          }
        }
      };

      durationSubmitter({ dataType: 'my-data-type' }, forms);

      expect(mockGetStore.dispatch).toHaveBeenCalledOnceWith({
        type: 'chart_type',
        payload: {
          page: 'base',
          configType: 'duration',
          size: 15,
          unit: 'hours',
          dataType: 'my-data-type'
        }
      });
    });
  });
});
