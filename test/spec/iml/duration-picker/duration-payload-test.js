import { mock, resetAll } from '../../../system-mock.js';

describe('duration payload', () => {
  let getServerMoment, durationPayload, payload;

  beforeEachAsync(async function() {
    getServerMoment = jasmine.createSpy('getServerMoment');
    const mod = await mock('source/iml/duration-picker/duration-payload.js', {
      'source/iml/get-server-moment.js': { default: getServerMoment }
    });

    durationPayload = mod.default;
  });

  afterEach(resetAll);

  beforeEach(() => {
    getServerMoment.and.callFake(() => {
      let date = new Date(1460560065352);

      const momentObj = {
        subtract: jasmine.createSpy('subtract').and.callFake(val => {
          date = new Date(date.valueOf() - val * 60 * 1000);
          return momentObj;
        }),
        seconds: jasmine.createSpy('seconds').and.callFake(val => {
          date.setSeconds(val);
          return momentObj;
        }),
        milliseconds: jasmine.createSpy('milliseconds').and.callFake(val => {
          date.setMilliseconds(val);
          return momentObj;
        }),
        toDate: jasmine.createSpy('toDate').and.callFake(() => {
          return date;
        })
      };

      return momentObj;
    });
  });

  describe('without overrides', () => {
    it('should return the payload', () => {
      payload = durationPayload();

      expect(payload).toEqual({
        configType: 'duration',
        size: 10,
        unit: 'minutes',
        startDate: 1460559420000,
        endDate: 1460560020000
      });
    });
  });

  describe('with overrides', () => {
    it('should return the payload', () => {
      payload = durationPayload({
        dataType: 'stats_read_bytes'
      });

      expect(payload).toEqual({
        configType: 'duration',
        dataType: 'stats_read_bytes',
        size: 10,
        unit: 'minutes',
        startDate: 1460559420000,
        endDate: 1460560020000
      });
    });
  });
});
