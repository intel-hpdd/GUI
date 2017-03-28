import { mock, resetAll } from '../../system-mock.js';

describe('get random value', () => {
  let getRandomValues, getRandomValue;

  beforeEachAsync(async function() {
    getRandomValues = jasmine.createSpy('getRandomValues').and.returnValue([2]);

    const getRandomValuesModule = await mock('source/iml/get-random-value.js', {
      'source/iml/global.js': {
        default: {
          crypto: {
            getRandomValues
          }
        }
      }
    });

    getRandomValue = getRandomValuesModule.default;
  });

  afterEach(resetAll);

  it('should be called with a Uint32Array', () => {
    getRandomValue();

    expect(getRandomValues).toHaveBeenCalledOnceWith(new Uint32Array(1));
  });

  it('should return the result of crypto.getRandomValues', () => {
    expect(getRandomValue()).toBe(2);
  });
});
