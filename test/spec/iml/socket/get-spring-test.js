import highland from 'highland';

describe('spring module', () => {
  let mockRegenerator, mockSocketStream, getSpring, s;

  beforeEach(() => {
    s = highland();
    jest.spyOn(s, 'destroy');
    mockSocketStream = jest.fn(() => s);

    mockRegenerator = jest.fn();

    jest.mock('../../../../source/iml/regenerator.js', () => mockRegenerator);
    jest.mock('../../../../source/iml/socket/socket-stream.js', () => mockSocketStream);

    const getSpringDependencies = require('../../../../source/iml/socket/get-spring.js');

    getSpring = getSpringDependencies.default;
    getSpring();
  });

  it('should pass a setup and teardown function to regenerator', () => {
    expect(mockRegenerator).toHaveBeenCalledOnceWith(expect.any(Function), expect.any(Function));
  });

  it('should setup a socket stream', () => {
    mockRegenerator.mock.calls[0][0]('foo', 'bar');

    expect(mockSocketStream).toHaveBeenCalledOnceWith('foo', 'bar');
  });

  it('should teardown a socket stream', () => {
    mockRegenerator.mock.calls[0][0]('foo', 'bar');
    mockRegenerator.mock.calls[0][1](s);

    expect(s.destroy).toHaveBeenCalledTimes(1);
  });
});
