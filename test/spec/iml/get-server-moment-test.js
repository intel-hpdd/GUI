describe('Get server moment', () => {
  let getServerMoment, mockEnvironment, momentInstance, mockMoment;

  beforeEach(() => {
    mockEnvironment = {
      SERVER_TIME_DIFF: 2000
    };

    momentInstance = {
      add: jest.fn(() => momentInstance)
    };

    mockMoment = jest.fn(() => momentInstance);

    jest.mock('../../../source/iml/environment.js', () => mockEnvironment);
    jest.mock('moment', () => mockMoment);

    const mod = require('../../../source/iml/get-server-moment.js');

    getServerMoment = mod.default;
  });

  it('should be a function', () => {
    expect(getServerMoment).toEqual(expect.any(Function));
  });

  describe('invoking', () => {
    let serverMoment;
    beforeEach(() => {
      serverMoment = getServerMoment();
    });

    it('should invoke moment', () => {
      expect(mockMoment).toHaveBeenCalledTimes(1);
    });

    it('should return a moment instance', () => {
      expect(serverMoment).toEqual(momentInstance);
    });
  });

  it('should add the server time diff', () => {
    getServerMoment();

    expect(momentInstance.add).toHaveBeenCalledOnceWith(2000);
  });

  it('should forward arguments to moment', () => {
    const epochTime = new Date().valueOf();

    getServerMoment(epochTime);

    expect(mockMoment).toHaveBeenCalledOnceWith(epochTime);
  });
});
