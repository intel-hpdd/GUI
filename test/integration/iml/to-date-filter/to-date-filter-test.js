import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('to date filter', () => {
  var createDate, result, mod, d;
  beforeEachAsync(async function () {
    createDate = jasmine.createSpy('createDate')
      .and.returnValue('2015-05-05T00:00:00.000Z');
    mod = await mock('source/iml/to-date-filter/to-date-filter.js', {
      'source/iml/create-date.js': { default: createDate }
    });
  });

  afterEach(resetAll);

  it('should return the date object', () => {
    result = mod.default(d);
    expect(result).toEqual('2015-05-05T00:00:00.000Z');
  });
});
