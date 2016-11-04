import {
  mock,
  resetAll
} from '../../system-mock.js';

describe('Get server moment', function () {
  let getServerMoment, environment, momentInstance, moment;

  beforeEachAsync(async function () {
    environment = {
      SERVER_TIME_DIFF: 2000
    };

    momentInstance = {
      add: jasmine.createSpy('add')
    };
    momentInstance.add
      .and.returnValue(momentInstance);

    moment = jasmine.createSpy('moment')
      .and.returnValue(momentInstance);

    const mod = await mock('source/iml/get-server-moment.js', {
      'source/iml/environment.js': environment,
      'moment': { default: moment }
    });

    getServerMoment = mod.default;
  });

  afterEach(resetAll);

  it('should be a function', function () {
    expect(getServerMoment).toEqual(jasmine.any(Function));
  });

  describe('invoking', () => {
    let serverMoment;
    beforeEach(() => {
      serverMoment = getServerMoment();
    });

    it('should invoke moment', () => {
      expect(moment).toHaveBeenCalledOnce();
    });

    it('should return a moment instance', () => {
      expect(serverMoment).toEqual(momentInstance);
    });
  });

  it('should add the server time diff', () => {
    getServerMoment();

    expect(momentInstance.add)
      .toHaveBeenCalledOnceWith(2000);
  });

  it('should forward arguments to moment', function () {
    const epochTime = new Date().valueOf();

    getServerMoment(epochTime);

    expect(moment).toHaveBeenCalledOnceWith(epochTime);
  });
});
