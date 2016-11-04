import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('duration submit handler', () => {

  let getStore, durationSubmitter, mod;
  beforeEachAsync(async function () {
    getStore = {
      dispatch: jasmine.createSpy('dispatch')
    };

    mod = await mock('source/iml/duration-picker/duration-submit-handler.js', {
      'source/iml/store/get-store.js': { default: getStore }
    });

    durationSubmitter = mod.default('chart_type', {page: 'base'});
  });

  afterEach(resetAll);

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

      durationSubmitter({dataType: 'my-data-type'}, forms);

      expect(getStore.dispatch).toHaveBeenCalledOnceWith({
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

      durationSubmitter({dataType: 'my-data-type'}, forms);

      expect(getStore.dispatch).toHaveBeenCalledOnceWith({
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
